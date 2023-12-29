/* eslint-disable react/prop-types */
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { Icons } from "../../assets/icons";
import { useEffect, useState } from "react";
import FileExplorer from "../FileExplorer";
import OpenFileExplorer from "../../lib/OpenFileExplorer";
import UseSocket from "../../hooks/socket/UseSocket";

const actions = [
  { id: 1, icon: <FileCopyIcon />, name: "Copy" },
  { id: 2, icon: <SaveIcon />, name: "Save" },
  { id: 3, icon: <PrintIcon />, name: "Print" },
  { id: 4, icon: <InsertPhotoOutlinedIcon />, name: "Photo" },
];

export default function ChatMediaMessage({ activeRoom }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [index, setIndex] = useState(null);
  const { ref, handleFile, isFile, file, reset, onClick } = OpenFileExplorer();
  const { emit } = UseSocket();

  useEffect(() => {
    if (isFile) {
      console.log("file", file);
      const messageObj = {
        room: activeRoom,
        type: "file",
        body: file,
        size: file.size,
        mimeType: file.type,
        fileName: file.name,
      };

      emit("image", messageObj);
      reset();
    }
  }, [isFile, file, activeRoom, emit, reset]);

  const handleDifferentOptions = (id) => {
    if (id === 4) {
      onClick();
    }
  };

  return (
    <>
      <section className="relative" onMouseLeave={() => setToggleMenu(false)}>
        <div
          className="rounded-full p-2 bg-color_3 text-color_1 hover:bg-color_3/90"
          onMouseEnter={() => setToggleMenu(true)}
          onClick={() =>
            toggleMenu ? setToggleMenu(false) : setToggleMenu(true)
          }
        >
          <Icons.plus
            className={`${
              toggleMenu && "rotate-45"
            } transition-all duration-300 text-xl`}
          />
        </div>
        {toggleMenu && (
          <div className="absolute bottom-full flex flex-col  gap-6 pb-8">
            {actions.map((action, i) => {
              const { id, icon, name } = action;

              return (
                <div key={i} className="relative cursor-pointer  text-center">
                  <p
                    onMouseEnter={() => setIndex(i)}
                    onMouseLeave={() => setIndex(null)}
                    className="p-1 bg-color_3 box_shadow rounded-full text-color_1 text-sm"
                    onClick={() => handleDifferentOptions(id)}
                  >
                    {icon}
                  </p>

                  {index === i && (
                    <div className="absolute top-0 z-10 right-full mr-2 bg-color_4/50 text-color_1 px-1 py-[1px] rounded-md  ">
                      {name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
      <FileExplorer forwardRef={ref} handleFile={handleFile} />
    </>
  );
}
