import React, { useState } from 'react';
import type { Customer, CustomerCategory } from '../types/customer.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Search, PlusLg, Whatsapp, Person, Trash3, Telephone, ExclamationTriangle } from 'react-bootstrap-icons';
import { useDeleteCustomerMutation } from '../api/customers.api';
import { toast } from 'sonner';

export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onAddCustomer: () => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  onAddCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null);
  const deleteMutation = useDeleteCustomerMutation();

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteMutation.mutateAsync(customerToDelete.id);
      toast.success(`Client "${customerToDelete.name}" supprimé`);
      setCustomerToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Impossible de supprimer le client');
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('221') ? cleanPhone : `221${cleanPhone}`;
    const message = encodeURIComponent(`Bonjour ${name}, de la part de votre joaillier INVENTA Bijoux.`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const getCategoryBadge = (category: CustomerCategory) => {
    switch (category) {
      case 'vip':
        return <Badge variant="gold">Client VIP ★</Badge>;
      case 'revendeur':
        return <Badge variant="info">Revendeur</Badge>;
      default:
        return <Badge variant="default">Particulier</Badge>;
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Rechercher un client..."
              aria-label="Rechercher un client par nom, téléphone ou ville"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              className="text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrer les clients par catégorie"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Toutes catégories</option>
            <option value="vip">Clients VIP</option>
            <option value="particulier">Particuliers</option>
            <option value="revendeur">Revendeurs</option>
          </select>
        </div>

        <Button
          variant="gold"
          size="sm"
          leftIcon={<PlusLg className="w-3.5 h-3.5" />}
          onClick={onAddCustomer}
        >
          Nouveau client
        </Button>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4">Client</th>
                <th scope="col" className="py-3.5 px-4">Téléphone & WhatsApp</th>
                <th scope="col" className="py-3.5 px-4">Ville / Quartier</th>
                <th scope="col" className="py-3.5 px-4">Catégorie</th>
                <th scope="col" className="py-3.5 px-4">Cumul Achats</th>
                <th scope="col" className="py-3.5 px-4">Date création</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span>Chargement du carnet de clients...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-xs mx-auto text-center space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                        <Person className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 m-0">
                        {searchTerm ? 'Aucun client trouvé' : 'Carnet de clients vide'}
                      </p>
                      <p className="text-xs text-slate-400 m-0">
                        {searchTerm
                          ? 'Modifiez votre recherche.'
                          : 'Enregistrez vos clients pour faciliter le suivi des ventes.'}
                      </p>
                      {!searchTerm && (
                        <Button variant="gold" size="sm" onClick={onAddCustomer}>
                          Ajouter un client
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nom + Avatar initiales */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                          {customer.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">
                            {customer.fullName}
                          </span>
                          {customer.notes && (
                            <span className="text-xs text-slate-500 truncate block max-w-xs">
                              {customer.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Téléphone & Bouton WhatsApp */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-800 font-semibold">
                          {customer.phone}
                        </span>
                        <button
                          type="button"
                          onClick={() => openWhatsApp(customer.phone, customer.fullName)}
                          aria-label={`Envoyer un message WhatsApp à ${customer.fullName}`}
                          title={`Envoyer un message WhatsApp à ${customer.fullName}`}
                          className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
                        >
                          <Whatsapp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Ville */}
                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                      {customer.city || 'Dakar'}
                    </td>

                    {/* Catégorie */}
                    <td className="py-3.5 px-4">{getCategoryBadge(customer.category)}</td>

                    {/* Cumul Achats avec espaces */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>

                    {/* Date création */}
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {formatDate(customer.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openWhatsApp(customer.phone, customer.fullName)}
                          title={`Contacter ${customer.fullName} sur WhatsApp`}
                          aria-label={`Contacter ${customer.fullName} par téléphone ou WhatsApp`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-colors cursor-pointer bg-white flex items-center justify-center focus:outline-none"
                        >
                          <Telephone className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomerToDelete({ id: customer.id, name: customer.fullName })}
                          title={`Supprimer ${customer.fullName}`}
                          aria-label={`Supprimer la fiche client de ${customer.fullName}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer bg-white flex items-center justify-center focus:outline-none"
                        >
                          <Trash3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation de suppression accessible (remplace confirm natif) */}
      <Modal
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        title="Supprimer la fiche client"
        description="Cette action retirera le client du carnet d'adresses."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs">
            <ExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="m-0">
              Êtes-vous sûr de vouloir supprimer définitivement la fiche de{' '}
              <strong className="font-bold">{customerToDelete?.name}</strong> ?
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCustomerToDelete(null)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={handleConfirmDelete}
            >
              Confirmer la suppression
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
