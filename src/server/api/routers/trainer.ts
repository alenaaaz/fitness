// src\server\api\routers\trainer.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { prisma } from '~/server/db';

export const trainerRouter = createTRPCRouter({
    getClients: protectedProcedure.query(async ({ ctx }) => {
        const trainerId = ctx.session.user.id;

        return await prisma.user.findMany({
            where: { trainerId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    }),

    getClientSchedule: protectedProcedure
        .input(z.object({ clientId: z.string() }))
        .query(async ({ ctx, input }) => {
            const trainerId = ctx.session.user.id;

            // Проверим, что этот клиент действительно принадлежит тренеру
            const client = await prisma.user.findFirst({
                where: {
                    id: input.clientId,
                    trainerId: trainerId,
                },
            });

            if (!client) {
                throw new Error('Клиент не найден или не принадлежит вам.');
            }

            // Получаем события тренировок (расписание), назначенные этому клиенту
            const events = await prisma.workoutEvent.findMany({
                where: {
                    userId: input.clientId,
                    workout: {
                        NOT: {}, // означает: workout НЕ null
                    },
                },
                include: {
                    workout: true,
                },
                orderBy: {
                    start: 'asc',
                },
            });


            //     const events = await prisma.workoutEvent.findMany({
            //         where: {
            //             userId: input.clientId,
            //         },
            //         include: {
            //             workout: true,
            //         },
            //         orderBy: {
            //             start: 'asc',
            //         },
            //     });

            return events;
        }),


    getClientWorkouts: publicProcedure
        .input(z.object({ clientId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.workout.findMany({
                where: {
                    assignment: {
                        some: {
                            userId: input.clientId,
                        },
                    },
                },
                include: {
                    exercises: true,
                    assignment: {
                        include: { user: true },
                    },
                },
            });
        }),
});