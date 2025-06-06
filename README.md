# FitnessApp

**FitnessApp** — это веб-приложение для планирования, назначения и отслеживания тренировок. Проект разработан на стеке T3 (Next.js, TypeScript, Tailwind CSS, TRPC, Prisma и PostgreSQL). Приложение позволяет тренерам взаимодействовать с клиентами, создавать программы тренировок и отслеживать прогресс, а клиентам — получать индивидуальные программы и расписание занятий.

## Технологии

- **Next.js** (App Router, SSR/CSR)
- **TypeScript**
- **Tailwind CSS**
- **TRPC** — для типобезопасного API
- **Prisma** — ORM для работы с PostgreSQL
- **NextAuth.js** — аутентификация
- **FullCalendar** — визуализация расписания
- **Vitest** — unit-тесты
- **Playwright** — end-to-end тестирование

## Роли и возможности

### Администратор

- Просмотр всех пользователей
- Добавление и редактирование пользователей
- Управление связями тренеров и клиентов
  
### Тренер

- Просмотр списка своих клиентов
- Создание тренировок и их назначение одному или нескольким клиентам
- Редактирование тренировок и обновление списка назначенных клиентов
- Просмотр расписания тренировок каждого клиента
- Удаление тренировок
- Отображение назначенных программ на странице клиентов

### Пользователь (Клиент)

- Просмотр списка назначенных тренировок
- Просмотр и ведение расписания тренировок в формате календаря (месяц / неделя / день)
- Доступ к подробной информации о тренировке (название, тип, описание, упражнения)
- Возможность видеть только свои тренировки

## Установка и запуск

### Установка зависимостей
pnpm install

### Генерация Prisma-моделей
pnpm prisma generate

### Применение миграций
pnpm prisma migrate dev

### Запуск проекта
pnpm dev

### Тестирование

### Запуск unit-тестов (Vitest):
pnpm test

### Запуск e2e-тестов (Playwright):
pnpm test:e2e
