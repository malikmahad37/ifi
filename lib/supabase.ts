/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Category, Inquiry, BlogPost } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Categories Operations ---

export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
    // Initial fetch
    supabase
        .from('categories')
        .select('*')
        .then(({ data, error }) => {
            if (!error && data) {
                callback(data as Category[]);
            } else {
                callback([]);
            }
        });

    // Subscribe to realtime changes
    const subscription = supabase
        .channel('categories_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'categories' },
            async () => {
                const { data } = await supabase.from('categories').select('*');
                if (data) callback(data as Category[]);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
};

export const syncCategories = async (currentCategories: Category[], newCategories: Category[]) => {
    // Delete all existing categories to maintain an exact sync
    await supabase.from('categories').delete().neq('id', 'dummy_value_to_delete_all');

    // Insert new categories with proper serialization
    if (newCategories.length > 0) {
        // Supabase expects JSON arrays/objects to be properly formattted or passed as is depending on the table structure.
        // Assuming "series" is a JSONB column in "categories".
        const toInsert = newCategories.map(cat => ({
            ...cat,
            // Ensure series is correctly passed as JSON
            series: cat.series || []
        }));

        const { error } = await supabase.from('categories').insert(toInsert);
        if (error) {
            console.error("Error syncing categories:", error);
            throw error; // Throw so App.tsx can catch it and alert the user instead of failing silently
        }
    }
};

export const migrateCategories = async (categories: Category[]) => {
    if (categories.length > 0) {
        const { error } = await supabase.from('categories').upsert(categories);
        if (error) console.error("Error migrating categories:", error);
    }
};

// --- Inquiries Operations ---

export const subscribeToInquiries = (callback: (inquiries: Inquiry[]) => void) => {
    supabase
        .from('inquiries')
        .select('*')
        .then(({ data, error }) => {
            if (!error && data) {
                callback(data as Inquiry[]);
            } else {
                callback([]);
            }
        });

    const subscription = supabase
        .channel('inquiries_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'inquiries' },
            async () => {
                const { data } = await supabase.from('inquiries').select('*');
                if (data) callback(data as Inquiry[]);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
};

export const saveInquiry = async (inquiry: Inquiry) => {
    const { error } = await supabase.from('inquiries').upsert([inquiry]);
    if (error) console.error("Error saving inquiry:", error);
};

export const deleteInquiry = async (id: string) => {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) console.error("Error deleting inquiry:", error);
};

// --- Blogs Operations ---

export const subscribeToBlogs = (callback: (blogs: BlogPost[]) => void) => {
    supabase
        .from('blogs')
        .select('*')
        .then(({ data, error }) => {
            if (!error && data) {
                callback(data as BlogPost[]);
            } else {
                callback([]);
            }
        });

    const subscription = supabase
        .channel('blogs_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'blogs' },
            async () => {
                const { data } = await supabase.from('blogs').select('*');
                if (data) callback(data as BlogPost[]);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
};

export const saveBlog = async (blog: BlogPost) => {
    const { error } = await supabase.from('blogs').upsert([blog]);
    if (error) console.error("Error saving blog:", error);
};

export const deleteBlog = async (id: string) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) console.error("Error deleting blog:", error);
};
