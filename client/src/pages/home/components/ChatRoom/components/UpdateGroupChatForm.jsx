/* eslint-disable react/prop-types */
import { useState } from "react";
import { Icons } from "../../../../../assets/icons";
import { Images } from "../../../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleGroupChatForm,
  toggleUpdateGroupChatForm,
} from "../../../../../redux/slice/toggleSlice";
import SearchFilterUsers from "../../../../../components/SearchFilterUsers";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import UseSocket from "../../../../../hooks/socket/UseSocket";
import { useForm } from "react-hook-form";
import UseUserRooms from "../../../../../hooks/query/UseUserRooms";
import environment from "../../../../../utils/environment";
import { roomsState } from "../../../../../redux/slice/roomSlice";
import areArraysEqual from "../../../../../utils/javaScript/areArraysEqual";
import Toastify from "../../../../../lib/Toastify";
import ImageComp from "../../../../../components/Image";

const UpdateGroupChatForm = ({ update = false }) => {
  const { emit } = UseSocket();
  const dispatch = useDispatch();
  const { data } = UseContinuousCheck(true);
  const { refetch } = UseUserRooms(true);
  const { activeRoom, activeRoomDetail } = useSelector(roomsState);
  const { showErrorMessage, ToastContainer } = Toastify();
  const { Image, file } = ImageComp();

  console.log("file", file);

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
    } else {
      return activeRoomDetail.members;
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
    const membersId = list?.map((user) => user._id);

    if (!update) {
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
    } else {
      const initialMembersId = activeRoomDetail.members.map((user) => user.id);

      //   if (
      //     name === activeRoomDetail.name &&
      //     areArraysEqual(initialMembersId, membersId) &&
      //     !file
      //   ) {
      //     return alert("you have not change anything this can't be updated");
      //   }

      const obj = {
        id: activeRoom,
        name,
        members: membersId,
        photo: file ,
      };

      console.log("obj", obj);

      // MARK: NEED TO CREATE THAT SOCKET IN SERVER
      emit("updateGroupChat", obj, (response) => {
        console.log("response", response);
        if (response.status !== "ok") {
          showErrorMessage({ message: response.error });
          return;
        }

        dispatch(toggleUpdateGroupChatForm(false));
        refetch();
      });
    }
  };

  const groupPhoto = `${environment.SERVER_URL}/${activeRoomDetail.photo}`;

  return (
    <>
      <section className="absolute top-0 z-50 w-screen h-screen backdrop-blur-sm flex justify-center items-center">
        <div className="h-[500px] w-[700px]  flex justify-center items-start">
          {/* MARK: FORM WITH CANCEL BUTTON */}
          <div className="w-full h-full bg-color_1 border-2 rounded-xl border-color_4 text-color_4 flex flex-col justify-between ">
            {/* MARK: FORM */}
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

              <section className="flex" style={{ height: "300px" }}>
                <div className="w-1/2 px-4 rounded-full">
                  <Image src={update ? groupPhoto : Images.dummyGroup} />
                  {/* <img
                    src={update ? groupPhoto : Images.dummyGroup}
                    alt="group photo"
                    className="w-full rounded-full object-cover"
                  /> */}
                </div>
                <div className="flex-1 h-full flex flex-col gap-3 px-4">
                  <div className="flex justify-center">
                    <SearchFilterUsers
                      userSelected={userSelected}
                      remove={removeUser}
                      list={update && list}
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
                className="h-16 w-full flex justify-center items-center -outline-offset-1 outline-color_3  bg-color_2 rounded-b-xl cursor-pointer text-lg font-semibold tracking-wide"
              >
                {update ? "Update" : "Create"} Group Chat
              </button>
            </form>
          </div>

          {/* MARK: CANCEL BUTTON */}
          <div
            className="p-2 rounded-full border border-color_4 cursor-pointer -mt-10"
            onClick={() =>
              dispatch(
                update
                  ? toggleUpdateGroupChatForm(false)
                  : toggleGroupChatForm(false)
              )
            }
          >
            <Icons.cancel className="text-xl text-color_4" />
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default UpdateGroupChatForm;
