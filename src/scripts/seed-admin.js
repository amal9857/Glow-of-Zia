const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Delete ALL existing admin users first
    await prisma.user.deleteMany({ where: { role: "ADMIN" } });
    console.log("Deleted all old admin users.");

    const email = "admin@glowofjoe.com";
    const password = "Joe@Secure#2025!xK9";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
        data: {
            email,
            name: "Super Admin",
            phone: "0000000000",
            password: hashedPassword,
            role: "ADMIN"
        }
    });

    console.log("Admin user created:", admin.email);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
