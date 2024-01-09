import { useEffect, useState } from "react";
import UseSocket from "../../../../hooks/socket/UseSocket";

const HandleSocket = () => {
  const { isConnecting, isConnected, isDisconnected } = UseSocket();

  const [showIsConnected, setShowIsConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setShowIsConnected(true);

      // Set a timeout to hide the message after 5 seconds
      const timeoutId = setTimeout(() => {
        setShowIsConnected(false);
      }, 5000);

      // Clear the timeout when the component unmounts or when isConnected becomes false
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isConnected]);

  return (
    <div className="absolute z-50 top-0 left-1/2  w-max h-max flex justify-center bg-color_2   text-color_4 rounded-b-xl">
      {isDisconnected && (
        <p className="p-2 border border-color_4 border-t-0 rounded-b-xl">
          Socket is disconnected
        </p>
      )}
      {isConnecting && (
        <p className="p-2 border border-color_4 border-t-0 rounded-b-xl">
          Socket is connecting
        </p>
      )}
      {showIsConnected && (
        <p className="p-2 border border-color_4 border-t-0 rounded-b-xl">
          Socket is connected
        </p>
      )}
    </div>
  );
};

export default HandleSocket;
