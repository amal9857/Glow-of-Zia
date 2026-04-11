import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const order = await prisma.order.create({ data: body });
        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ orders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.order.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
