// Login Page
'use client';

import { useAuthStore } from '@/features/tickets/store/authStore';
import {
  loginSchema,
  type LoginFormData,
} from '@/features/tickets/validations/authSchema';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './page.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    const success = await login(data.email, data.password);

    if (!success) {
      setLoginError('E-mail ou senha inválidos');
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Image
            src="/logo.png"
            alt="Helpdesk System Logo"
            width={300}
            height={85}
            priority
          />
          <p className={styles.subtitle}>Faça login para acessar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {loginError && (
            <div className={styles.errorMessage} role="alert">
              {loginError}
            </div>
          )}

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            {...register('password')}
          />

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className={styles.credentials}>
          <p className={styles.credentialsTitle}>Credenciais de teste:</p>
          <ul className={styles.credentialsList}>
            <li>E-mail: user@test.com.br</li>
            <li>Senha: 123Teste@</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
