// // src\types\workout.ts
import { type Key } from 'react';

export interface WorkoutExercise {
    id: Key;
    name: string;
    sets: number;
    reps: number;
    weight: number | null;
    duration?: number | null;
}

// import type { ReactNode } from "react";

// export type Exercise = {
//     id: string;
//     name: string;
//     type: 'strength' | 'cardio' | 'flexibility';
//     sets?: number;
//     reps?: number;
//     duration?: number; // Добавляем duration для минут
// };

// export type WorkoutProgram = {
//     type: ReactNode;
//     duration: ReactNode;
//     description: ReactNode;
//     id: string;
//     title: string;
//     exercises: Exercise[];
// };