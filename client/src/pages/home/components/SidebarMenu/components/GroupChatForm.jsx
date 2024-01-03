/* eslint-disable react/prop-types */
import { useState } from "react";
import { Icons } from "../../../../../assets/icons";
import { Images } from "../../../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { toggleGroupChatForm } from "../../../../../redux/slice/toggleSlice";
import SearchFilterUsers from "../../../../../components/SearchFilterUsers";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import UseSocket from "../../../../../hooks/socket/UseSocket";
import { useForm } from "react-hook-form";
import UseUserRooms from "../../../../../hooks/query/UseUserRooms";
import environment from "../../../../../utils/environment";
import { roomsState } from "../../../../../redux/slice/roomSlice";

const GroupChatForm = ({ update = false }) => {
  const { emit } = UseSocket();
  const dispatch = useDispatch();
  const { data } = UseContinuousCheck(true);
  const { refetch } = UseUserRooms(true);
  const { activeRoomChats, activeRoomDetail } = useSelector(roomsState);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: update ? activeRoomDetail.name : "",
    },
  });

  const [list, setList] = useState(() => {
    if (!update) {
      return [data];
    }
  });
  const [removeUser, setRemoveUser] = useState(null);

  const userSelected = (user) => {
    setList((prev) => [...prev, user]);
  };

  const handleRemoveUser = (user) => {
    setRemoveUser(user);
    setList((prev) => {
      return prev.filter((obj) => obj.id !== user.id);
    });
  };

  const onSubmit = (data) => {
    const { name } = data;
    const membersId = list?.map((user) => user.id);
    const obj = {
      name,
      members: membersId,
    };

    console.log("obj", obj);

    emit("createGroupChat", obj, (response) => {
      console.log("response", response);
      dispatch(toggleGroupChatForm(false));
      refetch();
    });
  };

  return (
    <section className="absolute top-0 z-50 w-screen h-screen backdrop-blur-sm flex justify-center items-center">
      <div className="h-[500px] w-[700px]  flex justify-center items-start">
        {/* WORK: FORM WITH CANCEL BUTTON */}
        <div className="w-full h-full bg-color_1 border-2 rounded-xl border-color_4 text-color_4 flex flex-col justify-between ">
          {/* WORK: FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full w-full flex flex-col justify-between"
          >
            <div className="h-24 p-6 border-b border-color_3 w-full  text-color_1">
              <input
                type="text"
                placeholder="Name of Group"
                className="w-full px-4 py-2 rounded-xl"
                {...register("name", {
                  required: true,
                })}
              />
              <p className="text-xs h-4 ml-4 mt-1 text-red-200">
                {errors?.name?.type === "required" && "Name is required."}
              </p>
            </div>

            <section className="flex h-full mb-10 mt-6">
              <div className="w-1/2 px-4 rounded-full h-max">
                <img
                  src={Images.dummyGroup}
                  alt="group photo"
                  className="w-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1 h-full flex flex-col gap-3 px-4">
                <div className="flex justify-center">
                  <SearchFilterUsers
                    userSelected={userSelected}
                    remove={removeUser}
                  />
                </div>

                <div className="flex-1 px-4 overflow-y-scroll h-60">
                  {list.map((user, i) => {
                    const { id, name, photo } = user;

                    const userPhoto = `${environment.SERVER_URL}/${photo}`;

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center mb-4"
                      >
                        <div className="flex justify-start items-center gap-4 ">
                          <div className="w-[50px]">
                            <img
                              src={userPhoto}
                              alt="photo"
                              className="w-full rounded-full"
                            />
                          </div>
                          <p>{name}</p>
                        </div>
                        <p
                          className="text-xs text-color_3/75 cursor-pointer py-2"
                          onClick={() => handleRemoveUser(user)}
                        >
                          {id !== data.id && "Remove"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="h-24 w-full flex justify-center items-center -outline-offset-1 outline-color_3  bg-color_2 rounded-b-xl cursor-pointer text-lg font-semibold tracking-wide"
            >
              {update ? "Update" : "Create"} Group Chat
            </button>
          </form>
        </div>

        {/* WORK: CANCEL BUTTON */}
        <div
          className="p-2 rounded-full border border-color_4 cursor-pointer -mt-10"
          onClick={() => dispatch(toggleGroupChatForm(false))}
        >
          <Icons.cancel className="text-xl text-color_4" />
        </div>
      </div>
    </section>
  );
};

export default GroupChatForm;
