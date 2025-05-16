// tests/AddUserForm.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"; // Импортируем необходимые утилиты из vitest
import { render, screen, fireEvent } from "@testing-library/react"; // Для рендеринга компонента и взаимодействия с элементами
import AddUserForm from "src/app/_components/users/AddUserForm"; // Импортируем сам компонент формы
import React from "react";
import { api } from "~/trpc/react"; // Импортируем api из нашего пути (с использованием alias ~)

// Мокаем api для того, чтобы в тестах не обращаться к настоящему серверу или мутациям
vi.mock("~/trpc/react", () => {
    return {
        api: {
            users: {
                createUser: {
                    useMutation: vi.fn(() => ({
                        mutate: vi.fn(), // Мокаем мутацию createUser, которая будет использоваться в компоненте
                    })),
                },
            },
            useUtils: vi.fn(() => ({
                users: {
                    getAll: {
                        invalidate: vi.fn(), // Мокаем getAll, чтобы можно было вызвать invalidate для сброса данных
                    },
                },
            })),
        },
    };
});

describe("AddUserForm", () => {
    let mutateMock: ReturnType<typeof vi.fn>; // Создаём мок для мутации

    // beforeEach -- хук, который выполняется перед каждым тестом. Здесь мы задаём поведение для моков
    beforeEach(() => {
        mutateMock = vi.fn(); // Создаём мок-функцию для мутации

        // Переопределяем поведение useMutation перед каждым тестом
        (api.users.createUser.useMutation as any).mockReturnValue({
            mutate: mutateMock, // Ожидаем, что функция mutate будет вызвана с параметрами
        });
    });

    // Тестируем отправку формы с правильными значениями
    it("отправляет форму с правильными значениями", () => {
        render(<AddUserForm />); // Рендерим компонент AddUserForm

        // Имитируем ввод данных в форму. Используем fireEvent для изменения значений в полях
        fireEvent.change(screen.getByPlaceholderText("Имя"), {
            target: { value: "Test User" }, // Меняем значение поля "Имя" на "Test User"
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@example.com" }, // Меняем значение поля "Email" на "test@example.com"
        });
        fireEvent.change(screen.getByDisplayValue("USER"), {
            target: { value: "TRAINER" }, // Меняем значение поля "Роль" с "USER" на "TRAINER"
        });

        // Имитируем клик по кнопке "Добавить"
        fireEvent.click(screen.getByRole("button", { name: /добавить/i }));

        // Проверяем, что функция mutate была вызвана с правильными значениями
        expect(mutateMock).toHaveBeenCalledWith({
            name: "Test User", // Проверка: правильное имя
            email: "test@example.com", // Проверка: правильный email
            role: "TRAINER", // Проверка: правильная роль
        });
    });
});
