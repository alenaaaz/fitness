// src/app/profile/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { trpc } from '~/server/utils/trpc';
import { useEffect, useState } from 'react';

const Profile = () => {
    const { data: session } = useSession();
    const { data: stats, isLoading, error } = trpc.users.getUserStats.useQuery();
    const [workoutCount, setWorkoutCount] = useState<number>(0);
    const [activeDaysCount, setActiveDaysCount] = useState<number>(0);

    useEffect(() => {
        if (stats) {
            setWorkoutCount(stats.workoutCount);
            setActiveDaysCount(stats.activeDaysCount);
        }
    }, [stats]);

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка загрузки</p>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col items-center bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto">
                {/* Имя пользователя */}
                <h2 className="text-3xl font-bold text-gray-800 mt-2">{session?.user?.name}</h2>
                <p className="text-gray-500">{session?.user?.email}</p>
                <p className="text-sm mt-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {session?.user?.role} {/* Роль пользователя */}
                </p>

                {/* Информация о тренере (только для USER) */}
                {session?.user?.role === 'USER' && session?.user?.trainer && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-xl w-full">
                        <h3 className="text-xl font-semibold text-gray-800">Тренер:</h3>
                        <p className="text-gray-700">Имя: {session.user.trainer.name}</p>
                        <p className="text-gray-700">Email: {session.user.trainer.email}</p>
                    </div>
                )}

                {/* Простая статистика */}
                {session?.user?.role === 'USER' && session?.user?.trainer && (
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-gray-600 w-full">
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-lg font-semibold text-black">{workoutCount}</p>
                            <p>Тренировок</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-lg font-semibold text-black">{activeDaysCount}</p>
                            <p>Дней активности</p>
                        </div>
                    </div>
                )}

                {/* Кнопки для разных ролей */}
                <div className="mt-6 space-y-4 w-full">
                    {/* Для ADMIN */}
                    {session?.user?.role === 'ADMIN' && (
                        <>

                            <Link
                                href="/admin/users"
                                className="block w-full py-3 text-center text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-300"
                            >
                                Пользователи
                            </Link>
                        </>
                    )}

                    {/* Для TRAINER */}
                    {session?.user?.role === 'TRAINER' && (
                        <>
                            <Link
                                href="/clients"
                                className="block w-full py-3 text-center text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition duration-300"
                            >
                                Мои клиенты
                            </Link>
                            <Link
                                href="/workouts"
                                className="block w-full py-3 text-center text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-300"
                            >
                                Программы
                            </Link>
                        </>
                    )}

                    {/* Для USER */}
                    {session?.user?.role === 'USER' && (
                        <>
                            <Link
                                href="/workouts"
                                className="block w-full py-3 text-center text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition duration-300"
                            >
                                Мои тренировки
                            </Link>
                            <Link
                                href="/schedule"
                                className="block w-full py-3 text-center text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-300"
                            >
                                Расписание
                            </Link>
                        </>
                    )}

                </div>

                {/* Выйти */}
                <div className="mt-6 w-full">
                    <Link
                        href="/api/auth/signout"
                        className="block w-full py-3 text-center text-red-600 hover:text-red-700 transition duration-300"
                    >
                        Выйти
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
