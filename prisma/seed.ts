import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Clean database
    await prisma.cita.deleteMany();
    await prisma.mascota.deleteMany();
    await prisma.veterinario.deleteMany();

    // 2. Create Veterinarian
    const hashedPassword = await bcrypt.hash('password123', 10);
    const vet = await prisma.veterinario.create({
        data: {
            email: 'dr.house@vetcare.com',
            password: hashedPassword,
            nombre: 'Gregory',
            apellido: 'House',
        },
    });

    console.log(`✅ Created veterinarian: ${vet.email}`);

    // 3. Create Pets
    const pet1 = await prisma.mascota.create({
        data: {
            nombre: 'Rex',
            especie: 'Perro',
            raza: 'Pastor Alemán',
            edad: 5,
            dueñoNombre: 'John Doe',
            dueñoContacto: '555-0101',
            veterinarioId: vet.id,
        },
    });

    const pet2 = await prisma.mascota.create({
        data: {
            nombre: 'Luna',
            especie: 'Gato',
            raza: 'Siamés',
            edad: 2,
            dueñoNombre: 'Jane Smith',
            dueñoContacto: '555-0202',
            veterinarioId: vet.id,
        },
    });

    console.log('✅ Created pets: Rex, Luna');

    // 4. Create Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.cita.create({
        data: {
            fecha: tomorrow,
            motivo: 'Vacunación Anual',
            descripcion: 'Refuerzo de rabia y parvovirus',
            veterinarioId: vet.id,
            mascotaId: pet1.id,
        },
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await prisma.cita.create({
        data: {
            fecha: nextWeek,
            motivo: 'Control Post-operatorio',
            descripcion: 'Revisión de puntos tras esterilización',
            veterinarioId: vet.id,
            mascotaId: pet2.id,
        },
    });

    console.log('✅ Created appointments');
    console.log('🚀 Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
