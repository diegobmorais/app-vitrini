import { ref, computed } from 'vue'

export function usePaginationStore(getList, searchKey = 'name') { 
  const search = ref('')
  const page = ref(1)
  const perPage = 10

  const filtered = computed(() => {
    const items = getList() || []
    return items.filter(item =>
      item && item[searchKey] &&
      item[searchKey].toLowerCase().includes(search.value.toLowerCase())
    )
  })

  const paginated = computed(() => {
    const start = (page.value - 1) * perPage
    const end = start + perPage
    return filtered.value.slice(start, end)
  })

  const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))

  return {
    search,
    page,
    perPage,


    filtered,
    paginated,
    totalPages
  }
}