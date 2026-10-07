import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Customer, CreateCustomerDto, CustomerCategory } from '../types/customer.types';
import { useCreateCustomerMutation } from '../api/customers.api';
import { toast } from 'sonner';
import { PersonCheck, StarFill, Whatsapp } from 'react-bootstrap-icons';

export interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
  onCustomerCreated?: (newCustomer: Customer) => void;
}

interface CustomerFormProps {
  customerToEdit?: Customer | null;
  onClose: () => void;
  onCustomerCreated?: (newCustomer: Customer) => void;
}

const categories: { label: string; value: CustomerCategory; desc: string }[] = [
  { label: 'Particulier', value: 'particulier', desc: 'Client occasionnel en boutique' },
  { label: 'Client VIP', value: 'vip', desc: 'Client fidèle haut de gamme' },
  { label: 'Revendeur / Négociant', value: 'revendeur', desc: 'Achats en gros ou récurrents' },
];

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerToEdit,
  onClose,
  onCustomerCreated,
}) => {
  const createMutation = useCreateCustomerMutation();

  // Initialisation directe sans useEffect, réinitialisée par la clé React du composant
  const [formData, setFormData] = useState<CreateCustomerDto>(() => ({
    fullName: customerToEdit?.fullName || '',
    phone: customerToEdit?.phone || '',
    email: customerToEdit?.email || '',
    city: customerToEdit?.city || 'Dakar',
    category: customerToEdit?.category || 'particulier',
    notes: customerToEdit?.notes || '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Veuillez renseigner le nom complet du client');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Veuillez renseigner le numéro de téléphone');
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        ...formData,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
        city: formData.city?.trim() || 'Dakar',
        notes: formData.notes?.trim() || undefined,
      });

      toast.success(`Client ${created.fullName} enregistré avec succès !`);
      if (onCustomerCreated) {
        onCustomerCreated(created);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Impossible d’enregistrer le client');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Nom complet */}
      <Input
        label="Nom et Prénom *"
        placeholder="ex: Mme Fatou Diop"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
      />

      {/* Téléphone / WhatsApp */}
      <div className="space-y-1.5 text-left">
        <Input
          label="Téléphone / WhatsApp *"
          placeholder="ex: +221 77 123 45 67 ou 77 123 45 67"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          leftIcon={<Whatsapp className="w-3.5 h-3.5 text-emerald-500" />}
          helperText="Permet d'envoyer le reçu de vente directement par WhatsApp"
          required
        />
      </div>

      {/* Ville & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Ville / Quartier"
          placeholder="ex: Dakar, Almadies"
          value={formData.city || ''}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />

        <Input
          label="Email (optionnel)"
          type="email"
          placeholder="client@gmail.com"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      {/* Catégorie de client avec role radiogroup pour accessibilité */}
      <div className="space-y-1.5 text-left">
        <label id="customer-category-label" className="block text-xs font-semibold text-slate-700">
          Catégorie de client
        </label>
        <div
          role="radiogroup"
          aria-labelledby="customer-category-label"
          className="grid grid-cols-3 gap-2"
        >
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={formData.category === c.value}
              onClick={() => setFormData({ ...formData, category: c.value })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer min-h-[44px] justify-center focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                formData.category === c.value
                  ? c.value === 'vip'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {c.value === 'vip' && <StarFill className="w-3 h-3 text-amber-500" />}
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Préférences & Notes du bijoutier */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="customer-notes-textarea" className="block text-xs font-semibold text-slate-700">
          Notes & Préférences Joaillerie (optionnel)
        </label>
        <textarea
          id="customer-notes-textarea"
          rows={2}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="ex: Bague taille 54, aime les parures or jaune 18k..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="gold"
          size="sm"
          isLoading={createMutation.isPending}
          leftIcon={<PersonCheck className="w-4 h-4" />}
        >
          {customerToEdit ? 'Enregistrer les modifications' : 'Créer le client'}
        </Button>
      </div>
    </form>
  );
};

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customerToEdit,
  onCustomerCreated,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customerToEdit ? 'Modifier la Fiche Client' : 'Nouveau Client Bijouterie'}
      description="Enregistrez les coordonnées et préférences de vos clients pour un suivi personnalisé"
      maxWidth="lg"
    >
      {isOpen && (
        <CustomerForm
          key={customerToEdit?.id ?? 'new-customer'}
          customerToEdit={customerToEdit}
          onClose={onClose}
          onCustomerCreated={onCustomerCreated}
        />
      )}
    </Modal>
  );
};
