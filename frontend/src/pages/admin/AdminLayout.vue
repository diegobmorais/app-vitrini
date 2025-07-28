<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <admin-sidebar :is-open="sidebarOpen" @toggle="toggleSidebar" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Navigation -->
            <admin-header @toggle-sidebar="toggleSidebar" :user="currentUser" />

            <!-- Main Content Area -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                <router-view></router-view>
            </main>
        </div>

        <!-- Notifications -->
        <!-- <notifications-container /> -->
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import AdminHeader from '../../components/admin/AdminHeader.vue'
import { useAuthStore } from '@/store/modules/useAuthStore'

const sidebarOpen = ref(true)
const router = useRouter()
const authStore = useAuthStore()

// Computed do currentUser via store
const currentUser = authStore.user

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const handleResize = () => {
    sidebarOpen.value = window.innerWidth >= 768
}

onMounted(() => {
    console.log('isAuthenticated do useAuth', authStore.isAuthenticated);
    
    // Verifica autenticação e permissão admin
    // if (!authStore.isAuthenticated || !authStore.isAdmin) {
    //     router.push('/login')
    // }

    // Ajusta sidebar e adiciona listener resize
    handleResize()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>
