// // src/app/workouts/page.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { trpc } from '~/server/utils/trpc';
import WorkoutCard from '../_components/workouts/WorkoutCard';
import { Button } from '../_components/ui/button';
import Pagination from '../_components/ui/pagination';
import { useSearchParams } from 'next/navigation';

export default function WorkoutsPage() {
    const { data: session } = useSession();
    const isTrainer = session?.user?.role === 'TRAINER';

    const utils = trpc.useUtils();

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const size = Number(searchParams.get('size')) || 6;

    // Запрашиваем тренировки для клиента или тренера
    const { data, isLoading, error } = trpc.workout.getAll.useQuery({ page, size });

    const workouts = data?.workouts ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / size);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                    {isTrainer ? 'Программы тренировок' : 'Мои тренировки'}
                </h2>

                {isTrainer && (
                    <Button asChild>
                        <Link href="/workouts/new">+ Новая тренировка</Link>
                    </Button>
                )}
            </div>

            {isLoading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">Ошибка при загрузке тренировок</p>}

            {!isLoading && !error && workouts.length > 0 && (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {workouts.map((workout) => (
                            <WorkoutCard
                                key={workout.id}
                                workout={{
                                    ...workout,
                                    user: workout.user ?? undefined,
                                }}
                                isTrainer={isTrainer}
                            />
                            //     <WorkoutCard
                            //         key={workout.id}
                            //         workout={workout}
                            //         isTrainer={isTrainer}
                            //     />
                        ))}
                    </div>

                    <Pagination totalPages={totalPages} />
                </>
            )}
        </div>
    );
}
