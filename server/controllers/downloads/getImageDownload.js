import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import path from "path";
import fs from "fs";

const getImageDownload = catchAsyncError(async (req, res, next) => {
  const { destination, fileName, originalName } = req.query;

  if (!destination || !fileName || !originalName) {
    return next(new HandleGlobalError("Fields are not provided", 404));
  }

  let filePath = `public/${destination}/${fileName}`;

  filePath = path.join(filePath);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return next(new HandleGlobalError("File is not found", 404));
  }

  // Set the response headers for the image download
  res.setHeader("Content-Type", "image/*");

  // Stream the file to the response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

export default getImageDownload;
