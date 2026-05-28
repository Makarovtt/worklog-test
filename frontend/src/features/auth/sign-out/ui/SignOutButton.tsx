import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button } from 'antd';

import { useAuth } from '@/shared/auth-session';
import { ROUTES } from '@/shared/config/routes';

export function SignOutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    signOut();
    navigate({ to: ROUTES.login });
  };

  return (
    <Button icon={<LogoutOutlined />} onClick={handleClick}>
      Выйти
    </Button>
  );
}
