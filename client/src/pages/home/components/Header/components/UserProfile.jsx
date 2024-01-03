/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Icons } from "../../../../../assets/icons";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import UseLogout from "../../../../../hooks/query/UseLogout";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../components/Loading";
import removeCookies from "../../../../../utils/crypto/removeCookies";
import UseUpdateUser from "../../../../../hooks/mutation/UseUpdateUser";
import MakeItLarge from "../../../../../lib/MakeItLarge";
import OnClickOutside from "../../../../../lib/onClickOutside";
import environment from "../../../../../utils/environment";
import ImageComp from "../../../../../components/Image";
import Toastify from "../../../../../lib/Toastify";

const UserProfile = ({ toggle = false, undoToggle }) => {
  const { data: user, refetch } = UseContinuousCheck(true);
  const navigate = useNavigate();
  const [doLogout, setDoLogout] = useState(false);
  const [makeLarge, setMakeLarge] = useState(false);
  const { isLoading, isError, error, data, isSuccess } = UseLogout(doLogout);
  const { Image, file } = ImageComp();

  const {
    mutate,
    error: updateUserError,
    isPending,
    isSuccess: updateUserIsSuccess,
  } = UseUpdateUser(true);

  const undoMakeLarge = () => {
    setMakeLarge(false);
  };

  const { ref: refMakeLarge } = OnClickOutside(undoMakeLarge);

  const { ToastContainer, showErrorMessage, showSuccessMessage } = Toastify();

  useEffect(() => {
    if (updateUserIsSuccess) {
      refetch();
    }
  }, [updateUserIsSuccess, refetch]);

  useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      mutate(formData);
    }
  }, [file, mutate]);

  useEffect(() => {
    if (isError || updateUserError) {
      showErrorMessage({ message: error.message || updateUserError.message });
    }
  }, [isError, error, updateUserError, showErrorMessage]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: data.message, time: 2000 });
      removeCookies();

      setTimeout(() => {
        window.location.reload();
        navigate("/");
      }, 2000);
    }
  }, [isSuccess, data, navigate, showSuccessMessage]);

  const userPhoto = `${environment.SERVER_URL}/${user?.photo}`;

  return (
    <>
      {toggle && (
        <section className="w-full h-screen absolute z-50 top-0 left-0 backdrop-blur-sm flex justify-center items-center gap-1">
          <div className="h-[600px] w-[550px] flex justify-center items-start gap-1">
            <div className="h-full w-full bg-color_2 text-color_4 rounded-xl relative">
              {/* <p className="text-xl font-medium tracking-wider text-center py-4 border-b border-color_4">
              Profile
            </p> */}
              <div className="flex justify-evenly  items-center px-10 py-8 border-b border-color_4">
                <div className="w-32 h-32 relative">
                  <Image src={userPhoto} />
                  {/* <img
                    src={userPhoto}
                    loading="lazy"
                    alt="profile"
                    className="w-full h-full rounded-full cursor-pointer"
                    onClick={() => setMakeLarge(true)}
                  />
                  <div className="absolute bottom-0 right-0 z-10 bg-color_4 p-1 cursor-pointer rounded-full">
                    <ModeEditIcon className="text-color_1" onClick={onClick} />
                  </div> */}

                  {isPending && (
                    <div className="absolute top-0 border border-color_4 rounded-full w-full h-full backdrop-blur-sm z-10 ">
                      <Loading hScreen={false} small={true} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p>{user?.name}</p>
                  <p>{user?.email}</p>
                  <p>{user?.id}</p>
                </div>
              </div>
              <div
                className="bg-color_1 border border-color_2 rounded-b-xl  absolute z-10 left-0 bottom-0 h-16  w-full flex justify-center items-center text-lg font-medium cursor-pointer top_box_shadow tracking-wide"
                onClick={() => setDoLogout(true)}
              >
                {isLoading ? (
                  <Loading hScreen={false} small={true} />
                ) : (
                  <p>Logout</p>
                )}
              </div>
              {makeLarge && (
                <MakeItLarge
                  hScreen={false}
                  photo={userPhoto}
                  radius={300}
                  forwardedRef={refMakeLarge}
                />
              )}
            </div>
            <div
              className="cursor-pointer rounded-full p-2 border border-color_4 mt-1"
              onClick={undoToggle}
            >
              <Icons.cancel className="text-xl rounded-full" />
            </div>
          </div>
        </section>
      )}
      <ToastContainer />
    </>
  );
};

export default UserProfile;
