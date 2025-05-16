'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { generatePagination } from '~/lib/utils';
import { clsx } from 'clsx';

type PaginationProps = {
    totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;
    const size = Number(searchParams.get('size')) || 6;

    const pages = generatePagination(currentPage, totalPages);

    const createPageLink = (page: number | string) => {
        if (typeof page === 'string') return '#';
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set('page', page.toString());
        params.set('size', size.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center mt-8 gap-2">
            {/* Стрелка назад */}
            {currentPage > 1 && (
                <Link
                    href={createPageLink(currentPage - 1)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    ←
                </Link>
            )}

            {/* Номера страниц */}
            {pages.map((page, index) => (
                <Link
                    key={index}
                    href={createPageLink(page)}
                    className={clsx(
                        'px-3 py-1 rounded text-sm',
                        page === currentPage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300',
                        page === '...' && 'pointer-events-none'
                    )}
                >
                    {page}
                </Link>
            ))}

            {/* Стрелка вперёд */}
            {currentPage < totalPages && (
                <Link
                    href={createPageLink(currentPage + 1)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    →
                </Link>
            )}
        </div>
    );
}
