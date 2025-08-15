# Vue.js Technical Interview Notes

## 🎯 Основные концепции Vue.js

### 1. Vue 3 Composition API

#### **reactive() vs ref()**

```typescript
// reactive() - для объектов
const formData = reactive({
  username: '',
  phonenumber: '',
})

// ref() - для примитивов
const isLoading = ref(false)
const count = ref(0)
```

**Когда использовать:**

- `reactive()` - для объектов и массивов
- `ref()` - для строк, чисел, булевых значений

#### **Почему reactive нужен:**

- Без `reactive()` Vue не отслеживает изменения
- С `reactive()` Vue автоматически обновляет DOM при изменениях
- В Vue 2 нужны были watcher, в Vue 3 - автоматически

### 2. Директивы Vue

#### **@submit.prevent**

```vue
<form @submit.prevent="handleLogin"></form>
```

- `@submit` = `v-on:submit` (слушает событие отправки формы)
- `.prevent` = `event.preventDefault()` (блокирует перезагрузку страницы)
- Без `.prevent` страница перезагрузится при отправке формы

#### **v-model**

```vue
<input v-model="formData.username" />
```

- Двусторонняя привязка данных
- Эквивалентно: `:value + @input`
- Автоматически обновляет DOM при изменениях

### 3. TypeScript в Vue

#### **Интерфейсы**

```typescript
interface LoginForm {
  username: string
  phonenumber: string
}

const formData = reactive<LoginForm>({
  username: '',
  phonenumber: '',
})
```

**Преимущества:**

- Проверка типов на этапе компиляции
- Автодополнение в IDE
- Предотвращение ошибок

## 🏗️ Архитектура проекта

### 1. Структура файлов

```
src/
├── types/          ← TypeScript интерфейсы
├── components/     ← Vue компоненты
├── styles/         ← SCSS стили
├── stores/         ← Pinia хранилища
└── router/         ← Vue Router
```

### 2. BEM методология CSS

```scss
.login {
  // Блок
  &__container {
  } // Элемент
  &__title {
  } // Элемент
  &__button {
    // Элемент
    &--disabled {
    } // Модификатор
  }
}
```

**Правила:**

- Блок: `login`
- Элемент: `login__container` (два подчеркивания)
- Модификатор: `login__button--disabled` (два дефиса)

## 🔧 Лучшие практики

### 1. Организация типов

- Выносить интерфейсы в отдельные файлы
- Группировать по функциональности
- Использовать экспорт/импорт

### 2. Компоненты

- Один компонент = одна задача
- Использовать Composition API
- Типизировать props и emits

### 3. Стили

- Использовать SCSS для переменных и миксинов
- Следовать BEM методологии
- Разделять стили по компонентам
- **Удалять пустые блоки** `<style>` и `<script>`

### 4. Комментарии и документация

- **Все комментарии в коде только на английском**
- Русский язык только в документации (README, заметки)
- Комментарии должны объяснять "почему", а не "что"
- Использовать JSDoc для функций и интерфейсов

### 5. Семантическая разметка и доступность (A11y)

- **Использовать семантические HTML5 теги** (`main`, `section`, `header`, `fieldset`)
- **ARIA атрибуты** для улучшения доступности (`aria-labelledby`, `aria-describedby`, `role="alert"`)
- **Связывание форм** через `id` и `for`, `aria-invalid` для валидации
- **Автозаполнение** через `autocomplete` атрибуты
- **Скрытый контент** через `.visually-hidden` для скринридеров
- **Живые области** через `aria-live="polite"` для динамических сообщений

### 6. SEO оптимизация ✅

- **Базовые мета-теги** (`description`, `keywords`, `author`, `robots`)
- **Open Graph теги** для социальных сетей (Facebook, LinkedIn)
- **Twitter Card теги** для Twitter
- **Структурированные данные** (JSON-LD Schema.org)
- **Динамические мета-теги** через Vue Router для каждой страницы
- **Семантические URL** через Vue Router History API
- **Performance оптимизация** (preconnect, lazy loading, code splitting)

## 🚀 Как работает наше приложение (для джунов)

### 1. 🏠 **Общая картина - что происходит при запуске**

**Когда пользователь открывает сайт:**

1. **Браузер загружает** `index.html` → `main.ts` → создает Vue приложение
2. **Vue Router смотрит** на URL в адресной строке
3. **Если URL = `/login`** → показывает форму входа
4. **Если URL = `/`** → показывает домашнюю страницу
5. **При переходе между страницами** → страница НЕ перезагружается (это SPA!)

### 2. 🔐 **Как работает логин (пошагово)**

#### **Шаг 1: Пользователь открывает страницу логина**

```typescript
// URL: /login
// Vue Router находит компонент Login.vue
// Рендерится форма входа
```

#### **Шаг 2: Пользователь вводит данные**

```vue
<!-- В Login.vue -->
<input v-model="formData.username" />
<!-- Связываем с данными -->
<input v-model="formData.phoneNumber" />
<!-- Связываем с данными -->
```

**Что происходит:**

- `v-model` автоматически обновляет `formData.username` и `formData.phoneNumber`
- Vue отслеживает изменения через `reactive()`
- При каждом вводе вызывается валидация

#### **Шаг 3: Валидация при вводе**

```typescript
// При каждом символе в поле username
@input="validateUsernameField"

// При каждом символе в поле phone
@input="validatePhoneField"
```

**Что происходит:**

- Проверяется, что поле не пустое
- Проверяется, что данные соответствуют формату (регулярка)
- Если есть ошибка → показывается красное сообщение
- Если все хорошо → ошибка исчезает

#### **Шаг 4: Пользователь нажимает "Sign In"**

```typescript
// Форма отправляется
@submit.prevent="handleLogin"
```

**Что происходит:**

- `.prevent` блокирует перезагрузку страницы
- Вызывается функция `handleLogin()`

#### **Шаг 5: Проверка валидации**

```typescript
const handleLogin = async (): Promise<void> => {
  const isUsernameValid: boolean = validateUsernameField()
  const isPhoneValid: boolean = validatePhoneField()

  if (isUsernameValid && isPhoneValid) {
    // Если все поля валидны → идем дальше
  }
}
```

#### **Шаг 6: Вызов API через composable**

```typescript
// Используем useAuth composable
const { login, loginError, isLoading } = useAuth()

// Вызываем функцию логина
const response = await login({
  username: formData.username,
  phoneNumber: formData.phoneNumber,
})
```

**Что происходит:**

- `useAuth()` - это переиспользуемая логика (как библиотека)
- `login()` делает HTTP запрос к API
- `isLoading` показывает спиннер
- `loginError` показывает ошибки

#### **Шаг 7: API запрос в AuthService**

```typescript
// В src/services/authService.ts
async login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // 1. Получаем всех пользователей
    const users = await this.getUsers()

    // 2. Ищем пользователя с такими данными
    const user = users.find(user =>
      user.username === credentials.username &&
      user.phone === credentials.phoneNumber
    )

    // 3. Возвращаем результат
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: ERROR_MESSAGES.LOGIN_ERROR }
    }
  } catch {
    return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR }
  }
}
```

**Что происходит:**

- Отправляется GET запрос к `https://jsonplaceholder.typicode.com/users`
- Получаем массив всех пользователей
- Ищем пользователя с введенными username и phone
- Возвращаем результат: найден или нет

#### **Шаг 8: Обработка ответа**

```typescript
if (response.success && response.user) {
  // Успешный логин → переходим на главную
  router.replace('/')
} else {
  // Ошибка → показываем сообщение
  // loginError уже установлен в useAuth
}
```

**Что происходит:**

- Если пользователь найден → `router.replace('/')` переводит на главную
- Если не найден → показывается ошибка "Invalid username or phone number"
- Если сеть не работает → показывается "Network error"

### 3. 🏗️ **Архитектура - почему так сделано**

#### **Зачем нужны разные папки?**

**`src/types/` - типы данных**

```typescript
// Определяем, как выглядят данные
interface User {
  id: number
  username: string
  phone: string
  email: string
}

// Теперь TypeScript знает, что user.username - это строка
// И не даст написать user.username = 123 (ошибка!)
```

**`src/services/` - работа с API**

```typescript
// AuthService делает HTTP запросы
// Компоненты НЕ знают, как делать fetch
// Они просто вызывают authService.login()
```

**`src/composables/` - переиспользуемая логика**

```typescript
// useAuth можно использовать в Login, Profile, Settings
// Не нужно копировать код валидации
// Вся логика в одном месте
```

**`src/constants/` - константы**

```typescript
// Вместо хардкода 'https://jsonplaceholder.typicode.com'
// Используем API_CONFIG.BASE_URL
// Легко поменять URL для продакшена
```

**`src/utils/` - вспомогательные функции**

```typescript
// Валидация вынесена в отдельный файл
// Можно переиспользовать в других формах
// Легко тестировать отдельно
```

### 4. 🔄 **Жизненный цикл компонента**

#### **Login.vue - что происходит при загрузке:**

