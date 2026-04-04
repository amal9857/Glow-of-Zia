import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Parse fields
        const name = formData.get('name')?.toString() || '';
        const productNumber = formData.get('productNumber')?.toString() || '';
        const category = formData.get('category')?.toString() || '';
        const collection = formData.get('collection')?.toString() || '';
        const priceStr = formData.get('price')?.toString() || '0';
        const isNew = formData.get('isNew') === 'true';
        const files = formData.getAll('images') as File[];
        const description = formData.get('description')?.toString() || '';
        const material = formData.get('material')?.toString() || '';
        const weight = formData.get('weight')?.toString() || '';
        const size = formData.get('size')?.toString() || '';
        const stock = parseInt(formData.get('stock')?.toString() || '0');
        const careInstructions = formData.get('careInstructions')?.toString() || '';

        if (!files.length || !name || !category || !collection || !priceStr) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const price = parseFloat(priceStr);

        const uploadDir = join(process.cwd(), 'public/uploads');
        if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

        const imageUrls: string[] = [];
        for (const file of files.slice(0, 5)) {
            if (!file || file.size === 0) continue;
            const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/\s+/g, '-')}`;
            await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
            imageUrls.push(`/uploads/${filename}`);
        }

        const product = await prisma.product.create({
            data: {
                name, category, collection, price, isNew,
                productNumber,
                image: imageUrls[0] || '',
                images: JSON.stringify(imageUrls),
                description, material, weight, size, stock, careInstructions
            }
        });

        return NextResponse.json({ success: true, product });

    } catch (error: any) {
        console.error('Error posting product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ products });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
