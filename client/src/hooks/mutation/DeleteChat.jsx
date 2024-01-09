import { useMutation } from "@tanstack/react-query";
import { deleteReq } from "../../utils/api/api";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteChatReducer,
  mutationState,
} from "../../redux/slice/mutationSlice";
import { useEffect } from "react";
import Toastify from "../../lib/Toastify";
import { deleteChatUpdateRoom } from "../../redux/slice/roomSlice";

const DeleteChat = () => {
  const { deleteChat } = useSelector(mutationState);
  const dispatch = useDispatch();
  const { ToastContainer, showSuccessMessage, showErrorMessage } = Toastify();

  const { mutate, reset, isSuccess, data, isError, error } = useMutation({
    mutationKey: ["deleteChat", deleteChat.data],
    mutationFn: (id) => deleteReq("/chat", { id }),
  });

  useEffect(() => {
    if (deleteChat.bool) {
      mutate(deleteChat.data);
      dispatch(deleteChatReducer({ bool: false, data: deleteChat.data }));
    }
  }, [deleteChat, mutate, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: data.message, time: 1000 });
      dispatch(deleteChatUpdateRoom(deleteChat.data));

      setTimeout(() => {
        reset();
      }, 1000);
    }
  }, [isSuccess, dispatch, deleteChat, data, showSuccessMessage, reset]);

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error.message, time: 3000 });

      setTimeout(() => {
        reset();
      }, 3000);
    }
  }, [isError, error, showErrorMessage, reset]);

  return (
    <>
      <ToastContainer />
    </>
  );
};

export default DeleteChat;
