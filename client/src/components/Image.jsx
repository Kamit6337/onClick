/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import OpenFileExplorer from "../lib/OpenFileExplorer";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const ImageComp = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const { Input, isFile, file, reset, onClick } = OpenFileExplorer();

  useEffect(() => {
    if (isFile) {
      setSelectedPhoto(file);
      reset();
    }
  }, [isFile, file, reset]);

  const Image = ({ src }) => {
    return (
      <div className="w-full h-full relative">
        <img
          src={selectedPhoto ? URL.createObjectURL(selectedPhoto) : src}
          loading="lazy"
          alt="profile"
          className="w-full h-full rounded-full cursor-pointer"
        />
        <div className="absolute z-10 bottom-0 right-0 mr-4 mb-4  bg-color_4 p-1 cursor-pointer rounded-full">
          <ModeEditIcon className="text-color_1" onClick={onClick} />;
        </div>
        <Input />
      </div>
    );
  };

  return { file, Image };
};

export default ImageComp;

// {isPending && (
//     <div className="absolute top-0 border border-color_4 rounded-full w-full h-full backdrop-blur-sm z-10 ">
//       <Loading hScreen={false} small={true} />
//     </div>
//   )}
