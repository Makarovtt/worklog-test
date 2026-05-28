import { Avatar, Flex, Layout, Space, Typography } from 'antd';

import { SignOutButton } from '@/features/auth/sign-out';
import { BRAND_PRIMARY } from '@/shared/config/brand';
import { useAuth } from '@/shared/auth-session';

export function AppHeader() {
  const { user } = useAuth();

  return (
    <Layout.Header
      style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        height: 64,
      }}
    >
      <Flex align="center" justify="space-between" style={{ height: '100%' }}>
        <Space size={12} align="center">
          <Avatar style={{ backgroundColor: BRAND_PRIMARY }}>Ж</Avatar>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Журнал работ
          </Typography.Title>
        </Space>

        {user && (
          <Space size={16} align="center">
            <Typography.Text strong>{user.fullName}</Typography.Text>
            <SignOutButton />
          </Space>
        )}
      </Flex>
    </Layout.Header>
  );
}
