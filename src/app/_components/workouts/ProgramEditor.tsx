// // /*
// // File: src/app/_components/workouts/ProgramEditor.tsx
// // */

'use client';
import React from 'react';
import { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { trpc } from '~/server/utils/trpc';
import { Button } from '~/app/_components/ui/button';
import ClientSelector from './ClientSelector';
import ExerciseList from './ExerciseList';
import toast from 'react-hot-toast';

const workoutTypes = ['cardio', 'strength', 'yoga', 'stretching', 'pilates', 'hiit'] as const;
type WorkoutType = typeof workoutTypes[number];

interface ExerciseInput {
    id?: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
}

interface FormData {
    title: string;
    type: WorkoutType;
    duration: number;
    description?: string;
    exercises: ExerciseInput[];
    clientIds: string[];
}

interface ProgramEditorProps {
    workout?: {
        id: string;
        title: string;
        type: WorkoutType;
        duration: number;
        description?: string;
        exercises: ExerciseInput[];
        assignment: { userId: string }[];
    };
}

export default function ProgramEditor({ workout }: ProgramEditorProps) {
    const router = useRouter();
    const utils = trpc.useUtils();

    const { register, control, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            title: workout?.title ?? '',
            type: workout?.type ?? 'cardio',
            duration: workout?.duration ?? 30,
            description: workout?.description ?? '',
            exercises: workout?.exercises.map(e => ({ ...e })) ?? [],
            clientIds: workout?.assignment.map(a => a.userId) ?? [],
        }
    });

    const { fields, append, remove } = useFieldArray({ name: 'exercises', control });

    const { data: clientsList } = trpc.trainer.getClients.useQuery();

    // уведомления
    const createWorkout = trpc.workout.create.useMutation({
        onSuccess: () => {
            utils.workout.getAll.invalidate();
            toast.success('Тренировка успешно создана!');
        },
    });
    const updateWorkout = trpc.workout.update.useMutation({
        onSuccess: async () => {
            utils.workout.getAll.invalidate();
            if (workout) {
                await utils.workout.getById.refetch(workout.id);
            }
            toast.success('Изменения сохранены!');
            router.push('/workouts');
        },
    });

    useEffect(() => {
        if (workout) {
            reset({
                title: workout.title,
                type: workout.type,
                duration: workout.duration,
                description: workout.description ?? '',
                exercises: workout.exercises.map(e => ({ ...e })),
                clientIds: workout.assignment.map(a => a.userId),
            });
        }
    }, [workout, reset]);

    const onSubmit = async (data: FormData) => {
        const exercises = data.exercises.map(exercise => ({
            ...exercise,
            weight: exercise.weight ? Number(exercise.weight) : 0,
            duration: exercise.duration ? Number(exercise.duration) : 0,
        }));

        const updatedData = { ...data, exercises };

        if (workout) {
            await updateWorkout.mutateAsync({ id: workout.id, ...updatedData });
        } else {
            await createWorkout.mutateAsync(updatedData);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="title" className="block mb-1 font-medium">Название тренировки</label>
                <input
                    id="title"
                    {...register('title', { required: true })}
                    className="input w-full border border-gray-300 focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="type" className="block mb-1 font-medium">Тип тренировки</label>
                <select
                    id="type"
                    {...register('type')}
                    className="input w-full border border-gray-300 focus:border-blue-500"
                >
                    {workoutTypes.map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="duration" className="block mb-1 font-medium">Длительность (мин)</label>
                <input
                    id="duration"
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    className="input w-full border border-gray-300 focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block mb-1 font-medium">Описание</label>
                <textarea
                    id="description"
                    {...register('description')}
                    className="input w-full h-24 border border-gray-300 focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="clientIds" className="block mb-1 font-medium">Клиенты</label>
                <Controller
                    control={control}
                    name="clientIds"
                    render={({ field }) => (
                        <ClientSelector clients={clientsList ?? []} field={field} />
                    )}
                />
            </div>

            <ExerciseList fields={fields} append={append} remove={remove} register={register} />

            <div className="flex justify-end">
                <Button type="submit">
                    {workout ? 'Сохранить изменения' : 'Создать тренировку'}
                </Button>
            </div>
        </form>
    );
}
