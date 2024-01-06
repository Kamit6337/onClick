import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import path from "path";
import fs from "fs";

const getPDFDownload = catchAsyncError(async (req, res, next) => {
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

  // Set the response headers for the download
  res.setHeader("Content-Type", "application/pdf");

  // Stream the file to the response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

export default getPDFDownload;

// const filename = req.params.filename;
// const filePath = path.join(__dirname, `public/pdfs/${filename}`);

// // Check if the file exists
// if (!fs.existsSync(filePath)) {
//   return res.status(404).send('File not found');
// }

// // Set the response headers for the download
// res.setHeader('Content-Type', 'application/pdf');
// res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

// // Stream the file to the response
// const fileStream = fs.createReadStream(filePath);
// fileStream.pipe(res);
