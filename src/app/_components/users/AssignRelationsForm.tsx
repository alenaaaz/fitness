// src\app\_components\users\AssignRelationsForm.tsx
'use client';
import React from 'react';
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/app/_components/ui/button";
// import { toast } from "sonner";

export default function AssignRelationsForm() {
    const utils = api.useUtils();
    const { data: users = [] } = api.users.getAll.useQuery();

    const [mode, setMode] = useState<"assignTrainer" | "assignClients">("assignTrainer");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedTrainerId, setSelectedTrainerId] = useState("");
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

    const assignTrainer = api.users.assignTrainer.useMutation({
        onSuccess: () => {
            // toast.success("Тренер назначен!");
            console.log("Тренер назначен!")
            utils.users.getAll.invalidate();
            setSelectedUserId("");
            setSelectedTrainerId("");
        },
        // onError: () => toast.error("Ошибка при назначении тренера"),
    });

    const assignClients = api.users.assignClients.useMutation({
        onSuccess: () => {
            // toast.success("Клиенты назначены!");
            console.log("Клиенты назначены!")
            utils.users.getAll.invalidate();
            setSelectedClientIds([]);
            setSelectedTrainerId("");
        },
        // onError: () => toast.error("Ошибка при назначении клиентов"),
    });

    const handleSubmit = () => {
        if (mode === "assignTrainer" && selectedUserId && selectedTrainerId) {
            assignTrainer.mutate({
                userId: selectedUserId,
                trainerId: selectedTrainerId,
            });
        } else if (mode === "assignClients" && selectedTrainerId && selectedClientIds.length) {
            assignClients.mutate({
                trainerId: selectedTrainerId,
                clientIds: selectedClientIds,
            });
        }
    };

    return (
        <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Назначение тренеров и клиентов</h2>

            <div className="mb-4 flex gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        value="assignTrainer"
                        checked={mode === "assignTrainer"}
                        onChange={() => setMode("assignTrainer")}
                    />
                    Назначить тренера пользователю
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        value="assignClients"
                        checked={mode === "assignClients"}
                        onChange={() => setMode("assignClients")}
                    />
                    Назначить клиентов тренеру
                </label>
            </div>

            {mode === "assignTrainer" && (
                <div className="space-y-4">
                    <div>
                        <label>Пользователь:</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                        >
                            <option value="">Выберите пользователя</option>
                            {users
                                .filter((u) => u.role === "USER")
                                .map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label>Тренер:</label>
                        <select
                            value={selectedTrainerId}
                            onChange={(e) => setSelectedTrainerId(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                        >
                            <option value="">Выберите тренера</option>
                            {users
                                .filter((u) => u.role === "TRAINER")
                                .map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}

            {mode === "assignClients" && (
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Тренер:</label>
                        <select
                            value={selectedTrainerId}
                            onChange={(e) => setSelectedTrainerId(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                        >
                            <option value="">Выберите тренера</option>
                            {users
                                .filter((u) => u.role === "TRAINER")
                                .map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Клиенты:</label>
                        <div className="border rounded p-2 max-h-60 overflow-y-auto space-y-1">
                            {users
                                .filter((u) => u.role === "USER")
                                .map((user) => (
                                    <div key={user.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`client-${user.id}`}
                                            value={user.id}
                                            checked={selectedClientIds.includes(user.id)}
                                            onChange={() => {
                                                setSelectedClientIds((prev) =>
                                                    prev.includes(user.id)
                                                        ? prev.filter((id) => id !== user.id)
                                                        : [...prev, user.id]
                                                );
                                            }}
                                            className="accent-blue-500"
                                        />
                                        <label htmlFor={`client-${user.id}`} className="cursor-pointer">
                                            {user.name} ({user.email})
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            <Button className="mt-4" onClick={handleSubmit}>
                Назначить
            </Button>
        </div>
    );
}
