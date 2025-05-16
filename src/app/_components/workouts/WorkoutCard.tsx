// // # Карточка тренировки
// src/app/_components/workouts/WorkoutCard.tsx
'use client';

import type { WorkoutExercise } from '~/types/workout';
import React, { useState, type Key, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { workoutTypeStyles, type WorkoutType } from './workoutTypeStyles';
import WorkoutDetailsModal from './WorkoutDetailsModal';
import { api } from '~/trpc/react';

interface WorkoutCardProps {
    workout: {
        id: string;
        title: string;
        description?: ReactNode;
        type: string;
        duration: number;
        exercises?: {
            id: Key;
            name: string;
            sets: number;
            reps: number;
            weight: number | null;
            duration?: number | null;
        }[];
        assignment?: {
            user: {
                id: string;
                name: string | null;
            };
        }[];
        user?: {
            id: string;
            name: string | null;
        };
    };
    isTrainer: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, isTrainer }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const wt = workout.type as WorkoutType;

    const utils = api.useUtils();
    const deleteWorkout = api.workout.delete.useMutation({
        onSuccess: async () => {
            await utils.workout.getAll.invalidate();
        },
    });

    const handleDelete = async () => {
        if (confirm('Вы уверены, что хотите удалить эту тренировку?')) {
            await deleteWorkout.mutateAsync(workout.id);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition space-y-2">
                <h3 className="text-xl font-semibold">{workout.title}</h3>
                <p className="text-gray-600">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${workoutTypeStyles[wt] ?? 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                    </span>
                </p>
                <p className="text-gray-600">Длительность: {workout.duration} мин</p>

                <button
                    onClick={() => setModalOpen(true)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                >
                    Подробнее
                </button>

                {isTrainer && (
                    <div className="flex flex-col gap-2 mt-2">
                        <button
                            onClick={() => router.push(`/workouts/${workout.id}/edit`)}
                            className="bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600"
                        >
                            Редактировать
                        </button>

                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
                        >
                            Удалить
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <WorkoutDetailsModal
                    workout={workout}
                    isTrainer={isTrainer}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
};

export default WorkoutCard;
