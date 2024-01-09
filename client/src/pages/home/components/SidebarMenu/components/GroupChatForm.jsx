/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Images } from "../../../../../assets/images";
import { useDispatch } from "react-redux";
import { toggleGroupChatForm } from "../../../../../redux/slice/toggleSlice";
import SearchFilterUsers from "../../../../../components/SearchFilterUsers";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import { useForm } from "react-hook-form";
import environment from "../../../../../utils/environment";
import CreateGroupChat from "../../../../../hooks/mutation/CreateGroupChat";
import Toastify from "../../../../../lib/Toastify";
import UseAllUser from "../../../../../hooks/query/UseAllUser";
import ImageComp from "../../../../../components/Image";
import ImageCrop from "../../ImageCrop/ImageCrop";

const GroupChatForm = () => {
  const dispatch = useDispatch();
  const { data: userData } = UseContinuousCheck(true);
  const { data: users } = UseAllUser(true);
  const [list, setList] = useState([userData]);
  const [initialUsers, setInitialUsers] = useState(users?.data || []);
  const {
    mutate,
    isError,
    error,
    reset,
    isSuccess,
    data: mutateData,
  } = CreateGroupChat();

  const [isCropStart, setIsCropStart] = useState(false);
  const [originalImageFile, setOriginalImageFile] = useState(null);
  const [croppedImageSrc, setCroppedImageSrc] = useState(null);

  const { Image, file } = ImageComp();
  const { ToastContainer, showErrorMessage, showSuccessMessage } = Toastify();

  useEffect(() => {
    if (file) {
      setOriginalImageFile(file);
      setIsCropStart(true);
    }
  }, [file]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(toggleGroupChatForm(false));
    }
  }, [isSuccess, showSuccessMessage, dispatch, mutateData, reset]);

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error.message, time: 3000 });

      setTimeout(() => {
        reset();
      }, 3000);
    }
  }, [isError, error, showErrorMessage, reset]);

  const userSelected = (user) => {
    setList((prev) => [...prev, user]);
    setInitialUsers((prev) => {
      return prev.filter((obj) => obj._id !== user._id);
    });
  };

  const handleRemoveUser = (user) => {
    setList((prev) => {
      return prev.filter((obj) => obj._id !== user._id);
    });
    setInitialUsers((prev) => [...prev, user]);
  };

  const onSubmit = (data) => {
    const { name } = data;

    if (list.length < 2) {
      showErrorMessage({
        message: "You have not selected users to make group",
        time: 3000,
      });
      return;
    }

    if (!croppedImageSrc) {
      showErrorMessage({
        message: "Please select an image for your group",
        time: 3000,
      });
      return;
    }

    const membersId = list.map((user) => user._id);

    const formData = new FormData();
    formData.append("image", croppedImageSrc);
    formData.append("name", name);
    formData.append("members", JSON.stringify(membersId));

    mutate(formData);
  };

  const handleOnCrop = (croppedFile) => {
    setCroppedImageSrc(croppedFile);
    setIsCropStart(false);
  };

  const handleCancelCrop = () => {
    setOriginalImageFile(null);
    setIsCropStart(false);
  };

  return (
    <>
      <section className="absolute top-0 z-50 w-screen h-screen backdrop-blur-sm flex justify-center items-center">
        {/* MARK: FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-[500px] w-[600px] relative bg-color_1 border-2 rounded-xl border-color_4 text-color_4 flex flex-col justify-between"
        >
          <div className="h-24 p-6 border-b border-color_3 w-full  text-color_1">
            <input
              type="text"
              placeholder="Name of Group"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full px-4 py-2 rounded-xl"
              {...register("name", {
                required: true,
              })}
            />
            <p className="text-xs h-4 ml-4 mt-1 text-red-200">
              {errors?.name?.type === "required" && "Name is required."}
            </p>
          </div>

          <section className="flex">
            <div className="w-64 px-6 rounded-full flex justify-center">
              <Image
                src={
                  croppedImageSrc
                    ? URL.createObjectURL(croppedImageSrc)
                    : Images.dummyGroup
                }
                alt="groupPhoto"
              />
            </div>
            <div className="h-full flex-1 flex flex-col gap-3 px-4">
              <div className="flex justify-center">
                <SearchFilterUsers
                  initialUsers={initialUsers}
                  userSelected={userSelected}
                />
              </div>

              <div className="px-4 overflow-y-scroll h-40">
                {list.map((user, i) => {
                  const { _id, name, photo, email } = user;

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
                        <div>
                          <p className="text-sm">{name}</p>
                          <p className="text-[10px] tracking-wider">{email}</p>
                        </div>
                      </div>
                      <p
                        className="text-xs text-color_3/75 cursor-pointer py-2"
                        onClick={() => handleRemoveUser(user)}
                      >
                        {_id !== userData._id && "Remove"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="h-16 w-full flex justify-between items-center gap-6 p-5">
            <button
              onClick={() => dispatch(toggleGroupChatForm(false))}
              className="flex-1 py-2 flex justify-center items-center -outline-offset-1 outline-color_3  bg-color_2 rounded-xl cursor-pointer text-lg tracking-wide"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-2 flex justify-center items-center -outline-offset-1 outline-color_3  bg-color_2 rounded-xl cursor-pointer text-lg tracking-wide"
            >
              Create Group Chat
            </button>
          </div>

          {isCropStart && (
            <ImageCrop
              image={originalImageFile}
              onCrop={handleOnCrop}
              cancelCrop={handleCancelCrop}
            />
          )}
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default GroupChatForm;
