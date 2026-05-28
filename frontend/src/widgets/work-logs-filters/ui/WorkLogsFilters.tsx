import { FilterOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';

import { WorkTypeSelect } from '@/entities/work-type';
import { WorkerSelect } from '@/entities/worker';
import { DATE_ISO_FORMAT } from '@/shared/lib/format-date';

export interface WorkLogsFiltersValue {
  dateFrom?: string;
  dateTo?: string;
  workTypeId?: string;
  workerId?: string;
}

interface InternalValues {
  dateRange?: [Dayjs | null, Dayjs | null];
  workTypeId?: string;
  workerId?: string;
}

interface Props {
  value: WorkLogsFiltersValue;
  onChange: (value: WorkLogsFiltersValue) => void;
}

function toInternal(value: WorkLogsFiltersValue): InternalValues {
  if (!value.dateFrom && !value.dateTo) {
    return { workTypeId: value.workTypeId, workerId: value.workerId };
  }
  return {
    dateRange: [value.dateFrom ? dayjs(value.dateFrom) : null, value.dateTo ? dayjs(value.dateTo) : null],
    workTypeId: value.workTypeId,
    workerId: value.workerId,
  };
}

export function WorkLogsFilters({ value, onChange }: Props) {
  const [form] = Form.useForm<InternalValues>();

  useEffect(() => {
    form.setFieldsValue(toInternal(value));
  }, [value, form]);

  const handleApply = () => {
    const values = form.getFieldsValue();
    onChange({
      dateFrom: values.dateRange?.[0]?.format(DATE_ISO_FORMAT),
      dateTo: values.dateRange?.[1]?.format(DATE_ISO_FORMAT),
      workTypeId: values.workTypeId,
      workerId: values.workerId,
    });
  };

  const handleReset = () => {
    form.resetFields();
    onChange({});
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form<InternalValues>
        form={form}
        layout="inline"
        initialValues={toInternal(value)}
        onFinish={handleApply}
        style={{ rowGap: 12, columnGap: 12, flexWrap: 'wrap' }}
      >
        <Form.Item name="dateRange" label="Период">
          <DatePicker.RangePicker
            format="DD.MM.YYYY"
            allowEmpty={[true, true]}
            style={{ width: 280 }}
          />
        </Form.Item>
        <Form.Item name="workTypeId" label="Вид работ">
          <WorkTypeSelect style={{ width: 240 }} />
        </Form.Item>
        <Form.Item name="workerId" label="Исполнитель">
          <WorkerSelect style={{ width: 240 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
              Применить
            </Button>
            <Button onClick={handleReset}>Сбросить</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
