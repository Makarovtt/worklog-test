import { IdcardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

import { useSignUp } from '../model/useSignUp';

interface FormValues {
  login: string;
  password: string;
  fullName: string;
}

const LOGIN_MIN = 3;
const PASSWORD_MIN = 6;
const FULL_NAME_MIN = 3;

export function RegisterForm() {
  const [form] = Form.useForm<FormValues>();
  const signUp = useSignUp();

  const handleFinish = (values: FormValues) => {
    signUp.mutate(values);
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark={false}
      disabled={signUp.isPending}
    >
      <Form.Item
        name="fullName"
        label="ФИО"
        rules={[
          { required: true, message: 'Введите ФИО' },
          { min: FULL_NAME_MIN, message: `Минимум ${FULL_NAME_MIN} символа` },
        ]}
      >
        <Input prefix={<IdcardOutlined />} placeholder="Иванов Иван Иванович" autoFocus />
      </Form.Item>

      <Form.Item
        name="login"
        label="Логин"
        rules={[
          { required: true, message: 'Введите логин' },
          { min: LOGIN_MIN, message: `Минимум ${LOGIN_MIN} символа` },
          { pattern: /^[a-zA-Z0-9._-]+$/, message: 'Допустимы латиница, цифры и . _ -' },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="ivanov" autoComplete="username" />
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
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={signUp.isPending}>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
}
