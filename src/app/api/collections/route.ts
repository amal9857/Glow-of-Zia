import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { uploadImage } from '../../../lib/cloudinary';

export async function GET() {
    try {
        const collections = await prisma.collection.findMany({ orderBy: { createdAt: 'asc' } });
        return NextResponse.json({ collections });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const imageFile = formData.get('image') as File | null;
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        let imageUrl = '';
        if (imageFile && imageFile.size > 0) imageUrl = await uploadImage(imageFile);
        const collection = await prisma.collection.create({ data: { name: name.toLowerCase().trim(), image: imageUrl } });
        return NextResponse.json({ collection });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const name = formData.get('name')?.toString();
        const imageFile = formData.get('image') as File | null;
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        let updateData: any = { name };
        if (imageFile && imageFile.size > 0) updateData.image = await uploadImage(imageFile);
        const collection = await prisma.collection.update({ where: { id }, data: updateData });
        return NextResponse.json({ collection });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.collection.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
