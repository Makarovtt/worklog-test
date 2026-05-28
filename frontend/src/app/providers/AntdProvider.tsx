import { App as AntdApp, ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import type { PropsWithChildren } from 'react';

import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from '@/shared/config/brand';

export function AntdProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: BRAND_PRIMARY,
          colorPrimaryHover: BRAND_PRIMARY_HOVER,
          colorPrimaryActive: BRAND_PRIMARY_HOVER,
          borderRadius: 6,
          fontSize: 14,
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
