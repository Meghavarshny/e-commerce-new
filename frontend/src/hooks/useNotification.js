import { useState, useCallback } from "react";

export default function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const showSuccess = useCallback(
    (message) => showNotification(message, "success"),
    [showNotification],
  );
  const showError = useCallback(
    (message) => showNotification(message, "error"),
    [showNotification],
  );
  const warning = useCallback(
    (message) => showNotification(message, "warning"),
    [showNotification],
  );

  // Kept alias for backward compatibility if needed, though not strictly necessary if unused
  const showWarning = warning;

  const hideNotification = useCallback(() => setNotification(null), []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    hideNotification,
  };
}
