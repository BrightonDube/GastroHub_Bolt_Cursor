import { useState } from 'react';
import { CategoryNode } from '../../components/categories/CategorySelector';
import { AddCategoryModal } from '../../components/categories/AddCategoryModal';
import { EditCategoryModal } from '../../components/categories/EditCategoryModal';
import { Button } from '../../components/ui/Button';

// Categories are now fetched from backend using hooks

import { useCategories, useAddCategory, useEditCategory, useDeleteCategory } from '../../hooks/useCategories';

export default function CategoryManagementPage() {
  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const editCategory = useEditCategory();
  const deleteCategory = useDeleteCategory();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalParent, setModalParent] = useState<{ id: string; name: string } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryState, setEditCategoryState] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function isUserCategory(cat: CategoryNode) {
    return !!cat.created_by;
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

  const handleSubmitCategory = async (data: { name: string; parent_id?: string | null }) => {
    try {
      await addCategory.mutateAsync(data);
    } catch (e: any) {
      setError(e.message);
    }
    setModalOpen(false);
    setModalParent(null);
  };

  const handleEditCategory = (cat: CategoryNode) => {
    setEditCategoryState({ id: cat.id, name: cat.name });
    setEditModalOpen(true);
  };

  const handleSubmitEditCategory = async (data: { name: string }) => {
    if (editCategoryState) {
      try {
        await editCategory.mutateAsync({ id: editCategoryState.id, name: data.name });
      } catch (e: any) {
        setError(e.message);
      }
    }
    setEditModalOpen(false);
    setEditCategoryState(null);
  };

  const handleDeleteCategory = (cat: CategoryNode) => {
    setDeleteConfirm({ id: cat.id, name: cat.name });
  };

  const confirmDeleteCategory = async () => {
    if (deleteConfirm) {
      try {
        await deleteCategory.mutateAsync(deleteConfirm.id);
      } catch (e: any) {
        setError(e.message);
      }
      setDeleteConfirm(null);
    }
  };

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

  function renderCategoryTree(nodes: CategoryNode[], level = 0) {
    const sorted = sortCategories(nodes);
    return (
      <ul className={level === 0 ? 'pl-0' : 'pl-4'}>
        {sorted.map((node) => (
          <li key={node.id} className="mb-1 flex items-center gap-2">
            <span>{node.name}</span>
            {isUserCategory(node) && (
              <>
                <Button size="sm" variant="ghost" onClick={() => handleEditCategory(node)}>Edit</Button>
                <Button size="sm" variant="ghost" color="danger" onClick={() => handleDeleteCategory(node)}>Delete</Button>
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
      {error && <div className="text-error-600 text-sm mb-4">{error}</div>}
      {isLoading ? <div>Loading...</div> : renderCategoryTree(categories)}
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
        category={editCategoryState}
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
