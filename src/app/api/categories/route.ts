import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
    const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ categories });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name')?.toString().toLowerCase().trim() || '';
        const label = formData.get('label')?.toString() || '';
        const file = formData.get('image') as File | null;

        if (!name || !label) return NextResponse.json({ error: 'Name and label are required' }, { status: 400 });

        let imageUrl = '';
        if (file && file.size > 0) {
            const uploadDir = join(process.cwd(), 'public/uploads');
            if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
            imageUrl = `/uploads/${filename}`;
        }

        const category = await prisma.category.create({ data: { name, label, image: imageUrl } });
        return NextResponse.json({ category });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id')?.toString() || '';
        const label = formData.get('label')?.toString() || '';
        const file = formData.get('image') as File | null;

        if (!id || !label) return NextResponse.json({ error: 'ID and label are required' }, { status: 400 });

        let imageUrl: string | undefined = undefined;
        if (file && file.size > 0) {
            const uploadDir = join(process.cwd(), 'public/uploads');
            if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
            imageUrl = `/uploads/${filename}`;
        }

        const category = await prisma.category.update({
            where: { id },
            data: { label, ...(imageUrl ? { image: imageUrl } : {}) }
        });
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
