import { useState, useMemo } from 'react';

export type SortConfig<T> = {
  key: keyof T | string; 
  direction: 'ascending' | 'descending';
};

export const useSortableData = <T>(items: T[], config: SortConfig<T> | null = null) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        // Handle nested properties (dots in key)
        const getKey = (item: any, key: string) => {
            if (key.includes('.')) {
                return key.split('.').reduce((obj, k) => obj && obj[k], item);
            }
            return item[key];
        };

        const aValue = getKey(a, sortConfig.key as string);
        const bValue = getKey(b, sortConfig.key as string);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T | string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
