export type Category = 'men' | 'women' | 'kids';

export interface JewelryItem {
    id: string;
    name: string;
    category: Category;
    collection: string; // e.g., 'anklet', 'necklaces', 'rings', etc.
    price: number;
    image: string;
    isNew?: boolean;
}

// Initial placeholder data, now products mostly pull from database
export const inventory: JewelryItem[] = [];

export const collectionsList = [
    'anklet',
    'necklaces',
    'rings',
    'bracelet',
    'bangles',
    'earrings',
    'bow rings',
    'toe ring'
];
