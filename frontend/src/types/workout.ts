interface set {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

export interface ExerciseForWorkout {
    id: string;
    cardio: boolean;
    exercise: string; // exercise id
    sets: set[];
}

export interface WorkoutGenerateType {
    name: string;
    exercises: ExerciseForWorkout[];
    muscleGroups: string[];
    equipment: string[];
    goal: string[];
    difficulty: string;
    duration?: number;
};

export interface Workout {
    _id: string;
    name: string;
    exercises: ExerciseForWorkout[];
    muscleGroups: string[];
    equipment: string[];
    goal: string[];
    difficulty: string;
    duration?: number;
};