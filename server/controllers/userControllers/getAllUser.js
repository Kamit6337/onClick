import catchAsyncError from "../../utils/catchAsyncError.js";
import { User } from "../../models/userModel.js";

const getAllUser = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const users = await User.find({ _id: { $ne: userId } })
    .lean()
    .select("_id name email photo");

  res.status(200).json({
    message: "All Users",
    data: users,
  });
});

export default getAllUser;
