import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Удалим существующих пользователей (для повторного запуска seed)
    await prisma.user.deleteMany();

    // Создаем пользователей
    await prisma.user.createMany({
        data: [
            {
                name: 'Алена Пользователь',
                email: 'user@example.com',
                role: 'USER',
            },
            {
                name: 'Иван Тренер',
                email: 'trainer@example.com',
                role: 'TRAINER',
            },
            {
                name: 'Данил Администратор',
                email: 'admin@example.com',
                role: 'ADMIN',
            },
        ],
    });

    console.log('Seed выполнен: пользователи добавлены');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
