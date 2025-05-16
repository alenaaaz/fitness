// // src\app\admin\users\[id]\page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import EditUserForm from "~/app/_components/users/EditUserForm";
import { Button } from "~/app/_components/ui/button";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    return (
        <div className="p-4 max-w-xl mx-auto">
            <Button
                variant="outline"
                className="mb-4 text-sm"
                onClick={() => router.push("/admin/users")}
            >
                ← Назад к списку пользователей
            </Button>

            <h1 className="text-2xl font-bold mb-4">Редактирование пользователя</h1>
            <EditUserForm userId={userId} />
        </div>
    );
}

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { api } from "~/trpc/react";
// import EditUserForm from "~/app/_components/users/EditUserForm";
// import { Button } from "~/app/_components/ui/button"; // если используешь кастомные кнопки

// export default function EditUserPage() {
//     const router = useRouter();
//     const params = useParams();
//     const id = params.id as string;

//     const { data: user, isLoading, error } = api.users.getById.useQuery({ id });

//     if (isLoading) return <div className="p-4">Загрузка...</div>;
//     if (error) return <div className="p-4 text-red-500">Ошибка: {error.message}</div>;
//     if (!user) return <div className="p-4 text-gray-500">Пользователь не найден</div>;

//     return (
//         <div className="p-4 max-w-xl mx-auto">
//             {/* 🔙 Кнопка назад */}
//             <Button
//                 variant="outline"
//                 className="mb-4 text-sm"
//                 onClick={() => router.push("/admin/users")}
//             >
//                 ← Назад к списку пользователей
//             </Button>

//             <h1 className="text-2xl font-bold mb-4">Редактирование пользователя</h1>
//             <EditUserForm user={user} />
//         </div>
//     );
// }
