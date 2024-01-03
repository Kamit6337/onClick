import { useEffect } from "react";
import SidebarMenu from "./components/SidebarMenu/SidebarMenu";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import { ErrorBoundary } from "react-error-boundary";
import UseSocket from "../../hooks/socket/UseSocket";
import { useDispatch, useSelector } from "react-redux";
import { updateRooms } from "../../redux/slice/roomSlice";
import { toggleInitialState } from "../../redux/slice/toggleSlice";
import GroupChatForm from "./components/SidebarMenu/components/GroupChatForm";
import SearchUsers from "../../components/SearchUsers";
import UpdateGroupChatForm from "./components/ChatRoom/components/UpdateGroupChatForm";

const Home = () => {
  const { socket, on, off, emit } = UseSocket();
  const dispatch = useDispatch();
  const { groupChatForm, updateGroupChat } = useSelector(toggleInitialState);

  useEffect(() => {
    const chatArg = (arg) => {
      dispatch(updateRooms(arg));
    };
    const imageArg = (arg) => {
      dispatch(updateRooms(arg));
    };

    on("chatMsg", chatArg);
    on("image", imageArg);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("chatMsg", chatArg);
      off("image", imageArg);
    };
  }, [socket, on, off, dispatch]);

  const createRoom = (user) => {
    emit("createSingleRoom", { id: user.id }, (err) => {
      console.log("createRoom", err);
    });
  };

  return (
    <>
      <article className="w-full h-full flex ">
        {/* <div className="w-full h-14">
          <Header />
        </div> */}

        <section className="basis-72 h-full border-r border-color_2">
          <header className="w-full h-14 px-4 border-b border-color_2">
            <SearchUsers userSelected={createRoom} />
          </header>
          <div className="w-full" style={{ height: "calc(100% - 56px)" }}>
            {/* MARK: SIDEBAR MENU */}
            <SidebarMenu />
          </div>
        </section>

        <main
          className="flex-1 h-full"
          // style={{ height: "calc(100% - 56px)" }}
        >
          {/* MARK: CHAT MESSAGES */}
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <ChatRoom />
          </ErrorBoundary>
        </main>
      </article>
      {groupChatForm && <GroupChatForm />}
      {updateGroupChat && <UpdateGroupChatForm update={true} />}
    </>
  );
};

export default Home;
