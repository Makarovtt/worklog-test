import { Layout } from 'antd';
import type { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header';

export function AuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
