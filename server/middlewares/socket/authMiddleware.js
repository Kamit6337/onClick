import { User } from "../../models/userModel.js";
import Socket from "../../utils/socket/Socket.js";
import verifyWebToken from "../../utils/verifyWebToken.js";

const err = new Error("Not Authorised");
err.status = 404;

const authMiddleware = async (socket, next) => {
  const { cookies } = Socket(socket);

  const { token } = cookies;

  if (!token) {
    return next(err);
  }

  try {
    const decoded = verifyWebToken(token);
    const findUser = await User.findOne({ _id: decoded.id }).select(
      "_id name email photo"
    );

    if (!findUser) {
      return next(err);
    }

    socket.user = findUser;
    socket.userId = String(findUser._id);
    socket.userName = findUser.name;

    next();
  } catch (error) {
    return next(error);
  }
};

export default authMiddleware;
