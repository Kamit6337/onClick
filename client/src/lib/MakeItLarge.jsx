/* eslint-disable react/prop-types */

import { useEffect, useRef } from "react";

const MakeItLarge = ({ hScreen = true, photo, radius = 100, forwardedRef }) => {
  const newRef = useRef(null);

  useEffect(() => {
    if (forwardedRef && newRef) {
      forwardedRef.current = newRef.current;
    }
  }, [forwardedRef]);

  if (!photo) {
    return null;
  }

  return (
    <div
      className={`${
        hScreen ? "h-screen" : "h-full"
      } backdrop-blur-sm absolute top-0 left-0 z-50 w-full flex justify-center items-center`}
      ref={newRef}
    >
      <div
        className={`rounded-full `}
        style={{ width: `${radius}px`, height: `${radius}px` }}
      >
        <img src={photo} alt="profile" className="w-full h-full rounded-full" />
      </div>
    </div>
  );
};

export default MakeItLarge;
