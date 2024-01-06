import multer from "multer";
import path from "path";

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file if it is an image
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};
const pdfFilter = (req, file, cb) => {
  // Check if the uploaded file is a PDF
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."), false);
  }
};

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true); // Accept the file if it is a video
  } else {
    cb(new Error("Invalid file type. Only videos are allowed."), false);
  }
};

// MARK: CHAT IMAGE STORAGE
const chatImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/chat"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const chatImageUpload = multer({
  storage: chatImageStorage,
  fileFilter: imageFilter,
});

// MARK: USER IMAGE STORAGE
const userProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/userProfile"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const userProfileUpload = multer({
  storage: userProfileStorage,
  fileFilter: imageFilter,
});

// MARK: GROUP IMAGE STORAGE
const groupChatProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/groupChatProfile"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const groupChatProfileUpload = multer({
  storage: groupChatProfileStorage,
  fileFilter: imageFilter,
});

// MARK: CHAT PDF STORAGE
const chatPDFStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/pdfs/chat"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const chatPDFUpload = multer({
  storage: chatPDFStorage,
  fileFilter: pdfFilter,
});

// MARK: CHAT VIDEO STORAGE
const chatVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos/chat"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const chatVideoUpload = multer({
  storage: chatVideoStorage,
  fileFilter: videoFilter,
});
