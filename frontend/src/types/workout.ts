interface set {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

interface MovementForWorkout {
    id: string;
    cardio: boolean;
    movement: string;
    sets: set[];
}


export interface Workout {
    name: string;
    movements: MovementForWorkout[];
    muscleGroups: string[];
    equipment: string[];
    goal: string[];
    difficulty: string;
    duration?: number;
};