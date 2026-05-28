import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import { getUnitLabel } from '@/shared/lib/format-volume';

import { useWorkTypesQuery } from '../model/useWorkTypesQuery';

type Props = Omit<SelectProps<string>, 'options'> & {
  value?: string;
  onChange?: (value: string) => void;
};

export function WorkTypeSelect(props: Props) {
  const { data, isLoading } = useWorkTypesQuery();

  const options = useMemo(
    () =>
      (data ?? []).map((workType) => ({
        value: workType.id,
        label: `${workType.name} (${getUnitLabel(workType.unit)})`,
      })),
    [data],
  );

  return (
    <Select
      showSearch
      optionFilterProp="label"
      placeholder="Выберите вид работ"
      loading={isLoading}
      options={options}
      allowClear
      {...props}
    />
  );
}