1. **Импорты** - загружаем нужные модули
2. **Создание состояния** - `formData`, `errors`, `useAuth()`
3. **Рендер template** - показываем форму
4. **Пользователь вводит данные** - обновляется `formData`
5. **Валидация** - проверяем правильность
6. **Отправка формы** - вызываем API
7. **Обработка ответа** - показываем результат
8. **Навигация** - переходим на другую страницу

### 5. 🎯 **Ключевые концепции Vue 3**

#### **Reactivity (Реактивность)**

```typescript
const formData = reactive({ username: '', phoneNumber: '' })

// Когда меняется formData.username
// Vue автоматически обновляет DOM
// НЕ нужно вызывать setState() как в React
```

#### **Computed Properties (Вычисляемые свойства)**

```typescript
const isFormValid = computed((): boolean => {
  return (
    formData.username.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    !errors.username &&
    !errors.phoneNumber
  )
})

// isFormValid автоматически пересчитывается
// когда меняются formData или errors
// Кнопка disabled/enabled обновляется сама
```

#### **Template Syntax (Синтаксис шаблона)**

```vue
<!-- :class - динамические CSS классы -->
<button :class="{ 'button--disabled': !isFormValid }"></button>
```

### 6. 🚀 **Как добавить новую страницу**

#### **Шаг 1: Создать компонент**

```vue
<!-- src/components/Profile.vue -->
<template>
  <div class="profile">
    <h1>User Profile</h1>
    <p>Username: {{ user.username }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const user = ref({ username: 'John Doe' })
</script>
```

#### **Шаг 2: Добавить маршрут**

```typescript
// src/router/index.ts
const Profile = () => import('@/components/Profile.vue')

const routes = [
  // ... существующие маршруты
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile - Todo Vue App',
      requiresAuth: true,
    },
  },
]
```

#### **Шаг 3: Добавить навигацию**

```typescript
// В любом компоненте
const router = useRouter()
router.push('/profile')
```

### 7. 🧪 **Как тестировать**

#### **Запуск тестов**

```bash
npm run test:unit
```

#### **Что тестируется:**

- Компоненты рендерятся правильно
- Валидация работает корректно
- API вызовы обрабатываются
- Ошибки показываются

### 8. 🔧 **Отладка и разработка**

#### **Vue DevTools**

- Установить расширение в браузере
- Видеть состояние компонентов
- Отслеживать изменения данных
- Анализировать производительность

#### **Console.log (только для разработки)**

```typescript
// В компонентах
console.log('formData:', formData)
console.log('errors:', errors)

// В сервисах
console.log('API response:', response)
```

#### **Network Tab в браузере**

- Видеть HTTP запросы
- Проверять статусы ответов
- Анализировать время загрузки

### 9. 📱 **Адаптивность и мобильные устройства**

#### **CSS Media Queries**

```scss
// src/styles/components/_login.scss
@media (max-width: 768px) {
  .login {
    padding: 20px;

    &__container {
      width: 100%;
      max-width: 400px;
    }
  }
}
```

#### **Touch-friendly интерфейс**

- Кнопки достаточно большие (минимум 44px)
- Поля ввода удобны для пальцев
- Анимации плавные на мобильных

### 10. 🚀 **Производительность**

#### **Lazy Loading**

```typescript
// Компоненты загружаются только когда нужны
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
```

#### **Code Splitting**

- Главная страница загружается быстро
- Дополнительный код загружается по требованию
- Bundle разбивается на части

### 11. 🔒 **Безопасность**

#### **Валидация на клиенте**

- Проверяем данные перед отправкой
- Показываем понятные ошибки
- Защищаем от XSS атак

#### **Готовность к серверной валидации**

- Клиентская валидация для UX
- Серверная валидация для безопасности
- Всегда проверяем данные на бэкенде

### 12. 📚 **Полезные команды**

#### **Разработка**

```bash
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшена
npm run preview      # Предпросмотр сборки
```

#### **Качество кода**

```bash
npm run lint         # Проверка ESLint
npm run format       # Форматирование Prettier
npm run type-check   # Проверка TypeScript
```

#### **Тестирование**

```bash
npm run test:unit    # Запуск unit тестов
npm run test:unit -- --watch  # Тесты в режиме наблюдения
```

---

## 🏛️ Middle Developer Architecture (Рефакторинг)

### 1. Что мы сделали - переход от junior к middle архитектуре

**Было (junior подход):**

```typescript
// Login.vue - всё в одном файле
const handleLogin = async (): Promise<void> => {
  // Валидация
  const isUsernameValid: boolean = validateUsername()
  const isPhoneValid: boolean = validatePhone()

  if (isUsernameValid && isPhoneValid) {
    // API вызов прямо в компоненте
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    const user = data.find(
      (user) => user.username === formData.username && user.phone === formData.phoneNumber,
    )

    if (user) {
      router.replace('/')
    } else {
      loginError.value = 'Login Error'
    }
  }
}
```

**Стало (middle подход):**

```typescript
// Login.vue - чистый UI компонент
const handleLogin = async (): Promise<void> => {
  const isUsernameValid: boolean = validateUsername()
  const isPhoneValid: boolean = validatePhone()

  if (isUsernameValid && isPhoneValid) {
    // Используем composable
    const response = await login({
      username: formData.username,
      phoneNumber: formData.phoneNumber,
    })

    if (response.success && response.user) {
      router.replace('/')
    }
  }
}
```

### 2. Новая архитектура по best practices

#### **2.1. Типы (`src/types/`)**

```typescript
// src/types/user.ts
export interface User {
  id: number
  username: string
  phone: string
  email: string
  name: string
}

export interface LoginCredentials {
  username: string
  phoneNumber: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

// src/types/auth.ts
export interface LoginForm {
  username: string
  phoneNumber: string
}

export interface LoginErrors {
  username: string
  phoneNumber: string
}
```

**Преимущества:**

- ✅ Централизованные интерфейсы
- ✅ Переиспользование типов
- ✅ Строгая типизация
- ✅ Легко поддерживать

#### **2.2. API сервисы (`src/services/`)**

```typescript
// src/services/authService.ts
export class AuthService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com'

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.API_URL}${API_CONFIG.ENDPOINTS.USERS}`)

      if (!response.ok) {
        if (response.status === HTTP_STATUS.NOT_FOUND) {
          throw new Error('Users endpoint not found')
        }
        if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          throw new Error('Server error')
        }
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const users = await this.getUsers()
      const user = users.find(
        (user) => user.username === credentials.username && user.phone === credentials.phoneNumber,
      )

      if (user) {
        return { success: true, user }
      } else {
        return { success: false, error: ERROR_MESSAGES.LOGIN_ERROR }
      }
    } catch {
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR }
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
```

**Преимущества:**

- ✅ Разделение ответственности
- ✅ Переиспользование в других компонентах
- ✅ Легко тестировать (можно мокать)
- ✅ Централизованная обработка ошибок
- ✅ Типизированные ответы

#### **2.3. Composables (`src/composables/`)**

```typescript
// src/composables/useAuth.ts
export function useAuth() {
  const loginError = ref('')
  const isLoading = ref(false)

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    isLoading.value = true
    loginError.value = ''

    try {
      const response = await authService.login(credentials)

      if (response.success) {
        loginError.value = ''
        return response
      } else {
        loginError.value = response.error || ERROR_MESSAGES.LOGIN_ERROR
        return response
      }
    } catch {
      loginError.value = ERROR_MESSAGES.NETWORK_ERROR
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    loginError.value = ''
  }

  return { login, loginError, isLoading, clearError }
}
```

**Преимущества:**

- ✅ Переиспользуемая логика
- ✅ Управление состоянием (loading, errors)
- ✅ Легко тестировать
- ✅ Можно использовать в других компонентах

#### **2.4. Компонент (`src/components/`)**

```typescript
// Login.vue - теперь только UI логика
<script setup lang="ts">
// LoginForm component - handles user authentication
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { validateUsername, validatePhone } from '@/utils/validation'
import { ROUTE_PATHS } from '@/constants/app'
import type { LoginForm, LoginErrors } from '@/types/auth'

const router = useRouter()
const { login, loginError, isLoading, clearError } = useAuth()

// Только валидация и отображение
const formData = reactive<LoginForm>({ username: '', phoneNumber: '' })
const errors = reactive<LoginErrors>({ username: '', phoneNumber: '' })

const handleLogin = async (): Promise<void> => {
  // Валидация
  const isUsernameValid: boolean = validateUsername()
  const isPhoneValid: boolean = validatePhone()

  if (isUsernameValid && isPhoneValid) {
    // Используем composable
    const response = await login({
      username: formData.username,
      phoneNumber: formData.phoneNumber
    })

    if (response.success && response.user) {
      router.replace('/')
    }
  }
}
</script>
```

**Преимущества:**

- ✅ Чистый UI компонент
- ✅ Только валидация и отображение
- ✅ Легко читать и поддерживать
- ✅ Можно переиспользовать в других местах

### 3. Структура папок после рефакторинга

```
src/
├── types/              # TypeScript интерфейсы
│   ├── user.ts        # Пользователи и аутентификация
│   └── auth.ts        # Формы и ошибки
├── services/           # API сервисы
│   └── authService.ts # Сервис аутентификации
├── composables/        # Vue composables
│   └── useAuth.ts     # Логика аутентификации
├── components/         # Vue компоненты
│   └── Login.vue      # Чистый UI компонент
├── styles/             # SCSS стили
├── stores/             # Pinia stores
└── router/             # Vue Router
```

### 4. Преимущества новой архитектуры

#### **4.1. Разделение ответственности**

- **Types** - только интерфейсы и типы
- **Services** - только API вызовы и бизнес-логика
- **Composables** - только управление состоянием
- **Components** - только UI и валидация

#### **4.2. Переиспользование**

```typescript
// useAuth можно использовать в других компонентах
// Login.vue
const { login, loginError, isLoading } = useAuth()

