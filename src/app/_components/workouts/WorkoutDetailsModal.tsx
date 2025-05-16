// // src\app\_components\workouts\WorkoutDetailsModal.tsx
'use client';
import React from 'react';
import { workoutTypeStyles, type WorkoutType } from './workoutTypeStyles';
import type { Key, ReactNode } from 'react';

interface WorkoutDetailsModalProps {
    workout: {
        id: string;
        title: string;
        description?: ReactNode;
        type: string;
        duration: number;
        exercises?: {
            id: Key;
            name: string;
            sets: number;
            reps: number;
            weight: number | null;
            duration?: number | null;
        }[];
        assignment?: { user: { id: string; name: string | null } }[];
        user?: { id: string; name: string | null };
    };
    isTrainer: boolean;
    onClose: () => void;
}

const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
    workout,
    isTrainer,
    onClose,
}) => {
    const wt = workout.type as WorkoutType;

    return (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full space-y-4">
                <h2 className="text-2xl font-bold">{workout.title}</h2>

                {/* Тип тренировки */}
                <p className="text-gray-700">
                    <strong>Тип:</strong>{' '}
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${workoutTypeStyles[wt] ?? 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                    </span>
                </p>

                {/* Описание */}
                <div className="text-gray-700">
                    <strong>Описание:</strong>{' '}
                    {workout.description ? (
                        workout.description
                    ) : (
                        <span className="text-gray-500">Нет описания</span>
                    )}
                </div>

                {/* Тренер */}
                {workout.user && (
                    <div>
                        <strong className="text-gray-700">Тренер:</strong>{' '}
                        <span className="text-gray-800">
                            {workout.user.name ?? 'Без имени'}
                        </span>
                    </div>
                )}

                {/* Клиенты (если тренер) */}
                {isTrainer && (
                    <div>
                        <strong className="text-gray-700">Клиенты:</strong>
                        {workout.assignment && workout.assignment.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-600 mt-1">
                                {workout.assignment.map(({ user }) => (
                                    <li key={user.id}>{user.name ?? 'Без имени'}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-1">Нет привязанных клиентов</p>
                        )}
                    </div>
                )}

                {/* Упражнения */}
                <div>
                    <strong className="text-gray-700">Упражнения:</strong>
                    {workout.exercises && workout.exercises.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 mt-1">
                            {workout.exercises.map((ex) => (
                                <li key={ex.id as string}>
                                    {ex.name}
                                    {ex.sets > 0 && <> — {ex.sets} подход{ex.sets > 1 && 'ов'}</>}
                                    {ex.reps > 0 && <> × {ex.reps} повтор{ex.reps > 1 ? 'ений' : 'ение'}</>}
                                    {typeof ex.weight === 'number' && ex.weight > 0 && <> , {ex.weight} кг</>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-1">Нет упражнений</p>
                    )}
                </div>

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default WorkoutDetailsModal;


// 'use client';
// import React from 'react';
// import { workoutTypeStyles, type WorkoutType } from './workoutTypeStyles';
// import type { Key, ReactNode } from 'react';

// interface WorkoutDetailsModalProps {
//     workout: {
//         id: string;
//         title: string;
//         description?: ReactNode;
//         type: string;
//         duration: number;
//         exercises?: {
//             id: Key;
//             name: string;
//             sets: number;
//             reps: number;
//             weight: number;
//         }[];
//         assignment?: { user: { id: string; name: string } }[];
//         user?: { id: string; name: string };
//     };
//     isTrainer: boolean;
//     onClose: () => void;
// }

// const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({ workout, isTrainer, onClose }) => {
//     const wt = workout.type as WorkoutType;

//     return (
//         <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full space-y-4">
//                 <h2 className="text-2xl font-bold">{workout.title}</h2>

//                 {/* Тип тренировки */}
//                 <p className="text-gray-700">
//                     <strong>Тип:</strong>{' '}
//                     <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${workoutTypeStyles[wt] ?? 'bg-gray-100 text-gray-700'
//                             }`}
//                     >
//                         {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
//                     </span>
//                 </p>

//                 {/* Описание */}
//                 <div className="text-gray-700">
//                     <strong>Описание:</strong>{' '}
//                     {workout.description ? (
//                         workout.description
//                     ) : (
//                         <span className="text-gray-500">Нет описания</span>
//                     )}
//                 </div>

//                 {/* Тренер */}
//                 {workout.user && (
//                     <div>
//                         <strong className="text-gray-700">Тренер:</strong>{' '}
//                         <span className="text-gray-800">{workout.user.name}</span>
//                     </div>
//                 )}

//                 {/* Клиенты (если тренер) */}
//                 {isTrainer && (
//                     <div>
//                         <strong className="text-gray-700">Клиенты:</strong>
//                         {workout.assignment && workout.assignment.length > 0 ? (
//                             <ul className="list-disc list-inside text-gray-600 mt-1">
//                                 {workout.assignment.map(({ user }) => (
//                                     <li key={user.id}>{user.name}</li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-gray-500 mt-1">Нет привязанных клиентов</p>
//                         )}
//                     </div>
//                 )}

//                 {/* Упражнения */}
//                 <div>
//                     <strong className="text-gray-700">Упражнения:</strong>
//                     {workout.exercises && workout.exercises.length > 0 ? (
//                         <ul className="list-disc list-inside text-gray-600 mt-1">
//                             {workout.exercises.map((ex) => (
//                                 <li key={ex.id as string}>
//                                     {ex.name}
//                                     {ex.sets > 0 && <> — {ex.sets} подход{ex.sets > 1 && 'ов'}</>}
//                                     {ex.reps > 0 && <> × {ex.reps} повтор{ex.reps > 1 ? 'ений' : 'ение'}</>}
//                                     {ex.weight > 0 && <> , {ex.weight} кг</>}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-500 mt-1">Нет упражнений</p>
//                     )}
//                 </div>

//                 {/* Кнопка закрытия */}
//                 <button
//                     onClick={onClose}
//                     className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                 >
//                     Закрыть
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default WorkoutDetailsModal;