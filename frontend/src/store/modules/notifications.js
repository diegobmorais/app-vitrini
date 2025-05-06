const state = {
    notifications: [],
    nextId: 1,
  }
  
  const getters = {
    allNotifications: (state) => state.notifications,
    unreadCount: (state) => state.notifications.filter((notification) => !notification.read).length,
  }
  
  const actions = {
    addNotification({ commit }, notification) {
      // Default values
      const defaults = {
        type: "info",
        read: false,
        timeout: 5000, // Auto-dismiss after 5 seconds by default
        dismissible: true,
      }
  
      // Merge with defaults
      const newNotification = {
        ...defaults,
        ...notification,
        timestamp: new Date(),
      }
  
      commit("ADD_NOTIFICATION", newNotification)
  
      // Auto-dismiss if timeout is set
      if (newNotification.timeout > 0) {
        setTimeout(() => {
          commit("REMOVE_NOTIFICATION", newNotification.id)
        }, newNotification.timeout)
      }
  
      return newNotification.id
    },
  
    removeNotification({ commit }, id) {
      commit("REMOVE_NOTIFICATION", id)
    },
  
    markAsRead({ commit }, id) {
      commit("MARK_AS_READ", id)
    },
  
    markAllAsRead({ commit }) {
      commit("MARK_ALL_AS_READ")
    },
  
    clearAll({ commit }) {
      commit("CLEAR_ALL")
    },
  
    // Convenience methods for different notification types
    success({ dispatch }, message) {
      return dispatch("addNotification", {
        type: "success",
        message,
        icon: "check-circle",
      })
    },
  
    error({ dispatch }, message) {
      return dispatch("addNotification", {
        type: "error",
        message,
        icon: "alert-circle",
        timeout: 0, // Don't auto-dismiss errors
      })
    },
  
    warning({ dispatch }, message) {
      return dispatch("addNotification", {
        type: "warning",
        message,
        icon: "alert-triangle",
      })
    },
  
    info({ dispatch }, message) {
      return dispatch("addNotification", {
        type: "info",
        message,
        icon: "info",
      })
    },
  }
  
  const mutations = {
    ADD_NOTIFICATION(state, notification) {
      // Assign an ID
      notification.id = state.nextId++
      state.notifications.unshift(notification)
    },
  
    REMOVE_NOTIFICATION(state, id) {
      const index = state.notifications.findIndex((notification) => notification.id === id)
      if (index !== -1) {
        state.notifications.splice(index, 1)
      }
    },
  
    MARK_AS_READ(state, id) {
      const notification = state.notifications.find((notification) => notification.id === id)
      if (notification) {
        notification.read = true
      }
    },
  
    MARK_ALL_AS_READ(state) {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
  
    CLEAR_ALL(state) {
      state.notifications = []
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }
  