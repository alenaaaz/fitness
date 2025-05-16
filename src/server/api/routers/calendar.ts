// src/server/api/calendar.ts
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const calendarRouter = createTRPCRouter({
    deleteEvent: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.workoutEvent.delete({
                where: { id: input.id },
            });
        }),

    getEvents: protectedProcedure.query(({ ctx }) => {
        console.log('User ID:', ctx.session.user.id);

        // /////////////////////////////////////////////
        return ctx.db.workoutEvent.findMany({
            where: { userId: ctx.session.user.id },
            include: {
                workout: {
                    select: { type: true },  // ← например, если в модели workout есть поле type
                },
            },
        });
    }),
    // /////////////////////////////

    //     return ctx.db.workoutEvent.findMany({
    //         where: { userId: ctx.session.user.id },
    //     });
    // }),
    addEvent: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                start: z.date(),
                end: z.date().optional(),
                workoutId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            let end = input.end;

            // Если выбрана тренировка — рассчитаем end по duration
            if (!end && input.workoutId) {
                const workout = await ctx.db.workout.findUnique({
                    where: { id: input.workoutId },
                    select: { duration: true },
                });

                if (workout?.duration) {
                    end = new Date(input.start);
                    end.setMinutes(end.getMinutes() + workout.duration);
                }
            }


            return ctx.db.workoutEvent.create({
                data: {
                    title: input.title,
                    start: input.start,
                    end,
                    userId: ctx.session.user.id,
                    workoutId: input.workoutId,
                },
            });
        }),

});
