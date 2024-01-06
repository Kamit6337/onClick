import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toastify = () => {
  const showErrorMessage = ({
    message,
    time = 3000,
    position = "top-right",
  } = {}) => {
    toast.error(message || "Somethings went Wrong !", {
      autoClose: time,
      position: position,
    });
  };

  const showSuccessMessage = ({
    message,
    time = 3000,
    position = "top-right",
  } = {}) => {
    toast.success(message || "Somethings went Wrong !", {
      position: position,
      autoClose: time,
    });
  };

  const showAlertMessage = ({
    message,
    time = 3000,
    position = "top-right",
  } = {}) => {
    toast.warn(message || "Somethings went Wrong !", {
      position: position,
      autoClose: time,
    });
  };

  return {
    ToastContainer,
    showErrorMessage,
    showSuccessMessage,
    showAlertMessage,
  };
};

export default Toastify;
