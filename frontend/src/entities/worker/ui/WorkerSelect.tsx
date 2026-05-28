import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import { useWorkersQuery } from '../model/useWorkersQuery';

type Props = Omit<SelectProps<string>, 'options'> & {
  value?: string;
  onChange?: (value: string) => void;
};

export function WorkerSelect(props: Props) {
  const { data, isLoading } = useWorkersQuery();

  const options = useMemo(
    () =>
      (data ?? []).map((worker) => ({
        value: worker.id,
        label: worker.brigade ? `${worker.fullName} — ${worker.brigade}` : worker.fullName,
      })),
    [data],
  );

  return (
    <Select
      showSearch
      optionFilterProp="label"
      placeholder="Выберите исполнителя"
      loading={isLoading}
      options={options}
      allowClear
      {...props}
    />
  );
}
