// src\app\clients\page.tsx
'use client';

import { trpc } from '~/server/utils/trpc';
import Link from 'next/link';
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default function ClientsPage() {
    const { data: clients, isLoading, error } = trpc.trainer.getClients.useQuery();

    if (isLoading) return <div className="p-4">Загрузка...</div>;
    if (error) return <div className="p-4 text-red-500">Ошибка: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Мои клиенты</h1>
            {clients?.length ? (
                <ul className="space-y-4">
                    {clients.map((client: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                        <li key={client.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{client.name}</p>
                                <p className="text-sm text-gray-500">{client.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/clients/${client.id}/schedule`}
                                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                                >
                                    Расписание
                                </Link>

                                <Link
                                    href={`/clients/${client.id}/workouts`}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Тренировки
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">У вас пока нет клиентов.</p>
            )}
        </div>
    );
}
