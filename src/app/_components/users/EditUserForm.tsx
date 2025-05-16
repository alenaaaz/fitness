// // src\app\_components\users\EditUserForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function EditUserForm({ userId }: { userId: string }) {
    const router = useRouter();
    const utils = api.useUtils();

    const { data: user, isLoading, error } = api.users.getById.useQuery({ id: userId });

    const updateUser = api.users.updateUser.useMutation({
        onSuccess: async () => {
            await utils.users.getAll.invalidate();
            alert("Пользователь обновлён");
            router.push("/admin/users");
        },
        onError: (error) => {
            const defaultMessage = "Ошибка при обновлении пользователя.";
            if (error?.data?.zodError?.fieldErrors?.email?.length) {
                alert(error.data.zodError.fieldErrors.email[0] ?? defaultMessage);
            } else {
                alert(error.message ?? defaultMessage);
            }
        },
    });

    const deleteUser = api.users.deleteUser.useMutation({
        onSuccess: async () => {
            await utils.users.getAll.invalidate();
            router.push("/admin/users");
        },
    });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"ADMIN" | "TRAINER" | "USER">("USER");

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setEmail(user.email ?? "");
            setRole(user.role);
        }
    }, [user]);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div className="text-red-500">Ошибка: {error.message}</div>;
    if (!user) return <div className="text-gray-500">Пользователь не найден</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        if (!isValidEmail) {
            alert("Некорректный email");
            return;
        }

        updateUser.mutate({ id: user.id, name, email, role });
    };

    const handleDelete = () => {
        if (confirm("Удалить пользователя?")) {
            deleteUser.mutate({ id: user.id });
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md">
            <label htmlFor="name" className="block font-medium">Имя</label>
            <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Имя"
            />
            <label htmlFor="email" className="block font-medium">Email</label>
            <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Email"
            />
            <label htmlFor="role" className="block font-medium">Роль</label>
            <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "TRAINER" | "USER")}
                className="select select-bordered w-full"
            >
                <option value="USER">USER</option>
                <option value="TRAINER">TRAINER</option>
                <option value="ADMIN">ADMIN</option>
            </select>

            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">Сохранить</button>
                <button type="button" onClick={handleDelete} className="btn btn-error flex-1">Удалить</button>
            </div>
        </form>
    );
}

