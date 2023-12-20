import axios from "axios";
import environment from "../environment";
import catchAsyncError from "./catchAsyncError";

const SERVER_URL = environment.SERVER_URL;

export const getReq = catchAsyncError(async (path, params) => {
  const get = await axios.get(`${SERVER_URL}${path}`, {
    params,
    withCredentials: true,
  });
  return get?.data;
});

export const postReq = catchAsyncError(async (path, body) => {
  const post = await axios.post(`${SERVER_URL}${path}`, body, {
    withCredentials: true,
  });
  return post?.data;
});

export const patchReq = catchAsyncError(async (path, body) => {
  const patch = await axios.patch(`${SERVER_URL}${path}`, body, {
    withCredentials: true,
  });
  return patch?.data;
});

export const deleteReq = catchAsyncError(async (path, params) => {
  const deleteReq = await axios.delete(`${SERVER_URL}${path}`, {
    params,
    withCredentials: true,
  });
  return deleteReq?.data;
});
