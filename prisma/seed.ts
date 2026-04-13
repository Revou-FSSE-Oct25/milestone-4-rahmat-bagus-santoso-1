import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('seeding');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    await prisma.user.upsert({
        where: { 
            email: 'admin@bank.com'
        },
        update: {},
        create: {
            fullName: 'Default Admin',
            email: 'admin@bank.com',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });

    await prisma.user.upsert ({
        where: {
            email: 'customer@bank.com'
        },
        update: {},
        create: {
            fullName: 'Default Customer',
            email: 'customer@bank.com',
            password: customerPassword,
            role: Role.CUSTOMER,
        },
    });

    console.log('Seed success');
}

main()
.catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
})
.finally(async() => {
    await prisma.$disconnect();
});