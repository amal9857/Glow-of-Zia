const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = "admin@glowofzia.com";
    const password = "Zia@Secure#2025!xK9";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: "ADMIN"
        },
        create: {
            email,
            name: "Super Admin",
            phone: "0000000000",
            password: hashedPassword,
            role: "ADMIN"
        }
    });

    console.log("Admin user created/updated successfully:", admin.email);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
