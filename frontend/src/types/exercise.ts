export interface Exercise {
  _id: string;
  name: string;
  description?: string;
  muscleGroups: string[];
  equipment: string[];
  images ?: string[];
  isPublic: boolean;
}