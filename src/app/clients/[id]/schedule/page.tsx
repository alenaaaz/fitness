// // src\app\clients\[id]\schedule\page.tsx
// 'use client';

// import { trpc } from '~/server/utils/trpc';
// import { useParams } from 'next/navigation';

// export default function ClientSchedulePage() {
//     const params = useParams();
//     const clientId = params?.id as string;

//     const { data: events, isLoading, error } = trpc.trainer.getClientSchedule.useQuery({ clientId });

//     if (isLoading) return <div className="p-4">Загрузка расписания...</div>;
//     if (error) return <div className="p-4 text-red-500">Ошибка: {error.message}</div>;

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <h1 className="text-3xl font-bold mb-6">Расписание клиента</h1>
//             {events?.length ? (
//                 <ul className="space-y-4">
//                     {events.map((event) => (
//                         <li key={event.id} className="bg-white p-4 rounded shadow">
//                             <p className="font-semibold">
//                                 {event.workout ? event.workout.title : 'Без названия'}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 {new Date(event.start).toLocaleString('ru-RU')}
//                                 {event.end && ` — ${new Date(event.end).toLocaleTimeString('ru-RU')}`}
//                             </p>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="text-gray-600">У этого клиента пока нет запланированных тренировок.</p>
//             )}
//         </div>
//     );
// }
'use client';

import { trpc } from '~/server/utils/trpc';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function ClientSchedulePage() {
    const params = useParams();
    const clientId = params?.id as string;

    const { data: events, isLoading, error } = trpc.trainer.getClientSchedule.useQuery({ clientId });

    const [showPast, setShowPast] = useState(false);

    const { upcomingEvents, pastEvents } = useMemo(() => {
        if (!events) return { upcomingEvents: [], pastEvents: [] };

        const now = new Date();

        const upcoming: typeof events = [];
        const past: typeof events = [];

        events.forEach(event => {
            const eventDate = new Date(event.start);
            if (eventDate >= now) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });

        upcoming.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        past.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        return { upcomingEvents: upcoming, pastEvents: past };
    }, [events]);

    if (isLoading) return <div className="p-4">Загрузка расписания...</div>;
    if (error) return <div className="p-4 text-red-500">Ошибка: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Расписание клиента</h1>

            {upcomingEvents.length > 0 ? (
                <>
                    <h2 className="text-xl font-semibold mb-4">Предстоящие тренировки</h2>
                    <ul className="space-y-4 mb-6">
                        {upcomingEvents.map(event => (
                            <li key={event.id} className="bg-white p-4 rounded shadow">
                                <p className="font-semibold">
                                    {event.workout ? event.workout.title : 'Без названия'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.start).toLocaleString('ru-RU')}
                                    {event.end && ` — ${new Date(event.end).toLocaleTimeString('ru-RU')}`}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className="text-gray-600 mb-6">Предстоящих тренировок нет.</p>
            )}

            <button
                className="mb-4 text-blue-600 hover:underline"
                onClick={() => setShowPast(prev => !prev)}
            >
                {showPast ? 'Скрыть прошедшие тренировки' : 'Показать прошедшие тренировки'}
            </button>

            {showPast && pastEvents.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Прошедшие тренировки</h2>
                    <ul className="space-y-4">
                        {pastEvents.map(event => (
                            <li key={event.id} className="bg-white p-4 rounded shadow">
                                <p className="font-semibold">
                                    {event.workout ? event.workout.title : 'Без названия'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.start).toLocaleString('ru-RU')}
                                    {event.end && ` — ${new Date(event.end).toLocaleTimeString('ru-RU')}`}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {!upcomingEvents.length && !showPast && (
                <p className="text-gray-600">У этого клиента пока нет запланированных тренировок.</p>
            )}
        </div>
    );
}


