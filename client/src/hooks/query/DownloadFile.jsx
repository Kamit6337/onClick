/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { downloadReq } from "../../utils/api/downloadApi";

const DownloadFile = ({ fileType, originalName, destination, fileName }) => {
  const query = useQuery({
    queryKey: ["file", fileType, originalName, fileName],
    queryFn: () => {
      return downloadReq(`/${fileType}`, {
        destination,
        fileName,
        originalName,
      });
    },
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  if (query.isSuccess) {
    const response = query.data;

    // Convert the response to a blob and create a download link
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);

    console.log("response header", response);

    // Use the filename directly from the Content-Disposition header
    const fileName = response.config.params.originalName;

    link.download = fileName || "downloadedFile.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }

  return query;
};

export default DownloadFile;
