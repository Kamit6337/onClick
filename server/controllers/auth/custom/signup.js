import { User } from "../../../models/userModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { environment } from "../../../utils/environment.js";
import generateWebToken from "../../../utils/generateWebToken.js";

// WORK: PLACED A DUMMY URL IN CASE USER DOES NOT PROVIDE PHOTO
const userPic = `${environment.SERVER_URL}/images/dummy_profile.png`;

const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password, photo } = req.body;

  if (!name || !email || !password) {
    return next(new HandleGlobalError("Not provided all field", 404));
  }

  // WORK: CREATE USER
  const createUser = await User.create({
    name,
    email,
    password,
    photo: userPic,
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
    message: "SignUp Successfully",
    name: createUser.name,
    photo: createUser.photo,
    email: createUser.email,
    role: createUser.role,
  });
});

export default signup;
