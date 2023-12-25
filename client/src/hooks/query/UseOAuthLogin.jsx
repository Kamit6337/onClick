import { useQuery } from "@tanstack/react-query";
import { getAuthReq } from "../../utils/api/authApi";

const UseOAuthLogin = () => {
  const query = useQuery({
    queryKey: ["OAuthLogin"],
    queryFn: async () => await getAuthReq("/login/OAuth"),
  });
  return query;
};

export default UseOAuthLogin;
