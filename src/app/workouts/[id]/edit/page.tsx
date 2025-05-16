// src\app\workouts\[id]\edit\page.tsx
'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import ProgramEditor from '~/app/_components/workouts/ProgramEditor';
import { trpc } from '~/server/utils/trpc';
import { Button } from '~/app/_components/ui/button';

export default function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // <--- Здесь важно: распаковка через use()
    const router = useRouter();
    const { data: workout, isLoading, error } = trpc.workout.getById.useQuery(id);

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка загрузки</p>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Button variant="outline" className="mb-4 text-sm" onClick={() => router.push("/workouts")}>
                ← Назад к списку программ
            </Button>
            <h1 className="text-2xl font-bold mb-4">Редактировать тренировку</h1>
            {workout && <ProgramEditor workout={workout} />}
        </div>
    );
}

