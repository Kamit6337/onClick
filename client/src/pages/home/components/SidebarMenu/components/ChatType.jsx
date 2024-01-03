import SpeedDial from "../../../../../components/SpeedDial";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import { useDispatch } from "react-redux";
import { toggleGroupChatForm } from "../../../../../redux/slice/toggleSlice";
const actions = [
  { id: 1, icon: <FileCopyIcon />, name: "Copy" },
  { id: 2, icon: <SaveIcon />, name: "Save" },
  { id: 3, icon: <PrintIcon />, name: "Print" },
  { id: 4, icon: <Groups2OutlinedIcon />, name: "Group Chat" },
];

const ChatType = () => {
  const dispatch = useDispatch();

  const handleOptionClick = (id) => {
    if (id === 4) {
      dispatch(toggleGroupChatForm(true));
    }
  };

  return (
    <>
      <SpeedDial
        actions={actions}
        position="right"
        size="bigger"
        handleOptionClick={handleOptionClick}
      />
    </>
  );
};

export default ChatType;