// Profile.vue
const { login, loginError, isLoading } = useAuth()

// Settings.vue
const { login, loginError, isLoading } = useAuth()
```

#### **4.3. Тестирование**

```typescript
// Легко мокать сервисы
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ success: true, user: mockUser }),
  },
}))

// Тестировать composables отдельно
const { result } = renderComposable(() => useAuth())
expect(result.loginError.value).toBe('')
```

#### **4.4. Масштабируемость**

```typescript
// Легко добавлять новые методы
export class AuthService {
  async login() {
    /* ... */
  }
  async logout() {
    /* ... */
  }
  async refreshToken() {
    /* ... */
  }
  async resetPassword() {
    /* ... */
  }
}

// Легко добавлять новые composables
export function useUser() {
  /* ... */
}
export function usePermissions() {
  /* ... */
}
export function useNotifications() {
  /* ... */
}
```

### 5. Готовые ответы для интервью

#### **"Как вы организуете архитектуру Vue проекта?"**

_"Следую принципу разделения ответственности. Types для интерфейсов, services для API вызовов, composables для переиспользуемой логики, components для UI. Это дает переиспользование кода, легкое тестирование и масштабируемость проекта."_

#### **"Зачем нужны composables?"**

_"Composables позволяют вынести логику из компонентов и переиспользовать её. Например, useAuth содержит логику аутентификации, которую можно использовать в Login, Profile, Settings компонентах. Это улучшает читаемость кода и упрощает тестирование."_

#### **"Как вы работаете с API в Vue?"**

_"Создаю сервисные классы (AuthService) для API вызовов, которые инкапсулируют HTTP логику и обработку ошибок. В компонентах использую composables (useAuth), которые вызывают сервисы и управляют состоянием. Это разделяет ответственность и упрощает поддержку."_

#### **"Как вы типизируете Vue проект?"**

_"Создаю централизованные интерфейсы в папке types, использую type imports для строгой типизации. Сервисы и composables типизирую через generic типы, компоненты через defineProps и defineEmits. TypeScript помогает предотвращать ошибки и улучшает автодополнение."_

### 6. Сравнение подходов

| Аспект                | Junior подход       | Middle подход              |
| --------------------- | ------------------- | -------------------------- |
| **Структура**         | Всё в одном файле   | Разделение по папкам       |
| **Переиспользование** | Копирование кода    | Composables и сервисы      |
| **Тестирование**      | Сложно мокать       | Легко мокать сервисы       |
| **Типизация**         | Минимальная         | Строгая типизация          |
| **Масштабируемость**  | Сложно расширять    | Легко добавлять функционал |
| **Поддержка**         | Сложно поддерживать | Легко читать и изменять    |

### 7. Практические примеры использования

#### **7.1. Добавление нового функционала**

```typescript
// 1. Добавляем тип
// src/types/user.ts
export interface UserProfile {
  id: number
  avatar: string
  bio: string
  preferences: UserPreferences
}

// 2. Добавляем метод в сервис
// src/services/authService.ts
async getUserProfile(userId: number): Promise<UserProfile> {
  const response = await fetch(`${this.API_URL}/users/${userId}/profile`)
  return response.json()
}

// 3. Добавляем в composable
// src/composables/useAuth.ts
const getUserProfile = async (userId: number) => {
  return await authService.getUserProfile(userId)
}

// 4. Используем в компоненте
// Profile.vue
const { getUserProfile } = useAuth()
const profile = await getUserProfile(userId)
```

#### **7.2. Обработка ошибок**

```typescript
// src/services/authService.ts
async login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: 'Invalid credentials' }
      }
      if (response.status === 429) {
        return { success: false, error: 'Too many attempts. Try again later.' }
      }
      return { success: false, error: 'Server error. Please try again.' }
    }

    const user = await response.json()
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Network error. Please check your connection.' }
  }
}
```

### 8. Заключение

**Что мы достигли:**

1. ✅ **Чистая архитектура** - каждый файл отвечает за свою область
2. ✅ **Переиспользование** - логика вынесена в composables и сервисы
3. ✅ **Тестируемость** - легко мокать API и тестировать логику
4. ✅ **Масштабируемость** - легко добавлять новые функции
5. ✅ **Типизация** - строгая типизация для всех данных
6. ✅ **Поддерживаемость** - код легко читать и изменять

**Это уровень middle developer!** 🚀

---

## 📚 Ключевые вопросы для интервью

### 1. Vue 3 vs Vue 2

- Composition API vs Options API
- Reactivity system
- Performance improvements

### 2. TypeScript

- Зачем нужен в Vue проектах
- Как типизировать компоненты
- Интерфейсы vs типы

### 3. Архитектура

- Как организовать большой проект
- Когда использовать компоненты vs страницы
- State management (Pinia)

### 4. CSS/SCSS

- BEM методология
- CSS Modules vs глобальные стили
- Адаптивный дизайн

## 🛣️ Vue Router

### 1. Что такое `<router-view />`?

**Концепция:**
`<router-view />` - это специальный компонент Vue Router, который работает как "окно" или "слот" для отображения компонентов в зависимости от текущего URL.

**Как это работает:**
Представь это как рамку для картины:

- Рамка (`<router-view />`) всегда на месте
- Картина (компонент) меняется в зависимости от URL

**Процесс работы:**

- URL: `/login` → Vue Router находит компонент `Login.vue` → рендерит внутри `<router-view />`
- URL: `/home` → Vue Router находит компонент `Home.vue` → рендерит внутри `<router-view />`

**Аналогия:**
Это как телевизор:

- Экран = `<router-view />`
- Каналы = разные компоненты (Login, Home)
- Пульт = URL в браузере
- Переключение канала = изменение URL

**Преимущества:**

- **SPA поведение**: страница не перезагружается
- **Динамическое содержимое**: один контейнер, разные компоненты
- **Чистая архитектура**: App.vue не знает о конкретных страницах

**Важно:** Если в App.vue оставить и `<Login />`, и `<router-view />`, то на `/login` будет две формы логина, а на `/home` - форма логина + домашняя страница одновременно!

### 2. Как `<router-view />` становится доступным?

**Это НЕ встроенный компонент Vue!**

`<router-view />` - компонент из внешней библиотеки Vue Router.

**Процесс подключения:**

1. Установка: `npm install vue-router@4`
2. Регистрация в main.ts:

```typescript
import router from './router'
app.use(router) // ← глобальная регистрация!
```

3. Использование в компонентах без импорта:

```vue
<template>
  <router-view />
  <!-- Доступен глобально -->
</template>
```

**Магия `.use(router)`:** автоматически регистрирует компоненты `<router-view />` и `<router-link>` глобально.

**Без .use(router) пришлось бы:**

```vue
<script setup>
import { RouterView } from 'vue-router'
</script>
<template>
  <RouterView />
</template>
```

### 3. Lazy Loading в маршрутах

**Статический импорт vs Динамический импорт:**

```typescript
// ❌ Статический импорт
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'

