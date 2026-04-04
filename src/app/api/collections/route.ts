import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'glow-of-zia' },
            (error, result) => error ? reject(error) : resolve(result!.secure_url)
        ).end(buffer);
    });
}

export async function GET() {
    const collections = await prisma.collection.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ collections });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const imageFile = formData.get('image') as File | null;
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        let imageUrl = '';
        if (imageFile && imageFile.size > 0) imageUrl = await uploadToCloudinary(imageFile);
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
        if (imageFile && imageFile.size > 0) updateData.image = await uploadToCloudinary(imageFile);
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
