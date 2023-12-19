import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { User } from "../../../models/userModel.js";
import verifyWebToken from "../../../utils/verifyWebToken.js";

const loginCheck = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new HandleGlobalError("Your token has expired. Please Login Again.", 400)
    );
  }

  const decoded = verifyWebToken(token);

  const findUser = await User.findOne({
    _id: decoded.id,
  });

  if (!findUser) {
    return next(
      new HandleGlobalError("Unauthorised Access. Please Login Again.", 400)
    );
  }

  res.status(200).json({
    message: "User is present",
  });
});

export default loginCheck;
