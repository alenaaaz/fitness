// src\app\_components\users\AddUserForm.tsx
"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

export default function AddUserForm() {
    const utils = api.useUtils();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"ADMIN" | "TRAINER" | "USER">("USER");

    const createUser = api.users.createUser.useMutation({
        onSuccess: () => {
            utils.users.getAll.invalidate();
            alert("Пользователь добавлен");
            setName("");
            setEmail("");
            setRole("USER");
            window.location.reload();
        },
        onError: (error) => {
            const defaultMessage = "Ошибка при добавлении пользователя.";
            const zodEmailError = error?.data?.zodError?.fieldErrors?.email?.[0];
            alert(zodEmailError ?? error.message ?? defaultMessage);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Проверка имени: только буквы, пробелы и дефисы
        const nameRegex = /^[A-Za-zа-яА-ЯёЁ\s-]+$/;
        if (!name.trim()) {
            alert("Имя не может быть пустым");
            return;
        }
        if (!nameRegex.test(name)) {
            alert("Имя может содержать только буквы, пробелы и дефисы");
            return;
        }

        // Проверка email
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        if (!isValidEmail) {
            alert("Некорректный email");
            return;
        }

        createUser.mutate({ name, email, role });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold">Добавить пользователя</h2>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Имя"
                required
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Email"
                type="email"
                required
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "TRAINER" | "USER")}
                className="select select-bordered w-full"
            >
                <option value="USER">USER</option>
                <option value="TRAINER">TRAINER</option>
                <option value="ADMIN">ADMIN</option>
            </select>

            <button type="submit" className="btn btn-success w-full">
                Добавить
            </button>
        </form>
    );
}

