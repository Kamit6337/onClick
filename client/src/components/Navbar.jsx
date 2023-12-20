import UseCacheData from "../hooks/useCacheData";

const Navbar = () => {
  const signupData = UseCacheData(["signup"]);
  const loginData = UseCacheData(["login"]);

  const data = loginData || signupData;

  return <div>Navbar</div>;
};

export default Navbar;
