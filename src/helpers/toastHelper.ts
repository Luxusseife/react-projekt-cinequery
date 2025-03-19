import { toast } from 'react-toastify';

// Konfigurering av toast-meddelande.
export const defaultOptions = {
  position: "top-center" as const,
  autoClose: 3000,
  pauseOnHover: true,
  style: {
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "20px",
    padding: "1rem",
  },
};

// Exporterar bekräftelse-toast.
export const showSuccessToast = (message: string, onClose?: () => void) => {
  toast.success(message, {
    ...defaultOptions,
    onClose,
  });
};

// Exporterar fel-toast.
export const showErrorToast = (message: string, onClose?: () => void) => {
  toast.error(message, {
    ...defaultOptions,
    onClose,
  });
};