// ✅ Динамический импорт (lazy loading)
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
```

**Разница:**

| Статический `import`            | Динамический `() => import()`      |
| ------------------------------- | ---------------------------------- |
| Загружается во время компиляции | Загружается во время выполнения    |
| Все компоненты в одном bundle   | Каждый компонент в отдельном файле |
| Синхронный                      | Асинхронный (Promise)              |
| Медленный старт приложения      | Быстрый старт приложения           |
| Весь код загружается сразу      | Код загружается по требованию      |

**Процесс работы lazy loading:**

1. Пользователь заходит → загружается только main.js (100KB)
2. Переходит на `/login` → загружается Login.js (500KB)
3. Переходит на `/home` → загружается Home.js (300KB)

**Преимущества:**

- **Code splitting**: автоматическое разбиение на части
- **Быстрый старт**: приложение загружается мгновенно
- **Экономия трафика**: загружается только нужное
- **Лучший UX**: пользователь быстрее видит контент

**Готовый ответ для интервью:**
_"Динамический `() => import()` загружает модуль асинхронно во время выполнения, что позволяет разбить приложение на части (code splitting) и загружать компоненты только когда они нужны. Это улучшает производительность, особенно для больших приложений."_

### 3.1. Анализ текущего проекта

**Статус проекта:** ✅ **Всё работает корректно**

**Используемые динамические импорты:**

```typescript
// src/router/index.ts
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
```

**Результат сборки (npm run build):**

```
dist/assets/Home-DXbk41OQ.js     0.16 kB │ gzip:  0.16 kB
dist/assets/Login-mlnyKxel.js    2.10 kB │ gzip:  0.92 kB
dist/assets/index-BKoFMmG0.js   87.56 kB │ gzip: 34.76 kB
```

**Что это означает:**

- ✅ **Code Splitting работает**: Login и Home компоненты создали отдельные чанки
- ✅ **Lazy Loading активен**: компоненты загружаются только при переходе на роут
- ✅ **Оптимизация размера**: основной bundle 87KB, компоненты по 0.16-2.1KB
- ✅ **Автоматическая настройка**: Vite автоматически обрабатывает динамические импорты

**Преимущества в нашем проекте:**

- Быстрый старт приложения (загружается только main bundle)
- Экономия трафика (компоненты загружаются по требованию)
- Лучший UX (пользователь быстрее видит интерфейс)

## 🚀 Performance & Optimization

### 1. Обязательно (базовый must-have) ✅

**Lazy loading компонентов:**

```typescript
// ✅ Реализовано в src/router/index.ts
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
```

**Code splitting:**

```bash
# ✅ Работает автоматически через Vite
dist/assets/Home-DXbk41OQ.js     0.16 kB
dist/assets/Login-mlnyKxel.js    2.10 kB
dist/assets/index-BKoFMmG0.js   87.56 kB
```

**Оптимизация шрифтов:**

```html
<!-- ✅ Реализовано в index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  rel="stylesheet"
/>
```

**Кэширование и версионирование:**

```bash
# ✅ Vite автоматически генерирует хеши в именах файлов
dist/assets/index-BKoFMmG0.js  # ← хеш BKoFMmG0
```

### 2. Что нужно добавить (средний уровень) 🔄

**Lazy loading изображений:**

```html
<!-- Пока не используется, но нужно для картинок -->
<img src="image.jpg" loading="lazy" alt="description" />
```

**Prefetch/Preload ресурсов:**

```html
<!-- Для критических ресурсов -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
<!-- Для ресурсов следующих страниц -->
<link rel="prefetch" href="/api/user-data" />
```

**Critical CSS:**

```html
<!-- Инлайн критических стилей для первого рендера -->
<style>
  .login {
    /* критические стили */
  }
</style>
```

### 3. Продвинутый уровень (плюс в копилку) 💪

**Настройка Vite для production:**

```typescript
// vite.config.ts - расширенная настройка
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          utils: ['axios'],
        },
      },
    },
  },
})
```

**Tree-shaking:**

```typescript
// ✅ Автоматически работает в Vite
// Неиспользуемый код удаляется из bundle
```

**Готовые ответы для интервью:**

**"Как вы оптимизируете Vue приложение?"**
_"Использую lazy loading компонентов через динамические импорты, настраиваю code splitting в роутере, оптимизирую загрузку шрифтов через preconnect, применяю lazy loading для изображений. Vite автоматически генерирует хеши для кэширования и выполняет tree-shaking."_

**"Что такое code splitting и зачем он нужен?"**
_"Code splitting разбивает приложение на отдельные чанки, которые загружаются по требованию. Это уменьшает размер начального bundle и ускоряет загрузку приложения. В нашем проекте каждый роут создает отдельный чанк."_

### 8. Анализ размеров bundle и оптимизация

**Почему vendor chunk самый тяжелый:**

```bash
# До оптимизации:
dist/assets/vendor-Dn8QOG1r.js  85.21 kB │ gzip: 33.74 kB
# Содержал: vue + vue-router + pinia

# После оптимизации:
dist/assets/vue-core-BB4XHX3B.js       61.27 kB │ gzip: 24.59 kB  # Vue.js
dist/assets/vue-ecosystem-Cte-T23s.js  23.94 kB │ gzip:  9.78 kB  # Router + Pinia
dist/assets/http-client-l0sNRNKZ.js     0.00 kB │ gzip:  0.02 kB  # Axios (не используется)
```

**Что делает chunks тяжелыми:**

1. **Vue.js core** (~61KB) - реактивность, компилятор, runtime
2. **Vue Router** (~15KB) - маршрутизация, history API
3. **Pinia** (~8KB) - state management
4. **Axios** (0KB) - не используется, пустой chunk

**Оптимизация chunks в vite.config.ts:**

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-core': ['vue'],           // Самый тяжелый отдельно
        'vue-ecosystem': ['vue-router', 'pinia'], // Экосистема
        'http-client': ['axios'],      // HTTP клиент
      },
    },
  },
}
```

**Bundle analyzer:**

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  visualizer({
    filename: 'dist/stats.html', // Генерирует анализ
    gzipSize: true, // Показывает gzip размеры
  }),
]
```

**Готовый ответ для интервью:**
_"Vendor chunk тяжелый потому что содержит Vue.js core (~61KB), который включает реактивную систему, компилятор шаблонов и runtime. Оптимизировал разделением на vue-core и vue-ecosystem chunks. Использую rollup-plugin-visualizer для анализа размеров и выявления тяжелых зависимостей."_

### 9. Code Review и очистка проекта ✅

**Найденные проблемы junior/middle developer:**

❌ **Console.log в production:**

```typescript
// Было:
console.log(formData)
console.log('errors', errors)

// Стало:
// TODO: Send data to API
// await authService.login(formData)
```

❌ **Неиспользуемый код:**

```typescript
// Удалены:
- src/stores/counter.ts (полностью не используется)
- axios dependency (0KB в bundle)
- Закомментированный код в eslint.config.ts
```

❌ **Bundle analyzer в production:**

```typescript
// Было:
visualizer({ open: true }) // Открывает браузер при каждой сборке

// Стало:
visualizer({ open: false }) // Не мешает CI/CD
```

**Результат очистки:**

```bash
# Чище bundle без пустых chunks:
dist/assets/vue-core-BB4XHX3B.js       61.27 kB │ gzip: 24.59 kB
dist/assets/vue-ecosystem-Cte-T23s.js  23.94 kB │ gzip:  9.78 kB
dist/assets/Login-K3TZ4EdN.js           3.34 kB │ gzip:  1.30 kB
# Убрали: http-client-l0sNRNKZ.js (пустой chunk)
```

**Принципы clean code:**

- ✅ **No dead code** - удалили неиспользуемые файлы
- ✅ **No debug logs** - убрали console.log из production
- ✅ **Clean dependencies** - удалили неиспользуемые пакеты
- ✅ **No commented code** - удалили закомментированный код
- ✅ **Production ready** - настроили bundle analyzer для CI/CD

**Готовый ответ для интервью:**
_"Провожу code review на наличие console.log, неиспользуемых зависимостей и мертвого кода. Удаляю закомментированный код, пустые chunks и debug логи. Настраиваю инструменты для production режима. Слежу за чистотой bundle и отсутствием технического долга."_

### 10. Улучшенная валидация форм ✅

**Username валидация:**

```typescript
const validateUsername = (): boolean => {
  const value = formData.username.trim()

  if (!value) {
    errors.username = 'Username is required'
  } else if (value.length < 3) {
    errors.username = 'Username must be at least 3 characters long'
  } else if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(value)) {
    errors.username =
      'Username must start with a letter and contain only letters, numbers, and underscores'
  } else {
    errors.username = ''
  }

  return !errors.username
}
```

**Phone валидация с международными форматами:**

```typescript
const validatePhone = (): boolean => {
  const value = formData.phoneNumber.trim()

  if (!value) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!/^\+?[1-9]\d{1,14}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
    errors.phoneNumber = 'Please enter a valid phone number (e.g., +1234567890 or 1234567890)'
  } else {
    const cleanNumber = value.replace(/[\s\-\(\)+]/g, '')
    if (cleanNumber.length < 7 || cleanNumber.length > 15) {
      errors.phoneNumber = 'Phone number must be between 7 and 15 digits'
    } else {
      errors.phoneNumber = ''
    }
  }

  return !errors.phoneNumber
}
```

**HTML5 валидация атрибуты:**

```html
<!-- Username field -->
<input
  placeholder="Enter username (min 3 characters)"
  minlength="3"
  maxlength="20"
  pattern="[A-Za-z][A-Za-z0-9_]*"
/>

