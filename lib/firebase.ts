import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, remove, push, child } from 'firebase/database';
import { Category, Inquiry } from '../types';

// Config configured based on the URL you provided
const firebaseConfig = {
    apiKey: "AIzaSyCooo33z6XlyjhEpIMiF1cHhW7qPd7cSo0",
    authDomain: "ifi-290d1.firebaseapp.com",
    databaseURL: "https://ifi-290d1-default-rtdb.firebaseio.com",
    projectId: "ifi-290d1",
    storageBucket: "ifi-290d1.firebasestorage.app",
    messagingSenderId: "561312981086",
    appId: "1:561312981086:web:edd0e8d7ae1cac2806d4cf"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// --- Categories Operations ---

export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
    const categoriesRef = ref(db, 'categories');
    return onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Convert object to array if needed, or structured as array
            // If we save as array, it comes back as array (or object with indices if sparse)
            const rawData = Array.isArray(data) ? data : Object.values(data);
            // Filter out nulls (common in Firebase arrays if items are deleted)
            const formattedData = rawData.filter(item => item !== null && item !== undefined);
            callback(formattedData as Category[]);
        } else {
            callback([]);
        }
    });
};

export const syncCategories = async (currentCategories: Category[], newCategories: Category[]) => {
    // For Realtime Database, we can simply overwrite the node for this use case
    // This is much simpler than Firestore batch updates
    // Note: This replaces the entire list
    await set(ref(db, 'categories'), newCategories);
};

// --- Inquiries Operations ---

export const subscribeToInquiries = (callback: (inquiries: Inquiry[]) => void) => {
    const inquiriesRef = ref(db, 'inquiries');
    return onValue(inquiriesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const formattedData = Object.keys(data).map(key => ({
                ...data[key],
                id: key // Ensure ID matches key if possible, though we usually store ID in object
            }));
            callback(formattedData as Inquiry[]);
        } else {
            callback([]);
        }
    });
};

export const saveInquiry = async (inquiry: Inquiry) => {
    // Use 'inquiry.id' as the key
    await set(ref(db, `inquiries/${inquiry.id}`), inquiry);
};

export const deleteInquiry = async (id: string) => {
    await remove(ref(db, `inquiries/${id}`));
};

// --- Migration Helper ---

export const migrateCategories = async (categories: Category[]) => {
    await set(ref(db, 'categories'), categories);
};
