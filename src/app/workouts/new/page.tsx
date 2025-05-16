// // src/app/workouts/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '~/app/_components/ui/button';
import ProgramEditor from '~/app/_components/workouts/ProgramEditor';

export default function NewWorkoutPage() {
    const router = useRouter();
    return (
        <div className="max-w-2xl mx-auto py-8">
            <Button variant="outline" className="mb-4 text-sm" onClick={() => router.push("/workouts")}>
                ← Назад к списку программ
            </Button>
            <h1 className="text-2xl font-bold mb-4">Создать новую тренировку</h1>
            <ProgramEditor />
        </div>
    );
}

// 'use client';

// import { useRouter } from 'next/navigation'; // ✅ правильно для App Router
// import { Button } from '~/app/_components/ui/button';
// import ProgramEditor from '~/app/_components/workouts/ProgramEditor';

// export default function NewWorkoutPage() {
//     const router = useRouter();

//     return (
//         <div className="max-w-2xl mx-auto py-8">
//             <Button
//                 variant="outline"
//                 className="mb-4 text-sm"
//                 onClick={() => router.push("/workouts")}
//             >
//                 ← Назад к списку программ
//             </Button>
//             <h1 className="text-2xl font-bold mb-4">Создать новую тренировку</h1>
//             <ProgramEditor />
//         </div>
//     );
// }
