import { useQuery } from "@tanstack/react-query";
import { getAuthReq } from "../../utils/api/authApi";

const UseContinuousCheck = (loggedIn = false) => {
  const query = useQuery({
    queryKey: ["continuousCheck"],
    queryFn: () => getAuthReq("/login/check"),
    enabled: loggedIn,
    staleTime: Infinity,
    // refetchInterval: 5 * 60 * 1000,
  });
  return query;
};

export default UseContinuousCheck;
