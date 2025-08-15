<template>
  <main class="home" role="main">
    <!-- Header with user profile -->
    <header class="home__header">
      <div class="home__header-content">
        <div class="home__header-left">
          <h1 class="home__title">Todo App</h1>
          <p class="home__subtitle">Manage your tasks efficiently</p>
        </div>

        <!-- Compact user profile -->
        <div v-if="isAuthenticated && currentUser" class="home__user-profile">
          <div class="home__user-info" @click="toggleProfileMenu">
            <div class="home__user-avatar">
              {{ currentUser.name.charAt(0).toUpperCase() }}
            </div>
            <div class="home__user-details">
              <span class="home__user-name">{{ currentUser.name }}</span>
              <span class="home__user-username">@{{ currentUser.username }}</span>
            </div>
            <button @click.stop="toggleProfileMenu" class="home__profile-toggle">
              {{ isProfileMenuOpen ? '▲' : '▼' }}
            </button>
          </div>

          <!-- Profile dropdown menu -->
          <div v-if="isProfileMenuOpen" class="home__profile-menu">
            <!-- Basic Information -->
            <div class="home__profile-section">
              <h4 class="home__profile-section-title">Basic Info</h4>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Email:</span>
                <span class="home__profile-value">{{ currentUser.email }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Phone:</span>
                <span class="home__profile-value">{{ currentUser.phone }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Website:</span>
                <span class="home__profile-value">
                  <a
                    :href="'https://' + currentUser.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="home__profile-link"
                  >
                    {{ currentUser.website }}
                  </a>
                </span>
              </div>
            </div>

            <!-- Address Information -->
            <div class="home__profile-section">
              <h4 class="home__profile-section-title">Address</h4>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Street:</span>
                <span class="home__profile-value">{{ currentUser.address.street }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Suite:</span>
                <span class="home__profile-value">{{ currentUser.address.suite }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">City:</span>
                <span class="home__profile-value">{{ currentUser.address.city }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Zipcode:</span>
                <span class="home__profile-value">{{ currentUser.address.zipcode }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Coordinates:</span>
                <span class="home__profile-value">
                  {{ currentUser.address.geo.lat }}, {{ currentUser.address.geo.lng }}
                </span>
              </div>
            </div>

            <!-- Company Information -->
            <div class="home__profile-section">
              <h4 class="home__profile-section-title">Company</h4>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Name:</span>
                <span class="home__profile-value">{{ currentUser.company.name }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Catch Phrase:</span>
                <span class="home__profile-value">{{ currentUser.company.catchPhrase }}</span>
              </div>
              <div class="home__profile-menu-item">
                <span class="home__profile-label">Business:</span>
                <span class="home__profile-value">{{ currentUser.company.bs }}</span>
              </div>
            </div>

            <div class="home__profile-actions">
              <button @click="handleLogout" class="home__logout-button">Logout</button>
            </div>
          </div>
        </div>

        <div v-else class="home__login-prompt">
          <router-link to="/login" class="home__login-link"> Sign In </router-link>
        </div>
      </div>
    </header>

    <section class="home__main-content">
      <div class="home__content-container">
        <TodoList />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// HomePage component - displays user profile and main content
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuth } from '@/composables/useAuth'
import { ROUTE_PATHS } from '@/constants/app'
import TodoList from '@/components/TodoList.vue'

const router = useRouter()
const userStore = useUserStore()
const { logout, initializeAuth } = useAuth()

// Get user data from store
const currentUser = computed(() => userStore.getUser)
const isAuthenticated = computed(() => userStore.getIsAuthenticated)

// Profile menu state
const isProfileMenuOpen = ref(false)

// Initialize authentication on component mount
onMounted(() => {
  console.log('🏠 Home component mounted, checking authentication...')
  initializeAuth()
})

// Toggle profile menu
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

// Handle logout
const handleLogout = () => {
  logout()
  isProfileMenuOpen.value = false
  router.push(ROUTE_PATHS.LOGIN)
}
</script>

<style scoped lang="scss">
@use '../styles/variables/colors' as colors;
@use '../styles/variables/spacing' as spacing;

.home {
  min-height: 100vh;
  background: linear-gradient(135deg, colors.$primary-color, colors.$secondary-color);

  &__header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: spacing.$medium spacing.$large;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  &__header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  &__header-left {
    flex: 1;
  }

  &__title {
    font-size: 1.8rem;
    font-weight: 700;
    color: colors.$white;
    margin: 0 0 spacing.$small 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &__subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  // Compact user profile (max 15% of screen)
  &__user-profile {
    width: 15%;
    min-width: 200px;
    max-width: 250px;
    position: relative;
    z-index: 1000;
  }

  &__user-info {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: spacing.$small;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &__user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: colors.$white;
    font-size: 0.9rem;
    margin-right: spacing.$small;
    flex-shrink: 0;
  }

  &__user-details {
    flex: 1;
    min-width: 0;
  }

  &__user-name {
    display: block;
    font-weight: 600;
    color: colors.$white;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__user-username {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__profile-toggle {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    cursor: pointer;
    padding: 2px;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &:hover {
      color: colors.$white;
    }
  }

  // Profile dropdown menu
  &__profile-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 320px;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    padding: spacing.$medium;
    margin-top: spacing.$small;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  &__profile-section {
    margin-bottom: spacing.$medium;
    padding-bottom: spacing.$medium;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__profile-section-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: colors.$white;
    margin-bottom: spacing.$small;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;

    // Mobile adjustments
    @media (max-width: 479px) {
      font-size: 0.8rem;
    }
  }

  &__profile-menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: spacing.$small 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }
  }

  &__profile-label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
    min-width: 60px;

    // Mobile adjustments
    @media (max-width: 479px) {
      font-size: 0.75rem;
      min-width: 50px;
    }
  }

  &__profile-value {
    color: colors.$white;
    font-size: 0.8rem;
    text-align: right;
    flex: 1;
    margin-left: spacing.$small;
    word-break: break-word;

    // Mobile adjustments
    @media (max-width: 479px) {
      font-size: 0.75rem;
      margin-left: spacing.$small;
    }
  }

  &__profile-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: colors.$white;
      text-decoration: underline;
    }
  }

  &__profile-actions {
    margin-top: spacing.$medium;
    text-align: center;
  }

  &__logout-button {
    background: rgba(220, 53, 69, 0.8);
    color: colors.$white;
    border: none;
    padding: spacing.$small spacing.$medium;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;

    &:hover {
      background: rgba(220, 53, 69, 1);
    }
  }

  &__login-prompt {
    width: 15%;
    min-width: 200px;
    max-width: 250px;
  }

  &__login-link {
    display: inline-block;
    color: colors.$white;
    text-decoration: none;
    font-weight: 600;
    padding: spacing.$small spacing.$medium;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  // Main content
  &__main-content {
    flex: 1;
    padding: spacing.$large;
  }

  &__content-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  &__placeholder-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: spacing.$large;
    text-align: center;
    color: colors.$white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    h3 {
      font-size: 1.3rem;
      margin-bottom: spacing.$medium;
      font-weight: 600;
    }

    p {
      opacity: 0.8;
      margin: 0;
    }
  }
}
</style>
