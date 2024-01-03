/* eslint-disable react/prop-types */
import { useState } from "react";
import UseContinuousCheck from "../../../../hooks/query/UseContinuousCheck";
import UseSocket from "../../../../hooks/socket/UseSocket";
import UserProfile from "./components/UserProfile";
import SearchUsers from "../../../../components/SearchUsers";
import environment from "../../../../utils/environment";

const Header = () => {
  const [toggleUser, setToggleUser] = useState(false);
  const { data: user } = UseContinuousCheck(true);
  const { emit } = UseSocket();

  const undoUserToggle = () => {
    setToggleUser(false);
  };

  const userPhoto = `${environment.SERVER_URL}/${user?.photo}`;

  return (
    <>
      <header className="w-full h-full border-b border-color_2 flex justify-between items-center">
        {/* WORK: SEARCH DIV */}
        {/* <div className="w-72 px-4">
          <SearchUsers userSelected={createRoom} />
        </div> */}

        {/* WORK: LOGO DIV */}
        <div className="text-2xl font-bold tracking-wider">onClick</div>

        {/* WORK: PROFILE DIV */}
        <div
          className="flex items-center gap-2 pr-10 cursor-pointer"
          onClick={() => setToggleUser((prev) => !prev)}
        >
          <img
            src={userPhoto}
            alt="profile"
            loading="lazy"
            className="w-8 h-8 rounded-full"
          />
          <p>{user?.name.split(" ")[0]}</p>
        </div>
      </header>
      <UserProfile toggle={toggleUser} undoToggle={undoUserToggle} />
    </>
  );
};

export default Header;
