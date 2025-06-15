import React, { useState } from 'react';
import { CategorySelector, CategoryNode } from '../../components/categories/CategorySelector';
import { AddCategoryModal } from '../../components/categories/AddCategoryModal';
import { EditCategoryModal } from '../../components/categories/EditCategoryModal';
import { Button } from '../../components/ui/Button';

// This would come from backend in real app
const initialCategories: CategoryNode[] = [
  {
    id: 'food', name: 'Food & Beverage Supplies',
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string; emoji?: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Only allow edit/delete for user-created (not master) categories
  function isUserCategory(cat: CategoryNode) {
    return !cat.id.startsWith('food'); // adjust as needed for your master category logic
  }

  const handleAddCategory = (parentId: string | null) => {
    if (parentId) {
      const parent = findCategory(categories, parentId);
      setModalParent(parent ? { id: parent.id, name: parent.name } : null);
    } else {
      setModalParent(null);
    }
    setModalOpen(true);
  };

  const handleSubmitCategory = (data: { name: string; parent_id?: string | null }) => {
    const newId = `${data.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newCategory: CategoryNode = {
      id: newId,
      name: data.name,
      parent_id: data.parent_id || null,
    };
    if (data.parent_id) {
      setCategories(sortCategories(addSubcategory(categories, data.parent_id, newCategory)));
    } else {
      setCategories(sortCategories([...categories, { ...newCategory, children: [] }]));
    }
  };

  const handleEditCategory = (cat: CategoryNode) => {
    setEditCategory({ id: cat.id, name: cat.name });
    setEditModalOpen(true);
  };

  const handleSubmitEditCategory = (data: { name: string; emoji?: string }) => {
    if (editCategory) {
      setCategories(sortCategories(updateCategory(categories, editCategory.id, data)));
    }
    setEditModalOpen(false);
    setEditCategory(null);
  };

  const handleDeleteCategory = (cat: CategoryNode) => {
    setDeleteConfirm({ id: cat.id, name: cat.name });
  };

  const confirmDeleteCategory = () => {
    if (deleteConfirm) {
      setCategories(sortCategories(removeCategory(categories, deleteConfirm.id)));
      setDeleteConfirm(null);
    }
  };

  // Custom rendering for category tree with edit/delete buttons
  function sortCategories(nodes: CategoryNode[]): CategoryNode[] {
    return nodes
      .slice()
      .sort((a, b) => {
        // Compare case-insensitive (no emoji logic)
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      })
      .map(node =>
        node.children && node.children.length > 0
          ? { ...node, children: sortCategories(node.children) }
          : node
      );
  }

  function renderCategoryTree(nodes: CategoryNode[], level = 0) {
    const sorted = sortCategories(nodes);
    return (
      <ul className={level === 0 ? 'pl-0' : 'pl-4'}>
        {sorted.map((node) => (
          <li key={node.id} className="mb-1 flex items-center gap-2">
            <span>{node.name}</span>
            {isUserCategory(node) && (
              <>
                <Button size="xs" variant="ghost" onClick={() => handleEditCategory(node)}>Edit</Button>
                <Button size="xs" variant="ghost" color="danger" onClick={() => handleDeleteCategory(node)}>Delete</Button>
              </>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4 border-l border-neutral-300 dark:border-neutral-700 pl-2">
                {renderCategoryTree(node.children, level + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage My Categories</h1>
      {renderCategoryTree(categories)}
      <Button variant="outline" className="mt-4" onClick={() => handleAddCategory(null)}>Add Category</Button>
      <AddCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCategory}
        parentCategory={modalParent}
      />
      <EditCategoryModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleSubmitEditCategory}
        category={editCategory}
      />
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-xl font-bold mb-4">Delete Category</h2>
            <p>Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span> and all its subcategories?</p>
            <div className="flex gap-2 mt-6">
              <Button variant="danger" onClick={confirmDeleteCategory}>Delete</Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
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
