'use client'
// src\app\clients\[id]\workouts\page.tsx

import { useParams } from 'next/navigation';
import { api } from '~/trpc/react';
import WorkoutCard from '~/app/_components/workouts/WorkoutCard';

export default function ClientWorkoutsPage() {
    const params = useParams();
    const clientId = params?.id as string;

    const { data: workouts, isLoading, error } = api.trainer.getClientWorkouts.useQuery({ clientId });

    if (isLoading) return <div className="p-4">Загрузка тренировок клиента...</div>;
    if (error) return <div className="p-4 text-red-500">Ошибка: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Тренировки клиента</h1>
            {workouts?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workouts.map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} isTrainer={true} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">Для этого клиента пока нет назначенных тренировок.</p>
            )}
        </div>
    );
}
