// src\app\_components\ui\button.tsx
import React from 'react';
import { type ReactNode, forwardRef } from 'react';
import Link from 'next/link';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'default' | 'lg';

type ButtonProps = {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
    className?: string;
    href?: string;
    disabled?: boolean;
    isLoading?: boolean;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'default',
            size = 'default',
            asChild = false,
            className = '',
            href,
            disabled = false,
            isLoading = false,
            icon,
            iconPosition = 'left',
            ...props
        },
        ref
    ) => {
        // Базовые классы
        const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

        // Варианты кнопок
        const variantClasses = {
            default: 'bg-blue-500 text-white hover:bg-blue-600',
            outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
            ghost: 'hover:bg-blue-50 text-blue-500',
            destructive: 'bg-red-500 text-white hover:bg-red-600'
        };

        // Размеры кнопок
        const sizeClasses = {
            sm: 'h-8 px-3 text-sm',
            default: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg'
        };

        // Иконка
        const iconClasses = {
            left: 'mr-2',
            right: 'ml-2'
        };

        const combinedClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

        // Состояние загрузки
        if (isLoading) {
            return (
                <button className={combinedClasses} disabled ref={ref} {...props}>
                    <span className="animate-spin mr-2">↻</span>
                    {children}
                </button>
            );
        }

        // Кнопка как ссылка
        if (asChild && href) {
            return (
                <Link
                    href={href}
                    className={combinedClasses}
                    {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}
                >
                    {icon && iconPosition === 'left' && <span className={iconClasses.left}>{icon}</span>}
                    {children}
                    {icon && iconPosition === 'right' && <span className={iconClasses.right}>{icon}</span>}
                </Link>
            );
        }

        // Обычная кнопка
        return (
            <button
                className={combinedClasses}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                {icon && iconPosition === 'left' && <span className={iconClasses.left}>{icon}</span>}
                {children}
                {icon && iconPosition === 'right' && <span className={iconClasses.right}>{icon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';