<!-- Phone field -->
<input type="tel" placeholder="+1234567890 or 1234567890" pattern="[\+]?[0-9\s\-\(\)]+" />
```

**Правила валидации:**

**Username:**

- ✅ Минимум 3 символа
- ✅ Максимум 20 символов
- ✅ Начинается с буквы
- ✅ Только буквы, цифры, подчеркивания
- ✅ Trim пробелов

**Phone Number:**

- ✅ Поддержка международных форматов (+1234567890)
- ✅ Локальные номера (1234567890)
- ✅ Разрешенные символы: +, -, (), пробелы
- ✅ Длина от 7 до 15 цифр после очистки
- ✅ Начинается с цифры 1-9 (не с 0)

**UX улучшения:**

- ✅ Понятные сообщения об ошибках
- ✅ Подсказки в placeholder
- ✅ HTML5 валидация как fallback
- ✅ Real-time валидация при вводе

**Готовый ответ для интервью:**
_"Реализую многоуровневую валидацию: client-side для UX, HTML5 атрибуты как fallback, и server-side для безопасности. Для username проверяю длину и формат, для телефона поддерживаю международные форматы. Использую понятные сообщения об ошибках и real-time валидацию для лучшего пользовательского опыта."_

## 🏛️ SPA Architecture & Component Design

### 1. Принципы SPA (Single Page Application) ✅

**Что такое SPA:**
SPA — приложение, где весь UI загружается один раз, а переходы между страницами происходят без полной перезагрузки браузера.

**Как работает в нашем проекте:**

```typescript
// src/router/index.ts - маршрутизация SPA
import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('@/components/Login.vue') // ✅ Lazy loading
const Home = () => import('@/components/Home.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // ✅ History API
  routes: [
    { path: '/login', name: 'Login', component: Login },
    { path: '/', name: 'Home', component: Home },
    { path: '/:pathMatch(.*)*', redirect: '/login' }, // ✅ Fallback
  ],
})
```

**Жизненный цикл SPA:**

1. **Первый рендер** - загрузка `main.ts`, монтирование `App.vue`
2. **Навигация** - Vue Router обрабатывает переходы без перезагрузки
3. **Обновление состояния** - реактивность Vue обновляет DOM
4. **API взаимодействие** - через axios/fetch (JSON)

### 2. Компонентный подход ✅

**Структура нашего проекта:**

```
src/
├── components/     ← Переиспользуемые компоненты
│   ├── Login.vue   ← Страница-компонент
│   └── Home.vue    ← Страница-компонент
├── types/          ← TypeScript интерфейсы
└── stores/         ← Глобальное состояние (Pinia)
```

**Принцип Single Responsibility:**

```vue
<!-- Login.vue - отвечает ТОЛЬКО за авторизацию -->
<template>
  <main class="login">
    <section class="login__container">
      <form @submit.prevent="handleLogin" class="login__form">
        <!-- Логика формы -->
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
// Только логика авторизации
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginForm, LoginErrors } from '@/types/auth'
</script>
```

**Взаимодействие компонентов:**

```typescript
// Props (данные вниз)
defineProps<{
  title: string
  isDisabled: boolean
}>()

// Emits (события вверх)
const emit = defineEmits<{
  submit: [data: LoginForm]
  cancel: []
}>()

// Программная навигация
const router = useRouter()
router.replace('/') // ✅ SPA-переход без перезагрузки
```

### 3. Чек-лист готовности к собеседованию

**SPA Architecture:**

- ✅ **Маршрутизация**: Vue Router с History API
- ✅ **Lazy Loading**: `() => import()` для компонентов
- ✅ **Состояние**: Локальное (reactive) + глобальное (Pinia)
- ✅ **API**: Готов для интеграции с бэкендом (axios)
- ✅ **Code Splitting**: Автоматическое разбиение на чанки

**Component Design:**

- ✅ **Single Responsibility**: Каждый компонент = одна задача
- ✅ **Переиспользуемость**: Модульная структура
- ✅ **TypeScript**: Типизация props и состояния
- ✅ **Composition API**: Современный подход Vue 3

### 4. Готовые ответы для интервью

**"Объясните архитектуру SPA"**
_"SPA загружается один раз, дальнейшие переходы обрабатывает JavaScript. В нашем проекте Vue Router управляет маршрутизацией через History API, компоненты загружаются лениво через динамические импорты. Состояние синхронизируется с URL, а данные получаем через API без перезагрузки страницы."_

**"Как организуете компоненты?"**
_"Следую принципу Single Responsibility - каждый компонент отвечает за одну задачу. Использую TypeScript для типизации props и состояния, Composition API для логики. Структура: components для переиспользуемых блоков, типы выношу в отдельные файлы, глобальное состояние через Pinia. Все комментарии в коде на английском для международной команды."_

**"В чем плюсы и минусы SPA?"**
_"Плюсы: быстрые переходы без перезагрузки, плавный UX, разделение фронтенда и бэкенда. Минусы: сложнее SEO (решается SSR), медленный первый рендер (решается code splitting), нужно продумывать состояние и кэширование."_

### 5. Архитектура нашего SPA

**Точка входа (main.ts):**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App) // ✅ Создание Vue приложения
app.use(createPinia()) // ✅ Глобальное состояние
app.use(router) // ✅ SPA маршрутизация
app.mount('#app') // ✅ Монтирование в DOM
```

**Корневой компонент (App.vue):**

```vue
<template>
  <div id="app">
    <router-view />
    <!-- ✅ SPA: один контейнер для всех страниц -->
  </div>
</template>
```

**Структура по принципам SPA:**

- ✅ **Единая точка входа**: `index.html` → `main.ts` → `App.vue`
- ✅ **Клиентская маршрутизация**: Vue Router без перезагрузки
- ✅ **Модульность**: Компоненты загружаются по требованию
- ✅ **Состояние**: Pinia для глобального состояния
- ✅ **Типизация**: TypeScript для надежности

### 7. Доказательства что это SPA

**Краткий анализ нашего кода:**

✅ **Единая HTML страница:**

```html
<!-- index.html - ОДНА страница -->
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

✅ **Vue Router с History API:**

```typescript
// src/router/index.ts
const router = createRouter({
  history: createWebHistory(),  // ✅ SPA: клиентская маршрутизация
  routes: [...]
})
```

✅ **Динамическая замена контента:**

```vue
<!-- App.vue - контейнер для всех "страниц" -->
<template>
  <div id="app">
    <router-view />
    <!-- ✅ SPA: один контейнер -->
  </div>
</template>
```

✅ **Lazy loading компонентов:**

```typescript
// Компоненты загружаются по требованию, не сразу все
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
```

✅ **Программная навигация без перезагрузки:**

```typescript
// Login.vue
const router = useRouter()
router.replace('/') // ✅ SPA: переход без перезагрузки страницы
```

**Как это работает:**

1. **Загрузка:** Браузер загружает `index.html` → `main.ts` → создает Vue приложение
2. **Навигация:** При переходе `/login` → `/` страница НЕ перезагружается
3. **Контент:** Vue Router просто меняет компонент в `<router-view />`
4. **URL:** Адресная строка меняется, но HTTP запроса нет

**Это классическое SPA приложение!** 🎯

---

**Детальные доказательства:**

**1. Единая HTML страница:**

```html
<!-- index.html - ОДНА страница для всего приложения -->
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
```

**2. History API маршрутизация:**

```typescript
// src/router/index.ts
const router = createRouter({
  history: createWebHistory(), // ✅ Клиентская маршрутизация
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Home },
  ],
})
```

**3. Динамическая замена контента:**

```vue
<!-- App.vue - один контейнер для всех "страниц" -->
<template>
  <div id="app">
    <router-view />
    <!-- ✅ Контент меняется без перезагрузки -->
  </div>
</template>
```

**4. Программная навигация:**

```typescript
// Login.vue - переход без перезагрузки страницы
const router = useRouter()
router.replace('/') // ✅ URL меняется, но HTTP запроса нет
```

**5. Запуск в dev режиме:**

```bash
# ✅ Один сервер для всего приложения
VITE v7.1.2  ready in 708 ms
➜  Local:   http://localhost:5173/
```

**Готовый ответ для интервью:**
_"Да, это классическое SPA. У нас одна HTML страница с div#app, Vue Router управляет маршрутизацией через History API, компоненты загружаются динамически через router-view, переходы между страницами происходят программно без перезагрузки браузера. Все признаки SPA присутствуют."_

## 🔷 TypeScript в Vue 3 (Deep Understanding)

### 1. Типизация интерфейсов и состояния ✅

**Организация типов:**

```typescript
// src/types/auth.ts - централизованные интерфейсы
export interface LoginForm {
  username: string
  phoneNumber: string
}

export interface LoginErrors {
  username: string
  phoneNumber: string
}

export interface User {
  id: number
  username: string
  phoneNumber: string
}

export interface AuthState {
  user: User | null
  token: string | null
}
```

### 2. Composition API с TypeScript ✅

**Реальное состояние в нашем коде:**

```typescript
// Login.vue - как есть сейчас (без явной типизации)
import { reactive, computed } from 'vue'
import type { LoginForm, LoginErrors } from '@/types/auth'

// ❌ Без явной типизации (TypeScript выводит автоматически)
const formData = reactive({
  username: '',
  phoneNumber: '',
})

const errors = reactive({
  username: '',
  phoneNumber: '',
})

// ❌ Без явного указания типа возврата
const isFormValid = computed(() => {
  return (
    formData.username.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    !errors.username &&
    !errors.phoneNumber
  )
})
```

**Улучшенная версия с явной типизацией:**

```typescript
// ✅ Лучше - с явной типизацией
const formData = reactive<LoginForm>({
  username: '',
  phoneNumber: '',
})

const errors = reactive<LoginErrors>({
  username: '',
  phoneNumber: '',
})

