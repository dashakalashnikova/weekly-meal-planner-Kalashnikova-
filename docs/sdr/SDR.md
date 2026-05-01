# Software Design Requirements (SDR)

## 1. Architecture Choice
The application follows a **Client-Side MVC (Model-View-Controller)** pattern.
- **Why?** The requirements stipulate a system that must work seamlessly without a server backend and deploy successfully to GitHub Pages. A Single-Page Application (SPA) using purely client-side technologies (HTML, CSS, Vanilla JS) is the simplest, most performant approach for this use case.

## 2. Storage Strategy
- **Choice:** `localStorage`.
- **Why?** Data persistence needs are simple (saving dishes, ingredients, and the plan). `localStorage` offers synchronous access and sufficient storage limits (typically 5MB) for single-user JSON data. No real-time syncing or multi-device support is required.
- **Keys:**
  - `meal_planner_dishes`: Array of dish objects.
  - `meal_planner_plan`: Weekly plan structure (object keyed by day).
  - `meal_planner_settings`: Active filters, UI states.

## 3. Deployment Constraints
- **Host:** GitHub Pages.
- **Implications:** Only static files are served. Routing will rely on Hash-based routing (`#plan`, `#catalog`) to prevent 404 errors when reloading the page. Sensitive data storage is impossible, and user authentication is out of scope.

## 4. Data Models
### Dish
```typescript
interface Dish {
  id: string;
  name: string;
  description?: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  ingredients: Ingredient[];
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: number; // minutes, 5-240
  isFavorite: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### Ingredient
```typescript
interface Ingredient {
  name: string; // 2-50 chars
  amount: number; // > 0
  unit: "г" | "кг" | "мл" | "л" | "шт" | "ч. л." | "ст. л." | "за смаком";
  category?: string;
}
```

### Plan Entry
```typescript
interface PlanEntry {
  id: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  dishId: string;
  updatedAt: string;
}
```

## 5. UI Structure
- **Global Header**: Navigation links (Plan, Catalog, Shopping List) and Demo/Reset actions.
- **Dashboard (Plan)**: Grid layout representing days of the week and meal slots.
- **Catalog**: Card-based grid for displaying dishes, with an advanced filter sidebar/topbar.
- **Dish Form**: Dynamic form supporting adding multiple ingredient rows.

## 6. Business Rules Enforcement
All business rules (BR-01 to BR-17) will be validated synchronously in JavaScript before persisting to `localStorage`. Warning systems for plan overloads (e.g., too many "heavy" tags) will use non-blocking toast notifications.
