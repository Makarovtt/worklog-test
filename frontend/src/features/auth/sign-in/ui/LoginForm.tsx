import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

import { useSignIn } from '../model/useSignIn';

interface FormValues {
  login: string;
  password: string;
}

const LOGIN_MIN = 3;
const PASSWORD_MIN = 6;

export function LoginForm() {
  const [form] = Form.useForm<FormValues>();
  const signIn = useSignIn();

  const handleFinish = (values: FormValues) => {
    signIn.mutate(values);
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark={false}
      initialValues={{ login: '', password: '' }}
      disabled={signIn.isPending}
    >
      <Form.Item
        name="login"
        label="Логин"
        rules={[
          { required: true, message: 'Введите логин' },
          { min: LOGIN_MIN, message: `Минимум ${LOGIN_MIN} символа` },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="admin" autoComplete="username" autoFocus />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          { required: true, message: 'Введите пароль' },
          { min: PASSWORD_MIN, message: `Минимум ${PASSWORD_MIN} символов` },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={signIn.isPending}>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}
