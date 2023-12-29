/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const FileExplorer = ({ forwardRef, handleFile }) => {
  const newRef = useRef();

  useEffect(() => {
    if (forwardRef && newRef) {
      forwardRef.current = newRef.current;
    }
  }, [forwardRef]);

  return (
    <input
      type="file"
      accept=".jpeg, .jpg, .png" // Specify accepted file types
      style={{ display: "none" }}
      ref={newRef}
      onChange={handleFile}
    />
  );
};

export default FileExplorer;
