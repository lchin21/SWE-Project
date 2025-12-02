export type MealSummary = {
  mealID: number;
  name: string;
  calories: number;
  protein?: number;
  fat?: number;
  carbs?: number;
};

export type MealPayload = {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type PlanSlot = {
  id: number;
  mealID: number;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  meal: {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  } | null;
};

export type WeeklyPlanResponse = Record<string, Record<string, PlanSlot | null>>;

export declare function listMeals(): Promise<MealSummary[]>;
export declare function createMeal(meal: MealPayload): Promise<any>;
export declare function updateMeal(mealID: number, meal: Partial<MealPayload>): Promise<any>;
export declare function deleteMealById(mealID: number): Promise<any>;

export declare function getGoals(): Promise<any>;
export declare function setGoals(goals: Record<string, number>): Promise<any>;
export declare function updateGoals(goals: Record<string, number>): Promise<any>;

export declare function listPlans(): Promise<WeeklyPlanResponse>;
export declare function createPlan(plan: { day: string; mealID: number; mealType: PlanSlot["mealType"] }): Promise<any>;
export declare function deletePlan(id: number): Promise<any>;

export declare function getCurrentUser(): Promise<any>;
