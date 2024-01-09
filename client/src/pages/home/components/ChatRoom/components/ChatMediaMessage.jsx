/* eslint-disable react/prop-types */
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { useEffect } from "react";
import SpeedDial from "../../../../../components/SpeedDial";
import SelectImageFile from "../../../../../lib/SelectImageFile";
import ShowToastifyError from "../../../../../components/ShowToastifyError";
import { useSelector } from "react-redux";
import { roomsState } from "../../../../../redux/slice/roomSlice";
import SelectPdfFile from "../../../../../lib/SelectPdfFile";
import SendChatFile from "../../../../../hooks/mutation/SendChatFile";

const actions = [
  { id: 1, icon: <FileCopyIcon />, name: "Copy" },
  { id: 2, icon: <SaveIcon />, name: "Save" },
  { id: 3, icon: <PrintIcon />, name: "PDF" },
  { id: 4, icon: <InsertPhotoOutlinedIcon />, name: "Photo" },
];

export default function ChatMediaMessage() {
  const { isFile, file, reset, onClick, Input: ImageInput } = SelectImageFile();
  const {
    isFile: pdfIsFile,
    file: pdfFile,
    reset: pdfReset,
    onClick: pdfOnClick,
    Input: PDFInput,
  } = SelectPdfFile();

  const { activeRoom } = useSelector(roomsState);

  const imageMutation = SendChatFile({ fileType: "image" });
  const pdfMutation = SendChatFile({ fileType: "pdf" });

  const { ToastContainer: ErrorContainer } = ShowToastifyError({
    isError: imageMutation.isError || pdfMutation.isError,
    error: imageMutation.error || pdfMutation.error,
  });

  useEffect(() => {
    if (isFile) {
      reset();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("room", activeRoom);
      imageMutation.mutate(formData);
    }
  }, [isFile, file, activeRoom, reset, imageMutation]);

  useEffect(() => {
    if (pdfIsFile) {
      pdfReset();
      console.log("pdf file", pdfFile);
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("room", activeRoom);
      pdfMutation.mutate(formData);
    }
  }, [pdfIsFile, pdfFile, activeRoom, pdfReset, pdfMutation]);

  const handleDifferentOptions = (id) => {
    if (id === 3) {
      pdfOnClick();
    } else if (id === 4) {
      onClick();
    }
  };

  return (
    <>
      <div>
        <SpeedDial
          actions={actions}
          handleOptionClick={handleDifferentOptions}
        />
        {/* <FileExplorer forwardRef={ref} handleFile={handleFile} /> */}
      </div>
      <ImageInput />
      <PDFInput />
      <ErrorContainer />
    </>
  );
}
