'use client';

import { useState, useRef, useEffect } from 'react';
import { type Session } from 'next-auth';
import Link from 'next/link';

export default function Navbar({ session }: { session: Session | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initial, setInitial] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Получаем первую букву имени только на клиенте
    useEffect(() => {
        if (session?.user?.name) {
            setInitial(session.user.name.charAt(0).toUpperCase());
        }
    }, [session]);

    // Закрытие dropdown при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    return (
        <nav className="bg-blue-500 text-white sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold">
                        FitnessApp
                    </Link>
                    {session && (
                        <div className="hidden md:flex gap-4">
                            {session.user?.role === 'ADMIN' ? (
                                <>
                                    {/* <Link href="/admin/dashboard" className="px-3 py-2 hover:bg-blue-600 rounded">Админ-панель</Link> */}
                                    {/* <Link href="/admin/workouts" className="px-3 py-2 hover:bg-blue-600 rounded">Тренировки</Link> */}
                                    <Link href="/admin/users" className="px-3 py-2 hover:bg-blue-600 rounded">Пользователи</Link>
                                </>
                            ) : session.user?.role === 'TRAINER' ? (
                                <>
                                    <Link href="/clients" className="px-3 py-2 hover:bg-blue-600 rounded">Мои клиенты</Link>
                                    <Link href="/workouts" className="px-3 py-2 hover:bg-blue-600 rounded">Программы</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/workouts" className="px-3 py-2 hover:bg-blue-600 rounded">Мои тренировки</Link>
                                    <Link href="/schedule" className="px-3 py-2 hover:bg-blue-600 rounded">Расписание</Link>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {session ? (
                            <div
                                className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                ref={dropdownRef}
                            >
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white text-blue-500 flex items-center justify-center">
                                        <span className="text-lg font-medium" suppressHydrationWarning>
                                            {initial}
                                        </span>
                                    </div>
                                </button>

                                <div
                                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
                                        }`}
                                >
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Профиль
                                    </Link>
                                    <div className="border-t my-1"></div>
                                    <Link
                                        href="/api/auth/signout"
                                        className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Выйти
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/api/auth/signin"
                                className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100 transition-colors"
                            >
                                Войти
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

