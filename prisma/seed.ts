import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, AccountStatus, TransactionType, TransactionStatus } from '@prisma/client';
import { PasswordService } from '../src/password/password.service';


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const passwordService = new PasswordService();

async function main() {
    console.log('initialize seeding data');
    
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    
    const admin = await prisma.user.create({
        data: {
            fullName: 'First Admin',
            email: 'admin1st@bank.com',
            password: await passwordService.hashPassword('admin123'),
            role: Role.ADMIN,
        },
    });

    const customer1 = await prisma.user.create ({
        data: {
            fullName: 'First Customer',
            email: 'customer1st@bank.com',
            password: await passwordService.hashPassword('customer123'),
            role: Role.CUSTOMER,
        },
    });

    const customer2 = await prisma.user.create ({
        data: {
            fullName: 'Second Customer',
            email: 'customer2nd@bank.com',
            password: await passwordService.hashPassword('customer123'),
            role: Role.CUSTOMER,
        },
    });

    const account1 = await prisma.account.create({
        data: {
            accountNumber: '1122334455',
            balance: 1000000,
            status: AccountStatus.ACTIVE,
            userId: customer1.id,
        },
    });

    const account2 = await prisma.account.create({
        data: {
            accountNumber: '9988776655',
            balance: 1000000,
            status: AccountStatus.ACTIVE,
            userId: customer2.id,
        },
    });

    await prisma.transaction.createMany({
        data: [ {
            amount: 1000000,
            type: TransactionType.DEPOSIT,
            destinationAccountId: account1.id,
            status: TransactionStatus.COMPLETED,
        },
        {
            amount: 500000,
            type: TransactionType.TRANSFER,
            sourceAccountId: account1.id,
            destinationAccountId: account2.id,
            status: TransactionStatus.COMPLETED,
        },
        {
            amount: 500000,
            type: TransactionType.WITHDRAW,
            sourceAccountId: account2.id,
            status: TransactionStatus.COMPLETED,
        }
    ]
    })
    console.log('Seeding finished');
}

main()
.catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
})
.finally(async() => {
    await prisma.$disconnect();
});