// Form Draft Store - Helpdesk System
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { TicketFormData } from '../validations/ticketSchema';

interface FormDraftState {
  draft: Partial<TicketFormData> | null;
  currentStep: number;
  saveDraft: (data: Partial<TicketFormData>, step: number) => void;
  getDraft: () => Partial<TicketFormData> | null;
  clearDraft: () => void;
  setStep: (step: number) => void;
}

export const useFormDraftStore = create<FormDraftState>()(
  persist(
    (set, get) => ({
      draft: null,
      currentStep: 1,

      saveDraft: (data, step) => {
        set({ draft: data, currentStep: step });
      },

      getDraft: () => get().draft,

      clearDraft: () => {
        set({ draft: null, currentStep: 1 });
      },

      setStep: (step) => {
        set({ currentStep: step });
      },
    }),
    {
      name: 'form-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
