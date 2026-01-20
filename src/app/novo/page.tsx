// Create Ticket Page - Multi-Step Form
'use client';

import { AuthProvider } from '@/features/tickets/components/AuthProvider';
import { TicketService } from '@/features/tickets/services/ticketService';
import { useFormDraftStore } from '@/features/tickets/store/formDraftStore';
import { useToastStore } from '@/features/tickets/store/toastStore';
import {
  ticketFormSchema,
  ticketStep1Schema,
  ticketStep2Schema,
  type TicketFormData,
  type TicketStep1Data,
  type TicketStep2Data,
} from '@/features/tickets/validations/ticketSchema';
import { Button, Input, Modal, Select, Textarea } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './page.module.scss';

function CreateTicketPage() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const {
    draft,
    saveDraft,
    clearDraft,
    currentStep: savedStep,
    setStep: saveStep,
  } = useFormDraftStore();
  const [step, setStep] = useState(savedStep);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 form
  const step1Form = useForm<TicketStep1Data>({
    resolver: zodResolver(ticketStep1Schema),
    defaultValues: draft
      ? {
          title: draft.title || '',
          email: draft.email || '',
          category: draft.category || 'other',
          priority: draft.priority || 'medium',
        }
      : {
          title: '',
          email: '',
          category: 'other',
          priority: 'medium',
        },
  });

  // Step 2 form
  const step2Form = useForm<TicketStep2Data>({
    resolver: zodResolver(ticketStep2Schema),
    defaultValues: draft
      ? {
          description: draft.description || '',
          attachmentUrl: draft.attachmentUrl || '',
          status: draft.status || 'open',
        }
      : {
          description: '',
          attachmentUrl: '',
          status: 'open',
        },
  });

  // Check for existing draft on mount
  useEffect(() => {
    if (draft && Object.keys(draft).length > 0) {
      setShowDraftModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestoreDraft = () => {
    setShowDraftModal(false);
    setStep(savedStep);
    addToast({ type: 'info', message: 'Rascunho restaurado' });
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftModal(false);
    setStep(1);
  };

  const onStep1Submit = (data: TicketStep1Data) => {
    const combinedData = { ...data, ...step2Form.getValues() };
    saveDraft(combinedData, 2);
    saveStep(2);
    setStep(2);
  };

  const onStep2Submit = async (data: TicketStep2Data) => {
    const step1Data = step1Form.getValues();
    const fullData: TicketFormData = { ...step1Data, ...data };

    // Final validation with full schema
    const validationResult = ticketFormSchema.safeParse(fullData);

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      errors.forEach((error) => {
        addToast({
          type: 'error',
          message: error.message,
        });
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await TicketService.createTicket(validationResult.data);
      clearDraft();
      addToast({
        type: 'success',
        message: 'Ticket criado com sucesso!',
      });
      router.push('/');
    } catch (error) {
      addToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Erro ao criar ticket',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    saveStep(1);
    setStep(1);
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Novo Ticket</h1>
          <div className={styles.steps}>
            <div
              className={`${styles.stepIndicator} ${step === 1 ? styles.active : styles.completed}`}
            >
              1. Informações Básicas
            </div>
            <div
              className={`${styles.stepIndicator} ${step === 2 ? styles.active : ''}`}
            >
              2. Detalhes
            </div>
          </div>
        </header>

        {step === 1 && (
          <form
            onSubmit={step1Form.handleSubmit(onStep1Submit)}
            className={styles.form}
          >
            <Input
              label="Título"
              placeholder="Descreva o problema de forma breve"
              error={step1Form.formState.errors.title?.message}
              required
              {...step1Form.register('title')}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={step1Form.formState.errors.email?.message}
              required
              {...step1Form.register('email')}
            />

            <Select
              label="Categoria"
              error={step1Form.formState.errors.category?.message}
              required
              options={[
                { value: 'bug', label: 'Bug' },
                { value: 'billing', label: 'Cobrança' },
                { value: 'feature', label: 'Funcionalidade' },
                { value: 'other', label: 'Outro' },
              ]}
              {...step1Form.register('category')}
            />

            <Select
              label="Prioridade"
              error={step1Form.formState.errors.priority?.message}
              required
              options={[
                { value: 'low', label: 'Baixa' },
                { value: 'medium', label: 'Média' },
                { value: 'high', label: 'Alta' },
              ]}
              {...step1Form.register('priority')}
            />

            <div className={styles.formActions}>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit">Próximo</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={step2Form.handleSubmit(onStep2Submit)}
            className={styles.form}
          >
            <Textarea
              label="Descrição"
              placeholder="Descreva o problema em detalhes..."
              error={step2Form.formState.errors.description?.message}
              required
              rows={6}
              {...step2Form.register('description')}
            />

            <Input
              label="URL do Anexo"
              type="url"
              placeholder="https://exemplo.com/arquivo.pdf"
              error={step2Form.formState.errors.attachmentUrl?.message}
              helperText="Opcional: Cole o link de um arquivo ou imagem"
              {...step2Form.register('attachmentUrl')}
            />

            <Select
              label="Status Inicial"
              error={step2Form.formState.errors.status?.message}
              required
              options={[
                { value: 'open', label: 'Aberto' },
                { value: 'in_progress', label: 'Em Andamento' },
                { value: 'resolved', label: 'Resolvido' },
              ]}
              {...step2Form.register('status')}
            />

            <div className={styles.formActions}>
              <Button type="button" variant="ghost" onClick={goToPreviousStep}>
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Ticket'}
              </Button>
            </div>
          </form>
        )}
      </div>

      <Modal
        isOpen={showDraftModal}
        onClose={handleDiscardDraft}
        title="Rascunho Encontrado"
        footer={
          <>
            <Button variant="ghost" onClick={handleDiscardDraft}>
              Descartar
            </Button>
            <Button onClick={handleRestoreDraft}>Restaurar Rascunho</Button>
          </>
        }
      >
        <p>
          Encontramos um rascunho salvo anteriormente. Deseja restaurá-lo ou
          começar um novo ticket?
        </p>
      </Modal>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <CreateTicketPage />
    </AuthProvider>
  );
}
