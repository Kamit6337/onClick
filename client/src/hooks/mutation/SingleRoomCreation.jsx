import { useMutation } from "@tanstack/react-query";
import { postReq } from "../../utils/api/api";

const SingleRoomCreation = () => {
  const mutation = useMutation({
    mutationKey: ["createSingleRoom"],
    mutationFn: (id) => postReq("/room/single", { id }),
    retry: 3,
  });

  return mutation;
};

export default SingleRoomCreation;
