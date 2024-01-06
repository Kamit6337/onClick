import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const getPDFDownload = catchAsyncError(async (req, res, next) => {
  const { path } = req.body; //images/image.jpeg

  console.log("path", path);

  if (!path) {
    return next(new HandleGlobalError("Path is not provided", 404));
  }

  const filePath = `/public/${path}`;

  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const fileName = `pdf_${date}-${month}:${year}.pdf`;

  res.download(filePath, fileName);
});

export default getPDFDownload;
