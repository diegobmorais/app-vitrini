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

<script>
import AdminSidebar from '../../components/admin/AdminSidebar.vue';
import AdminHeader from '../../components/admin/AdminHeader.vue';
import NotificationsContainer from '../../components/ui/NotificationsContainer.vue';
import { mapState } from 'vuex';

export default {
    name: 'AdminLayout',
    components: {
        AdminSidebar,
        AdminHeader,
        NotificationsContainer
    },
    data() {
        return {
            sidebarOpen: true,
            currentUser: {
                name: 'admin@gmail.com',
                role: 'admin'
            }
        };
    },
    computed: {
        ...mapState({
            currentUser: state => state.auth.user
        })
    },
    methods: {
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        }
    },

    // created() {
    //   // Verificar se o usuário está autenticado e tem permissões de admin
    //   if (!this.$store.getters['auth/isAuthenticated'] || !this.$store.getters['auth/isAdmin']) {
    //     this.$router.push('/login');
    //   }

    //   // Ajustar sidebar para dispositivos móveis
    //   const handleResize = () => {
    //     if (window.innerWidth < 768) {
    //       this.sidebarOpen = false;
    //     } else {
    //       this.sidebarOpen = true;
    //     }
    //   };

    //   window.addEventListener('resize', handleResize);
    //   handleResize();

    //   // Remover event listener quando o componente for destruído
    //   this.$once('hook:beforeDestroy', () => {
    //     window.removeEventListener('resize', handleResize);
    //   });
    // }
};
</script>