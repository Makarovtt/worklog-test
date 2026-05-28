import { LoginForm } from '@/features/auth/sign-in';
import { ROUTES } from '@/shared/config/routes';
import { AuthCard } from '@/widgets/auth-card';

export function LoginPage() {
  return (
    <AuthCard
      title="Вход в систему"
      alternativeText="Нет учётной записи?"
      alternativeLink={{ to: ROUTES.register, label: 'Зарегистрироваться' }}
    >
      <LoginForm />
    </AuthCard>
  );
}
