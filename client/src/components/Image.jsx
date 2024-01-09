/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SelectImageFile from "../lib/SelectImageFile";

const ImageComp = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const { Input, isFile, file, reset, onClick } = SelectImageFile();

  useEffect(() => {
    if (isFile) {
      setSelectedPhoto(file);
      reset();
    }
  }, [isFile, file, reset]);

  const Image = ({ src, alt = "profile" }) => {
    return (
      <div className="w-full h-full relative">
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full cursor-pointer"
        />
        <div className="absolute z-10 bottom-0 right-0 mr-2 mb-2  bg-color_4 p-1 cursor-pointer rounded-full">
          <ModeEditIcon className="text-color_1" onClick={onClick} />;
        </div>
        <Input />
      </div>
    );
  };

  return { file: selectedPhoto, Image };
};

export default ImageComp;

// {isPending && (
//     <div className="absolute top-0 border border-color_4 rounded-full w-full h-full backdrop-blur-sm z-10 ">
//       <Loading hScreen={false} small={true} />
//     </div>
//   )}
