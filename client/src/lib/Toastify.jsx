import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toastify = () => {
  const showErrorMessage = ({ message, time = 5000 } = {}) => {
    toast.error(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: time,
    });
  };

  const showSuccessMessage = ({ message, time = 5000 } = {}) => {
    toast.success(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: time,
    });
  };

  const showAlertMessage = ({ message, time = 5000 } = {}) => {
    toast.warn(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
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
