import React from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { SortConfig } from '@/utils/hooks/useSortableData';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: SortConfig<any> | null;
  onSort: (key: string) => void;
  align?: 'left' | 'right' | 'center';
  className?: string; // Additional classes for the th element
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
  align = 'left',
  className = ''
}) => {
  const isActive = currentSort?.key === sortKey;
  
  return (
    <th 
      className={`px-6 py-3 font-medium cursor-pointer group hover:bg-gray-100 transition-colors select-none ${className}`}
      onClick={() => onSort(sortKey)}
      style={{ textAlign: align }}
    >
      <div className={`flex items-center gap-1.5 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}
        <span className="text-gray-400">
          {!isActive && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
          {isActive && currentSort.direction === 'ascending' && <ChevronUp className="w-3 h-3 text-brand-primary" />}
          {isActive && currentSort.direction === 'descending' && <ChevronDown className="w-3 h-3 text-brand-primary" />}
        </span>
      </div>
    </th>
  );
};
