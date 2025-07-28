import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const nextId = ref(1)

  // Getters
  const allNotifications = computed(() => notifications.value)
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  // Actions
  function addNotification(notification) {
    const defaults = {
      type: 'info',
      read: false,
      timeout: 5000, // 5s padrão para auto-dismiss
      dismissible: true,
    }

    const newNotification = {
      ...defaults,
      ...notification,
      id: nextId.value++,
      timestamp: new Date(),
    }

    notifications.value.unshift(newNotification)

    if (newNotification.timeout > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.timeout)
    }

    return newNotification.id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => (n.read = true))
  }

  function clearAll() {
    notifications.value = []
  }

  // Conveniência para tipos específicos
  function success(message) {
    return addNotification({
      type: 'success',
      message,
      icon: 'check-circle',
    })
  }

  function error(message) {
    return addNotification({
      type: 'error',
      message,
      icon: 'alert-circle',
      timeout: 0, // não auto fecha erros
    })
  }

  function warning(message) {
    return addNotification({
      type: 'warning',
      message,
      icon: 'alert-triangle',
    })
  }

  function info(message) {
    return addNotification({
      type: 'info',
      message,
      icon: 'info',
    })
  }

  return {
    notifications,
    nextId,

    allNotifications,
    unreadCount,

    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,

    success,
    error,
    warning,
    info,
  }
})
