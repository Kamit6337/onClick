/* eslint-disable react/prop-types */
import { downloadReq } from "../../utils/api/downloadApi";
import { useEffect, useState } from "react";

const DownloadFile = () => {
  const [startDownload, setStartDownload] = useState(false);
  const [value, setValue] = useState(null);

  const handleDownload = (para) => {
    setValue(para); //{ fileType, originalName, destination, fileName }
    setStartDownload(true);
  };

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const { fileType, originalName, destination, fileName } = value;
        const response = await downloadReq(`/${fileType}`, {
          destination,
          fileName,
          originalName,
        });

        // Convert the response to a blob and create a download link
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);

        console.log("response header", response);

        // Use the filename directly from the Content-Disposition header
        const downloadFileName = response.config.params.originalName;

        link.download = downloadFileName || "downloadedFile.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        setStartDownload(false);
      } catch (error) {
        console.error("error in downloading", error);
      }
    };

    if (startDownload) {
      downloadFile();
    }
  }, [startDownload, value]);

  // if (query.isSuccess) {
  //   const response = query.data;

  //   // Convert the response to a blob and create a download link
  //   const blob = new Blob([response.data], {
  //     type: response.headers["content-type"],
  //   });

  //   const link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);

  //   console.log("response header", response);

  //   // Use the filename directly from the Content-Disposition header
  //   const fileName = response.config.params.originalName;

  //   link.download = fileName || "downloadedFile.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   window.URL.revokeObjectURL(link.href);
  // }

  // return query;
  return { handleDownload };
};

export default DownloadFile;
