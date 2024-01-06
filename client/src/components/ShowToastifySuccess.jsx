import { useEffect } from "react";
import Toastify from "../lib/Toastify";

const ShowToastifySuccess = ({
  isSuccess = false,
  message = "Successful",
  time = 1000,
}) => {
  const { ToastContainer, showSuccessMessage } = Toastify();

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message, time });
    }
  }, [isSuccess, message, showSuccessMessage, time]);

  return { ToastContainer };
};

export default ShowToastifySuccess;
