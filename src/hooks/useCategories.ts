import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../App';
import { CategoryNode } from '../components/categories/CategorySelector';

// Fetch master categories from 'categories' table
async function fetchMasterCategories(): Promise<CategoryNode[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null);
  if (error) throw error;
  if (!data) return [];
  // Fetch children for each master category
  const categories: CategoryNode[] = await Promise.all(
    data.map(async (cat: any) => {
      const children = await fetchCategoryChildren(cat.id);
      return { ...cat, children };
    })
  );
  return categories;
}

async function fetchCategoryChildren(parentId: string): Promise<CategoryNode[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId);
  if (error) throw error;
  if (!data) return [];
  return data.map((cat: any) => ({ ...cat, children: [] }));
}

// Fetch user custom categories from 'custom_categories' table
async function fetchUserCategories(userId: string): Promise<CategoryNode[]> {
  const { data, error } = await supabase
    .from('custom_categories')
    .select('*')
    .eq('created_by', userId)
    .is('parent_id', null);
  if (error) throw error;
  if (!data) return [];
  // Fetch children for each root custom category
  const categories: CategoryNode[] = await Promise.all(
    data.map(async (cat: any) => {
      const children = await fetchUserCategoryChildren(userId, cat.id);
      return { ...cat, children };
    })
  );
  return categories;
}

async function fetchUserCategoryChildren(userId: string, parentId: string): Promise<CategoryNode[]> {
  const { data, error } = await supabase
    .from('custom_categories')
    .select('*')
    .eq('created_by', userId)
    .eq('parent_id', parentId);
  if (error) throw error;
  if (!data) return [];
  return data.map((cat: any) => ({ ...cat, children: [] }));
}

export function useCategories() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      const [master, userCats] = await Promise.all([
        fetchMasterCategories(),
        user?.id ? fetchUserCategories(user.id) : Promise.resolve([]),
      ]);
      return [...master, ...userCats];
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { name: string; parent_id?: string | null }) => {
      if (!user) throw new Error('Not authenticated');
      const insertData = {
        name: data.name,
        parent_id: data.parent_id || null,
        created_by: user.id,
      };
      const { data: result, error } = await supabase
        .from('custom_categories')
        .insert([insertData])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

export function useEditCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { id: string; name: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { data: result, error } = await supabase
        .from('custom_categories')
        .update({ name: data.name })
        .eq('id', data.id)
        .eq('created_by', user.id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      // Delete category and all its children recursively (handled by RLS/cascade in DB)
      const { error } = await supabase
        .from('custom_categories')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}
