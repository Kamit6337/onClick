import { useEffect, useState } from "react";
import UseUserRooms from "../query/UseUserRooms";
import environment from "../../utils/environment";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  incSocketAttempt,
  resetSocket,
  socketState,
} from "../../redux/slice/SocketSlice";

const UseSocket = () => {
  const [socket, setSocket] = useState(null);
  const { data: roomsData } = UseUserRooms(true);
  const navigate = useNavigate();
  const maxRetryAttempts = 3; // Maximum number of retry attempts
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isReconnected, setIsReconnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const socketAttempt = useSelector(socketState);
  const dispatch = useDispatch();

  const connectSocket = () => {
    setIsDisconnected(false);
    setIsConnecting(true);
    const newSocket = io(environment.SERVER_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      // Reset retry counter on successful connection
      dispatch(resetSocket());
      setIsConnected(true);
      setIsDisconnected(false);
      setIsConnecting(false);
      setIsReconnecting(false);
      setIsReconnected(false);
    });

    return newSocket;
  };

  // MARK: TO MAKE CONNECTION INITIALLY
  useEffect(() => {
    if (!isConnected) {
      connectSocket();
    }
  }, [isConnected]);

  useEffect(() => {
    const handleConnectionError = (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
      setIsConnecting(false);

      // Retry connection if the maximum attempts are not reached
      if (socketAttempt.attempt < maxRetryAttempts) {
        console.log(
          `Retrying socket connection. Attempt ${socketAttempt.attempt}`
        );
        dispatch(incSocketAttempt());
        setTimeout(() => {
          setSocket(connectSocket());
        }, 1000); // Delay before retrying (adjust as needed)
      } else {
        // Show error page after maximum retry attempts
        navigate("/error", { state: { message: "Socket connection failed" } });
      }
    };

    const disconnectArg = () => {
      console.log("Socket disconnected");
      setIsDisconnected(true);
      setIsConnecting(false);
      setIsConnected(false);
      setIsReconnecting(false);
      setIsReconnected(false);
    };

    const reconnectingArg = () => {
      setIsReconnecting(true);
    };
    const reconnectArg = () => {
      setIsReconnected(true);
    };

    const roomList = roomsData?.data.map((room) => room._id);

    const joinConnectionArg = (arg) => {
      if (arg === "ok") {
        if (roomList.length > 0) {
          socket.emit("joinRoom", { rooms: roomList }, (response) => {
            if (response.status !== "ok") {
              console.log("error from join room", response.error); //{status : "ok"}
            }
          });
        }
      }
    };

    if (socket) {
      socket.on("joinConnection", joinConnectionArg);

      // MARK: IF ERROR OCCUR ON CONNECTION
      socket.on("connect_error", handleConnectionError);

      // MARK: ON DISCONNECTED OR RECONNECTING OR RECONNECTED
      socket.on("disconnect", disconnectArg);
      socket.on("reconnecting", reconnectingArg);
      socket.on("reconnect", reconnectArg);
    }

    return () => {
      socket?.off("connect_error", handleConnectionError);
      socket?.off("disconnect", disconnectArg);
      socket?.off("reconnecting", reconnectingArg);
      socket?.off("reconnect", reconnectArg);
    };
  }, [socket]);

  return {
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
    isReconnected,
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
