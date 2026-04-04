import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
    const collections = await prisma.collection.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ collections });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name')?.toString().toLowerCase().trim() || '';
        const file = formData.get('image') as File | null;

        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        let imageUrl = '';
        if (file && file.size > 0) {
            const uploadDir = join(process.cwd(), 'public/uploads');
            if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
            imageUrl = `/uploads/${filename}`;
        }

        const collection = await prisma.collection.create({ data: { name, image: imageUrl } });
        return NextResponse.json({ collection });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id')?.toString() || '';
        const name = formData.get('name')?.toString().toLowerCase().trim() || '';
        const file = formData.get('image') as File | null;

        if (!id || !name) return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });

        let imageUrl: string | undefined = undefined;
        if (file && file.size > 0) {
            const uploadDir = join(process.cwd(), 'public/uploads');
            if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
            imageUrl = `/uploads/${filename}`;
        }

        const collection = await prisma.collection.update({
            where: { id },
            data: { name, ...(imageUrl ? { image: imageUrl } : {}) }
        });
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
