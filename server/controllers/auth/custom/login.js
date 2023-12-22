import { User } from "../../../models/userModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import generateWebToken from "../../../utils/generateWebToken.js";
import { environment } from "../../../utils/environment.js";

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //   WORK: IF USER DOES NOT PROVIDE EITHER EMAIL OR PASSWORD
  if (!email || !password) {
    return next(
      new HandleGlobalError("Email or Password is not provided", 404)
    );
  }

  const findUser = await User.findOne({ email });

  //   WORK: IF USER DOES NOT EXIST WITH THAT PASSWORD THROW ERROR
  if (!findUser) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   WORK: IF USER PASSWORD DOES NOT MATCH WITH HASH PASSWORD, THROW ERROR
  const isPasswordValid = findUser.checkPassword(password); // Boolean

  if (!isPasswordValid) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   WORK: UPDATE THE USER PROFILE AFTER SUCCESSFUL LOGIN
  await User.findOneAndUpdate(
    {
      _id: findUser._id,
    },
    {
      $inc: { loginCount: 1 },
      $currentDate: { lastLoginAt: true },
    }
  );

  //   WORK: USER EMAIL AND PASSWORD IS CONFIRMED, SEND TOKEN AND MAKE LOGIN
  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });

  res.cookie("token", token, {
    expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Login Successfully",
    id: findUser._id,
    name: findUser.name,
    photo: findUser.photo,
    email: findUser.email,
    role: findUser.role,
  });
});

export default login;
