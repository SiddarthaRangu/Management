// Simple mock toast implementation
export const toast = {
  success: (message) => {
    console.log("Success:", message)
    alert(message)
  },
  error: (message) => {
    console.error("Error:", message)
    alert(message)
  },
}
