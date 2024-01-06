import { useMutation } from "@tanstack/react-query";
import { postReq } from "../../utils/api/api";

const CreateGroupChat = () => {
  const mutation = useMutation({
    mutationKey: ["createGroupChat"],
    mutationFn: (formData) => postReq("/room/group", formData),
  });
  return mutation;
};

export default CreateGroupChat;
