// // Компонент для отображения связей пользователей
// src\app\_components\users\UserRelationsPanel.tsx
'use client';

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

type UserWithRelations = {
    id: string;
    name: string | null;
    role: string;
    trainerId: string | null;
    trainer?: { id: string; name: string | null } | null;
    clients: { id: string; name: string | null }[];
};

export default function UserRelationsPanel() {
    const { data: users = [] } = api.users.getAll.useQuery() as {
        data: UserWithRelations[];
    };

    const utils = api.useUtils();

    const removeTrainer = api.users.removeTrainer.useMutation({
        onSuccess: () => utils.users.getAll.invalidate(),
    });

    const removeClient = api.users.removeClient.useMutation({
        onSuccess: () => utils.users.getAll.invalidate(),
    });

    const [selectedRole, setSelectedRole] = useState<string | "all">("all");

    const filteredUsers =
        selectedRole === "all"
            ? users
            : users.filter((user) => user.role === selectedRole);

    return (
        <div className="mt-12 border-t pt-6 px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Управление связями пользователей
            </h2>

            {/* 🎛 Фильтр ролей */}
            <div className="flex items-center mb-6">
                <label className="mr-4 text-sm font-medium text-gray-700">Фильтр по роли:</label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                >
                    <option value="all">Все</option>
                    <option value="USER">Клиенты</option>
                    <option value="TRAINER">Тренеры</option>
                    <option value="ADMIN">Админы</option>
                </select>
            </div>

            {/* 📋 Список пользователей */}
            <div className="space-y-4">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white p-4 rounded-md shadow-sm border text-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">
                                    {user.name ?? "Без имени"}{" "}
                                    <span className="text-gray-500">({user.role})</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">ID: {user.id}</p>
                            </div>
                        </div>

                        {/* Клиент с тренером */}
                        {user.role === "USER" && user.trainer && (
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Тренер: <strong>{user.trainer.name ?? "Неизвестен"}</strong>
                                </p>
                                <Button
                                    variant="destructive"
                                    className="h-auto px-2 py-1 text-xs"
                                    onClick={() => removeTrainer.mutate({ userId: user.id })}
                                >
                                    Убрать тренера
                                </Button>
                            </div>
                        )}


                        {/* Тренер с клиентами */}
                        {user.role === "TRAINER" && user.clients.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 font-medium mb-1">Клиенты:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {user.clients.map((client) => (
                                        <li
                                            key={client.id}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-gray-700">{client.name ?? "Без имени"}</span>
                                            <Button
                                                variant="destructive"
                                                className="ml-4 h-auto px-2 py-1 text-xs"
                                                onClick={() =>
                                                    removeClient.mutate({
                                                        trainerId: user.id,
                                                        clientId: client.id,
                                                    })
                                                }
                                            >
                                                Удалить клиента
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
