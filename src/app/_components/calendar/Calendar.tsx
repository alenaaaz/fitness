'use client';
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { api } from '~/trpc/react';
import { Button } from '../ui/button';

type Event = {
    id: string;
    title: string;
    start: Date;
    end?: Date;
    color?: string;
};

export default function Calendar() {
    const calendarRef = useRef<FullCalendar>(null);

    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [eventTime, setEventTime] = useState('12:00');

    // Загружаем тренировки пользователя
    // const { data: workouts = [] } = api.workout.getUserWorkouts.useQuery();
    const { data: workouts = [] } = api.workout.getAvailableWorkouts.useQuery();

    // Загружаем события
    const { data: storedEvents = [], refetch } = api.calendar.getEvents.useQuery();

    const addEventMutation = api.calendar.addEvent.useMutation({
        onSuccess: () => {
            refetch(); // обновить после добавления
        },
    });

    const deleteEventMutation = api.calendar.deleteEvent.useMutation({
        onSuccess: () => {
            refetch(); // обновить после удаления
        },
    });

    // Подгружаем события из БД
    // цветовая карта по типу тренировки
    const typeColors: Record<string, string> = {
        cardio: '#60a5fa',      // синий 
        strength: '#f87171',    // красный 
        yoga: '#34d399',        // зелёный 
        stretching: '#facc15',  // желтый
        pilates: '#a78bfa',     // фиолетовый
        hiit: '#fb923c',        // оранжевый
        default: '#9ca3af',     // серый по умолчанию
    }

    useEffect(() => {
        if (storedEvents.length > 0) {
            const mapped = storedEvents.map((e) => {
                const type = e.workout?.type || 'default';  // предполагаем, что из бэка прилетает workout.type
                const color = typeColors[type] || typeColors['default'];

                return {
                    id: e.id,
                    title: e.title,
                    start: new Date(e.start),
                    end: e.end ? new Date(e.end) : undefined,
                    color,
                };
            });
            setEvents(mapped);
        }
    }, [storedEvents]);

    const handleDateClick = (arg: { date: Date; view: any }) => {
        if (showModal) return;

        const clickedDate = new Date(arg.date);
        if (arg.view.type === 'dayGridMonth') {
            const [hours = 12, minutes = 0] = eventTime.split(':').map(Number);
            if (isNaN(hours) || isNaN(minutes)) {
                alert('Неверный формат времени!');
                return;
            }

            clickedDate.setHours(hours, minutes);
            setSelectedDate(clickedDate);
            setShowModal(true);
        }
    };
    const addEvent = async () => {
        if (!selectedWorkoutId || !selectedDate) return;

        const selectedWorkout = workouts.find((w) => w.id === selectedWorkoutId);
        if (!selectedWorkout) {
            alert('Выберите тренировку');
            return;
        }

        const [hours = 12, minutes = 0] = eventTime.split(':').map(Number);
        const eventStart = new Date(selectedDate);
        eventStart.setHours(hours, minutes);

        // проверка: не разрешаем добавление в прошлое
        const now = new Date();
        if (eventStart < now) {
            alert('Нельзя назначить тренировку на прошедшее время.');
            return;
        }

        // Проверка на пересечение событий
        const isConflict = events.some((e) => {
            const eStart = new Date(e.start);
            const eEnd = e.end ? new Date(e.end) : new Date(eStart.getTime() + 60 * 60 * 1000); // длительность по умолчанию 1 час
            const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);

            return eventStart < eEnd && eventEnd > eStart;
        });

        if (isConflict) {
            const confirmAdd = confirm('На это время уже назначена тренировка. Всё равно добавить?');
            if (!confirmAdd) {
                return;
            }
        }

        try {
            await addEventMutation.mutateAsync({
                title: selectedWorkout.title,
                start: eventStart,
                workoutId: selectedWorkout.id,
            });

            setSelectedWorkoutId('');
            setEventTime('12:00');
            setShowModal(false);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    // const addEvent = async () => {
    //     if (!selectedWorkoutId || !selectedDate) return;

    //     const selectedWorkout = workouts.find((w) => w.id === selectedWorkoutId);
    //     if (!selectedWorkout) {
    //         alert('Выберите тренировку');
    //         return;
    //     }

    //     const [hours = 12, minutes = 0] = eventTime.split(':').map(Number);
    //     const eventStart = new Date(selectedDate);
    //     eventStart.setHours(hours, minutes);

    //     // Новая проверка на пересечение событий
    //     const isConflict = events.some((e) => {
    //         const eStart = new Date(e.start);
    //         const eEnd = e.end ? new Date(e.end) : eStart;
    //         const eventEnd = e.end ? new Date(e.end) : new Date(eventStart.getTime() + 60 * 60 * 1000); // если нет end, считаем 1 час

    //         return eventStart < eEnd && eventEnd > eStart;
    //     });

    //     if (isConflict) {
    //         const confirmAdd = confirm('На это время уже назначена тренировка. Всё равно добавить?');
    //         if (!confirmAdd) {
    //             return;
    //         }
    //     }

    //     try {
    //         await addEventMutation.mutateAsync({
    //             title: selectedWorkout.title,
    //             start: eventStart,
    //             workoutId: selectedWorkout.id,
    //         });

    //         setSelectedWorkoutId('');
    //         setEventTime('12:00');
    //         setShowModal(false);
    //     } catch (error) {
    //         console.error('Error adding event:', error);
    //     }
    // };


    return (
        <div className="p-4 relative">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                locale="ru"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                dateClick={handleDateClick}
                eventClick={(info) => {
                    if (confirm(`Удалить "${info.event.title}"?`)) {
                        deleteEventMutation.mutateAsync({ id: info.event.id })
                            .then(() => {
                                refetch();  // обновляем список событий с сервера
                            })
                            .catch((error) => {
                                if (error.message.includes('Событие не найдено')) {
                                    alert('Это событие уже было удалено.');
                                } else {
                                    console.error('Ошибка при удалении события:', error);
                                }
                            });
                    }
                }}

                height="400px"
                slotMinTime="08:00:00"
                slotMaxTime="22:00:00"
                nowIndicator
                editable
                selectable
            />

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-sm w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-lg mb-4">
                            Добавить событие на{' '}
                            {selectedDate && format(selectedDate, 'dd.MM.yyyy')}
                        </h3>

                        {/* Выпадающий список тренировок */}
                        <select
                            className="w-full p-2 border rounded mb-4"
                            value={selectedWorkoutId}
                            onChange={(e) => setSelectedWorkoutId(e.target.value)}
                        >
                            <option value="">Выберите тренировку</option>
                            {workouts.map((workout) => (
                                <option key={workout.id} value={workout.id}>
                                    {workout.title}
                                </option>
                            ))}
                        </select>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Время:</label>
                            <input
                                type="time"
                                className="w-full p-2 border rounded"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowModal(false)}>
                                Отмена
                            </Button>
                            <Button onClick={addEvent}>Добавить</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
