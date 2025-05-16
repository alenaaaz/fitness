// src/server/api/routers/users.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findMany({
            include: {
                trainer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                clients: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }),

    getTrainerClients: protectedProcedure
        .input(z.object({ trainerId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findMany({
                where: {
                    trainerId: input.trainerId,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findUnique({
                where: { id: input.id },
                include: {
                    trainer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        }),

    updateUser: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                email: z.string().email().optional(),
                role: z.enum(["ADMIN", "TRAINER", "USER"]).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    email: input.email,
                    role: input.role,
                },
            });
        }),

    deleteUser: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.delete({
                where: { id: input.id },
            });
        }),

    createUser: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                email: z.string().email(),
                role: z.enum(["ADMIN", "TRAINER", "USER"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    role: input.role,
                },
            });
        }),

    assignTrainer: protectedProcedure
        .input(z.object({ userId: z.string(), trainerId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: input.userId },
                data: { trainerId: input.trainerId },
            });
        }),

    assignClients: protectedProcedure
        .input(z.object({ trainerId: z.string(), clientIds: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            const updates = input.clientIds.map((id) =>
                ctx.db.user.update({
                    where: { id },
                    data: { trainerId: input.trainerId },
                })
            );
            return ctx.db.$transaction(updates);
        }),

    removeTrainer: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: input.userId },
                data: { trainerId: null },
            });
        }),

    removeClient: protectedProcedure
        .input(z.object({ trainerId: z.string(), clientId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: input.clientId },
                data: { trainerId: null },
            });
        }),

    getUserStats: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        // Получаем количество тренировок для пользователя
        const workoutCount = await ctx.db.workoutAssignment.count({
            where: { userId },
        });

        // Получаем все события тренировок пользователя (используем WorkoutEvent для точных дат)
        const activeDays = await ctx.db.workoutEvent.findMany({
            where: {
                userId: userId, // Фильтруем по конкретному пользователю
                start: {
                    lte: new Date(), // Убираем тренировки в будущем
                },
            },
            select: {
                start: true, // Дата начала тренировки
            },
        });

        // Логируем полученные тренировки для отладки
        console.log("All workout events:", activeDays);

        // Собираем уникальные дни (учитываем только прошедшие тренировки)
        const uniqueDays = new Set(
            activeDays
                .map(workout => workout.start.toISOString().split('T')[0]) // Преобразуем в формат YYYY-MM-DD
        );

        // Логируем количество уникальных дней
        console.log("Unique active days count:", uniqueDays.size);

        return {
            workoutCount,
            activeDaysCount: uniqueDays.size, // Количество уникальных дней активности
        };
    }),

});