// ✅ Лучше - с типизированным возвратом
const isFormValid = computed((): boolean => {
  return (
    formData.username.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    !errors.username &&
    !errors.phoneNumber
  )
})
```

### 3. Типизированные функции и валидация ✅

**Generic функция с типами:**

```typescript
// Универсальная функция валидации с типизацией
const createValidator = (
  data: LoginForm, // ✅ Типизированные параметры
  errors: LoginErrors,
  field: keyof LoginForm, // ✅ Ключи только из интерфейса
  pattern: RegExp,
  errorMsg: string,
): (() => boolean) => {
  // ✅ Типизированный возврат
  return (): boolean => {
    if (!data[field]) {
      errors[field] = `${String(field)} is required`
    } else if (!pattern.test(String(data[field]))) {
      errors[field] = errorMsg
    } else {
      errors[field] = ''
    }
    return !errors[field]
  }
}
```

### 4. Pinia Store с TypeScript ✅

**Типизированное хранилище:**

```typescript
// src/stores/counter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref<number>(0) // ✅ Явная типизация
  const doubleCount = computed(
    (): number => count.value * 2, // ✅ Типизированный computed
  )

  function increment(): void {
    // ✅ Типизированная функция
    count.value++
  }

  return { count, doubleCount, increment }
})

// ✅ TypeScript автоматически выводит типы возврата
// type CounterStore = {
//   count: Ref<number>
//   doubleCount: ComputedRef<number>
//   increment: () => void
// }
```

### 5. Router с типизацией ✅

**Типизированные маршруты:**

```typescript
// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router'

// ✅ Типизация мета-данных
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    requiresAuth: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login', // ✅ Типизировано
      requiresAuth: false, // ✅ Типизировано
    },
  },
]
```

### 6. Готовые ответы для интервью

**"Как используете TypeScript в Vue 3?"**
_"Создаю централизованные интерфейсы в папке types, использую type imports для строгой типизации. В текущем проекте полагаюсь на автоматический вывод типов TypeScript, но для production кода предпочитаю явную типизацию reactive/computed для лучшей читаемости и предотвращения ошибок. Использую generic функции с keyof для валидации."_

**"Какие преимущества TypeScript в Composition API?"**
_"Автоматический вывод типов для reactive/computed, типизация props через defineProps<Interface>, строгая типизация функций и их параметров, интеграция с IDE для автокомплита и рефакторинга, предотвращение ошибок на этапе компиляции."_

**"Как типизируете Pinia stores?"**
_"Использую Composition API стиль с defineStore, типизирую ref/computed явно или через вывод типов, создаю интерфейсы для состояния store, TypeScript автоматически типизирует возвращаемые методы и свойства."_

### 7. Программная навигация

**useRouter() composable** - для программного управления навигацией:

```typescript
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = () => {
  // Программный переход
  router.push('/home')
}
</script>
```

**Методы навигации:**

| Метод                 | Описание                         | Когда использовать   |
| --------------------- | -------------------------------- | -------------------- |
| `router.push('/')`    | Переход с добавлением в историю  | Обычная навигация    |
| `router.replace('/')` | Переход с заменой текущей записи | После логина/логаута |
| `router.back()`       | Переход назад                    | Кнопка "Назад"       |
| `router.forward()`    | Переход вперед                   | Кнопка "Вперед"      |
| `router.go(-2)`       | Переход на N позиций в истории   | Сложная навигация    |

**push() vs replace():**

```typescript
// ✅ Для логина используй replace()
const handleLogin = () => {
  if (isValidForm()) {
    router.replace('/') // Пользователь не вернется на логин кнопкой "Назад"
  }
}

// ✅ Для обычной навигации используй push()
const goToProfile = () => {
  router.push('/profile') // Можно вернуться назад
}
```

**Преимущества программной навигации:**

- **Условная навигация**: переход только при выполнении условий
- **Контроль истории**: управление кнопками браузера
- **UX**: предотвращение возврата на страницы входа

## 🔍 Валидация форм

### 1. Подходы к валидации

**Разделение ответственности (рекомендуемый):**

```typescript
const formData = reactive({
  username: '',
  phoneNumber: '',
})

const errors = reactive({
  username: '',
  phoneNumber: '',
})
```

**Все в одном объекте (альтернативный):**

```typescript
const formData = reactive({
  username: '',
  phoneNumber: '',
  errors: {
    username: '',
    phoneNumber: '',
  },
})
```

### 2. Универсальный валидатор

**Senior+ подход:**

```typescript
const createValidator = (
  data: any, // объект с данными
  errors: any, // объект с ошибками
  field: string, // имя поля
  pattern: RegExp, // регулярка
  errorMsg: string, // сообщение об ошибке
) => {
  return () => {
    if (!data[field]) {
      errors[field] = `${field} is required`
    } else if (!pattern.test(data[field])) {
      errors[field] = errorMsg
    } else {
      errors[field] = ''
    }
    return !errors[field]
  }
}
```

**Преимущества:**

- **Переиспользование**: один валидатор для всех форм
- **Типобезопасность**: TypeScript проверит поля
- **Нет хардкода**: работает с любыми объектами

### 3. События валидации

**Событие `@blur` - потеря фокуса:**

| Событие   | Когда происходит   | Когда использовать    | UX                         |
| --------- | ------------------ | --------------------- | -------------------------- |
| `@input`  | При каждом символе | Мгновенная валидация  | Раздражает пользователя    |
| `@blur`   | При потере фокуса  | После заполнения поля | Комфортно для пользователя |
| `@submit` | При отправке формы | Финальная проверка    | Может быть поздно          |

**Процесс @blur:**

```
1. Пользователь кликает в поле → focus
2. Печатает данные → input события
3. Кликает вне поля → blur ← ВАЛИДАЦИЯ!
4. Показывается ошибка или поле очищается
```

**Пример использования:**

```vue
<input v-model="formData.username" @blur="validateUsername" :class="{ error: errors.username }" />
<span v-if="errors.username">{{ errors.username }}</span>
```

**Почему @blur лучше для UX:**

- **Не мешает вводу**: пользователь спокойно печатает
- **Своевременно**: проверяет когда поле заполнено
- **Не раздражает**: нет красных ошибок во время ввода

### 4. Отображение ошибок

**Условное отображение:**

```vue
<span v-if="errors.username" class="form-error">
  {{ errors.username }}
</span>
```

**Динамические стили:**

```vue
<input :class="{ 'input--error': errors.username }" />
```

**CSS для ошибок:**

```scss
.form {
  &-input {
    &--error {
      border-color: $error-color;
      box-shadow: 0 0 0 1px $error-color;
    }
  }

  &-error {
    color: $error-color;
    font-size: 12px;
    margin-top: 5px;
  }
}
```

### 5. Computed свойства для форм

**computed() vs обычная функция:**

```typescript
// ❌ Обычная функция - НЕ реактивная
const isFormValid = () => {
  return formData.username && formData.phoneNumber && !errors.username
}

// ✅ Computed свойство - автоматически пересчитывается
const isFormValid = computed(() => {
  return (
    formData.username.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    !errors.username &&
    !errors.phoneNumber
  )
})
```

**Использование в template:**

```vue
<!-- ❌ Неправильно - с скобками -->
<button :disabled="!isFormValid()">Login</button>

<!-- ✅ Правильно - без скобок -->
<button :disabled="!isFormValid">Login</button>
```

**Disabled кнопка - Best Practice:**

```vue
<template>
  <button
    type="submit"
    class="form-button"
    :class="{ 'form-button--disabled': !isFormValid }"
    :disabled="!isFormValid"
  >
    {{ isFormValid ? 'Login' : 'Fill all fields' }}
  </button>
</template>

<script setup>
import { reactive, computed } from 'vue'

const isFormValid = computed(() => {
  return (
    formData.username.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    !errors.username &&
    !errors.phoneNumber
  )
})
</script>
```

**CSS для disabled состояния:**

```scss
.form-button {
  &--disabled {
    background-color: $gray-light;
    color: $text-color-grey;
    cursor: not-allowed;
    opacity: 0.6;

    &:hover {
      background-color: $gray-light; // Отключаем hover
    }
  }

  &:disabled {
    pointer-events: none; // Блокируем все события
  }
}
```

**Почему computed лучше:**

| Обычная функция           | Computed свойство             |
| ------------------------- | ----------------------------- |
| Вызывается каждый раз     | Кешируется                    |
| НЕ реактивная             | Автоматически пересчитывается |
| Нужно вызывать `func()`   | Используется как `prop`       |
| Плохая производительность | Оптимизировано Vue            |

**Готовый ответ для интервью:**
_"Computed свойства автоматически пересчитываются при изменении зависимостей и кешируются для производительности. В отличие от методов, они вызываются только когда изменились зависимые данные. Идеально подходят для валидации форм и вычисляемых значений."_

## 🚀 Готовые ответы

### "Расскажите о Composition API"

"Composition API - это новый способ организации логики в Vue 3. Вместо Options API (data, methods, computed) мы используем функции как `reactive()`, `ref()`, `computed()`. Это дает лучшую типизацию с TypeScript, переиспользование логики и более читаемый код."

### "Зачем нужен TypeScript в Vue?"

"TypeScript добавляет статическую типизацию, что помогает находить ошибки на этапе компиляции, улучшает автодополнение в IDE и делает код более поддерживаемым. Особенно полезен в больших проектах и командах."

### "Как работает реактивность в Vue 3?"

"Vue 3 использует Proxy API для отслеживания изменений. Когда мы создаем реактивный объект через `reactive()` или `ref()`, Vue автоматически отслеживает все изменения и обновляет DOM. Это происходит без дополнительных watcher или ручного управления."

## 🗂️ **Pinia State Management (Управление состоянием)**

### **Что такое Pinia?**

Pinia - это официальная библиотека управления состоянием для Vue 3. Она заменяет Vuex и предоставляет более простой и TypeScript-friendly способ управления глобальным состоянием приложения.

### **Зачем нужна Pinia?**

**Без Pinia (проблемы):**

- Данные разбросаны по компонентам
- Сложно передавать данные между компонентами
- Нет централизованного управления состоянием
- Сложно отслеживать изменения данных

**С Pinia (решения):**

- Централизованное хранение данных
- Простая передача данных между компонентами
- Автоматическое отслеживание изменений
- TypeScript поддержка из коробки

### **Как работает Pinia в нашем проекте:**

#### **1. Создание Store**

```typescript
// src/stores/user.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State - данные которые храним
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Getters - вычисляемые свойства
  const getUser = computed(() => currentUser.value)
  const getIsAuthenticated = computed(() => isAuthenticated.value)

  // Actions - методы для изменения состояния
  const login = (user: User) => {
    currentUser.value = user
    isAuthenticated.value = true
  }

  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
  }

  return {
    // Экспортируем все что нужно
    currentUser,
    isAuthenticated,
    getUser,
    getIsAuthenticated,
    login,
    logout,
  }
})
```

#### **2. Подключение к приложению**

```typescript
// src/main.ts
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia() // Создаем экземпляр Pinia
app.use(pinia) // Подключаем к приложению
app.mount('#app')
```

#### **3. Использование в компонентах**

```vue
<!-- src/components/Home.vue -->
<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore() // Получаем доступ к store

