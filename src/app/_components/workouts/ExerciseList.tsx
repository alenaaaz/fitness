// src\app\_components\workouts\ExerciseList.tsx
'use client';
import React from 'react';
import type { UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import { Button } from '~/app/_components/ui/button';

interface ExerciseListProps {
    fields: UseFieldArrayReturn<any, 'exercises'>['fields'];
    append: UseFieldArrayReturn<any, 'exercises'>['append'];
    remove: UseFieldArrayReturn<any, 'exercises'>['remove'];
    register: UseFormRegister<any>;
}

export default function ExerciseList({ fields, append, remove, register }: ExerciseListProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Упражнения</h3>
                <Button type="button" onClick={() => append({ name: '', sets: 0, reps: 0 })}>
                    Добавить упражнение
                </Button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div>
                        <label className="block mb-1">Название</label>
                        <input
                            {...register(`exercises.${index}.name`, { required: true })}
                            className="input w-full border border-gray-300 focus:border-blue-500"
                            placeholder="Упражнение"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Подходы</label>
                            <input
                                type="number"
                                {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
                                className="input w-full border border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Повторения</label>
                            <input
                                type="number"
                                {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
                                className="input w-full border border-gray-300 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Вес (кг)</label>
                            <input
                                type="number"
                                {...register(`exercises.${index}.weight`, { valueAsNumber: true })}
                                className="input w-full border border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Длительность (сек)</label>
                            <input
                                type="number"
                                {...register(`exercises.${index}.duration`, { valueAsNumber: true })}
                                className="input w-full border border-gray-300 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Удалить упражнение
                    </Button>
                </div>
            ))}
        </div>
    );
}
