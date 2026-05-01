// ---- Theme Initialization ----
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// ---- Store.js Content ----
const DISHES_KEY = 'meal_planner_dishes';
const PLAN_KEY = 'meal_planner_plan';

const Store = {
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


// ---- Demo Data.js Content ----
const DEMO_DISHES = [
  {
    id: "dish-1",
    name: "Вівсянка",
    description: "Корисний і швидкий сніданок",
    mealType: "Breakfast",
    difficulty: "Easy",
    prepTime: 10,
    tags: ["корисне", "швидко", "солодке"],
    isFavorite: true,
    ingredients: [
      { name: "Вівсянка", amount: 50, unit: "г" },
      { name: "Молоко", amount: 200, unit: "мл" },
      { name: "Мед", amount: 1, unit: "ст. л." }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dish-2",
    name: "Салат з куркою",
    description: "Білковй обід",
    mealType: "Lunch",
    difficulty: "Medium",
    prepTime: 20,
    tags: ["корисне", "білкове", "з куркою"],
    isFavorite: false,
    ingredients: [
      { name: "Куряча грудка", amount: 150, unit: "г" },
      { name: "Салат", amount: 100, unit: "г" },
      { name: "Оливкова олія", amount: 1, unit: "ст. л." }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dish-3",
    name: "Стейк і картопля",
    description: "Важка вечеря",
    mealType: "Dinner",
    difficulty: "Hard",
    prepTime: 45,
    tags: ["важке", "м'ясо"],
    isFavorite: true,
    ingredients: [
      { name: "Стейк", amount: 250, unit: "г" },
      { name: "Картопля", amount: 300, unit: "г" },
      { name: "Вершкове масло", amount: 20, unit: "г" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dish-4",
    name: "Яблучні шматочки",
    description: "Простий перекус",
    mealType: "Snack",
    difficulty: "Easy",
    prepTime: 5,
    tags: ["швидко", "фрукти", "солодке"],
    isFavorite: false,
    ingredients: [
      { name: "Яблуко", amount: 1, unit: "шт" }
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

function loadDemoData() {
  Store.saveDishes(DEMO_DISHES);
  Store.savePlan(DEMO_PLAN);
  console.log("Demo data loaded");
}


// ---- App.js Content ----
// Translators
const DAYS_UK = {
  "Monday": "Понеділок",
  "Tuesday": "Вівторок",
  "Wednesday": "Середа",
  "Thursday": "Четвер",
  "Friday": "П'ятниця",
  "Saturday": "Субота",
  "Sunday": "Неділя"
};

const MEALS_UK = {
  "Breakfast": "Сніданок",
  "Lunch": "Обід",
  "Dinner": "Вечеря",
  "Snack": "Перекус"
};

const DIFF_UK = {
  "Easy": "Легко",
  "Medium": "Середньо",
  "Hard": "Складно"
};

// ---- DOM Elements ----
const views = {
  plan: document.getElementById('view-plan'),
  catalog: document.getElementById('view-catalog'),
  shopping: document.getElementById('view-shopping')
};
const navItems = {
  plan: document.getElementById('nav-plan'),
  catalog: document.getElementById('nav-catalog'),
  shopping: document.getElementById('nav-shopping')
};

// Modals & Overlays
const dishModal = document.getElementById('dish-modal-overlay');
const selectModal = document.getElementById('select-dish-overlay');
const toastContainer = document.getElementById('toast-container');

// Forms & Inputs
const dishForm = document.getElementById('dish-form');
const ingredientsContainer = document.getElementById('ingredients-container');

// State
let currentDishes = [];
let currentPlan = [];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

// Initialize
function init() {
  currentDishes = Store.getDishes();
  currentPlan = Store.getPlan();
  
  setupRouting();
  setupEventListeners();
  
  // Navigate based on hash
  handleHashChange();
  
  renderPlan();
  renderCatalog();
  renderShoppingList();
}

// ---- Routing & Navigation ----
function setupRouting() {
  window.addEventListener('hashchange', handleHashChange);
}

function handleHashChange() {
  const hash = window.location.hash || '#plan';
  const viewId = hash.replace('#', '');
  
  // Hide all views, deactivate all navs
  Object.values(views).forEach(v => {
    if(v) v.classList.remove('active');
  });
  Object.values(navItems).forEach(n => {
    if(n) n.classList.remove('active');
  });
  
  if (views[viewId]) {
    views[viewId].classList.add('active');
    if(navItems[viewId]) navItems[viewId].classList.add('active');
  } else {
    if(views.plan) views.plan.classList.add('active');
    if(navItems.plan) navItems.plan.classList.add('active');
  }
}

// ---- Toast Notifications ----
function showToast(message, type = 'warning') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  if(toastContainer) toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ---- Event Listeners ----
function setupEventListeners() {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed');
    });
  }

  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    if (localStorage.getItem('theme') === 'dark') {
      themeToggleBtn.textContent = 'Світла тема';
    }
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = 'Темна тема';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = 'Світла тема';
      }
    });
  }

  // Demo data and Reset
  const loadDemoBtn = document.getElementById('load-demo-btn');
  if(loadDemoBtn) {
    loadDemoBtn.addEventListener('click', () => {
      if(confirm("Завантажити демо дані? Це перезапише ваші поточні страви та план.")) {
        loadDemoData();
        currentDishes = Store.getDishes();
        currentPlan = Store.getPlan();
        renderPlan();
        renderCatalog();
        renderShoppingList();
        showToast("Демо дані завантажено", "success");
      }
    });
  }
  
  const resetPlanBtn = document.getElementById('reset-plan-btn');
  if(resetPlanBtn) {
    resetPlanBtn.addEventListener('click', () => {
      if(confirm("Ви впевнені, що хочете скинути тижневий план? Ваші страви будуть збережені.")) {
        Store.clearPlan();
        currentPlan = [];
        renderPlan();
        renderShoppingList();
        showToast("План успішно скинуто", "success");
      }
    });
  }

  // Catalog Actions
  const newDishBtn = document.getElementById('new-dish-btn');
  if(newDishBtn) newDishBtn.addEventListener('click', () => openDishModal());
  
  const closeDishBtn = document.getElementById('close-dish-modal');
  if(closeDishBtn) closeDishBtn.addEventListener('click', closeDishModal);
  
  const cancelDishBtn = document.getElementById('cancel-dish-btn');
  if(cancelDishBtn) cancelDishBtn.addEventListener('click', closeDishModal);
  
  // Filters
  const filterSearch = document.getElementById('filter-search');
  if(filterSearch) filterSearch.addEventListener('input', renderCatalog);
  
  const filterType = document.getElementById('filter-type');
  if(filterType) filterType.addEventListener('change', renderCatalog);
  
  const filterDiff = document.getElementById('filter-difficulty');
  if(filterDiff) filterDiff.addEventListener('change', renderCatalog);
  
  const filterFav = document.getElementById('filter-fav');
  if(filterFav) filterFav.addEventListener('change', renderCatalog);

  const filterTag = document.getElementById('filter-tag');
  if(filterTag) filterTag.addEventListener('input', renderCatalog);
  
  const filterMaxTime = document.getElementById('filter-max-time');
  if(filterMaxTime) filterMaxTime.addEventListener('input', renderCatalog);
  
  const sortCatalog = document.getElementById('sort-catalog');
  if(sortCatalog) sortCatalog.addEventListener('change', renderCatalog);
  
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  if(clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if(filterSearch) filterSearch.value = '';
      if(filterType) filterType.value = '';
      if(filterDiff) filterDiff.value = '';
      if(filterFav) filterFav.checked = false;
      if(filterTag) filterTag.value = '';
      if(filterMaxTime) filterMaxTime.value = '';
      if(sortCatalog) sortCatalog.value = 'date-desc';
      renderCatalog();
    });
  }

  // Form Submission
  if(dishForm) dishForm.addEventListener('submit', handleDishSubmit);
  
  const addIngBtn = document.getElementById('add-ingredient-btn');
  if(addIngBtn) addIngBtn.addEventListener('click', () => addIngredientRow());
  
  // Select Modal
  const closeSelModal = document.getElementById('close-select-modal');
  if(closeSelModal) closeSelModal.addEventListener('click', () => {
    if(selectModal) selectModal.classList.remove('active');
  });

  // Select Day Modal
  const closeDayModal = document.getElementById('close-select-day-modal');
  const dayModal = document.getElementById('select-day-overlay');
  if(closeDayModal) closeDayModal.addEventListener('click', () => {
    if(dayModal) dayModal.classList.remove('active');
  });
}

