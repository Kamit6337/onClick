import { useEffect, useState } from "react";
import UseUserRooms from "../query/UseUserRooms";
import environment from "../../utils/environment";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Toastify from "../../lib/Toastify";

const UseSocket = () => {
  const [socket, setSocket] = useState(null);
  const { data: roomsData } = UseUserRooms(true);
  const navigate = useNavigate();
  const maxRetryAttempts = 10; // Maximum number of retry attempts
  let retryCounter = 0;
  const { ToastContainer, showAlertMessage, showSuccessMessage } = Toastify();

  useEffect(() => {
    const connectSocket = () => {
      showAlertMessage({
        message: "Wait. Socket is Connecting",
        position: "top-center",
      });
      const newSocket = io(environment.SERVER_URL, {
        withCredentials: true,
      });

      setSocket(newSocket);

      const roomList = roomsData?.data.map((room) => room._id);

      const joinConnectionArg = (arg) => {
        if (arg === "ok") {
          if (roomList.length > 0) {
            newSocket.emit("joinRoom", { rooms: roomList }, (err) => {
              if (err) {
                // console.log("error", err); //{status : "ok"}
              }
            });
          }
        }
      };

      newSocket.on("joinConnection", joinConnectionArg);

      newSocket.on("connect", () => {
        // Reset retry counter on successful connection
        showSuccessMessage({
          message: "Socket connection Completed",
          position: "top-center",
        });
        retryCounter = 0;
      });

      return newSocket;
    };

    const handleConnectionError = (error) => {
      console.error("Socket connection error:", error);

      // Increment the retry counter
      retryCounter++;

      // Retry connection if the maximum attempts are not reached
      if (retryCounter < maxRetryAttempts) {
        console.log(`Retrying socket connection. Attempt ${retryCounter}`);
        setTimeout(() => {
          setSocket(connectSocket());
        }, 1000); // Delay before retrying (adjust as needed)
      } else {
        // Show error page after maximum retry attempts
        navigate("/error", { state: { message: "Socket connection failed" } });
      }
    };

    const initialSocket = connectSocket();

    initialSocket.on("connect_error", handleConnectionError);

    // Clean up the socket connection when the component unmounts
    return () => {
      initialSocket.off("connect_error", handleConnectionError);
      initialSocket.disconnect();
    };
  }, [roomsData, navigate]);

  return {
    ToastContainer,
    socket,
    emit: (event, data, callback) => {
      // Wrapper function to emit events
      if (socket) {
        socket.emit(event, data, callback);
      }
    },
    on: (event, callback) => {
      // Wrapper function to listen for events
      if (socket) {
        socket.on(event, callback);
      }
    },
    off: (event, callback) => {
      // Wrapper function to remove event listeners
      if (socket) {
        socket.off(event, callback);
      }
    },
  };
};

export default UseSocket;
