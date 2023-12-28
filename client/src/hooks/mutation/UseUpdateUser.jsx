import { useMutation } from "@tanstack/react-query";
import { patchReq } from "../../utils/api/api";

const UseUpdateUser = (photo = false) => {
  const mutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (data) => patchReq(photo ? "/user/photo" : "/user", data),
  });
  return mutation;
};

export default UseUpdateUser;
