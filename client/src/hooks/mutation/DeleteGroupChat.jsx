import { useMutation } from "@tanstack/react-query";
import { deleteReq } from "../../utils/api/api";

const DeleteGroupChat = (para) => {
  const mutation = useMutation({
    mutationKey: ["deleteSingleChat", para],
    mutationFn: (id) => deleteReq("/room/group", { id }),
  });

  return mutation;
};

export default DeleteGroupChat;
