/* eslint-disable react/prop-types */
import { Icons } from "../../../../../assets/icons";
import DownloadFile from "../../../../../hooks/query/DownloadFile";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import environment from "../../../../../utils/environment";
import changeDate from "../../../../../utils/javaScript/changeDate";

const SERVER_URL = environment.SERVER_URL;

const DifferentChatMessages = ({ chat }) => {
  const { data: user } = UseContinuousCheck(true);

  let {
    message,
    sender: { _id: id, name },
    updatedAt,
    isFile,
    file: { fileType, originalName, destination, fileName, size },
  } = chat;

  const { refetch } = DownloadFile({
    fileType,
    originalName,
    destination,
    fileName,
  });

  if (!isFile) {
    if (id !== user?.id) {
      return (
        <div className={`flex items-end gap-2 w-max  self-end `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
          <div className="p-2 px-4 border border-color_3 text-color_1 bg-color_3 rounded-2xl max-w-96 ">
            <p className="font-extrabold tracking-wide text-color_1 ">
              {name.split(" ")[0]}
            </p>
            <p className="break-all font-thin">{message}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex items-end gap-2 w-max `}>
          <div className="p-2 px-4 border border-color_3 rounded-2xl max-w-96">
            <p className="font-extrabold tracking-wide text-color_3 ">
              {name.split(" ")[0]}
            </p>

            <p className="font-thin break-all">{message}</p>
          </div>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
        </div>
      );
    }
  }

  const file = `${SERVER_URL}/${destination}/${fileName}`;

  if (fileType === "image") {
    if (id !== user?.id) {
      return (
        <div className={`flex items-end gap-2 w-max self-end `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

          <div className="p-1 border border-color_3 text-color_1 bg-color_3 rounded-xl max-w-96 ">
            <p className="font-extrabold tracking-wide text-color_1 px-3 py-2">
              {name.split(" ")[0]}
            </p>
            <img
              src={file}
              alt="photo"
              className="w-full rounded-b-xl"
              loading="lazy"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex items-end gap-2 w-max `}>
          <div className="p-1 border border-color_3 rounded-2xl max-w-96">
            <p className="font-extrabold tracking-wide text-color_3 px-3 py-2">
              {name.split(" ")[0]}
            </p>
            <img
              src={file}
              alt="photo"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </div>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
        </div>
      );
    }
  }

  if (fileType === "pdf") {
    if (id !== user?.id) {
      return (
        <div className={`flex items-end gap-2 w-max self-end `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

          <div className="max-w-96 min-w-40 p-1 border border-color_3 text-color_1 bg-color_3 rounded-xl ">
            <p className="font-extrabold tracking-wide text-color_1 px-3 py-2">
              {name.split(" ")[0]}
            </p>
            <div className="relative h-24 w-full  bg-color_2">
              <p>PDF</p>
              <p>{originalName}</p>
              <p>{+size / 1024} kb</p>
              <div
                className="absolute z-10 bottom-0 right-0 rounded-full border border-color_4 p-1 cursor-pointer"
                onClick={
                  () => refetch()
                  // refetch({
                  //   queryKey: [
                  //     "file",
                  //     "pdf",
                  //     { destination, fileName, originalName },
                  //   ],
                  // })
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
          <div className="p-1 border border-color_3 rounded-2xl max-w-96">
            <p className="font-extrabold tracking-wide text-color_3 px-3 py-2">
              {name.split(" ")[0]}
            </p>
            <div className="relative h-24 bg-color_2">
              <p>PDF</p>
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
