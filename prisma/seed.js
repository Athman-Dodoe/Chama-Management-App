require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const TEST_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

async function seed() {

    // ---- Users ----
    const alice = await prisma.user.upsert({
        where: { email:'treasurer@chama.com' },
        update: { 
            passwordHash: TEST_PASSWORD_HASH,
            fullName: 'Alice Treasurer',
            phoneNumber:'254708374149',
            role: 'TREASURER',
         },
        create: { 
            email:'treasurer@chama.com',
            passwordHash: TEST_PASSWORD_HASH,   
            fullName: 'Alice Treasurer',
            phoneNumber:'254708374149',
            role: 'TREASURER',
         },
    });
    console.log(`✅ Seeded treasurer: ${alice.email} (${alice.id})`);

    const bob = await prisma.user.upsert ({
        where: { email:'member@chama.com' },
        update: {
            passwordHash: TEST_PASSWORD_HASH,
            fullName: 'Bob Member',
            phoneNumber:'254712345678',
        } ,
        create: {
            email: 'member@chama.com',
            passwordHash: TEST_PASSWORD_HASH,
            fullName: 'Bob Member',
            phoneNumber: '254712345678',

        } 
    })
    console.log(`✅ Seeded member: ${bob.email} (${bob.id})`);

    // ---- Chamas ----    
    const chama = await prisma.chama.upsert({
        where: { chamaCode: 'CH01' },
        update: {
            name: 'Umoja Savings Group',
            type: 'SAVINGS_AND_LOAN',
            contributionAmount: 2500.00,
            createdById: alice.id,
        } ,
        create: {
            chamaCode: 'CH01',
            name: 'Umoja Savings Group',
            type: 'SAVINGS_AND_LOAN',
            contributionAmount: 2500.00,
            createdById: alice.id,
        }, 
    });
    console.log(`✅ Seeded chama: ${chama.name} (${chama.chamaCode})`);

    // ---- Memberships ----
    const alicemembership = await prisma.membership.upsert({
        where: { chamaId_userId: {chamaId: chama.id, userId: alice.id} },
        update: {
            roleInChama: 'TREASURER',
            rotationIndex: 1,
        } ,
        create: {
            userId: alice.id,
            chamaId: chama.id,
            memberNumber: 'CH01-M001',
            roleInChama: 'TREASURER',
            rotationIndex: 1,
        },
    });
    console.log(`✅ Seeded membership: ${alicemembership.memberNumber}`);

    const bobMembership = await prisma.membership.upsert({
        where: { chamaId_userId: {chamaId: chama.id, userId: bob.id} },
        update: {
            roleInChama: 'MEMBER',
            rotationIndex: 2,
        } ,
        create: {
            userId: bob.id,
            chamaId: chama.id,
            memberNumber: 'CH01-M002',
            roleInChama: 'MEMBER',
            rotationIndex: 2,
        },
    });
    console.log(`✅ Seeded membership: ${bobMembership.memberNumber}`);

}

seed ()
    .then(() => {
        console.log(' 🌱 Seeding completed successfully.');
    })
    .catch((error) => {
        console.error(' ❌ Seeding failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