// Используем данные из store
const currentUser = computed(() => userStore.getUser)
const isAuthenticated = computed(() => userStore.getIsAuthenticated)

// Вызываем методы store
const handleLogout = () => {
  userStore.logout()
}
</script>
```

#### **4. Использование в composables**

```typescript
// src/composables/useAuth.ts
import { useUserStore } from '@/stores/user'

export function useAuth() {
  const userStore = useUserStore() // Получаем store

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)

    if (response.success && response.user) {
      userStore.login(response.user) // Сохраняем пользователя в store
      return response
    }
  }

  const logout = () => {
    userStore.logout() // Очищаем данные пользователя
  }

  return { login, logout }
}
```

### **Структура Pinia Store:**

```
Store (useUserStore)
├── State (состояние)
│   ├── currentUser: User | null
│   └── isAuthenticated: boolean
├── Getters (вычисляемые свойства)
│   ├── getUser: User | null
│   └── getIsAuthenticated: boolean
└── Actions (действия)
    ├── login(user: User): void
    └── logout(): void
```

### **Преимущества Pinia:**

1. **TypeScript Support** - полная поддержка типов
2. **DevTools** - отличные инструменты разработчика
3. **Modular** - можно создавать много store'ов
4. **Lightweight** - легковесная библиотека
5. **Vue 3 Native** - создана специально для Vue 3

### **Паттерны использования:**

#### **1. Store per Feature (Store на фичу)**

```typescript
// stores/user.ts - для пользователей
// stores/todos.ts - для задач
// stores/settings.ts - для настроек
```

#### **2. Composition API Style**

```typescript
export const useUserStore = defineStore('user', () => {
  // Используем Composition API функции
  const state = ref({})
  const computed = computed(() => {})
  const methods = () => {}

  return { state, computed, methods }
})
```

#### **3. Options API Style (альтернатива)**

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.currentUser,
  },

  actions: {
    login(user) {
      this.currentUser = user
      this.isAuthenticated = true
    },
  },
})
```

### **Жизненный цикл Store:**

1. **Создание** - `defineStore()` определяет store
2. **Инициализация** - `useUserStore()` создает экземпляр
3. **Использование** - компоненты читают/изменяют данные
4. **Обновление** - Vue автоматически обновляет DOM
5. **Уничтожение** - store автоматически очищается

### **Лучшие практики:**

#### **1. Именование**

```typescript
// ✅ Правильно
export const useUserStore = defineStore('user', () => {})
export const useTodoStore = defineStore('todo', () => {})

// ❌ Неправильно
export const userStore = defineStore('user', () => {})
export const store = defineStore('user', () => {})
```

#### **2. Структура файлов**

```
src/stores/
├── user.ts          ← Store для пользователей
├── todo.ts          ← Store для задач
├── index.ts         ← Экспорт всех store'ов
└── types.ts         ← Типы для store'ов
```

#### **3. Экспорт store'ов**

```typescript
// src/stores/index.ts
export { useUserStore } from './user'
export { useTodoStore } from './todo'
export { useSettingsStore } from './settings'
```

### **Отладка и DevTools:**

1. **Vue DevTools** - показывает все store'ы
2. **State Inspector** - просмотр состояния
3. **Time Travel** - откат изменений
4. **Actions Log** - лог всех действий

### **Готовый ответ для интервью:**

**"Pinia - это современная библиотека управления состоянием для Vue 3. Она предоставляет централизованное хранение данных через store'ы, которые содержат state, getters и actions. Store'ы создаются с помощью `defineStore()` и используются в компонентах через `useStoreName()`. Pinia автоматически отслеживает изменения и обновляет компоненты, что делает управление состоянием простым и эффективным."**

### **Примеры использования в реальных проектах:**

#### **E-commerce приложение:**

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() => items.value.reduce((sum, item) => sum + item.price, 0))

  const addItem = (item: CartItem) => items.value.push(item)
  const removeItem = (id: string) => {
    const index = items.value.findIndex((item) => item.id === id)
    if (index > -1) items.value.splice(index, 1)
  }

  return { items, total, addItem, removeItem }
})
```

#### **Dashboard приложение:**

```typescript
// stores/dashboard.ts
export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref<Widget[]>([])
  const layout = ref<Layout>('grid')

  const addWidget = (widget: Widget) => widgets.value.push(widget)
  const changeLayout = (newLayout: Layout) => (layout.value = newLayout)

  return { widgets, layout, addWidget, changeLayout }
})
```

**Pinia делает управление состоянием простым, типобезопасным и эффективным! 🚀**

---

# 🚀 **Todo Vue App - Interview Notes**

## 📋 **Project Overview**

**Todo Vue App** - это современное веб-приложение для управления задачами, построенное с использованием:

- **Vue 3** - Composition API
- **TypeScript** - строгая типизация
- **Pinia** - управление состоянием
- **Vue Router 4** - маршрутизация
- **SCSS** - модульные стили
- **Vite** - сборка и разработка
- **Vitest** - тестирование

## 🏗️ **Architecture & Best Practices**

### **📁 Project Structure**

```
src/
├── components/          # Vue компоненты
├── composables/         # Переиспользуемая логика
├── constants/           # Константы приложения
├── router/             # Маршрутизация
├── services/           # API сервисы
├── stores/             # Pinia stores
├── styles/             # SCSS стили
├── types/              # TypeScript типы
└── utils/              # Утилиты
```

### **🔧 Key Features**

- **Authentication System** - логин/логаут с API
- **User Profile Management** - отображение информации о пользователе
- **Todo Management** - CRUD операции с задачами
- **Advanced Filtering** - фильтрация по статусу, пользователю, поиск
- **Favorites System** - избранные задачи с localStorage
- **Responsive Design** - адаптивный дизайн для всех устройств

## 🎯 **Todo Functionality Implementation**

### **📊 Data Structure**

```typescript
interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}
```

### **🔌 API Integration**

- **Endpoint**: `https://jsonplaceholder.typicode.com/todos`
- **Methods**: GET (fetch todos), POST (create todo)
- **Error Handling**: HTTP status codes, network errors
- **Loading States**: индикаторы загрузки

### **🎛️ Filtering System**

1. **Status Filter**: All, Completed, Uncompleted, Favorites
2. **User Filter**: по userId или All Users
3. **Search Filter**: поиск по title в реальном времени
4. **Combined Filters**: все фильтры работают вместе

### **⭐ Favorites System**

- **Storage**: localStorage для персистентности
- **Toggle**: добавление/удаление из избранного
- **Visual Feedback**: анимация звездочки
- **Filter**: отдельный фильтр для избранных

### **📱 Responsive Design**

- **Grid Layout**: CSS Grid для карточек
- **Flexbox**: для форм и фильтров
- **Mobile First**: адаптация под мобильные устройства
- **Touch Friendly**: удобные размеры для тач-устройств

## 🗂️ **Pinia State Management (Управление состоянием)**

### **🤔 Что такое Pinia и зачем она нужна?**

**Pinia** - это официальная библиотека для управления состоянием в Vue 3, которая заменяет Vuex.

#### **❌ Проблемы без Pinia:**

- **Props Drilling** - передача данных через множество компонентов
- **Event Bus** - сложная коммуникация между компонентами
- **Local State** - дублирование логики в каждом компоненте
- **No Centralization** - нет централизованного управления данными

#### **✅ Решения с Pinia:**

- **Centralized State** - централизованное хранение данных
- **Reactive Updates** - автоматическое обновление компонентов
- **Type Safety** - полная поддержка TypeScript
- **DevTools** - отладка состояния в браузере

