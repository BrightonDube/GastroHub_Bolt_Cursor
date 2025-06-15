import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  category: { id: string; name: string } | null;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ open, onClose, onSubmit, category }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    onSubmit({ name: name.trim() });
    setError(null);
    onClose();
  };

  if (!open || !category) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required />
          </div>
          {error && <div className="text-error-600 text-sm">{error}</div>}
          <Button type="submit" variant="primary" className="w-full">Save</Button>
        </form>
      </div>
    </div>
  );
};
