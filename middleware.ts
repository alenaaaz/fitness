import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '~/server/auth';

export async function middleware(request: NextRequest) {
    const session = await auth();

    // Защищенные маршруты
    const protectedRoutes = ['/workouts', '/schedule', '/progress', '/profile'];

    if (
        !session &&
        protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
    ) {
        const signInUrl = new URL('/api/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

// Конфигурация для matcher (опционально)
export const config = {
    matcher: [
        /*
         * Исключает:
         * - API-роуты
         * - Статические файлы
         * - Файлы изображений
         * - Страницу авторизации
         */
        '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
    ],
};