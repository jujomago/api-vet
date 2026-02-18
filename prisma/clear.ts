import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning database...');

    // Order matters due to foreign key constraints
    await prisma.cita.deleteMany();
    await prisma.mascota.deleteMany();
    await prisma.veterinario.deleteMany();

    console.log('✨ Database is now empty!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
