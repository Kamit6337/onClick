/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import UseContinuousCheck from "../../../hooks/query/UseContinuousCheck";
import { useForm } from "react-hook-form";
import UseAllUser from "../../../hooks/query/UseAllUser";
import UseSingleRoomCreation from "../../../hooks/mutation/UseSingleRoomCreation";
import UseUserRooms from "../../../hooks/query/UseUserRooms";

const Header = () => {
  const divRef = useRef(null);
  const { data: user } = UseContinuousCheck(true);
  const { data: users } = UseAllUser(true);
  const [searchUsers, setSearchUsers] = useState([]);
  const { refetch } = UseUserRooms(true);

  const { mutate, isSuccess } = UseSingleRoomCreation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  const { register, reset } = useForm({
    defaultValues: {
      searchName: "",
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        // Clicked outside the div, hide the div
        reset({ searchName: "" });
        setSearchUsers([]);
      }
    };
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [reset]);

  const handleSearch = (e) => {
    const { value } = e.target;
    if (!value) {
      setSearchUsers([]);
      return;
    }

    const findUsers = users?.data.filter((user) => {
      return user.name.toLowerCase().startsWith(value.toLowerCase());
    });

    setSearchUsers(findUsers);
  };

  const createRoom = (id) => {
    setSearchUsers([]);
    mutate(id);
  };

  return (
    <header className="w-full h-14 border-b border-color_2 flex justify-between items-center">
      {/* WORK: SEARCH DIV */}
      <div className="relative w-72  flex justify-center items-center px-4">
        <input
          type="text"
          {...register("searchName", {
            pattern: /^[A-Za-z]+$/i,
          })}
          spellCheck="false"
          autoCorrect="off"
          autoComplete="off"
          onChange={handleSearch}
          placeholder="Search User"
          className="text-color_1 border border-color_2 rounded-3xl p-1 pl-4 w-full"
        />

        {/* WORK: SEARCHED USERS */}
        <div className="absolute top-full mt-1 left-0 w-full z-50 px-4">
          <div className="bg-color_2 rounded-lg" ref={divRef}>
            {searchUsers.length > 0 &&
              searchUsers.map((user, i) => {
                const { id, name, email, photo } = user;

                return (
                  <div
                    key={i}
                    className={`w-full p-3 px-4 flex gap-6 items-center cursor-pointer hover:bg-color_3 hover:text-color_1 first:hover:rounded-t-lg last:hover:rounded-b-lg`}
                    onClick={() => createRoom(id)}
                  >
                    <div className="w-9">
                      <img
                        src={photo}
                        alt="profile"
                        className="w-full rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div>{name}</div>
                      <div className="text-xs">{email}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* WORK: LOGO DIV */}
      <div>onClick</div>

      {/* WORK: PROFILE DIV */}
      <div className="flex items-center gap-2 pr-10 cursor-pointer">
        <img src={user?.photo} alt="profile" className="w-8 h-8 rounded-full" />
        <p>{user?.name.split(" ")[0]}</p>
      </div>
    </header>
  );
};

export default Header;
