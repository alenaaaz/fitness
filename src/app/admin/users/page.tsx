// src\app\admin\users\page.tsx
// // Server Component
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import AddUserForm from "~/app/_components/users/AddUserForm";
import AssignRelationsForm from "~/app/_components/users/AssignRelationsForm";
import UserRelationsPanel from "~/app/_components/users/UserRelationsPanel";

export default async function UsersPage() {
    const session = await auth();
    if (session?.user.role !== "ADMIN") return <div>Нет доступа</div>;

    const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Список пользователей
            </h1>

            {/* Таблица пользователей */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4 mt-6">
                <table className="w-full table-auto border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="px-4 py-2 text-sm font-medium">Имя</th>
                            <th className="px-4 py-2 text-sm font-medium">Email</th>
                            <th className="px-4 py-2 text-sm font-medium">Роль</th>
                            <th className="px-4 py-2 text-sm font-medium">Дата регистрации</th>
                            <th className="px-4 py-2 text-sm font-medium">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{user.name}</td>
                                <td className="px-4 py-3 text-sm">{user.email}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === "ADMIN"
                                            ? "bg-blue-100 text-blue-700"
                                            : user.role === "TRAINER"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-sm flex gap-2">
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="text-sm text-indigo-600 hover:underline"
                                    >
                                        Редактировать
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 👇 Добавление нового пользователя */}
            <div className="mt-10">
                <AddUserForm />
            </div>
            <AssignRelationsForm />
            <UserRelationsPanel />
        </div>
    );
}
