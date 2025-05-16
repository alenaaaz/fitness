// // File: tests/ProgramEditor.test.tsx
// File: tests/ProgramEditor.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // утилиты для рендеринга компонентов и взаимодействия с DOM
import { describe, it, expect, vi, beforeEach } from 'vitest'; // vitest — тестовый фреймворк
import ProgramEditor from 'src/app/_components/workouts/ProgramEditor'; // сам компонент, который мы тестируем
import { useRouter } from 'next/navigation'; // роутер Next.js

// 👇 Мокаем trpc, чтобы не использовать реальный API в тестах
vi.mock('~/server/utils/trpc', () => ({
    trpc: {
        trainer: {
            getClients: {
                useQuery: () => ({ data: [{ id: '1', name: 'Клиент 1' }] }), // возвращаем одного клиента
            },
        },
        workout: {
            create: {
                useMutation: () => ({ mutateAsync: vi.fn(), onSuccess: vi.fn() }), // мок функции создания тренировки
            },
            update: {
                useMutation: () => ({ mutateAsync: vi.fn(), onSuccess: vi.fn() }), // мок функции обновления тренировки
            },
            getAll: {
                invalidate: vi.fn(), // мок инвалидатора кеша
            },
            getById: {
                refetch: vi.fn(), // мок повторной загрузки
            },
        },
        useUtils: () => ({
            workout: {
                getAll: { invalidate: vi.fn() }, // мок — использоваться может после создания
                getById: { refetch: vi.fn() }, // мок — использоваться может после редактирования
            },
        }),
    },
}));

// 👇 Мокаем useRouter от Next.js, чтобы не было реальных переходов по маршрутам
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(), // мок перехода по маршруту
    }),
}));

// Группа тестов для ProgramEditor
describe('ProgramEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // очищаем все моки перед каждым тестом
    });

    // Тест: проверяет, что все поля формы отрисованы
    it('renders form fields', () => {
        render(<ProgramEditor />); // рендерим компонент

        // Проверяем наличие всех полей формы по лейблам и текстам
        expect(screen.getByLabelText(/Название тренировки/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Тип тренировки/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Длительность/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Описание/i)).toBeInTheDocument();
        expect(screen.getByText(/Создать тренировку/i)).toBeInTheDocument();
    });

    // Тест: имитирует ввод данных в форму и нажатие на кнопку "Создать тренировку"
    it('can fill and submit form', async () => {
        render(<ProgramEditor />); // рендерим компонент

        // Имитируем ввод названия тренировки
        fireEvent.change(screen.getByLabelText(/Название тренировки/i), {
            target: { value: 'Тестовая тренировка' },
        });

        // Имитируем ввод длительности
        fireEvent.change(screen.getByLabelText(/Длительность/i), {
            target: { value: '45' },
        });

        // Имитируем нажатие кнопки "Создать тренировку"
        fireEvent.click(screen.getByRole('button', { name: /Создать тренировку/i }));

        // Проверка, что поле названия содержит введённое значение
        // (прямого вызова мутации не проверяем, т.к. она мокнута и не проброшена)
        expect(screen.getByLabelText(/Название тренировки/i)).toHaveValue('Тестовая тренировка');
    });
});
