import React from 'react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutCard from 'src/app/_components/workouts/WorkoutCard';

const mockPush = vi.fn();

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
    return {
        ...actual,
        useRouter: () => ({
            push: mockPush,
            replace: vi.fn(),
            refresh: vi.fn(),
            back: vi.fn(),
        }),
    };
});

vi.mock('src/trpc/react', () => ({
    api: {
        useUtils: () => ({
            workout: { getAll: { invalidate: vi.fn() } },
        }),
        workout: {
            delete: {
                useMutation: ({ onSuccess }: any) => ({
                    mutateAsync: vi.fn().mockImplementation(async () => {
                        if (onSuccess) await onSuccess();
                    }),
                }),
            },
        },
    },
}));

// confirm
global.confirm = vi.fn();

describe('WorkoutCard', () => {
    const workout = {
        id: '1',
        title: 'Тренировка А',
        type: 'cardio',
        duration: 60,
    };

    it('рендерит заголовок, тип и длительность', () => {
        render(<WorkoutCard workout={workout} isTrainer={false} />);
        expect(screen.getByText('Тренировка А')).toBeDefined();
        expect(screen.getByText('Cardio')).toBeDefined();
        expect(screen.getByText(/Длительность: 60 мин/)).toBeDefined();
    });

    it('открывает модалку при нажатии "Подробнее"', () => {
        render(<WorkoutCard workout={workout} isTrainer={false} />);
        fireEvent.click(screen.getByText('Подробнее'));
        expect(screen.getByText(/Подробнее/)).toBeDefined();
    });

    it('рендерит кнопки для тренера', () => {
        render(<WorkoutCard workout={workout} isTrainer={true} />);
        expect(screen.getByText('Редактировать')).toBeDefined();
        expect(screen.getByText('Удалить')).toBeDefined();
    });

    it('при клике "Редактировать" вызывает router.push', () => {
        render(<WorkoutCard workout={workout} isTrainer={true} />);
        fireEvent.click(screen.getByText('Редактировать'));
        expect(mockPush).toHaveBeenCalledWith('/workouts/1/edit');
    });

    it('вызывает confirm при удалении', () => {
        const confirmMock = global.confirm as Mock;
        confirmMock.mockReturnValue(true);

        render(<WorkoutCard workout={workout} isTrainer={true} />);
        fireEvent.click(screen.getByText('Удалить'));

        expect(confirmMock).toHaveBeenCalledWith(
            'Вы уверены, что хотите удалить эту тренировку?'
        );
    });
});
