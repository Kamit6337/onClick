import { useEffect } from "react";
import Toastify from "../lib/Toastify";

const ShowToastifyError = ({ isError = false, error = null, time = 1000 }) => {
  const { ToastContainer, showErrorMessage } = Toastify();

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error?.message, time });
    }
  }, [isError, error, showErrorMessage, time]);

  return { ToastContainer };
};

export default ShowToastifyError;