// ---- Dish Form Logic ----
function openDishModal(dish = null) {
  if(dishForm) dishForm.reset();
  if(ingredientsContainer) ingredientsContainer.innerHTML = '';
  const dishIdEl = document.getElementById('dish-id');
  if(dishIdEl) dishIdEl.value = '';
  
  if (dish) {
    document.getElementById('dish-modal-title').textContent = 'Редагувати страву';
    document.getElementById('dish-id').value = dish.id;
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-desc').value = dish.description || '';
    document.getElementById('dish-type').value = dish.mealType;
    document.getElementById('dish-diff').value = dish.difficulty;
    document.getElementById('dish-time').value = dish.prepTime;
    document.getElementById('dish-tags').value = dish.tags.join(', ');
    document.getElementById('dish-fav').checked = dish.isFavorite;
    
    dish.ingredients.forEach(ing => addIngredientRow(ing));
  } else {
    document.getElementById('dish-modal-title').textContent = 'Створити страву';
    addIngredientRow(); // Add one empty row
  }
  
  if(dishModal) dishModal.classList.add('active');
}

function closeDishModal() {
  if(dishModal) dishModal.classList.remove('active');
}

function addIngredientRow(data = null) {
  const maxIngredients = 20;
  if (!ingredientsContainer) return;
  if (ingredientsContainer.children.length >= maxIngredients) {
    showToast("Максимум 20 інгредієнтів");
    return;
  }
  
  const row = document.createElement('div');
  row.className = 'ingredient-row';
  
  const units = ['г', 'кг', 'мл', 'л', 'шт', 'ч. л.', 'ст. л.', 'за смаком'];
  const unitOptions = units.map(u => `<option value="${u}" ${data && data.unit === u ? 'selected' : ''}>${u}</option>`).join('');
  
  row.innerHTML = `
    <input type="text" class="form-control name" placeholder="Назва" value="${data ? data.name : ''}" required minlength="2" maxlength="50" style="flex:2;">
    <input type="number" class="form-control amount" placeholder="Кіл-ть" value="${data ? data.amount : ''}" required min="0.1" step="0.1" style="flex:1;">
    <select class="form-control unit" required style="flex:1.2;">
      <option value="">Один.</option>
      ${unitOptions}
    </select>
    <input type="text" class="form-control category" placeholder="Категорія" value="${data ? data.category || '' : ''}" style="flex:1.5;">
    <button type="button" class="btn btn-ghost" style="padding: 8px; color: var(--danger);" onclick="this.parentElement.remove()">X</button>
  `;
  ingredientsContainer.appendChild(row);
}

