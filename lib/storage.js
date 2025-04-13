export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("LocalStorage save error:", error)
  }
}

export const loadData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch (error) {
    console.error("LocalStorage load error:", error)
    return []
  }
}
