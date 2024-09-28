import React from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
  ToastType,
} from "react-native-toast-message";

// Define custom styles for dark theme with the appropriate type
export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4caf50", backgroundColor: "#333" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
      }}
      text2Style={{
        fontSize: 13,
        color: "#ddd",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#f44336", backgroundColor: "#333" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
      }}
      text2Style={{
        fontSize: 13,
        color: "#ddd",
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#2196f3", backgroundColor: "#333" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
      }}
      text2Style={{
        fontSize: 13,
        color: "#ddd",
      }}
    />
  ),
};

export const showToast = ({
  type,
  title,
  description,
}: {
  type: ToastType;
  title: string;
  description: string;
}) => {
  Toast.show({
    type: type, // 'success', 'error', or 'info'
    text1: title,
    text2: description,
    position: "bottom",
  });
};
