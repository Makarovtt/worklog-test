import { DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';

import type { WorkLog } from '@/entities/work-log';
import { WorkTypeSelect } from '@/entities/work-type';
import { WorkerSelect } from '@/entities/worker';
import { DATE_ISO_FORMAT } from '@/shared/lib/format-date';

export interface WorkLogFormValues {
  performedAt: string;
  workTypeId: string;
  volume: number;
  workerId: string;
  note?: string | null;
}

interface InternalFormValues {
  performedAt: Dayjs;
  workTypeId: string;
  volume: number;
  workerId: string;
  note?: string | null;
}

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: WorkLog | null;
  defaults?: Partial<WorkLogFormValues>;
  loading?: boolean;
  onSubmit: (values: WorkLogFormValues) => void;
  onClose: () => void;
}

const NOTE_MAX = 500;
const MIN_VOLUME = 0.001;

function buildInitialValues(
  initial: WorkLog | null | undefined,
  defaults: Partial<WorkLogFormValues> | undefined,
): InternalFormValues {
  if (initial) {
    return {
      performedAt: dayjs(initial.performedAt),
      workTypeId: initial.workType.id,
      volume: Number(initial.volume),
      workerId: initial.worker.id,
      note: initial.note ?? null,
    };
  }
  return {
    performedAt: defaults?.performedAt ? dayjs(defaults.performedAt) : dayjs(),
    workTypeId: defaults?.workTypeId ?? '',
    volume: defaults?.volume ?? 1,
    workerId: defaults?.workerId ?? '',
    note: defaults?.note ?? null,
  };
}

export function WorkLogFormModal({
  open,
  mode,
  initialValues,
  defaults,
  loading,
  onSubmit,
  onClose,
}: Props) {
  const [form] = Form.useForm<InternalFormValues>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(buildInitialValues(initialValues, defaults));
    }
  }, [open, initialValues, defaults, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit({
      performedAt: values.performedAt.format(DATE_ISO_FORMAT),
      workTypeId: values.workTypeId,
      volume: values.volume,
      workerId: values.workerId,
      note: values.note ?? null,
    });
  };

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Новая запись' : 'Редактирование записи'}
      okText={mode === 'create' ? 'Создать' : 'Сохранить'}
      cancelText="Отмена"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
      maskClosable={false}
    >
      <Form<InternalFormValues> form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="performedAt"
          label="Дата выполнения"
          rules={[{ required: true, message: 'Укажите дату' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item
          name="workTypeId"
          label="Вид работ"
          rules={[{ required: true, message: 'Выберите вид работ' }]}
        >
          <WorkTypeSelect />
        </Form.Item>
        <Form.Item
          name="volume"
          label="Объём"
          rules={[
            { required: true, message: 'Укажите объём' },
            {
              type: 'number',
              min: MIN_VOLUME,
              message: 'Объём должен быть положительным',
            },
          ]}
        >
          <InputNumber<number>
            style={{ width: '100%' }}
            min={MIN_VOLUME}
            step={0.1}
            decimalSeparator=","
            stringMode={false}
          />
        </Form.Item>
        <Form.Item
          name="workerId"
          label="Исполнитель"
          rules={[{ required: true, message: 'Выберите исполнителя' }]}
        >
          <WorkerSelect />
        </Form.Item>
        <Form.Item name="note" label="Примечание">
          <Input.TextArea
            rows={3}
            maxLength={NOTE_MAX}
            showCount
            placeholder="Необязательное примечание"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
