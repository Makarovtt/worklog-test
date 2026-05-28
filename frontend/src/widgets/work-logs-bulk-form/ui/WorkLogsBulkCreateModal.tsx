import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, InputNumber, Modal, Space, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';

import { WorkTypeSelect } from '@/entities/work-type';
import { WorkerSelect } from '@/entities/worker';
import { DATE_ISO_FORMAT } from '@/shared/lib/format-date';

interface RowValues {
  performedAt: Dayjs;
  workTypeId: string;
  volume: number;
  workerId: string;
}

interface FormShape {
  entries: RowValues[];
}

export interface BulkCreateValues {
  performedAt: string;
  workTypeId: string;
  volume: number;
  workerId: string;
}

interface Props {
  open: boolean;
  loading?: boolean;
  onSubmit: (values: BulkCreateValues[]) => void;
  onClose: () => void;
}

const BULK_MIN = 1;
const BULK_MAX = 50;
const MIN_VOLUME = 0.001;

function emptyRow(): RowValues {
  return {
    performedAt: dayjs(),
    workTypeId: '',
    volume: 1,
    workerId: '',
  };
}

export function WorkLogsBulkCreateModal({ open, loading, onSubmit, onClose }: Props) {
  const [form] = Form.useForm<FormShape>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ entries: [emptyRow()] });
    }
  }, [open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(
      values.entries.map((entry) => ({
        performedAt: entry.performedAt.format(DATE_ISO_FORMAT),
        workTypeId: entry.workTypeId,
        volume: entry.volume,
        workerId: entry.workerId,
      })),
    );
  };

  return (
    <Modal
      open={open}
      title="Массовое добавление записей"
      okText="Создать все"
      cancelText="Отмена"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
      maskClosable={false}
      width={920}
    >
      <Typography.Paragraph type="secondary">
        Добавьте несколько записей за раз. Все строки будут созданы в одной транзакции — либо все,
        либо ни одной.
      </Typography.Paragraph>

      <Form<FormShape> form={form} layout="vertical" requiredMark={false}>
        <Form.List
          name="entries"
          rules={[
            {
              validator: async (_, entries: RowValues[]) => {
                if (!entries || entries.length < BULK_MIN) {
                  return Promise.reject(new Error('Нужна хотя бы одна запись'));
                }
                if (entries.length > BULK_MAX) {
                  return Promise.reject(new Error(`Не более ${BULK_MAX} записей за раз`));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  align="start"
                  size={8}
                  style={{ display: 'flex', width: '100%' }}
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'performedAt']}
                    rules={[{ required: true, message: 'Дата' }]}
                    style={{ marginBottom: 0, width: 140 }}
                  >
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'workTypeId']}
                    rules={[{ required: true, message: 'Вид работ' }]}
                    style={{ marginBottom: 0, flex: 1, minWidth: 220 }}
                  >
                    <WorkTypeSelect />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'volume']}
                    rules={[
                      { required: true, message: 'Объём' },
                      { type: 'number', min: MIN_VOLUME, message: '> 0' },
                    ]}
                    style={{ marginBottom: 0, width: 120 }}
                  >
                    <InputNumber<number>
                      style={{ width: '100%' }}
                      min={MIN_VOLUME}
                      step={0.1}
                      decimalSeparator=","
                    />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'workerId']}
                    rules={[{ required: true, message: 'Исполнитель' }]}
                    style={{ marginBottom: 0, flex: 1, minWidth: 220 }}
                  >
                    <WorkerSelect />
                  </Form.Item>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    disabled={fields.length === 1}
                    onClick={() => remove(field.name)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add(emptyRow())}
                disabled={fields.length >= BULK_MAX}
                block
              >
                Добавить строку
              </Button>
              <Form.ErrorList errors={errors} />
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
