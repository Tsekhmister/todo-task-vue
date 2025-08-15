<template>
  <div class="todo-list">
    <!-- Header -->
    <div class="todo-list__header">
      <h2 class="todo-list__title">📝 Todo List</h2>
      <p class="todo-list__subtitle">Manage your tasks efficiently</p>
    </div>

    <!-- Create Todo Section -->
    <div class="todo-list__create-section">
      <h3 class="todo-list__section-title">Create Todo</h3>
      <form @submit.prevent="handleCreateTodo" class="todo-list__create-form">
        <div class="todo-list__form-row">
          <div class="todo-list__form-field">
            <label for="userId" class="todo-list__form-label">User ID</label>
            <input
              id="userId"
              v-model.number="newTodo.userId"
              type="number"
              min="1"
              required
              class="todo-list__form-input"
              placeholder="Enter user ID"
            />
          </div>
          <div class="todo-list__form-field">
            <label for="title" class="todo-list__form-label">Title</label>
            <input
              id="title"
              v-model="newTodo.title"
              type="text"
              required
              class="todo-list__form-input"
              placeholder="Enter todo title"
            />
          </div>
          <button type="submit" class="todo-list__create-button" :disabled="isCreating">
            {{ isCreating ? 'Adding...' : 'Add Todo' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Filters Section -->
    <div class="todo-list__filters-section">
      <h3 class="todo-list__section-title">Filters</h3>
      <div class="todo-list__filters">
        <div
          class="todo-list__filter-group"
          :class="{ 'todo-list__filter-group--active': filters.status !== 'all' }"
        >
          <label for="statusFilter" class="todo-list__filter-label">Status</label>
          <select
            id="statusFilter"
            v-model="filters.status"
            @change="updateFilters"
            class="todo-list__filter-select"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>

        <div
          class="todo-list__filter-group"
          :class="{ 'todo-list__filter-group--active': filters.userId !== 'all' }"
        >
          <label for="userIdFilter" class="todo-list__filter-label">User ID</label>
          <select
            id="userIdFilter"
            v-model="filters.userId"
            @change="updateFilters"
            class="todo-list__filter-select"
          >
            <option value="all">All Users</option>
            <option v-for="userId in uniqueUserIds" :key="userId" :value="userId">
              User {{ userId }}
            </option>
          </select>
        </div>

        <div
          class="todo-list__filter-group"
          :class="{ 'todo-list__filter-group--active': filters.searchQuery.trim() !== '' }"
        >
          <label for="searchInput" class="todo-list__filter-label">Search</label>
          <input
            id="searchInput"
            v-model="filters.searchQuery"
            @input="updateFilters"
            type="text"
            class="todo-list__filter-input"
            placeholder="Search by title..."
          />
        </div>

        <button @click="clearFilters" class="todo-list__clear-filters">Clear Filters</button>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="todo-list__error">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="todo-list__loading">Loading todos...</div>

    <!-- Todos List -->
    <div v-else-if="filteredTodos.length > 0" class="todo-list__todos">
      <div class="todo-list__stats">
        Showing {{ filteredTodos.length }} of {{ todos.length }} todos
      </div>

      <div class="todo-list__todos-grid">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-list__todo-item"
          :class="{ 'todo-list__todo-item--completed': todo.completed }"
        >
          <div class="todo-list__todo-header">
            <span class="todo-list__todo-id">#{{ todo.id }}</span>
            <span class="todo-list__todo-user">User {{ todo.userId }}</span>
            <button
              @click="toggleFavorite(todo.id)"
              class="todo-list__favorite-button"
              :class="{ 'todo-list__favorite-button--active': isFavorite(todo.id) }"
              :title="isFavorite(todo.id) ? 'Remove from favorites' : 'Add to favorites'"
            >
              ⭐
            </button>
          </div>

          <h4 class="todo-list__todo-title">{{ todo.title }}</h4>

          <div class="todo-list__todo-footer">
            <span
              class="todo-list__todo-status"
              :class="{ 'todo-list__todo-status--completed': todo.completed }"
            >
              {{ todo.completed ? '✅ Completed' : '⏳ Pending' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="todo-list__empty">
      <p>No todos found matching your filters.</p>
      <button @click="clearFilters" class="todo-list__clear-filters">Clear Filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// TodoList component - displays and manages todos
import { ref, reactive, onMounted, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { CreateTodoRequest } from '@/types/todo'

const todoStore = useTodoStore()

// New todo form
const newTodo = reactive<CreateTodoRequest>({
  userId: 1,
  title: '',
})

// Computed properties
const todos = computed(() => todoStore.getTodos)
const filteredTodos = computed(() => todoStore.filteredTodos)
const isLoading = computed(() => todoStore.getIsLoading)
const error = computed(() => todoStore.getError)
const uniqueUserIds = computed(() => todoStore.uniqueUserIds)
const filters = computed(() => todoStore.filters)
const isCreating = ref(false)

// Methods
const handleCreateTodo = async () => {
  if (!newTodo.title.trim() || newTodo.userId < 1) return

  isCreating.value = true
  try {
    await todoStore.createTodo({
      userId: newTodo.userId,
      title: newTodo.title.trim(),
    })

    // Reset form
    newTodo.title = ''
    newTodo.userId = 1
  } catch (err) {
    console.error('Failed to create todo:', err)
  } finally {
    isCreating.value = false
  }
}

const toggleFavorite = (todoId: number) => {
  todoStore.toggleFavorite(todoId)
}

const isFavorite = (todoId: number) => {
  return todoStore.isFavorite(todoId)
}

const updateFilters = () => {
  todoStore.updateFilters(filters.value)
}

const clearFilters = () => {
  todoStore.clearFilters()
}

// Load todos on component mount
onMounted(() => {
  todoStore.fetchTodos()
})
</script>

<style scoped lang="scss">
@use '../styles/variables/colors' as colors;
@use '../styles/variables/spacing' as spacing;

.todo-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: spacing.$large;

  &__header {
    text-align: center;
    margin-bottom: spacing.$large;
    color: colors.$white;

    h2 {
      font-size: 2.5rem;
      margin-bottom: spacing.$small;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 1.1rem;
      opacity: 0.8;
    }
  }

  &__section-title {
    font-size: 1.5rem;
    margin-bottom: spacing.$medium;
    color: colors.$white;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
    padding-left: spacing.$medium;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 1.5rem;
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.8), rgba(255, 193, 7, 0.4));
      border-radius: 2px;
    }

    // Different color for create section
    .todo-list__create-section & {
      &::before {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.4));
      }
    }
  }

  // Create Todo Section
  &__create-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: spacing.$large;
    margin-bottom: spacing.$large;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.15);
    }
  }

  &__create-form {
    .todo-list__form-row {
      display: flex;
      gap: spacing.$medium;
      align-items: end;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
      }
    }
  }

  &__form-field {
    flex: 1;
  }

  &__form-label {
    display: block;
    margin-bottom: spacing.$small;
    color: colors.$white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__form-input {
    width: 100%;
    padding: spacing.$medium;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.1);
    color: colors.$white;
    font-size: 1rem;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.3s ease;
      font-style: italic;
      opacity: 0.8;
    }

    &:focus::placeholder {
      color: rgba(255, 255, 255, 0.4);
      opacity: 0.6;
    }

    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  &__create-button {
    padding: spacing.$medium spacing.$large;
    background: rgba(76, 175, 80, 0.8);
    color: colors.$white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);

    &:hover:not(:disabled) {
      background: rgba(76, 175, 80, 1);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    }

    &:active:not(:disabled) {
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    &:focus:not(:disabled) {
      outline: none;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
    }

    &:disabled {
      background: rgba(128, 128, 128, 0.6);
      cursor: not-allowed;
      box-shadow: none;
      opacity: 0.6;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  // Filters Section
  &__filters-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: spacing.$large;
    margin-bottom: spacing.$large;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.15);
    }
  }

  &__filters {
    display: flex;
    gap: spacing.$medium;
    flex-wrap: wrap;
    align-items: end;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__filter-group {
    flex: 1;
    min-width: 150px;
    position: relative;
    transition: all 0.3s ease;

    &:focus-within {
      .todo-list__filter-label {
        opacity: 1;
        color: rgba(255, 255, 255, 1);
      }
    }

    // Active filter indicator
    &.todo-list__filter-group--active {
      .todo-list__filter-label {
        color: rgba(255, 255, 255, 1);
        opacity: 1;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
      }

      .todo-list__filter-select,
      .todo-list__filter-input {
        border-color: rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
      }
    }
  }

  &__filter-label {
    display: block;
    margin-bottom: spacing.$small;
    color: colors.$white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__filter-select,
  &__filter-input {
    width: 100%;
    padding: spacing.$medium;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.1);
    color: colors.$white;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.15);
    }

    // Custom select styling
    option {
      background: rgba(0, 0, 0, 0.9);
      color: colors.$white;
      padding: spacing.$small;
    }
  }

  // Enhanced select styling
  &__filter-select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right spacing.$small center;
    background-size: 16px;
    padding-right: spacing.$large + spacing.$small;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }
  }

  // Enhanced input styling
  &__filter-input {
    cursor: text;
    transition: all 0.3s ease;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.3s ease;
      font-style: italic;
      opacity: 0.8;
    }

    &:focus::placeholder {
      color: rgba(255, 255, 255, 0.4);
      opacity: 0.6;
    }
  }

  &__clear-filters {
    padding: spacing.$medium spacing.$large;
    background: rgba(255, 193, 7, 0.8);
    color: colors.$white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);

    &:hover {
      background: rgba(255, 193, 7, 1);
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
    }

    &:active {
      box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.5);
    }
  }

  // Error and Loading
  &__error {
    background: rgba(244, 67, 54, 0.2);
    border: 1px solid rgba(244, 67, 54, 0.5);
    border-radius: 5px;
    padding: spacing.$medium;
    margin-bottom: spacing.$large;
    color: #ffcdd2;
    text-align: center;
  }

  &__loading {
    text-align: center;
    padding: spacing.$large;
    color: colors.$white;
    font-size: 1.1rem;
    opacity: 0.8;
  }

  // Todos List
  &__stats {
    text-align: center;
    margin-bottom: spacing.$medium;
    color: colors.$white;
    opacity: 0.8;
    font-size: 0.9rem;
  }

  &__todos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: spacing.$medium;
  }

  &__todo-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: spacing.$medium;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    color: colors.$white;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    &--completed {
      background: rgba(76, 175, 80, 0.2);
      border-color: rgba(76, 175, 80, 0.3);
    }
  }

  &__todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: spacing.$small;
  }

  &__todo-id {
    font-size: 0.8rem;
    opacity: 0.7;
    font-weight: 600;
  }

  &__todo-user {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  &__favorite-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.5;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    &--active {
      opacity: 1;
      animation: pulse 1s infinite;
    }
  }

  &__todo-title {
    font-size: 1.1rem;
    margin-bottom: spacing.$medium;
    line-height: 1.4;
    word-break: break-word;
  }

  &__todo-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__todo-status {
    font-size: 0.9rem;
    opacity: 0.8;
    font-weight: 600;

    &--completed {
      color: #4caf50;
      opacity: 1;
    }
  }

  // Empty State
  &__empty {
    text-align: center;
    padding: spacing.$large;
    color: colors.$white;
    opacity: 0.8;

    p {
      margin-bottom: spacing.$medium;
      font-size: 1.1rem;
    }
  }

  // Animations
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  // Responsive Design
  @media (max-width: 768px) {
    padding: spacing.$medium;

    &__header h2 {
      font-size: 2rem;
    }

    &__todos-grid {
      grid-template-columns: 1fr;
    }
  }

  // Global select option styling
  :deep(select option) {
    background: rgba(0, 0, 0, 0.95) !important;
    color: colors.$white !important;
    padding: spacing.$small;
    border: none;
    outline: none;
  }

  :deep(select option:hover) {
    background: rgba(255, 255, 255, 0.05) !important;
  }

  // Force dark background for all options including selected ones
  :deep(select option:checked),
  :deep(select option:selected) {
    background: rgba(0, 0, 0, 0.95) !important;
    color: colors.$white !important;
  }

  // Remove custom checked styling completely
  // :deep(select option:checked) {
  //   background: transparent;
  //   color: colors.$white;
  // }

  // Global focus styles for accessibility
  *:focus {
    outline: none;
  }

  // Focus visible for keyboard navigation
  *:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  // Smooth transitions for all interactive elements
  button,
  select,
  input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  // Enhanced button hover effects
  button:not(:disabled):hover {
    // Hover effects without transform
  }

  button:not(:disabled):active {
    // Active effects without transform
  }
}
</style>
