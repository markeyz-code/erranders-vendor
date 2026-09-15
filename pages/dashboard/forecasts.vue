<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Demand Forecasting</h1>
    <p class="text-gray-600 mb-8">View upcoming automated orders to prepare ingredients and manage staff.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-5 rounded-lg border shadow-sm text-center">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Subscribed Orders</h3>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalUpcomingOrders }}</p>
      </div>
      <div class="bg-white p-5 rounded-lg border shadow-sm text-center">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Guaranteed Weekly Revenue</h3>
        <p class="text-3xl font-bold text-primary mt-2">₦ {{ totalExpectedRevenue.toLocaleString() }}</p>
      </div>
    </div>

    <div class="bg-white border rounded-lg overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b">
            <th class="py-3 px-4 text-sm font-medium text-gray-700">Day</th>
            <th class="py-3 px-4 text-sm font-medium text-gray-700">Expected Orders</th>
            <th class="py-3 px-4 text-sm font-medium text-gray-700">Expected Revenue</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="loading">
            <td colspan="3" class="py-8 text-center text-gray-500">Loading forecasts...</td>
          </tr>
          <tr v-else-if="forecasts.length === 0">
            <td colspan="3" class="py-8 text-center text-gray-500">No upcoming recurring orders.</td>
          </tr>
          <tr v-for="forecast in forecasts" :key="forecast._id" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-medium capitalize">{{ forecast._id }}</td>
            <td class="py-3 px-4">{{ forecast.expectedOrders }}</td>
            <td class="py-3 px-4">₦{{ forecast.expectedRevenue.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { orders_api } from '@/api_factory/modules/orders'

const forecasts = ref([])
const loading = ref(true)

const fetchForecasts = async () => {
  try {
    loading.value = true
    const res = await orders_api.getRecurringForecasts()
    forecasts.value = res.data
  } catch (error) {
    console.error('Failed to fetch vendor forecasts', error)
  } finally {
    loading.value = false
  }
}

// Simple computed properties based on the fetched aggregate data
const totalUpcomingOrders = computed(() => forecasts.value.reduce((acc, curr) => acc + curr.expectedOrders, 0))
const totalExpectedRevenue = computed(() => forecasts.value.reduce((acc, curr) => acc + curr.expectedRevenue, 0))

onMounted(() => {
  fetchForecasts()
})
</script>