function handleDishSubmit(e) {
  e.preventDefault();
  
  // Gather Data
  const id = document.getElementById('dish-id').value;
  const name = document.getElementById('dish-name').value.trim();
  const desc = document.getElementById('dish-desc').value.trim();
  const type = document.getElementById('dish-type').value;
  const diff = document.getElementById('dish-diff').value;
  const time = parseInt(document.getElementById('dish-time').value, 10);
  const tagsStr = document.getElementById('dish-tags').value;
  const fav = document.getElementById('dish-fav').checked;
  
  // Validation Rules
  if (name.length < 3 || name.length > 80) return showToast("Назва повинна містити від 3 до 80 символів");
  
  // Check uniqueness of name (BR-02)
  const isDuplicateName = currentDishes.some(d => d.name.toLowerCase() === name.toLowerCase() && d.id !== id);
  if (isDuplicateName) return showToast("Страва з такою назвою вже існує");
  
  if (time < 5 || time > 240) return showToast("Час приготування повинен бути від 5 до 240 хвилин");
  
  const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
  if (tags.length > 6) return showToast("Не можна додати більше 6 тегів");
  if (tags.some(t => t.length > 20)) return showToast("Кожен тег повинен містити не більше 20 символів");
  if (new Set(tags).size !== tags.length) return showToast("Теги не повинні повторюватися");
  
  // Gather Ingredients
  const ingRows = ingredientsContainer.querySelectorAll('.ingredient-row');
  if (ingRows.length === 0) return showToast("Додайте хоча б один інгредієнт");
  
  const ingredients = [];
  for (let row of ingRows) {
    const iName = row.querySelector('.name').value.trim();
    const iAmount = parseFloat(row.querySelector('.amount').value);
    const iUnit = row.querySelector('.unit').value;
    const iCategory = row.querySelector('.category').value.trim();
    
    if (iName.length < 2 || iName.length > 50) return showToast("Назва інгредієнта повинна містити від 2 до 50 символів");
    if (isNaN(iAmount) || iAmount <= 0) return showToast("Кількість інгредієнта повинна бути більшою за 0");
    if (!iUnit) return showToast("Оберіть одиницю вимірювання");
    
    ingredients.push({ name: iName, amount: iAmount, unit: iUnit, category: iCategory });
  }
  
  const newDish = {
    id: id || `dish-${Date.now()}`,
    name,
    description: desc,
    mealType: type,
    difficulty: diff,
    prepTime: time,
    tags,
    isFavorite: fav,
    ingredients,
    createdAt: id ? currentDishes.find(d => d.id === id).createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (id) {
    currentDishes = currentDishes.map(d => d.id === id ? newDish : d);
  } else {
    currentDishes.push(newDish);
  }
  
  Store.saveDishes(currentDishes);
  closeDishModal();
  renderCatalog();
  renderPlan(); // In case dish name changed
  renderShoppingList();
  showToast("Страва успішно збережена", "success");
}

// ---- Render Catalog ----
function renderCatalog() {
  const container = document.getElementById('catalog-container');
  if(!container) return;
  container.innerHTML = '';
  
  const searchEl = document.getElementById('filter-search');
  const typeFilterEl = document.getElementById('filter-type');
  const diffFilterEl = document.getElementById('filter-difficulty');
  const favFilterEl = document.getElementById('filter-fav');
  const tagSearchEl = document.getElementById('filter-tag');
  const maxTimeEl = document.getElementById('filter-max-time');
  const sortEl = document.getElementById('sort-catalog');
  
  const search = searchEl ? searchEl.value.toLowerCase() : '';
  const typeFilter = typeFilterEl ? typeFilterEl.value : '';
  const diffFilter = diffFilterEl ? diffFilterEl.value : '';
  const favFilter = favFilterEl ? favFilterEl.checked : false;
  const tagSearch = tagSearchEl ? tagSearchEl.value.toLowerCase() : '';
  const maxTime = maxTimeEl ? parseInt(maxTimeEl.value, 10) : 0;
  
  let filtered = currentDishes.filter(d => {
    if (search && !d.name.toLowerCase().includes(search)) return false;
    if (typeFilter && d.mealType !== typeFilter) return false;
    if (diffFilter && d.difficulty !== diffFilter) return false;
    if (favFilter && !d.isFavorite) return false;
    if (tagSearch && !d.tags.some(t => t.toLowerCase().includes(tagSearch))) return false;
    if (maxTime > 0 && d.prepTime > maxTime) return false;
    return true;
  });

  const sortVal = sortEl ? sortEl.value : 'date-desc';
  filtered.sort((a, b) => {
    if (sortVal === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortVal === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
    if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
    if (sortVal === 'time-asc') return a.prepTime - b.prepTime;
    if (sortVal === 'time-desc') return b.prepTime - a.prepTime;
    if (sortVal.startsWith('diff')) {
      const diffMap = { "Easy": 1, "Medium": 2, "Hard": 3 };
      if (sortVal === 'diff-asc') return diffMap[a.difficulty] - diffMap[b.difficulty];
      if (sortVal === 'diff-desc') return diffMap[b.difficulty] - diffMap[a.difficulty];
    }
    return 0;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <h3>Страви не знайдено</h3>
        <p>Спробуйте очистити фільтри або створити нову страву.</p>
      </div>`;
    return;
  }
  
  filtered.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const favIcon = dish.isFavorite ? '★' : '☆';
    const favClass = dish.isFavorite ? 'fav-icon active' : 'fav-icon';
    
    card.innerHTML = `
      <div class="dish-title">
        ${dish.name}
        <span class="${favClass}" onclick="window.toggleFav('${dish.id}')">${favIcon}</span>
      </div>
      <div class="dish-meta">
        <span>🕒 ${dish.prepTime} хв</span>
        <span>${DIFF_UK[dish.difficulty]}</span>
        <span>${MEALS_UK[dish.mealType]}</span>
      </div>
      ${dish.description ? `<p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:16px;">${dish.description}</p>` : ''}
      <div class="tag-list">
        ${dish.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" style="flex:1;" onclick="window.addToPlanFlow('${dish.id}')">У план</button>
        <button class="btn btn-outline" onclick="window.editDish('${dish.id}')">Редагувати</button>
        <button class="btn btn-outline" style="color:var(--danger);" onclick="window.deleteDish('${dish.id}')">Видалити</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Global actions for onclick
window.toggleFav = (id) => {
  const dish = currentDishes.find(d => d.id === id);
  if (dish) {
    dish.isFavorite = !dish.isFavorite;
    Store.saveDishes(currentDishes);
    renderCatalog();
  }
};

window.editDish = (id) => {
  const dish = currentDishes.find(d => d.id === id);
  if (dish) openDishModal(dish);
};

window.deleteDish = (id) => {
  if (confirm("Ви впевнені, що хочете видалити цю страву?")) {
    currentDishes = currentDishes.filter(d => d.id !== id);
    Store.saveDishes(currentDishes);
    // Remove from plan
    currentPlan = currentPlan.filter(p => p.dishId !== id);
    Store.savePlan(currentPlan);
    
    renderCatalog();
    renderPlan();
    renderShoppingList();
    showToast("Страву видалено", "success");
  }
};

// ---- Render Plan ----
function renderPlan() {
  const tbody = document.getElementById('plan-tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  DAYS.forEach(day => {
    const row = document.createElement('tr');
    
    // SR-03: Visual warning check
    const dayWarnings = getDayWarnings(day);
    const warningText = dayWarnings.join('. ').replace(/"/g, '&quot;');
    
    if (dayWarnings.length > 0) {
      row.classList.add('day-has-warning');
    }
    
    let dayCell = `<td>
      <strong>${DAYS_UK[day]}</strong>
      ${dayWarnings.length > 0 ? `<div class="warning-badge" onmouseenter="window.showTooltip(this, '${warningText}')" onmouseleave="window.hideTooltip()">!</div>` : ''}
    </td>`;
    row.innerHTML = dayCell;
    
    MEALS.forEach(meal => {
      const entry = currentPlan.find(p => p.dayOfWeek === day && p.mealType === meal);
      const cell = document.createElement('td');
      
      if (entry) {
        const dish = currentDishes.find(d => d.id === entry.dishId);
        if (dish) {
          cell.innerHTML = `
            <div class="meal-slot filled">
              <div class="meal-dish-name">${dish.name}</div>
              <div class="meal-slot-actions">
                <button onclick="window.selectDishForSlot('${day}', '${meal}')" title="Замінити">↻</button>
                <button onclick="window.removePlanEntry('${entry.id}')" title="Видалити">✕</button>
              </div>
            </div>
          `;
        } else {
          // Orphan entry
          cell.innerHTML = `<div class="meal-slot" onclick="window.selectDishForSlot('${day}', '${meal}')">+ Додати</div>`;
        }
      } else {
        cell.innerHTML = `
          <div class="meal-slot" onclick="window.selectDishForSlot('${day}', '${meal}')">
            <span style="color:var(--text-muted);">+ Додати</span>
          </div>
        `;
      }
      row.appendChild(cell);
    });
    
    tbody.appendChild(row);
  });
  
  updatePlanStats();
}

function updatePlanStats() {
  const statsContainer = document.getElementById('plan-stats');
  if(!statsContainer) return;
  const filledSlots = currentPlan.length;
  const emptySlots = (DAYS.length * MEALS.length) - filledSlots;
  const favCount = currentDishes.filter(d => d.isFavorite).length;
  
  // FR-15: Count total warnings
  let totalWarnings = 0;
  DAYS.forEach(day => {
    totalWarnings += getDayWarnings(day).length;
  });

  // FR-15: Count shopping items
  const shoppingDict = {};
  currentPlan.forEach(entry => {
    const dish = currentDishes.find(d => d.id === entry.dishId);
    if (dish && dish.ingredients) {
      dish.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase()}_${ing.unit}`;
        shoppingDict[key] = true;
      });
    }
  });
  const productsCount = Object.keys(shoppingDict).length;
  
  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${currentDishes.length}</div>
      <div class="stat-label">Страви</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${filledSlots}</div>
      <div class="stat-label">Заплановано</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${favCount}</div>
      <div class="stat-label">Улюблені</div>
    </div>
    <div class="stat-card ${totalWarnings > 0 ? 'warning' : ''}">
      <div class="stat-value">${totalWarnings}</div>
      <div class="stat-label">Попередження</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${productsCount}</div>
      <div class="stat-label">Продукти</div>
    </div>
  `;
}

// Helper for SR-03/FR-13
function getDayWarnings(day) {
  const warnings = [];
  const dayEntries = currentPlan.filter(p => p.dayOfWeek === day);
  const dayDishes = dayEntries.map(p => currentDishes.find(d => d.id === p.dishId)).filter(Boolean);

  // BR-11: Same dish multiple times
  const dishIds = dayDishes.map(d => d.id);
  const duplicates = dishIds.filter((id, index) => dishIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    warnings.push("Одна й та сама страва додана більше одного разу");
  }

  // BR-12: > 2 heavy dishes
  const heavyCount = dayDishes.filter(d => d.tags.includes('важке')).length;
  if (heavyCount > 2) {
    warnings.push("Забагато страв із тегом 'важке'");
  }

  // BR-13: Wrong meal type
  dayEntries.forEach(entry => {
    const dish = currentDishes.find(d => d.id === entry.dishId);
    if (dish && dish.mealType !== entry.mealType) {
      warnings.push(`Невідповідність типу: ${dish.name} (${MEALS_UK[dish.mealType]}) у ${MEALS_UK[entry.mealType]}`);
    }
  });

  return warnings;
}

// ---- Plan Logic ----
let currentSlotForSelection = null; // {day, meal}

window.addToPlanFlow = (dishId) => {
  const dish = currentDishes.find(d => d.id === dishId);
  const dayModal = document.getElementById('select-day-overlay');
  const list = document.getElementById('select-day-list');
  
  if (!dayModal || !list) return;
  
  list.innerHTML = '';
  
  DAYS.forEach(day => {
    const btn = document.createElement('div');
    btn.className = 'day-select-btn';
    
    // Check if slot is taken
    const existing = currentPlan.find(p => p.dayOfWeek === day && p.mealType === dish.mealType);
    let statusText = existing 
      ? '<span style="color:var(--warning); font-size:0.85rem;">Вже зайнято</span>' 
      : '<span style="color:var(--success); font-size:0.85rem;">Вільно</span>';
    
    btn.innerHTML = `
      <span>${DAYS_UK[day]}</span>
      ${statusText}
    `;
    btn.onclick = () => {
      addDishToPlan(dishId, day, dish.mealType);
      dayModal.classList.remove('active');
    };
    list.appendChild(btn);
  });
  
  dayModal.classList.add('active');
};

window.selectDishForSlot = (day, meal) => {
  currentSlotForSelection = { day, meal };
  const list = document.getElementById('select-dish-list');
  if(!list) return;
  list.innerHTML = '';
  
  const compatibleDishes = currentDishes;
  if (compatibleDishes.length === 0) {
    list.innerHTML = `<p class="empty-state">Каталог порожній. Будь ласка, створіть страву.</p>`;
  } else {
    compatibleDishes.forEach(dish => {
      const item = document.createElement('div');
      item.style = "display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid var(--border-color); border-radius:var(--radius-md); cursor:pointer;";
      item.innerHTML = `
        <div>
          <div style="font-weight:500;">${dish.name} <span style="font-size:0.75rem; color:var(--primary); background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:10px;">${MEALS_UK[dish.mealType]}</span></div>
          <div style="font-size:0.8rem; color:var(--text-muted);">🕒 ${dish.prepTime} хв | ${DIFF_UK[dish.difficulty]}</div>
        </div>
        <button class="btn btn-outline btn-sm">Обрати</button>
      `;
      item.onclick = () => {
        addDishToPlan(dish.id, day, meal);
        if(selectModal) selectModal.classList.remove('active');
      };
      list.appendChild(item);
    });
  }
  
  if(selectModal) selectModal.classList.add('active');
};

function addDishToPlan(dishId, day, meal) {
  const dish = currentDishes.find(d => d.id === dishId);
  
  // Validation Rules
  
  // BR-13: Type match
  if (dish.mealType !== meal) {
    showToast(`Попередження: Додано страву типу ${MEALS_UK[dish.mealType]} до прийому їжі ${MEALS_UK[meal]}`, "warning");
  }
  
  // BR-11: Repeat in same day
  const sameDayDishes = currentPlan.filter(p => p.dayOfWeek === day);
  if (sameDayDishes.some(p => p.dishId === dishId)) {
    showToast(`Попередження: Страва повторюється в день ${DAYS_UK[day]}`, "warning");
  }
  
  // BR-12: Too many heavy dishes
  let heavyCount = sameDayDishes.filter(p => {
    const d = currentDishes.find(dx => dx.id === p.dishId);
    return d && d.tags.includes('важке');
  }).length;
  if (dish.tags.includes('важке')) heavyCount++;
  
  if (heavyCount > 2) {
    showToast(`Попередження: Перевантажений день (в ${DAYS_UK[day]} більше 2 важких страв)`, "warning");
  }

  // Find existing slot and replace if necessary
  const existingIndex = currentPlan.findIndex(p => p.dayOfWeek === day && p.mealType === meal);
  if (existingIndex >= 0) {
    if (!confirm("Це місце вже заповнене. Замінити?")) return;
    currentPlan[existingIndex].dishId = dishId;
    currentPlan[existingIndex].updatedAt = new Date().toISOString();
  } else {
    currentPlan.push({
      id: `plan-${Date.now()}`,
      dayOfWeek: day,
      mealType: meal,
      dishId: dishId,
      updatedAt: new Date().toISOString()
    });
  }
  
  Store.savePlan(currentPlan);
  renderPlan();
  renderShoppingList();
}

window.removePlanEntry = (entryId) => {
  currentPlan = currentPlan.filter(p => p.id !== entryId);
  Store.savePlan(currentPlan);
  renderPlan();
  renderShoppingList();
};


// ---- Render Shopping List ----
function renderShoppingList() {
  const container = document.getElementById('shopping-list-container');
  if(!container) return;
  container.innerHTML = '';
  
  if (currentPlan.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <h3>Немає продуктів</h3>
        <p>Ваш тижневий план порожній.</p>
      </div>
    `;
    return;
  }
  
  // Aggregate ingredients
  const shoppingDict = {};
  
  currentPlan.forEach(entry => {
    const dish = currentDishes.find(d => d.id === entry.dishId);
    if (dish && dish.ingredients) {
      dish.ingredients.forEach(ing => {
        // Key uniquely by name and unit (BR-14)
        const key = `${ing.name.toLowerCase()}_${ing.unit}`;
        if (!shoppingDict[key]) {
          shoppingDict[key] = { name: ing.name, amount: 0, unit: ing.unit };
        }
        shoppingDict[key].amount += ing.amount;
      });
    }
  });
  
  const shoppingList = Object.values(shoppingDict).sort((a,b) => a.name.localeCompare(b.name));
  
  shoppingList.forEach(item => {
    const el = document.createElement('div');
    el.className = 'shopping-item';
    el.innerHTML = `
      <div class="shopping-item-info">
        <span class="shopping-item-name">${item.name}</span>
        ${item.category ? `<span class="shopping-item-category">${item.category}</span>` : ''}
      </div>
      <span class="shopping-item-amount">${Math.round(item.amount * 100) / 100} ${item.unit}</span>
    `;
    container.appendChild(el);
  });
}

// Global Tooltip Logic
window.showTooltip = (el, text) => {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  
  tooltip.textContent = text;
  tooltip.classList.add('active');
  
  const rect = el.getBoundingClientRect();
  tooltip.style.left = `${rect.right + 10}px`;
  tooltip.style.top = `${rect.top + rect.height / 2}px`;
};

window.hideTooltip = () => {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.classList.remove('active');
};

// Start app
document.addEventListener('DOMContentLoaded', init);
