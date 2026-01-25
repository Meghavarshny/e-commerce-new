import { useState } from "react";

export default function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setNotification(null), 4000);
  };

  const showSuccess = (message) => showNotification(message, "success");
  const showError = (message) => showNotification(message, "error");
  const showWarning = (message) => showNotification(message, "warning");

  const hideNotification = () => setNotification(null);

  return { 
    notification, 
    showNotification, 
    showSuccess, 
    showError, 
    showWarning,
    hideNotification 
  };
}
