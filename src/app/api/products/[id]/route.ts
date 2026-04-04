import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { uploadImage } from "../../../../lib/cloudinary";

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
        const formData = await req.formData();

        const fields: any = {
            name: formData.get('name'),
            productNumber: formData.get('productNumber') || '',
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

        const updateData: any = {
            name: fields.name,
            productNumber: fields.productNumber,
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

        const images = formData.getAll('images') as File[];
        const newImageUrls: string[] = [];
        for (const file of images) {
            if (file && file.size > 0) {
                newImageUrls.push(await uploadImage(file));
            }
        }

        if (newImageUrls.length > 0) {
            updateData.image = newImageUrls[0];
            updateData.images = JSON.stringify(newImageUrls);
        }

        const updatedProduct = await prisma.product.update({ where: { id }, data: updateData });
        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.product.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
