export const workoutTypeStyles = {
    cardio: 'bg-blue-100 text-blue-700',
    strength: 'bg-red-100 text-red-700',
    yoga: 'bg-green-100 text-green-700',
    stretching: 'bg-yellow-100 text-yellow-700',
    pilates: 'bg-purple-100 text-purple-700',
    hiit: 'bg-orange-100 text-orange-700',
} as const;

export type WorkoutType = keyof typeof workoutTypeStyles;
