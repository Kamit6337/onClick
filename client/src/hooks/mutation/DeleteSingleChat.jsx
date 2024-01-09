import { useMutation } from "@tanstack/react-query";
import { deleteReq } from "../../utils/api/api";

const DeleteSingleChat = (para) => {
  const mutation = useMutation({
    mutationKey: ["deleteSingleChat", para],
    mutationFn: (id) => deleteReq("/room/single", { id }),
  });

  return mutation;
};

export default DeleteSingleChat;
