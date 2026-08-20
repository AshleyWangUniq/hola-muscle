export interface Movement {
  _id: string;
  name: string;
  description?: string;
  muscleGroups: string[];
  equipment: string[];
  images ?: string[];
  isPublic: boolean;
}