import { Link } from '@tanstack/react-router';
import { Card, Flex, Typography } from 'antd';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  alternativeText: string;
  alternativeLink: { to: string; label: string };
}

export function AuthCard({ title, alternativeText, alternativeLink, children }: Props) {
  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh', padding: 24 }}>
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Flex vertical gap={20}>
          <Flex vertical gap={4}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
            <Typography.Text type="secondary">Журнал работ на строительном объекте</Typography.Text>
          </Flex>
          {children}
          <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
            {alternativeText} <Link to={alternativeLink.to}>{alternativeLink.label}</Link>
          </Typography.Text>
        </Flex>
      </Card>
    </Flex>
  );
}
