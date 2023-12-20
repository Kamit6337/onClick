const catchAsyncError = (func) => {
  return async (para1, para2) => {
    try {
      return await func(para1, para2);
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };
};

export default catchAsyncError;
