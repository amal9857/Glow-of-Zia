import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.product.findUnique({ where: { id: params.id } });
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const contentType = req.headers.get('content-type') || '';

        let fields: any = {};
        let newImagePaths: string[] = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            fields = {
                name: formData.get('name'),
                productNumber: formData.get('productNumber'),
                price: formData.get('price'),
                category: formData.get('category'),
                collection: formData.get('collection'),
                isNew: formData.get('isNew') === 'true',
                inStock: formData.get('inStock') === 'true',
                description: formData.get('description'),
                material: formData.get('material'),
                weight: formData.get('weight'),
                size: formData.get('size'),
                stock: formData.get('stock'),
                careInstructions: formData.get('careInstructions'),
            };

            const images = formData.getAll('images') as File[];
            for (const file of images) {
                if (file && file.size > 0) {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/\s+/g, '-')}`;
                    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
                    await writeFile(filepath, buffer);
                    newImagePaths.push(`/uploads/${filename}`);
                }
            }
        } else {
            fields = await req.json();
        }

        const updateData: any = {
            name: fields.name,
            productNumber: fields.productNumber || '',
            price: parseFloat(fields.price),
            category: fields.category,
            collection: fields.collection,
            isNew: fields.isNew,
            inStock: fields.inStock,
            description: fields.description,
            material: fields.material,
            weight: fields.weight,
            size: fields.size,
            stock: parseInt(fields.stock) || 0,
            careInstructions: fields.careInstructions,
        };

        if (newImagePaths.length > 0) {
            updateData.image = newImagePaths[0];
            updateData.images = JSON.stringify(newImagePaths);
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
