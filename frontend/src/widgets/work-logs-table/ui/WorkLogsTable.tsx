import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { useMemo } from 'react';

import type { WorkLog } from '@/entities/work-log';
import { formatDate } from '@/shared/lib/format-date';
import { formatVolume } from '@/shared/lib/format-volume';

interface Props {
  data: WorkLog[];
  total: number;
  loading?: boolean;
  page: number;
  pageSize: number;
  sortDirection: 'asc' | 'desc';
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
  onEdit: (workLog: WorkLog) => void;
  onDelete: (ids: string[]) => void;
}

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

export function WorkLogsTable({
  data,
  total,
  loading,
  page,
  pageSize,
  sortDirection,
  selectedIds,
  onSelectedIdsChange,
  onPaginationChange,
  onSortDirectionChange,
  onEdit,
  onDelete,
}: Props) {
  const columns: TableColumnsType<WorkLog> = useMemo(
    () => [
      {
        title: 'Дата',
        dataIndex: 'performedAt',
        key: 'performedAt',
        width: 130,
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        sortOrder: sortDirection === 'asc' ? 'ascend' : 'descend',
        showSorterTooltip: { title: 'Сортировка по дате (по всей базе)' },
        render: (value: string) => formatDate(value),
      },
      {
        title: 'Вид работ',
        dataIndex: ['workType', 'name'],
        key: 'workType',
      },
      {
        title: 'Объём',
        dataIndex: 'volume',
        key: 'volume',
        width: 140,
        align: 'right',
        render: (value: string, record) => formatVolume(value, record.workType.unit),
      },
      {
        title: 'Исполнитель',
        dataIndex: ['worker', 'fullName'],
        key: 'worker',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Typography.Text>{record.worker.fullName}</Typography.Text>
            {record.worker.brigade && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {record.worker.brigade}
              </Typography.Text>
            )}
          </Space>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: 96,
        align: 'right',
        render: (_, record) => (
          <Space size={4}>
            <Tooltip title="Редактировать">
              <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
            </Tooltip>
            <Tooltip title="Удалить">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete([record.id])}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [onDelete, onEdit, sortDirection],
  );

  const resolveDateSorter = (sorter: SorterResult<WorkLog> | SorterResult<WorkLog>[]) => {
    const items = Array.isArray(sorter) ? sorter : [sorter];
    return items.find((item) => item.columnKey === 'performedAt' || item.field === 'performedAt');
  };

  const handleChange: TableProps<WorkLog>['onChange'] = (pagination, _filters, sorter, extra) => {
    if (extra.action === 'paginate') {
      onPaginationChange(pagination.current ?? page, pagination.pageSize ?? pageSize);
      return;
    }

    if (extra.action !== 'sort') {
      return;
    }

    const dateSorter = resolveDateSorter(sorter);
    if (!dateSorter?.order) {
      onSortDirectionChange(sortDirection === 'desc' ? 'asc' : 'desc');
      return;
    }

    onSortDirectionChange(dateSorter.order === 'ascend' ? 'asc' : 'desc');
  };

  return (
    <>
      {selectedIds.length > 0 && (
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Tag>Выбрано: {selectedIds.length}</Tag>
          <Space>
            <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(selectedIds)}>
              Удалить выбранные
            </Button>
            <Button onClick={() => onSelectedIdsChange([])}>Снять выделение</Button>
          </Space>
        </Flex>
      )}

      <Table<WorkLog>
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => onSelectedIdsChange(keys.map(String)),
          preserveSelectedRowKeys: true,
        }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (value) => `Всего записей: ${value}`,
        }}
        onChange={handleChange}
        scroll={{ x: 800 }}
      />
    </>
  );
}
