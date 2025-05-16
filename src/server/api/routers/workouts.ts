// // src/server/api/routers/workouts.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const workoutRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(
            z
                .object({
                    page: z.number().optional(),
                    size: z.number().optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1;
            const size = input?.size ?? 6;
            const userId = ctx.session.user.id;

            const [workouts, total] = await Promise.all([
                ctx.db.workout.findMany({
                    where: {
                        OR: [
                            { userId }, // тренерские
                            { assignment: { some: { userId } } }, // клиентские
                        ],
                    },
                    include: {
                        exercises: true,
                        assignment: { include: { user: true } },
                        user: { select: { id: true, name: true } },
                    },
                    skip: (page - 1) * size,
                    take: size,
                    orderBy: { createdAt: 'desc' },
                }),
                ctx.db.workout.count({
                    where: {
                        OR: [
                            { userId },
                            { assignment: { some: { userId } } },
                        ],
                    },
                }),
            ]);

            return { workouts, total };
        }),

    getById: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return ctx.db.workout.findUnique({
                where: { id: input },
                include: {
                    exercises: true,
                    assignment: { include: { user: true } },
                    user: { select: { id: true, name: true } },
                },
            });
        }),

    // ////////////////////////////////////////////////////
    getEvents: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const events = await ctx.db.workoutEvent.findMany({
            where: {
                OR: [
                    { userId },
                    { workout: { assignment: { some: { userId } } } },
                ],
            },
            select: {
                id: true,
                title: true,
                start: true,
                end: true,
                workout: {
                    select: {
                        type: true, // <--- ДОБАВИЛИ тип тренировки
                    },
                },
            },
        });

        return events;
    }),
    // //////////////////////////////////////////////////////////////

    create: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                type: z.enum(['cardio', 'strength', 'yoga', 'stretching', 'pilates', 'hiit']),
                duration: z.number().min(5),
                description: z.string().optional(),
                exercises: z
                    .array(
                        z.object({
                            name: z.string(),
                            sets: z.number(),
                            reps: z.number(),
                            weight: z.number().optional(),
                            duration: z.number().optional(),
                        })
                    )
                    .optional(),
                clientIds: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Проверка на роль тренера
            if (ctx.session.user.role !== "TRAINER" && ctx.session.user.role !== "ADMIN") {
                throw new Error("You do not have permission to create a workout.");
            }

            return ctx.db.workout.create({
                data: {
                    title: input.title,
                    type: input.type,
                    duration: input.duration,
                    description: input.description,
                    userId: userId,
                    exercises: {
                        create: input.exercises?.map((e) => ({
                            ...e,
                            weight: e.weight ?? 0,
                            duration: e.duration ?? 0,
                        })) ?? [],
                    },
                    assignment: {
                        create: input.clientIds.map((userId) => ({ userId })),
                    },
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string(),
                type: z.enum(['cardio', 'strength', 'yoga', 'stretching', 'pilates', 'hiit']),
                duration: z.number().min(5),
                description: z.string().optional(),
                exercises: z.array(
                    z.object({
                        id: z.string().optional(),
                        name: z.string(),
                        sets: z.number(),
                        reps: z.number(),
                        weight: z.number().optional(),
                        duration: z.number().optional(),
                    })
                ),
                clientIds: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Проверка на роль тренера
            if (ctx.session.user.role !== "TRAINER" && ctx.session.user.role !== "ADMIN") {
                throw new Error("You do not have permission to update this workout.");
            }

            const updatedExercises = input.exercises.map((e) => ({
                ...e,
                weight: e.weight ?? 0,
                duration: e.duration ?? 0,
            }));

            await ctx.db.$transaction([
                ctx.db.workout.update({
                    where: { id: input.id },
                    data: {
                        title: input.title,
                        type: input.type,
                        duration: input.duration,
                        description: input.description,
                        exercises: {
                            upsert: updatedExercises.map((e) => ({
                                where: { id: e.id ?? '' },
                                update: {
                                    name: e.name,
                                    sets: e.sets,
                                    reps: e.reps,
                                    weight: e.weight,
                                    duration: e.duration,
                                },
                                create: {
                                    name: e.name,
                                    sets: e.sets,
                                    reps: e.reps,
                                    weight: e.weight,
                                    duration: e.duration,
                                },
                            })),
                        },
                    },
                }),
                ctx.db.workoutAssignment.deleteMany({ where: { workoutId: input.id } }),
                ctx.db.workoutAssignment.createMany({
                    data: input.clientIds.map((userId) => ({
                        workoutId: input.id,
                        userId,
                    })),
                }),
            ]);

            return ctx.db.workout.findUnique({
                where: { id: input.id },
                include: {
                    exercises: true,
                    assignment: { include: { user: true } },
                    user: { select: { id: true, name: true } },
                },
            });
        }),

    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Проверка на роль админа или тренера
            const workout = await ctx.db.workout.findUnique({
                where: { id: input },
                include: { user: true },
            });

            if (!workout) {
                throw new Error("Workout not found.");
            }

            if (ctx.session.user.role === "ADMIN" || workout.userId === userId) {
                await ctx.db.$transaction([
                    ctx.db.exercise.deleteMany({ where: { workoutId: input } }),
                    ctx.db.workoutAssignment.deleteMany({ where: { workoutId: input } }),
                    ctx.db.workout.delete({ where: { id: input } }),
                ]);
                return { success: true };
            }

            throw new Error("You do not have permission to delete this workout.");
        }),
    getUserWorkouts: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.workout.findMany({
            where: { userId: ctx.session.user.id },
            select: {
                id: true,
                title: true,
                duration: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }),
    getAvailableWorkouts: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        return ctx.db.workout.findMany({
            where: {
                OR: [
                    { userId }, // автор тренировки
                    { assignment: { some: { userId } } }, // клиент, которому назначена
                ],
            },
            select: {
                id: true,
                title: true,
                duration: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }),
    // .......................................................................
    getAllByAdmin: protectedProcedure
        .input(
            z
                .object({
                    page: z.number().optional(),
                    size: z.number().optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1;
            const size = input?.size ?? 6;

            if (ctx.session.user.role !== 'ADMIN') {
                throw new Error('You do not have permission to access this resource.');
            }

            const workouts = await ctx.db.workout.findMany({
                include: {
                    exercises: true,
                    assignment: { include: { user: true } },
                    user: { select: { id: true, name: true } }, // имя тренера
                },
                skip: (page - 1) * size,
                take: size,
                orderBy: { createdAt: 'desc' },
            });

            const total = await ctx.db.workout.count();

            return { workouts, total };
        }),

});
