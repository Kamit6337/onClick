import { useMutation } from "@tanstack/react-query";
import { patchReq } from "../../utils/api/api";

const UpdateGroupChat = (para) => {
  const mutation = useMutation({
    mutationKey: ["updateGroup", para],
    mutationFn: (formData) => patchReq("/room/group", formData),
  });

  return mutation;
};

export default UpdateGroupChat;
