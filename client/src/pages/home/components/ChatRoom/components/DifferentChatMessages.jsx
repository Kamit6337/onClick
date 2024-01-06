/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Icons } from "../../../../../assets/icons";
import DownloadFile from "../../../../../hooks/query/DownloadFile";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import environment from "../../../../../utils/environment";
import changeDate from "../../../../../utils/javaScript/changeDate";
import download from "../../../../../lib/download";
import { useMutation } from "@tanstack/react-query";
import { downloadReq } from "../../../../../utils/api/downloadApi";

const SERVER_URL = environment.SERVER_URL;

const DifferentChatMessages = ({ chat }) => {
  const { data: user } = UseContinuousCheck(true);
  const {
    mutate,
    data: response,
    isSuccess,
  } = useMutation({
    mutationKey: ["file"],
    mutationFn: ({ fileType, path }) => downloadReq(`/${fileType}`, { path }),
  });

  let {
    message,
    sender: { _id: id, name },
    updatedAt,
    isFile,
    fileType,
    file,
  } = chat;

  useEffect(() => {
    if (isSuccess) {
      // Convert the response to a blob and create a download link
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      // Extract filename from response headers or use a fixed name
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]
        : "downloadedFile.pdf";

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }
  }, [isSuccess, response]);

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

  if (fileType === "image") {
    const photo = `${SERVER_URL}/${file}`;

    if (id !== user?.id) {
      return (
        <div className={`flex items-end gap-2 w-max self-end `}>
          <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

          <div className="p-1 border border-color_3 text-color_1 bg-color_3 rounded-xl max-w-96 ">
            <p className="font-extrabold tracking-wide text-color_1 px-3 py-2">
              {name.split(" ")[0]}
            </p>
            <img
              src={photo}
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
              src={photo}
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
    const pdfPath = file;

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
              <div
                className="absolute z-10 bottom-0 right-0 rounded-full border border-color_4 p-1 cursor-pointer"
                onClick={() => mutate({ fileType: "pdf", path: pdfPath })}
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
