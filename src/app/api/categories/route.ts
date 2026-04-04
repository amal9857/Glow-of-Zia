import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { uploadImage } from '../../../lib/cloudinary';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } });
        return NextResponse.json({ categories });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const label = formData.get('label')?.toString();
        const imageFile = formData.get('image') as File | null;
        if (!name || !label) return NextResponse.json({ error: 'Name and label are required' }, { status: 400 });
        let imageUrl = '';
        if (imageFile && imageFile.size > 0) imageUrl = await uploadImage(imageFile);
        const category = await prisma.category.create({ data: { name: name.toLowerCase().trim(), label, image: imageUrl } });
        return NextResponse.json({ category });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const label = formData.get('label')?.toString();
        const imageFile = formData.get('image') as File | null;
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        let updateData: any = { label };
        if (imageFile && imageFile.size > 0) updateData.image = await uploadImage(imageFile);
        const category = await prisma.category.update({ where: { id }, data: updateData });
        return NextResponse.json({ category });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
