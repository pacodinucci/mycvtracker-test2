import { showNotification } from "@mantine/notifications";
import { useContext, createContext, useCallback, ReactElement } from "react";

type ContextType = {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
};

const ToastContext = createContext<ContextType>({
  showSuccessToast: () => {},
  showErrorToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactElement }) => {
  const showSuccessToast = useCallback((message: string) => {
    showNotification({ title: "Success", message });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    showNotification({
      title: "Error",
      message,
      color: "red",
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
      <>{children}</>
    </ToastContext.Provider>
  );
};
