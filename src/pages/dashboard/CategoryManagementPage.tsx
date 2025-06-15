import React, { useState } from 'react';
import { CategorySelector, CategoryNode } from '../../components/categories/CategorySelector';
import { AddCategoryModal } from '../../components/categories/AddCategoryModal';
import { Button } from '../../components/ui/Button';

// This would come from backend in real app
const initialCategories: CategoryNode[] = [
  {
    id: 'food', name: '🥗 Food & Beverage Supplies',
    children: [
      { id: 'produce', name: 'Fresh Produce', parent_id: 'food' },
      { id: 'meat', name: 'Meat & Poultry', parent_id: 'food' },
    ]
  },
];

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<CategoryNode[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalParent, setModalParent] = useState<{ id: string; name: string } | null>(null);

  const handleAddCategory = (parentId: string | null) => {
    if (parentId) {
      const parent = findCategory(categories, parentId);
      setModalParent(parent ? { id: parent.id, name: parent.name } : null);
    } else {
      setModalParent(null);
    }
    setModalOpen(true);
  };

  const handleSubmitCategory = (data: { name: string; emoji?: string; parent_id?: string | null }) => {
    const newId = `${data.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newCategory: CategoryNode = {
      id: newId,
      name: data.emoji ? `${data.emoji} ${data.name}` : data.name,
      parent_id: data.parent_id || null,
    };
    if (data.parent_id) {
      setCategories(addSubcategory(categories, data.parent_id, newCategory));
    } else {
      setCategories([...categories, { ...newCategory, children: [] }]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage My Categories</h1>
      <CategorySelector
        value={null}
        onChange={() => {}}
        categories={categories}
        allowAdd={true}
        onAddCategory={handleAddCategory}
      />
      <AddCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCategory}
        parentCategory={modalParent}
      />
    </div>
  );
}

// Helper to find a category node by id
function findCategory(nodes: CategoryNode[], id: string): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findCategory(node.children, id);
      if (found) return found;
    }
  }
  return null;
}
// Helper to add a subcategory to the tree
function addSubcategory(nodes: CategoryNode[], parentId: string, subcat: CategoryNode): CategoryNode[] {
  return nodes.map(node => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), subcat] };
    } else if (node.children) {
      return { ...node, children: addSubcategory(node.children, parentId, subcat) };
    } else {
      return node;
    }
  });
}
