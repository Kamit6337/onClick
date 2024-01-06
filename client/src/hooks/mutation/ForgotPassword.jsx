import { useMutation } from "@tanstack/react-query";
import { postAuthReq } from "../../utils/api/authApi";

const ForgotPassword = () => {
  const mutation = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: (data) => postAuthReq("/forgot", { email: data }),
  });

  return mutation;
};

export default ForgotPassword;