### **🔧 Как работает в нашем проекте:**

#### **1. Создание Store:**

```typescript
// src/stores/todo.ts
export const useTodoStore = defineStore('todo', () => {
  // State - реактивные данные
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)

  // Getters - вычисляемые свойства
  const filteredTodos = computed(() => {
    /* логика фильтрации */
  })

  // Actions - методы для изменения состояния
  const fetchTodos = async () => {
    /* API вызов */
  }

  return { todos, isLoading, filteredTodos, fetchTodos }
})
```

#### **2. Подключение к приложению:**

```typescript
// src/main.ts
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia()) // Регистрируем Pinia
```

#### **3. Использование в компонентах:**

```typescript
// В компоненте
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()
const todos = computed(() => todoStore.getTodos)
```

### **🏗️ Структура Pinia Store:**

#### **State (Состояние):**

```typescript
const todos = ref<Todo[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
```

- **ref()** - реактивные переменные
- **reactive()** - реактивные объекты
- Автоматическое обновление UI при изменении

#### **Getters (Геттеры):**

```typescript
const filteredTodos = computed(() => {
  let filtered = todos.value
  // Логика фильтрации
  return filtered
})
```

- **computed()** - вычисляемые свойства
- Кэширование результатов
- Автоматическое пересчитывание при изменении зависимостей

#### **Actions (Действия):**

```typescript
const fetchTodos = async () => {
  isLoading.value = true
  try {
    const data = await api.getTodos()
    todos.value = data
  } finally {
    isLoading.value = false
  }
}
```

- **async/await** - асинхронные операции
- Изменение состояния
- API вызовы
- Обработка ошибок

### **🚀 Преимущества Pinia:**

1. **TypeScript First** - нативная поддержка TypeScript
2. **DevTools** - отладка в браузере
3. **Modular** - модульная архитектура
4. **Lightweight** - легковесная библиотека
5. **Vue 3 Native** - оптимизирована для Vue 3

### **📋 Паттерны использования:**

#### **Store per Feature:**

```typescript
// stores/user.ts - управление пользователями
// stores/todo.ts - управление задачами
// stores/auth.ts - управление аутентификацией
```

#### **Composition API Style:**

```typescript
export const useStore = defineStore('main', () => {
  // Composition API синтаксис
  const state = ref({})
  const actions = () => {}
  return { state, actions }
})
```

#### **Options API Style:**

```typescript
export const useStore = defineStore('main', {
  state: () => ({}),
  actions: {},
  getters: {},
})
```

### **🔄 Жизненный цикл Store:**

1. **Creation** - создание при инициализации
2. **Usage** - использование в компонентах
3. **Updates** - обновление состояния
4. **Cleanup** - автоматическая очистка при размонтировании

### **✅ Best Practices:**

#### **Naming Convention:**

```typescript
// ✅ Правильно
export const useUserStore = defineStore('user', () => {})
export const useTodoStore = defineStore('todo', () => {})

// ❌ Неправильно
export const store = defineStore('user', () => {})
export const userStore = defineStore('user', () => {})
```

#### **File Structure:**

```
stores/
├── user.ts      # User store
├── todo.ts      # Todo store
└── index.ts     # Re-exports
```

#### **Export Pattern:**

```typescript
// Экспортируем только store
export { useUserStore } from './user'
export { useTodoStore } from './todo'
```

### **🐛 Debugging & DevTools:**

#### **Vue DevTools:**

- **Pinia Tab** - просмотр всех stores
- **State Inspection** - инспекция состояния
- **Time Travel** - путешествие по времени изменений
- **Actions** - выполнение действий

#### **Console Logging:**

```typescript
// Добавляем логи для отладки
const fetchTodos = async () => {
  console.log('📋 Fetching todos...')
  // ... логика
  console.log('✅ Todos loaded:', todos.value.length)
}
```

### **🎯 Готовый ответ для интервью:**

> **"Pinia - это официальная библиотека для управления состоянием в Vue 3. В нашем проекте мы используем её для централизованного управления данными пользователей и задач. Store состоит из state (реактивные данные), getters (вычисляемые свойства) и actions (методы для изменения состояния). Это позволяет избежать props drilling, обеспечить реактивность и типобезопасность. Pinia интегрируется с Vue DevTools для удобной отладки."**

### **🌍 Реальные примеры использования:**

#### **E-commerce:**

```typescript
// stores/cart.ts
const cart = ref<CartItem[]>([])
const addToCart = (item: Product) => {
  /* логика */
}
const totalPrice = computed(() => {
  /* вычисление */
})
```

#### **Dashboard:**

```typescript
// stores/dashboard.ts
const metrics = ref<Metrics>({})
const fetchMetrics = async () => {
  /* API вызов */
}
const isLoading = ref(false)
```

## 🔐 **Authentication System**

### **📋 Login Flow:**

1. **Form Validation** - проверка username и phone
2. **API Call** - запрос к `https://jsonplaceholder.typicode.com/users`
3. **User Search** - поиск пользователя по credentials
4. **Success/Error** - редирект или показ ошибки
5. **State Update** - сохранение пользователя в Pinia store

### **🔍 Validation Rules:**

- **Username**: буквы, цифры, пробелы, дефисы, апострофы
- **Phone**: цифры, пробелы, дефисы, скобки, плюсы, x для расширений
- **Case Insensitive**: username не чувствителен к регистру

### **🔄 State Persistence:**

- **Pinia Store** - активная сессия
- **Local Storage** - избранные задачи
- **Route Guards** - защита приватных маршрутов

## 🎨 **UI/UX Features**

### **🎭 Visual Design:**

- **Glassmorphism** - полупрозрачные элементы с blur эффектом
- **Gradient Backgrounds** - красивые градиенты
- **Smooth Animations** - плавные переходы и hover эффекты
- **Responsive Grid** - адаптивная сетка для карточек

### **📱 Mobile Experience:**

- **Touch Friendly** - удобные размеры для пальцев
- **Responsive Layout** - адаптация под все экраны
- **Mobile Navigation** - оптимизированная навигация
- **Performance** - быстрая загрузка на мобильных

### **♿ Accessibility:**

- **Semantic HTML** - семантическая разметка
- **ARIA Labels** - атрибуты доступности
- **Keyboard Navigation** - навигация с клавиатуры
- **Reduced Motion** - поддержка prefers-reduced-motion

## 🧪 **Testing Strategy**

### **📊 Test Coverage:**

- **Unit Tests** - Vitest для компонентов и логики
- **Component Tests** - тестирование Vue компонентов
- **Store Tests** - тестирование Pinia stores
- **Utility Tests** - тестирование утилит

### **🔧 Test Setup:**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

## 🚀 **Performance Optimizations**

### **⚡ Code Splitting:**

- **Route-based** - разделение по маршрутам
- **Component-based** - ленивая загрузка компонентов
- **Tree Shaking** - удаление неиспользуемого кода

### **🔄 Reactivity Optimization:**

- **Computed Properties** - кэширование вычислений
- **Ref vs Reactive** - правильный выбор реактивности
- **Shallow Ref** - для больших объектов

### **📦 Bundle Optimization:**

- **Vite** - быстрая сборка
- **SCSS** - модульные стили
- **TypeScript** - строгая типизация

## 🔮 **Future Enhancements**

### **📈 Planned Features:**

- **Real-time Updates** - WebSocket интеграция
- **Offline Support** - Service Worker
- **Data Export** - экспорт в CSV/PDF
- **Advanced Analytics** - детальная статистика
- **Team Collaboration** - совместная работа

### **🛠️ Technical Improvements:**

- **PWA Support** - Progressive Web App
- **Micro-frontends** - модульная архитектура
- **Performance Monitoring** - метрики производительности
- **Error Tracking** - отслеживание ошибок

## 📚 **Learning Resources**

### **🎯 Vue 3:**

- [Vue 3 Documentation](https://vuejs.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Support](https://vuejs.org/guide/typescript/overview.html)

### **🗂️ Pinia:**

- [Pinia Documentation](https://pinia.vuejs.org/)
- [State Management](https://vuejs.org/guide/scaling-up/state-management.html)
- [DevTools Integration](https://pinia.vuejs.org/cookbook/devtools.html)

### **🎨 SCSS:**

- [Sass Documentation](https://sass-lang.com/)
- [BEM Methodology](https://en.bem.info/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### **🔧 Vite:**

- [Vite Documentation](https://vitejs.dev/)
- [Build Optimization](https://vitejs.dev/guide/build.html)
- [Plugin Development](https://vitejs.dev/guide/api-plugin.html)

---

## 🎉 **Conclusion**

Этот проект демонстрирует современный подход к разработке Vue 3 приложений с использованием лучших практик:

- **Modular Architecture** - модульная архитектура
- **Type Safety** - типобезопасность с TypeScript
- **State Management** - управление состоянием с Pinia
- **Responsive Design** - адаптивный дизайн
- **Performance** - оптимизация производительности
- **Testing** - стратегия тестирования
- **Best Practices** - современные практики разработки

Проект готов для production и может служить основой для более сложных приложений! 🚀
