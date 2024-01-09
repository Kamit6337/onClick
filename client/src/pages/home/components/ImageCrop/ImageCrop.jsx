/* eslint-disable react/prop-types */
import { useRef } from "react";
import AvatarEditor from "react-avatar-editor";

// Function to convert data URL to File
const dataURLtoFile = (dataURL, fileName, lastModified) => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const imageType = mime.split("/")[1];
  const modifyFilename = `${fileName}.${imageType}`;

  // Create a new File object
  const file = new File([u8arr], modifyFilename, {
    type: mime,
    lastModified: lastModified || Date.now(),
  });

  return file;
};

const ImageCrop = ({ image, onCrop, radius = 250, cancelCrop }) => {
  const editorRef = useRef(null);

  const handleCrop = () => {
    const canvas = editorRef.current.getImage();

    const circularCanvas = document.createElement("canvas");
    const context = circularCanvas.getContext("2d");

    // Set the canvas size to be the same as the circular mask
    circularCanvas.width = radius;
    circularCanvas.height = radius;

    // Draw a circular mask
    context.beginPath();
    context.arc(radius / 2, radius / 2, radius / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();

    // Draw the rectangular image onto the circular canvas
    context.drawImage(canvas, 0, 0, radius, radius);

    // Get the data URL of the circular image
    const circularDataURL = circularCanvas.toDataURL();

    // Specify the desired filename
    const filename = "croppedImage";

    const croppedImageFile = dataURLtoFile(circularDataURL, filename);

    onCrop(croppedImageFile);
  };

  return (
    <div className="w-full h-full rounded-xl absolute z-50 top-0 flex flex-col justify-between items-center py-6 bg-red-400">
      <AvatarEditor
        ref={editorRef}
        image={URL.createObjectURL(image)}
        width={radius}
        height={radius}
        border={50}
        borderRadius={250}
        scale={1.25}
        className="rounded-lg"
      />
      <div className="flex justify-between items-center gap-6">
        <button
          onClick={cancelCrop}
          className="w-32 p-2 bg-color_2 cursor-pointer rounded-2xl "
        >
          Cancel
        </button>
        <button
          onClick={handleCrop}
          className=" w-32 p-2 bg-color_2 cursor-pointer rounded-2xl "
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ImageCrop;
