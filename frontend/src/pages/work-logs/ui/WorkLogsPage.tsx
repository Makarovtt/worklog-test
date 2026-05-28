import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button, Card, Flex, Space } from 'antd';
import { useCallback, useState } from 'react';

import { type WorkLog, useWorkLogsQuery } from '@/entities/work-log';
import { useCreateWorkLogsBulk } from '@/features/work-log/create-bulk';
import { useCreateWorkLog } from '@/features/work-log/create-one';
import { useDeleteWorkLogs } from '@/features/work-log/delete';
import { useUpdateWorkLog } from '@/features/work-log/update-one';
import { ROUTES } from '@/shared/config/routes';
import { AuthenticatedLayout } from '@/widgets/authenticated-layout';
import { WorkLogFormModal, type WorkLogFormValues } from '@/widgets/work-log-form';
import {
  WorkLogsBulkCreateModal,
  type BulkCreateValues,
} from '@/widgets/work-logs-bulk-form';
import { WorkLogsFilters, type WorkLogsFiltersValue } from '@/widgets/work-logs-filters';
import { WorkLogsTable } from '@/widgets/work-logs-table';

export function WorkLogsPage() {
  const search = useSearch({ from: '/work-logs' });
  const navigate = useNavigate({ from: '/work-logs' });

  const [editing, setEditing] = useState<WorkLog | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [bulkFormOpen, setBulkFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query = useWorkLogsQuery({
    dateFrom: search.dateFrom,
    dateTo: search.dateTo,
    workTypeId: search.workTypeId,
    workerId: search.workerId,
    page: search.page,
    pageSize: search.pageSize,
    sortDirection: search.sortDirection,
  });

  const createMutation = useCreateWorkLog();
  const updateMutation = useUpdateWorkLog();
  const deleteMutation = useDeleteWorkLogs();
  const bulkCreateMutation = useCreateWorkLogsBulk();

  const updateSearch = useCallback(
    (next: Partial<typeof search>) => {
      void navigate({
        to: ROUTES.workLogs,
        search: (prev) => ({ ...prev, ...next }),
      });
    },
    [navigate],
  );

  const handleFiltersChange = useCallback(
    (value: WorkLogsFiltersValue) => {
      updateSearch({
        dateFrom: value.dateFrom,
        dateTo: value.dateTo,
        workTypeId: value.workTypeId,
        workerId: value.workerId,
        page: 1,
      });
    },
    [updateSearch],
  );

  const openCreateForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (workLog: WorkLog) => {
    setEditing(workLog);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: WorkLogFormValues) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload: values },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditing(null);
          },
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleBulkSubmit = (entries: BulkCreateValues[]) => {
    bulkCreateMutation.mutate(entries, {
      onSuccess: () => setBulkFormOpen(false),
    });
  };

  const handleDelete = (ids: string[]) => {
    deleteMutation.mutate(ids, {
      onSuccess: () => {
        setSelectedIds((current) => current.filter((id) => !ids.includes(id)));
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <div style={{ padding: 24 }}>
        <Flex justify="flex-end" style={{ marginBottom: 16 }}>
          <Space>
            <Button icon={<UnorderedListOutlined />} onClick={() => setBulkFormOpen(true)}>
              Добавить несколько
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
              Новая запись
            </Button>
          </Space>
        </Flex>

        <WorkLogsFilters
          value={{
            dateFrom: search.dateFrom,
            dateTo: search.dateTo,
            workTypeId: search.workTypeId,
            workerId: search.workerId,
          }}
          onChange={handleFiltersChange}
        />

        <Card>
          <WorkLogsTable
            data={query.data?.items ?? []}
            total={query.data?.total ?? 0}
            loading={query.isLoading || query.isFetching}
            page={search.page}
            pageSize={search.pageSize}
            sortDirection={search.sortDirection}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onPaginationChange={(page, pageSize) => updateSearch({ page, pageSize })}
            onSortDirectionChange={(direction) => updateSearch({ sortDirection: direction, page: 1 })}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        </Card>

        <WorkLogFormModal
          open={formOpen}
          mode={editing ? 'edit' : 'create'}
          initialValues={editing}
          loading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />

        <WorkLogsBulkCreateModal
          open={bulkFormOpen}
          loading={bulkCreateMutation.isPending}
          onSubmit={handleBulkSubmit}
          onClose={() => setBulkFormOpen(false)}
        />
      </div>
    </AuthenticatedLayout>
  );
}
