// src\server\api\root.ts
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
import { calendarRouter } from "./routers/calendar";
import { workoutRouter } from './routers/workouts';
// import { adminRouter } from "./routers/admin";
import { trainerRouter } from "./routers/trainer";
import { usersRouter } from "./routers/users";
// import { workoutsRouter } from './routers/workouts';

export const appRouter = createTRPCRouter({
  calendar: calendarRouter,
  workout: workoutRouter,
  // admin: adminRouter,
  trainer: trainerRouter,
  users: usersRouter,

  // ... другие роутеры
});
// export const appRouter = createTRPCRouter({
//   post: postRouter,
// });

// export type definition of API

export type AppRouter = typeof appRouter;
// export { appRouter };

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
