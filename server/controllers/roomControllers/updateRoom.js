import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import { Chat } from "../../models/chatModel.js";
import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateRoom = catchAsyncError(async (req, res, next) => {});

export default updateRoom;
