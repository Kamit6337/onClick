import { useMutation } from "@tanstack/react-query";
import { postReq } from "../../utils/api/api";

const SendChatFile = ({ fileType }) => {
  if (!fileType) {
    throw new Error("Filetype is not provided");
  }

  const mutation = useMutation({
    mutationKey: ["sendChatImage", fileType],
    mutationFn: (formData) => postReq(`/chat/${fileType}`, formData),
  });

  return mutation;
};

export default SendChatFile;
