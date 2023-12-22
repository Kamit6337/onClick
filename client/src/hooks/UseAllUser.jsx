import { useQuery } from "@tanstack/react-query";
import { getReq } from "../utils/api/api";

const UseAllUser = (isSuccess = false) => {
  const allUser = useQuery({
    queryKey: ["allUser"],
    queryFn: () => getReq("/user/all"),
    staleTime: Infinity,
    enabled: isSuccess,
  });

  return allUser;
};

export default UseAllUser;
