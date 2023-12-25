import { useMutation } from "@tanstack/react-query";
import { postReq } from "../../utils/api/api";

const UseSingleRoomCreation = () => {
  const mutation = useMutation({
    mutationKey: ["createSingleRoom"],
    mutationFn: (id) => postReq("/room", { id }),
    retry: 3,
  });

  return mutation;
};

export default UseSingleRoomCreation;
