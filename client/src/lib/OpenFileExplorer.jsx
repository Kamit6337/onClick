import { useRef, useState } from "react";

const OpenFileExplorer = () => {
  const ref = useRef();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isFile, setIsFile] = useState(false);

  const reset = () => {
    setIsFile(false);
    setFile(null);
  };

  // Function to trigger file input click
  const onClick = () => {
    ref?.current?.click();
  };
  const handleFile = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setIsFile(true);
    } else {
      setIsFile(false);
      setFile(null);
      setError("File is not selected");
    }
  };

  return { isFile, ref, onClick, file, error, handleFile, reset };
};

export default OpenFileExplorer;

// Example :
// <input
// type="file"
// accept=".jpeg, .jpg, .png" // Specify accepted file types
// style={{ display: "none" }}
// ref={ref}
// onChange={handleFile}
// />
