import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import generateWebToken from "../../utils/generateWebToken.js";
import { User } from "../../models/userModel.js";

// NOTE: UPDATE USER
export const updateUser = catchAsyncError(async (req, res) => {
  if (req.user) {
    const { id } = req.user;

    await User.findOneAndUpdate(
      { id },
      {
        $inc: { loginCount: 1 },
        $currentDate: { lastLoginAt: true },
      }
    );
  }

  res.redirect(environment.CLIENT_CHECKLOGIN_URL);
});

// NOTE: LOGIN SUCCESS
export const loginSuccess = catchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(new HandleGlobalError("You are not logged in.", 403));

  const {
    id,
    provider,
    _json: { name, email, picture },
  } = req.user;

  const findUser = await User.findOne({ id });

  // WORK: IF NOT FIND USER
  if (!findUser) {
    // WORK: CREATE USER
    const createUser = await User.create({
      name,
      email,
      photo: picture,
      OAuthId: id,
      OAuthProvider: provider,
    });

    if (!createUser) {
      return next(new HandleGlobalError("Issue in Signup", 404));
    }

    const token = generateWebToken({
      id: createUser._id,
      role: createUser.role,
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
      httpOnly: true,
    });

    res.status(200).json({
      message: "Login Successfully",
      name: createUser.name,
      photo: createUser.photo,
      email: createUser.email,
      role: createUser.role,
    });
    return;
  }

  // WORK: IF FIND USER
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
    name: findUser.name,
    photo: findUser.photo,
    email: findUser.email,
    role: findUser.role,
  });
  return;
});

// NOTE: LOGOUT
export const logout = (req, res) => {
  req.logout();

  const cookies = req.cookies;

  Object.keys(cookies).forEach((cookie) => {
    res.clearCookie(cookie);
  });

  res.status(200).json({
    message: "Successfully Logout",
  });
};
