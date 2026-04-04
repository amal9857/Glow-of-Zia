const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const defaultCategories = [
        { name: 'women', label: "Women's Collection", image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
        { name: 'men', label: "Men's Collection", image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80' },
        { name: 'kids', label: "Kids' Collection", image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
    ];

    const defaultCollections = [
        { name: 'anklet', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80' },
        { name: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478514-4a4e0ec947b4?auto=format&fit=crop&w=600&q=80' },
        { name: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=600&q=80' },
        { name: 'bracelet', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80' },
        { name: 'bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80' },
        { name: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
        { name: 'bow rings', image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=600&q=80' },
        { name: 'toe ring', image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=600&q=80' },
    ];

    for (const cat of defaultCategories) {
        await prisma.category.upsert({ where: { name: cat.name }, update: {}, create: cat });
    }
    for (const col of defaultCollections) {
        await prisma.collection.upsert({ where: { name: col.name }, update: {}, create: col });
    }

    console.log('Default categories and collections seeded.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
