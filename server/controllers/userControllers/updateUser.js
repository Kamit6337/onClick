import { User } from "../../models/userModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const updateUser = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const filePath = req.file.path;
  // Modify the filePath to replace backslashes with forward slashes
  const modifiedFilePath = filePath.replace(/\\/g, "/").replace("public/", "");

  const updateUser = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { photo: modifiedFilePath },
    },
    {
      new: true,
    }
  );

  console.log(updateUser);

  res.status(200).json({
    message: "Upload successfully",
    data: modifiedFilePath,
  });
});

export default updateUser;
