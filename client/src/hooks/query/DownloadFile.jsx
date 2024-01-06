/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { downloadReq } from "../../utils/api/downloadApi";

const DownloadFile = () => {
  const mutation = useMutation({
    mutationKey: ["file"],
    mutationFn: ({ fileType, path }) =>
      downloadReq(`/download/${fileType}`, { path }),
  });

  return mutation;
};

export default DownloadFile;
