import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';

export interface CategoryNode {
  id: string;
  name: string;
  parent_id?: string | null;
  children?: CategoryNode[];
  is_master?: boolean;
  created_by?: string | null;
}

interface CategorySelectorProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
  categories: CategoryNode[];
  allowAdd?: boolean;
  onAddCategory?: (parentId: string | null) => void;
  label?: string;
  error?: string;
}

function sortCategories(nodes: CategoryNode[]): CategoryNode[] {
  return nodes
    .slice()
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .map(node =>
      node.children && node.children.length > 0
        ? { ...node, children: sortCategories(node.children) }
        : node
    );
}

function renderTree(
  nodes: CategoryNode[],
  selected: string | null,
  onSelect: (id: string) => void,
  onAdd: (parentId: string | null) => void,
  level = 0
) {
  const sorted = sortCategories(nodes);
  return (
    <ul className={level === 0 ? 'pl-0' : 'pl-4'}>
      {sorted.map((node) => (
        <li key={node.id} className="mb-1">
          <div className={`flex items-center gap-2 ${selected === node.id ? 'font-bold text-primary-700 dark:text-primary-300' : ''}`}
               style={{ paddingLeft: level * 8 }}>

            <button
              type="button"
              className="text-left flex-1 focus:outline-none"
              onClick={() => onSelect(node.id)}
            >
              {node.name}
            </button>
            {node.children && node.children.length > 0 && (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
            {onAdd && (
              <Button size="xs" variant="ghost" onClick={() => onAdd(node.id)}>
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
          {node.children && node.children.length > 0 && (
            <div className="ml-4 border-l border-neutral-300 dark:border-neutral-700 pl-2">
              {renderTree(node.children, selected, onSelect, onAdd, level + 1)}
            </div>
          )}
        </li>
      ))}
      {onAdd && level === 0 && (
        <li>
          <Button size="sm" variant="outline" onClick={() => onAdd(null)} className="mt-2">
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </Button>
        </li>
      )}
    </ul>
  );
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  categories,
  allowAdd = false,
  onAddCategory,
  label = 'Category',
  error
}) => {
  // Flattened lookup for fast selection
  const [flat, setFlat] = useState<{ [id: string]: CategoryNode }>({});
  useEffect(() => {
    const map: { [id: string]: CategoryNode } = {};
    function walk(nodes: CategoryNode[]) {
      for (const n of nodes) {
        map[n.id] = n;
        if (n.children) walk(n.children);
      }
    }
    walk(categories);
    setFlat(map);
  }, [categories]);

  return (
    <div>
      {label && <label className="block font-medium mb-1">{label}</label>}
      <div className="bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 p-2">
        {renderTree(categories, value, onChange, allowAdd ? (onAddCategory || (() => {})) : undefined)}
      </div>
      {error && <div className="text-error-600 text-sm mt-1">{error}</div>}
      {value && flat[value] && (
        <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Selected: {flat[value].emoji ? flat[value].emoji + ' ' : ''}{flat[value].name}
        </div>
      )}
    </div>
  );
};
