import axios from "axios";
import environment from "../environment";
import catchAsyncError from "./catchAsyncError";

const SERVER_URL = environment.SERVER_URL;

export const downloadReq = catchAsyncError(async (path, body) => {
  const get = await axios.post(`${SERVER_URL}/download${path}`, body, {
    withCredentials: true,
    responseType: "blob",
  });

  // Important for handling binary data
  // You might need to include headers if your backend requires them

  return get;
});
