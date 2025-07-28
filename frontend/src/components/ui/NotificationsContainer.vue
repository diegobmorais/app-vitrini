<template>
  <div class="notifications-container" :class="{ 'notifications-expanded': expanded }">
    <div class="notifications-header" @click="toggleExpand">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span>Notificações</span>
      </div>
      <span class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
      <button class="clear-btn" v-if="notifications.length > 0" @click.stop="markAllAsRead">Limpar todas</button>
    </div>
    <transition-group name="notification-list" tag="div" class="notifications-list">
      <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{
        'unread': !notification.read,
        'notification-success': notification.type === 'success',
        'notification-error': notification.type === 'error',
        'notification-warning': notification.type === 'warning',
        'notification-info': notification.type === 'info'
      }" @click="readNotification(notification.id)">
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="notification-content">
          <div class="notification-title">
            {{ notification.title }}
          </div>
          <div class="notification-message">
            {{ notification.message }}
          </div>
          <div class="notification-time">
            {{ formatTime(notification.timestamp) }}
          </div>
        </div>
        <button class="notification-dismiss" @click.stop="removeNotification(notification.id)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div v-if="notifications.length === 0" key="empty" class="notification-empty">
        Sem novas notificações
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/store/modules/useNotificationStore'

const notificationsStore = useNotificationStore()
const expanded = ref(false)

// Computed state
const notifications = computed(() => notificationsStore.notifications)
const unreadCount = computed(() => notificationsStore.unreadCount)

// Methods
function toggleExpand() {
  expanded.value = !expanded.value
}

function readNotification(id) {
  notificationsStore.markAsRead(id)
}

function removeNotification(id) {
  notificationsStore.removeNotification(id)
}

function markAllAsRead() {
  notificationsStore.markAllAsRead()
}

function formatTime(timestamp) {
  const now = new Date()
  const notificationTime = new Date(timestamp)
  const diffMs = now - notificationTime

  if (diffMs < 60000) {
    return 'Agora mesmo'
  }

  if (diffMs < 3600000) {
    const minutes = Math.floor(diffMs / 60000)
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`
  }

  if (diffMs < 86400000) {
    const hours = Math.floor(diffMs / 3600000)
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`
  }

  const day = notificationTime.getDate().toString().padStart(2, '0')
  const month = (notificationTime.getMonth() + 1).toString().padStart(2, '0')
  const year = notificationTime.getFullYear()
  return `${day}/${month}/${year}`
}
</script>


<style scoped>
.notifications-container {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 350px;
  max-height: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  font-weight: 600;
  color: #343a40;
}

.notification-badge {
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
  margin-left: auto;
  margin-right: 8px;
}

.notifications-list {
  overflow-y: auto;
  max-height: 350px;
  transition: max-height 0.3s ease;
}

.notifications-container:not(.notifications-expanded) .notifications-list {
  max-height: 0;
}

.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-icon {
  margin-right: 12px;
  display: flex;
  align-items: flex-start;
}

.notification-success .notification-icon {
  color: #28a745;
}

.notification-error .notification-icon {
  color: #dc3545;
}

.notification-warning .notification-icon {
  color: #ffc107;
}

.notification-info .notification-icon {
  color: #17a2b8;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.notification-message {
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 0.75rem;
  color: #adb5bd;
}

.notification-dismiss {
  color: #adb5bd;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.notification-item:hover .notification-dismiss {
  opacity: 1;
}

.notification-dismiss:hover {
  color: #6c757d;
}

.notification-empty {
  padding: 24px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s;
}

.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.clear-btn {
  background: transparent;
  border: none;
  color: #6c757d;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px 8px;
}

.clear-btn:hover {
  text-decoration: underline;
  color: #495057;
}
</style>