import { RegisterForm } from '@/features/auth/sign-up';
import { ROUTES } from '@/shared/config/routes';
import { AuthCard } from '@/widgets/auth-card';

export function RegisterPage() {
  return (
    <AuthCard
      title="Регистрация"
      alternativeText="Уже есть учётная запись?"
      alternativeLink={{ to: ROUTES.login, label: 'Войти' }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
