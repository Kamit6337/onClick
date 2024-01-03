/* eslint-disable react/prop-types */
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { useEffect } from "react";
import OpenFileExplorer from "../../../../../lib/OpenFileExplorer";
import UseSocket from "../../../../../hooks/socket/UseSocket";
import SpeedDial from "../../../../../components/SpeedDial";

const actions = [
  { id: 1, icon: <FileCopyIcon />, name: "Copy" },
  { id: 2, icon: <SaveIcon />, name: "Save" },
  { id: 3, icon: <PrintIcon />, name: "Print" },
  { id: 4, icon: <InsertPhotoOutlinedIcon />, name: "Photo" },
];

export default function ChatMediaMessage({ activeRoom }) {
  const { isFile, file, reset, onClick, Input } = OpenFileExplorer();
  const { emit } = UseSocket();

  useEffect(() => {
    if (isFile) {
      console.log("file", file);
      const messageObj = {
        room: activeRoom,
        photo: file,
      };

      emit("image", messageObj, (response) => {
        console.log("response", response);
      });
      reset();
    }
  }, [isFile, file, activeRoom, emit, reset]);

  const handleDifferentOptions = (id) => {
    if (id === 4) {
      onClick();
    }
  };

  return (
    <div>
      <SpeedDial actions={actions} handleOptionClick={handleDifferentOptions} />
      <Input />
      {/* <FileExplorer forwardRef={ref} handleFile={handleFile} /> */}
    </div>
  );
}
