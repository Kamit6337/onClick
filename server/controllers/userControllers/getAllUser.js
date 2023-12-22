import catchAsyncError from "../../utils/catchAsyncError.js";
import { User } from "../../models/userModel.js";
import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";

const getAllUser = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const users = await User.find({ _id: { $ne: userId } })
    .lean()
    .select("_id name email photo");

  const usersId = changeUnderScoreId(users);

  res.status(200).json({
    message: "All Users",
    data: usersId,
  });
});

export default getAllUser;
