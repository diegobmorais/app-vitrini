<template>
    <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="['tab-button', { active: activeTab === tab.id }]"
            @click="setActiveTab(tab.id)">
            {{ tab.label }}
        </button>
    </div>
</template>

<script setup>
defineProps({
    tabs: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:activeTab'])

// const props = defineProps(['activeTab'])

const setActiveTab = (id) => {
    emit('update:activeTab', id)
}
</script>

<style scoped>
.tabs {
    display: flex;
    gap: 1px;
    background: #f1f1f1;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.tab-button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #555;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.tab-button:hover {
    background: #e9e9e9;
}

.tab-button.active {
    background: #007bff;
    color: white;
    font-weight: 600;
}
</style>