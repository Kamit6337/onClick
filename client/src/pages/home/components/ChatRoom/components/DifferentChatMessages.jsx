/* eslint-disable react/prop-types */
import { Icons } from "../../../../../assets/icons";
import DownloadFile from "../../../../../hooks/query/DownloadFile";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import environment from "../../../../../utils/environment";
import changeDate from "../../../../../utils/javaScript/changeDate";
import { useDispatch } from "react-redux";
import { toggleChatOptionOnRightClick } from "../../../../../redux/slice/toggleSlice";
import bytesToKbMb from "../../../../../utils/javaScript/bytesToKbMb";

const SERVER_URL = environment.SERVER_URL;

const DifferentChatMessages = ({ chat, isGroupChat }) => {
  const dispatch = useDispatch();
  const { data: user } = UseContinuousCheck(true);

  let {
    _id,
    message,
    sender: { _id: id, name },
    updatedAt,
    isFile,
    file: { fileType, originalName, destination, fileName, size },
  } = chat;

  const { handleDownload } = DownloadFile();

  const handleContextMenu = (e) => {
    e.preventDefault();

    dispatch(
      toggleChatOptionOnRightClick({
        bool: true,
        data: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          chatId: _id,
        },
      })
    );
  };

  if (!isFile) {
    if (id !== user?._id) {
      return (
        <div className={`flex items-end gap-2 w-max self-end  `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
          <div
            className={`${
              isGroupChat ? "p-2" : "p-1"
            } px-4 border border-color_3 text-color_1 bg-color_3 rounded-2xl max-w-96 `}
          >
            {isGroupChat && (
              <p className="font-extrabold tracking-wide text-color_1 ">
                {name.split(" ")[0]}
              </p>
            )}
            <p className="break-all font-thin">{message}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex items-end gap-2 w-max self-start `}>
          <div
            className={`${
              isGroupChat ? "p-2" : "p-1"
            } px-4 border border-color_3 rounded-2xl max-w-96`}
            onContextMenu={handleContextMenu}
          >
            {isGroupChat && (
              <p className="font-extrabold tracking-wide text-color_3 ">
                {name.split(" ")[0]}
              </p>
            )}

            <p className="font-thin break-all">{message}</p>
          </div>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
        </div>
      );
    }
  }

  const file = `${SERVER_URL}/${destination}/${fileName}`;

  if (fileType === "image") {
    if (id !== user?._id) {
      return (
        <div className={`flex items-end gap-2 w-max self-end `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

          <div
            className={` max-w-96 min-w-40 h-auto border border-color_3 text-color_1 bg-color_3 rounded-xl `}
          >
            {isGroupChat && (
              <p className="font-extrabold tracking-wide text-color_1 px-3 py-2">
                {name.split(" ")[0]}
              </p>
            )}

            <img
              src={file}
              alt="photo"
              className={`${
                isGroupChat ? "rounded-b-2xl" : " rounded-2xl"
              }  w-full`}
              loading="lazy"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex items-end gap-2 w-max `}>
          <div
            className="max-w-96 min-w-40 border border-color_3 rounded-2xl "
            onContextMenu={handleContextMenu}
          >
            {isGroupChat && (
              <p className="font-extrabold tracking-wide text-color_3 px-3 py-2">
                {name.split(" ")[0]}
              </p>
            )}

            <img
              src={file}
              alt="photo"
              className={`${
                isGroupChat ? "rounded-b-2xl" : " rounded-2xl"
              }  w-full`}
              loading="lazy"
            />
          </div>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
        </div>
      );
    }
  }

  if (fileType === "pdf") {
    if (id !== user?._id) {
      return (
        <div className={`flex items-end gap-2 w-max self-end `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

          <div className="max-w-96 min-w-40 border border-color_3 text-color_1 bg-color_3 rounded-2xl ">
            {isGroupChat && (
              <p className="font-extrabold tracking-wide text-color_1 px-3 py-2">
                {name.split(" ")[0]}
              </p>
            )}

            <div className="px-2 w-full relative h-24 bg-color_2 rounded-2xl flex flex-col justify-center">
              <p>PDF</p>
              <p>{originalName}</p>
              <p>{bytesToKbMb(size)}</p>
              <div
                className="absolute z-10 bottom-0 right-0 rounded-full border border-color_4 p-1 cursor-pointer"
                onClick={() =>
                  handleDownload({
                    fileType,
                    originalName,
                    destination,
                    fileName,
                  })
                }
              >
                <Icons.download />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex items-end gap-2 w-max `}>
          <div
            className=" border border-color_3 rounded-2xl max-w-96 min-w-40"
            onContextMenu={handleContextMenu}
          >
            {isGroupChat && (
              <p className="font-extrabold tracking-wide text-color_3 px-3 py-2">
                {name.split(" ")[0]}
              </p>
            )}

            <div className="px-2 relative h-24 bg-color_2 rounded-2xl flex flex-col justify-center">
              <p>PDF</p>
              <p>{originalName}</p>
              <p>{bytesToKbMb(size)}</p>
            </div>
          </div>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
        </div>
      );
    }
  }

  return null;
};

export default DifferentChatMessages;
