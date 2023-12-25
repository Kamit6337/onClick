import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const UseUserRooms = (isSuccess = false) => {
  const query = useQuery({
    queryKey: ["fetchRooms"],
    queryFn: () => getReq("/room"),
    enabled: isSuccess,
    staleTime: Infinity,
  });

  return query;
};

export default UseUserRooms;
