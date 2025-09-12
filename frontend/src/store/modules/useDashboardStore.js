import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/main'

export const useDashboardStore = defineStore('dashboard', () => {

    // State
    const totalOrders = ref(0)
    const totalSales = ref(0)
    const totalCustomers = ref(0)
    const totalProducts = ref(0)
    const lowStockCount = ref(0)
    const loading = ref(false)
    const error = ref(null)
    const series = reactive([{ name: "Vendas", data: [] }]);
    const chartOptions = reactive({
        chart: { toolbar: { show: false } },
        xaxis: { categories: [] },
        yaxis: { labels: { formatter: val => `R$ ${val.toFixed(2)}` } },
        stroke: { curve: "smooth" },
    });

    //Actions
    async function fetchStats() {
        loading.value = true
        error.value = null
        try {
            const response = await api.get('api/dashboard/stats')
            totalOrders.value = response.data.totalOrders
            totalSales.value = response.data.totalSales
            totalCustomers.value = response.data.totalCustomers
            totalProducts.value = response.data.totalProducts
            lowStockCount.value = response.data.lowStockCount
        } catch (err) {
            error.value = err.message || 'Failed to fetch dashboard stats'
        } finally {
            loading.value = false
        }
    }

    async function fetchSalesData(period = '7D') {
        loading.value = true
        error.value = null
        try {
            const response = await api.get(`/api/dashboard/sales?period=${period}`)

            chartOptions.value = {
                chart: { toolbar: { show: false } }, 
                xaxis: {
                    categories: response.data.map(item => item.period)
                },
                yaxis: {
                    labels: { formatter: val => `R$ ${val.toFixed(2)}` }
                },
                stroke: { curve: "smooth" }
            }

            series.value = [{
                name: "Vendas",
                data: response.data.map(item => item.total_sales)
            }]
        } catch (err) {
            error.value = err.message || 'Failed to fetch sales data'
        } finally {
            loading.value = false
        }
    }

    return {
        totalOrders,
        totalSales,
        totalCustomers,
        totalProducts,
        lowStockCount,
        loading,
        error,
        series,
        chartOptions,

        fetchStats,
        fetchSalesData,
    }
})