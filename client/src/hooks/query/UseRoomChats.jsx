import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const UseRoomChats = ({ toggle = false, id, page = 1 }) => {
  const query = useQuery({
    queryKey: ["roomChats", id, page],
    queryFn: () => getReq("/chat", { id }),
    staleTime: 5 * 60 * 1000,
    enabled: toggle,
  });

  return query;
};

export default UseRoomChats;
