const DISHES_KEY = 'meal_planner_dishes';
const PLAN_KEY = 'meal_planner_plan';

export const Store = {
  getDishes() {
    try {
      const data = localStorage.getItem(DISHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading dishes', e);
      return [];
    }
  },

  saveDishes(dishes) {
    localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
  },

  getPlan() {
    try {
      const data = localStorage.getItem(PLAN_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading plan', e);
      return [];
    }
  },

  savePlan(planEntries) {
    localStorage.setItem(PLAN_KEY, JSON.stringify(planEntries));
  },

  clearPlan() {
    localStorage.removeItem(PLAN_KEY);
  },

  clearAll() {
    localStorage.removeItem(DISHES_KEY);
    localStorage.removeItem(PLAN_KEY);
  }
};
