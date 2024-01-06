import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRooms } from "../../redux/slice/roomSlice";
import { getReq } from "../../utils/api/api";

const UseRoomChats = ({ toggle = false, list }) => {
  const dispatch = useDispatch();
  const [isLoading, setLoadingList] = useState(false);
  const [isError, setIsErrorList] = useState(false);
  const [error, setErrorList] = useState(null);
  const [roomChatsData, setRoomChatsData] = useState(null);

  useEffect(() => {
    const fetchRoomChats = async () => {
      try {
        setLoadingList(true);

        const requests = list.map(async (room) => {
          const roomChats = await getReq("/chat", { id: room._id });

          return { ...room, chats: roomChats?.data };
        });

        const results = await Promise.all(requests);

        setRoomChatsData(results);
      } catch (error) {
        setErrorList(error);
        setIsErrorList(true);
      } finally {
        setLoadingList(false);
      }
    };

    if (toggle) {
      fetchRoomChats();
    }
  }, [toggle, list]);

  useEffect(() => {
    if (roomChatsData) {
      dispatch(setRooms(roomChatsData));
    }
  }, [roomChatsData, dispatch]);

  return { isLoading, isError, error };
};

export default UseRoomChats;
