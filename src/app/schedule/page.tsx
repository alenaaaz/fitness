// src\app\schedule\page.tsx
import Calendar from '../_components/calendar/Calendar';
import { Button } from '../_components/ui/button';
import Link from 'next/link';

export default function SchedulePage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Мое расписание тренировок</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <Calendar />
            </div>
        </div>
    );
}

