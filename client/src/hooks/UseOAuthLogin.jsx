import { useQuery } from "@tanstack/react-query";
import { getAuthReq } from "../utils/api/authApi";

const UseOAuthLogin = (toggle = true) => {
  const query = useQuery({
    queryKey: ["OAuthLogin"],
    queryFn: async () => await getAuthReq("/login/OAuth"),
    enabled: toggle,
  });
  return query;
};

export default UseOAuthLogin;
