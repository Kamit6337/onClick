import axios from "axios";
import environment from "../environment";
import catchAsyncError from "./catchAsyncError";

const SERVER_URL = environment.SERVER_URL;

export const getAuthReq = catchAsyncError(async (path, params) => {
  const get = await axios.get(`${SERVER_URL}/auth${path}`, {
    params,
    withCredentials: true,
  });
  return get?.data;
});

export const postAuthReq = catchAsyncError(async (path, body) => {
  const post = await axios.post(`${SERVER_URL}/auth${path}`, body, {
    withCredentials: true,
  });
  return post?.data;
});

export const patchAuthReq = catchAsyncError(async (path, body) => {
  const patch = await axios.patch(`${SERVER_URL}/auth${path}`, body, {
    withCredentials: true,
  });
  return patch?.data;
});

export const deleteAuthReq = catchAsyncError(async (path, params) => {
  const deleteReq = await axios.delete(`${SERVER_URL}/auth${path}`, {
    params,
    withCredentials: true,
  });
  return deleteReq?.data;
});
