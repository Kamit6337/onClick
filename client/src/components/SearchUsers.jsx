/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import OnClickOutside from "../lib/onClickOutside";
import { useForm } from "react-hook-form";
import UseAllUser from "../hooks/query/UseAllUser";
import environment from "../utils/environment";
import UseSingleRoomCreation from "../hooks/mutation/SingleRoomCreation";
import Toastify from "../lib/Toastify";

const SearchUsers = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const { data: users } = UseAllUser(true);
  const { isError, error, mutate, isSuccess } = UseSingleRoomCreation();
  const { ToastContainer, showErrorMessage, showSuccessMessage } = Toastify();

  const { register, reset } = useForm({
    defaultValues: {
      searchName: "",
    },
  });

  const success = () => {
    reset({ searchName: "" });
    setSearchUsers([]);
  };

  const { ref: divRef } = OnClickOutside(success);

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error.message });
    }
  }, [isError, error, showErrorMessage]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Chat created" });
    }
  }, [isSuccess, showSuccessMessage]);

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

  const handleUser = (user) => {
    setSearchUsers([]);
    mutate(user._id);
  };

  return (
    <>
      <div className="relative w-full h-full flex justify-center items-center  ">
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

        {/* MARK: SEARCHED USERS */}
        <div className="absolute top-full mt-1 left-0 w-full z-50  bg-color_1">
          <div className="bg-color_2 rounded-lg" ref={divRef}>
            {searchUsers.length > 0 &&
              searchUsers.map((user, i) => {
                const { name, email, photo } = user;

                const userPhoto = `${environment.SERVER_URL}/${photo}`;

                return (
                  <div
                    key={i}
                    className={`w-full p-3 px-4 flex gap-6 items-center cursor-pointer hover:bg-color_3 hover:text-color_1 first:hover:rounded-t-lg last:hover:rounded-b-lg`}
                    onClick={() => handleUser(user)}
                  >
                    <div className="w-9">
                      <img
                        src={userPhoto}
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
      <ToastContainer />
    </>
  );
};

export default SearchUsers;
