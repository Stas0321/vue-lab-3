<template>
  <div class="users-container">
    <h2>Список користувачів</h2>

    <!-- Панель інструментів (Toolbar) -->
    <div class="toolbar">
      <!-- Фільтр за статтю -->
      <div class="filter-group">
        <span>Стать:</span>
        <button
          :class="{ active: genderFilter === 'all' }"
          @click="genderFilter = 'all'"
        >
          Всі
        </button>
        <button
          :class="{ active: genderFilter === 'male' }"
          @click="genderFilter = 'male'"
        >
          Чоловіки
        </button>
        <button
          :class="{ active: genderFilter === 'female' }"
          @click="genderFilter = 'female'"
        >
          Жінки
        </button>
      </div>

      <!-- Фільтр за віком 18+ -->
      <div class="filter-group">
        <span>Вік:</span>
        <button
          :class="{ active: ageFilter === 'all' }"
          @click="ageFilter = 'all'"
        >
          Всі
        </button>
        <button
          :class="{ active: ageFilter === '18+' }"
          @click="ageFilter = '18+'"
        >
          18 +
        </button>
      </div>

      <!-- Сортування -->
      <div class="filter-group">
        <span>Сортування:</span>
        <button
          :class="{ active: sortBy === 'name' && sortOrder === 'asc' }"
          @click="setSort('name', 'asc')"
        >
          Ім'я &#8593;
        </button>
        <button
          :class="{ active: sortBy === 'name' && sortOrder === 'desc' }"
          @click="setSort('name', 'desc')"
        >
          Ім'я &#8595;
        </button>
        <button
          :class="{ active: sortBy === 'age' && sortOrder === 'asc' }"
          @click="setSort('age', 'asc')"
        >
          Вік &#8593;
        </button>
        <button
          :class="{ active: sortBy === 'age' && sortOrder === 'desc' }"
          @click="setSort('age', 'desc')"
        >
          Вік &#8595;
        </button>
      </div>

      <!-- Скидання -->
      <button class="reset-btn" @click="resetFilters">Очистити все</button>
    </div>

    <!-- Перевірка порожнього списку -->
    <div v-if="filteredAndSortedUsers.length === 0" class="empty-message">
      Список юзерів пустий
    </div>

    <!-- Картки користувачів -->
    <div v-else class="users-list">
      <div
        v-for="user in filteredAndSortedUsers"
        :key="user.id"
        class="user-card"
        :class="getAgeClass(user.dob.age)"
      >
        <!-- Динамічна прив'язка src та alt за допомогою v-bind -->
        <img
          :src="user.picture"
          :alt="`${user.name.first} ${user.name.last}`"
          class="user-avatar"
        />

        <h3>{{ user.name.first }} {{ user.name.last }}</h3>
        <p><strong>Стать:</strong> {{ user.gender === 'male' ? 'Чоловік' : 'Жінка' }}</p>
        <p><strong>Локація:</strong> {{ user.location }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Телефон:</strong> {{ user.phone }}</p>

        <!-- Директива v-if: відображення віку тільки якщо > 18 -->
        <p v-if="user.dob.age > 18">
          <strong>Вік:</strong> {{ user.dob.age }} років
        </p>

        <!-- Директива v-for: список хобі -->
        <div class="hobbies-section">
          <strong>Хобі:</strong>
          <ul>
            <li v-for="(hobby, index) in user.hobbies" :key="index">
              {{ hobby }}
            </li>
          </ul>
        </div>

        <!-- Переключення v-show для детальної інформації -->
        <button class="toggle-btn" @click="toggleDetails(user.id)">
          {{ visibleDetails[user.id] ? 'Приховати деталі' : 'Показати деталі' }}
        </button>

        <!-- Директива v-show: додаткова інформація -->
        <p v-show="visibleDetails[user.id]" class="user-details">
          {{ user.details }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import usersData from '../data/users.json'

// Завантаження даних
const users = ref<User[]>(usersData as User[])

// Стан фільтрів і сортування
const genderFilter = ref<'all' | 'male' | 'female'>('all')
const ageFilter = ref<'all' | '18+'>('all')
const sortBy = ref<'none' | 'name' | 'age'>('none')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Стан видимості деталей (об'єкт ключ-значення: user.id -> boolean)
const visibleDetails = ref<Record<number, boolean>>({})

const toggleDetails = (id: number) => {
  visibleDetails.value[id] = !visibleDetails.value[id]
}

// Прив'язка стилів за віком
const getAgeClass = (age: number) => {
  return {
    minor: age < 18,
    young: age >= 18 && age <= 30,
    adult: age >= 31 && age <= 50,
    senior: age > 50,
  }
}

// Встановлення сортування
const setSort = (type: 'name' | 'age', order: 'asc' | 'desc') => {
  sortBy.value = type
  sortOrder.value = order
}

// Скидання фільтрів
const resetFilters = () => {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortBy.value = 'none'
  sortOrder.value = 'asc'
}

// Реактивно обчислюваний список (computed) з урахуванням фільтрів і сортування
const filteredAndSortedUsers = computed(() => {
  let result = [...users.value]

  // Фільтрація за статтю
  if (genderFilter.value !== 'all') {
    result = result.filter((u) => u.gender === genderFilter.value)
  }

  // Фільтрація за віком
  if (ageFilter.value === '18+') {
    result = result.filter((u) => u.dob.age >= 18)
  }

  // Сортування
  if (sortBy.value !== 'none') {
    result.sort((a, b) => {
      let valA: string | number = ''
      let valB: string | number = ''

      if (sortBy.value === 'name') {
        valA = `${a.name.first} ${a.name.last}`
        valB = `${b.name.first} ${b.name.last}`
      } else if (sortBy.value === 'age') {
        valA = a.dob.age
        valB = b.dob.age
      }

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})
</script>

<style scoped>
.users-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background-color: #f4f4f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #e2e2e2;
}

button.active {
  background-color: #42b883;
  color: white;
  border-color: #42b883;
}

.reset-btn {
  background-color: #ff5252;
  color: white;
  border: none;
  margin-left: auto;
}

.reset-btn:hover {
  background-color: #e04848;
}

.empty-message {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  padding: 40px;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px auto;
  border: 3px solid #eee;
}

/* Класи стилів у залежності від віку */
.minor {
  border-color: #ff9800; /* Помаранчевий - неповнолітні */
  background-color: #fffde7;
}

.young {
  border-color: #4caf50; /* Зелений - молодь */
  background-color: #f1f8e9;
}

.adult {
  border-color: #2196f3; /* Синій - дорослі */
  background-color: #e3f2fd;
}

.senior {
  border-color: #9c27b0; /* Фіолетовий - літні */
  background-color: #f3e5f5;
}

.toggle-btn {
  margin-top: auto;
  background-color: #35495e;
  color: white;
  border: none;
}

.user-details {
  margin-top: 10px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  font-style: italic;
  font-size: 0.9rem;
}
</style>