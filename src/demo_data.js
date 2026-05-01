import { Store } from './store.js';

const DEMO_DISHES = [
  {
    id: "dish-1",
    name: "Classic Oatmeal",
    description: "Healthy and quick breakfast",
    mealType: "Breakfast",
    difficulty: "Easy",
    prepTime: 10,
    tags: ["healthy", "quick", "sweet"],
    isFavorite: true,
    ingredients: [
      { name: "Oats", amount: 50, unit: "г" },
      { name: "Milk", amount: 200, unit: "мл" },
      { name: "Honey", amount: 1, unit: "ст. л." }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dish-2",
    name: "Chicken Salad",
    description: "High protein lunch",
    mealType: "Lunch",
    difficulty: "Medium",
    prepTime: 20,
    tags: ["healthy", "protein", "chicken"],
    isFavorite: false,
    ingredients: [
      { name: "Chicken Breast", amount: 150, unit: "г" },
      { name: "Lettuce", amount: 100, unit: "г" },
      { name: "Olive Oil", amount: 1, unit: "ст. л." }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dish-3",
    name: "Steak and Potatoes",
    description: "Heavy dinner meal",
    mealType: "Dinner",
    difficulty: "Hard",
    prepTime: 45,
    tags: ["heavy", "meat"],
    isFavorite: true,
    ingredients: [
      { name: "Beef Steak", amount: 250, unit: "г" },
      { name: "Potatoes", amount: 300, unit: "г" },
      { name: "Butter", amount: 20, unit: "г" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dish-4",
    name: "Apple Slices",
    description: "Simple snack",
    mealType: "Snack",
    difficulty: "Easy",
    prepTime: 5,
    tags: ["quick", "fruit", "sweet"],
    isFavorite: false,
    ingredients: [
      { name: "Apple", amount: 1, unit: "шт" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_PLAN = [
  { id: "plan-1", dayOfWeek: "Monday", mealType: "Breakfast", dishId: "dish-1", updatedAt: new Date().toISOString() },
  { id: "plan-2", dayOfWeek: "Monday", mealType: "Lunch", dishId: "dish-2", updatedAt: new Date().toISOString() },
  { id: "plan-3", dayOfWeek: "Tuesday", mealType: "Dinner", dishId: "dish-3", updatedAt: new Date().toISOString() },
  { id: "plan-4", dayOfWeek: "Wednesday", mealType: "Snack", dishId: "dish-4", updatedAt: new Date().toISOString() }
];

export function loadDemoData() {
  Store.saveDishes(DEMO_DISHES);
  Store.savePlan(DEMO_PLAN);
  console.log("Demo data loaded");
}
