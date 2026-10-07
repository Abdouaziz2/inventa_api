import React, { useState } from 'react';
import { useCartStore } from '../stores/cart.store';
import type { JewelleryItem } from '@/features/inventory/types/inventory.types';
import type { SaleReceipt } from '../types/sales.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatWeight } from '@/lib/formatters';
import { useBarcodeScanner } from '@/features/barcode/hooks/useBarcodeScanner';
import { useMetalRatesStore } from '@/features/inventory/stores/metalRates.store';
import { CustomerSelect } from '@/features/customers/components/CustomerSelect';
import {
  UpcScan,
  Trash3,
  PlusLg,
  DashLg,
  CheckCircleFill,
  CashCoin,
  Phone,
  CreditCard,
  Receipt,
  Printer,
  Search,
  Whatsapp,
} from 'react-bootstrap-icons';
import { toast } from 'sonner';

export interface PosCashierProps {
  inventory: JewelleryItem[];
}

export const PosCashier: React.FC<PosCashierProps> = ({ inventory }) => {
  const {
    items,
    paymentMethod,
    discount,
    customerName,
    customerPhone,
    amountReceived,
    addItem,
    removeItem,
    updateQuantity,
    updateItemPrice,
    setDiscount,
    setPaymentMethod,
    setCustomer,
    setAmountReceived,
    clearCart,
    getSubtotal,
    getTotal,
    getChange,
  } = useCartStore();

  const { getRateFor } = useMetalRatesStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchCatalog, setSearchCatalog] = useState('');
  const [completedSale, setCompletedSale] = useState<SaleReceipt | null>(null);

  // Scanner douchette automatique
  useBarcodeScanner({
    onScan: (scannedCode) => {
      handleScanCode(scannedCode);
    },
  });

  const handleScanCode = (code: string) => {
    const cleanCode = code.trim().toLowerCase();
    const matched = inventory.find(
      (item) =>
        (item.sku && item.sku.toLowerCase() === cleanCode) ||
        item.id.toLowerCase() === cleanCode
    );

    if (matched) {
      if (matched.stockQty <= 0) {
        toast.error(`La pièce ${matched.name} est épuisée`);
        return;
      }

      const rate = getRateFor(matched.metalType, matched.karat);
      const computedPrice = matched.priceSell > 0
        ? matched.priceSell
        : Math.round(matched.weightGrams * rate);

      addItem(matched, computedPrice, rate);
      toast.success(`Scanné : ${matched.name} (${formatWeight(matched.weightGrams)})`, {
        icon: <CheckCircleFill className="w-4 h-4 text-emerald-500" />,
      });
      setBarcodeInput('');
    } else {
      toast.error(`Aucun bijou trouvé pour le code : "${code}"`);
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    handleScanCode(barcodeInput);
  };

  const handleAddFromCatalog = (item: JewelleryItem) => {
    const rate = getRateFor(item.metalType, item.karat);
    const computedPrice = item.priceSell > 0
      ? item.priceSell
      : Math.round(item.weightGrams * rate);

    addItem(item, computedPrice, rate);
    toast.success(`Ajouté au comptoir : ${item.name}`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Le panier est vide');
      return;
    }

    const saleReceipt = {
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      items: [...items],
      subtotal: getSubtotal(),
      discount,
      totalAmount: getTotal(),
      amountReceived: paymentMethod === 'CASH' ? amountReceived : getTotal(),
      changeGiven: paymentMethod === 'CASH' ? getChange() : 0,
      paymentMethod,
      customerName: customerName || 'Client Comptoir',
      customerPhone: customerPhone || '-',
      createdAt: new Date().toISOString(),
    };

    setCompletedSale(saleReceipt);
    clearCart();
    toast.success('Vente enregistrée avec succès !');
  };

  const filteredCatalog = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchCatalog.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchCatalog.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
      {/* Colonne gauche : Scanner & Catalogue du Stock (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Scanner Barcode Hero Box */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UpcScan className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-semibold text-slate-800 m-0">Scanner</h2>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Prêt
            </span>
          </div>

          <form onSubmit={handleManualScanSubmit} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Scanner ou entrer un SKU..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                leftIcon={<UpcScan className="w-3.5 h-3.5 text-slate-400" />}
                className="allow-scanner-intercept text-xs"
              />
            </div>
            <Button type="submit" variant="gold" size="sm">
              Ajouter
            </Button>
          </form>
        </div>

        {/* Sélection rapide dans le catalogue du stock */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 m-0">
                Catalogue ({inventory.length})
              </h2>
            </div>

            <div className="w-full sm:w-56">
              <Input
                placeholder="Rechercher..."
                value={searchCatalog}
                onChange={(e) => setSearchCatalog(e.target.value)}
                leftIcon={<Search className="w-3 h-3 text-slate-400" />}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredCatalog.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center col-span-2">
                Aucun article dans l'inventaire.
              </p>
            ) : (
              filteredCatalog.map((item) => {
                const rate = getRateFor(item.metalType, item.karat);
                const estimatedPrice = item.priceSell > 0
                  ? item.priceSell
                  : Math.round(item.weightGrams * rate);

                return (
                  <div
                    key={item.id}
                    role={item.stockQty > 0 ? 'button' : undefined}
                    tabIndex={item.stockQty > 0 ? 0 : -1}
                    aria-label={
                      item.stockQty > 0
                        ? `Ajouter ${item.name} au panier`
                        : `${item.name} épuisé`
                    }
                    onClick={() => {
                      if (item.stockQty > 0) handleAddFromCatalog(item);
                    }}
                    onKeyDown={(e) => {
                      if (item.stockQty > 0 && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleAddFromCatalog(item);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between space-y-2.5 ${
                      item.stockQty > 0
                        ? 'border-slate-200/70 hover:border-slate-300 hover:shadow-2xs bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500'
                        : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {item.name}
                        </span>
                        <Badge variant="gold" className="text-[9px] shrink-0">
                          {item.metalType === 'or' ? `${item.karat}k` : item.metalType}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span className="font-medium text-slate-700">
                          {formatWeight(item.weightGrams)}
                        </span>
                        <code className="text-slate-400 font-mono text-[10px]">{item.sku || 'N/A'}</code>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(estimatedPrice)}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Stock: {item.stockQty}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Colonne droite : Caisse & Détermination du Prix de Vente (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-700" />
            <h2 className="font-semibold text-slate-900 text-sm m-0">
              Panier {items.length > 0 && `(${items.length})`}
            </h2>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              aria-label="Vider tous les articles du panier"
              className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer p-1 rounded-md focus:outline-none"
            >
              Vider
            </button>
          )}
        </div>

        {/* Liste des articles du panier */}
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1.5">
              <Receipt className="w-7 h-7 mx-auto opacity-30 text-slate-500" />
              <p className="text-xs font-medium text-slate-600">Panier vide</p>
              <p className="text-[11px] text-slate-400">
                Scannez un code ou sélectionnez dans le catalogue
              </p>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.item.id}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-slate-900 truncate block">
                      {cartItem.item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-medium text-amber-800 bg-amber-100/60 px-1 rounded-xs">
                        {cartItem.item.metalType === 'or' ? `${cartItem.item.karat}k` : cartItem.item.metalType}
                      </span>
                      <span>{formatWeight(cartItem.item.weightGrams)}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{cartItem.item.sku}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(cartItem.item.id)}
                    aria-label={`Supprimer ${cartItem.item.name} du panier`}
                    title={`Supprimer ${cartItem.item.name}`}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors flex items-center justify-center focus:outline-none rounded-lg"
                  >
                    <Trash3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Détermination du Prix de vente convenu */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/50">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        aria-label={`Diminuer la quantité de ${cartItem.item.name}`}
                        className="text-slate-500 hover:text-slate-900 cursor-pointer p-0.5 flex items-center justify-center focus:outline-none"
                      >
                        <DashLg className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        aria-label={`Augmenter la quantité de ${cartItem.item.name}`}
                        className="text-slate-500 hover:text-slate-900 cursor-pointer p-0.5 flex items-center justify-center focus:outline-none"
                      >
                        <PlusLg className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Champ prix convenu en direct */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Prix :</span>
                    <div className="w-28">
                      <input
                        type="number"
                        step="500"
                        min="0"
                        aria-label={`Prix convenu pour ${cartItem.item.name} en FCFA`}
                        value={cartItem.unitPrice || ''}
                        onChange={(e) =>
                          updateItemPrice(cartItem.item.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-right font-bold text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détail du règlement & Encaissement */}
        {items.length > 0 && (
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            {/* Sélection ou création du client joaillerie */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-500 block">
                Client (optionnel)
              </span>
              <CustomerSelect
                selectedCustomerName={customerName}
                selectedCustomerPhone={customerPhone}
                onSelectCustomer={(name, phone) => setCustomer(name, phone)}
                onClearCustomer={() => setCustomer('', '')}
              />
            </div>

            {/* Remise commerciale éventuelle */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Remise (FCFA)</span>
              <input
                type="number"
                min="0"
                step="500"
                aria-label="Montant de la remise commerciale en FCFA"
                value={discount || ''}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-right text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Choix du mode de paiement */}
            <div className="space-y-1.5">
              <span id="pos-payment-method-label" className="text-xs font-medium text-slate-600 block">
                Paiement
              </span>
              <div
                role="radiogroup"
                aria-labelledby="pos-payment-method-label"
                className="grid grid-cols-3 gap-2"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'CASH'}
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CashCoin className="w-3.5 h-3.5" />
                  <span>Espèces</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'WAVE'}
                  onClick={() => setPaymentMethod('WAVE')}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'WAVE'
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Wave</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'ORANGE_MONEY'}
                  onClick={() => setPaymentMethod('ORANGE_MONEY')}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'ORANGE_MONEY'
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>OM</span>
                </button>
              </div>
            </div>

            {/* Calculatrice de monnaie si paiement en espèces */}
            {paymentMethod === 'CASH' && (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Reçu du client :</span>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    aria-label="Montant remis en espèces par le client en FCFA"
                    value={amountReceived || ''}
                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-28 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-right font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                {amountReceived > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-semibold">
                    <span className="text-slate-500">Rendu :</span>
                    <span className={`text-xs font-bold ${getChange() >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(getChange())}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Récapitulatif Total */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Sous-total</span>
                <span>{formatCurrency(getSubtotal())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-rose-400">
                  <span>Remise</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-slate-800">
                <span className="text-slate-300">TOTAL</span>
                <span className="text-amber-400 text-base">
                  {formatCurrency(getTotal())}
                </span>
              </div>
            </div>

            {/* Bouton de validation */}
            <Button
              variant="gold"
              size="md"
              className="w-full text-sm font-bold py-2.5"
              onClick={handleCheckout}
            >
              Encaisser ({formatCurrency(getTotal())})
            </Button>
          </div>
        )}
      </div>

      {/* MODAL DU TICKET DE CAISSE (Après encaissement) */}
      {completedSale && (
        <Modal
          isOpen={!!completedSale}
          onClose={() => setCompletedSale(null)}
          title="Vente Encaissée"
          description={`Ticket N° ${completedSale.receiptNumber}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            {/* Zone imprimable du ticket */}
            <div className="printable-area space-y-3 bg-white p-2">
              <div className="text-center border-b border-slate-100 pb-3">
                <div className="no-print w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircleFill className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base m-0">INVENTA BIJOUTERIE</h4>
                <p className="text-xs font-mono text-slate-500 mt-0.5">Ticket N° {completedSale.receiptNumber}</p>
                <p className="text-[10px] text-slate-400">{new Date(completedSale.createdAt).toLocaleString('fr-FR')}</p>
              </div>

              <div className="text-xs space-y-2 border-b border-slate-100 pb-3">
                <div className="flex justify-between text-slate-600">
                  <span>Client :</span>
                  <span className="font-bold text-slate-900">{completedSale.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mode de règlement :</span>
                  <span className="font-bold text-slate-900">{completedSale.paymentMethod}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Détail des pièces :</span>
                  {completedSale.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-slate-800 text-[11px]">
                      <span className="truncate pr-2">
                        {i.item.name} ({formatWeight(i.item.weightGrams)})
                      </span>
                      <span className="font-bold shrink-0">{formatCurrency(i.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Net Payé :</span>
                  <span className="text-base text-amber-700 font-black">
                    {formatCurrency(completedSale.totalAmount)}
                  </span>
                </div>
                {completedSale.paymentMethod === 'CASH' && (completedSale.changeGiven ?? 0) > 0 && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Monnaie rendue :</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(completedSale.changeGiven)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions post-encaissement (masquées à l'impression) */}
            <div className="no-print flex flex-col gap-2 pt-2 border-t border-slate-100">
              {completedSale.customerPhone && completedSale.customerPhone !== '-' && (
                <button
                  type="button"
                  onClick={() => {
                    const cleanPhone = completedSale.customerPhone?.replace(/[^0-9]/g, '') || '';
                    const phoneWithCountry = cleanPhone.startsWith('221') ? cleanPhone : `221${cleanPhone}`;
                    const text = encodeURIComponent(
                      `Bonjour ${completedSale.customerName}, voici votre reçu INVENTA Bijoux N° ${completedSale.receiptNumber} pour un montant de ${formatCurrency(completedSale.totalAmount)}. Merci pour votre confiance !`
                    );
                    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Whatsapp className="w-4 h-4 text-emerald-600" />
                  <span>Envoyer par WhatsApp</span>
                </button>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Printer className="w-4 h-4" />}
                  onClick={() => window.print()}
                >
                  Imprimer
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  className="flex-1"
                  onClick={() => setCompletedSale(null)}
                >
                  Terminer
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
