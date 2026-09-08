"use client";

import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={3}
    />
  );
}
