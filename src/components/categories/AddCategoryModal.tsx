import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; emoji?: string; parent_id?: string | null }) => void;
  parentCategory?: { id: string; name: string } | null;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose, onSubmit, parentCategory }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    onSubmit({ name: name.trim(), emoji: emoji.trim() || undefined, parent_id: parentCategory?.id || null });
    setName('');
    setEmoji('');
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Add {parentCategory ? 'Subcategory' : 'Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="block font-medium mb-1">Emoji <span className="text-xs text-neutral-400">(optional)</span></label>
            <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} className="input" maxLength={2} placeholder="e.g. 🥗" />
          </div>
          {error && <div className="text-error-600 text-sm">{error}</div>}
          <Button type="submit" variant="primary" className="w-full">Add</Button>
        </form>
      </div>
    </div>
  );
};
