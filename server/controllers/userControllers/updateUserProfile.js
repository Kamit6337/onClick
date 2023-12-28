import catchAsyncError from "../../utils/catchAsyncError.js";

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const body = req.body;

  console.log("body", body);
});

export default updateUserProfile;
