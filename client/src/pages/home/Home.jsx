import SidebarMenu from "./components/SidebarMenu/SidebarMenu";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import { useSelector } from "react-redux";
import { toggleInitialState } from "../../redux/slice/toggleSlice";
import GroupChatForm from "./components/SidebarMenu/components/GroupChatForm";
import SearchUsers from "../../components/SearchUsers";
import UpdateGroupChatForm from "./components/ChatRoom/components/UpdateGroupChatForm";
import ListeningSocket from "../../components/ListeningSocket";
import RightClickMenu from "./components/ChatRoom/components/RightClickMenu";
import DeleteChat from "../../hooks/mutation/DeleteChat";

import HandleSocket from "./components/HandleSocket/HandleSocket";

const Home = () => {
  ListeningSocket();

  const { groupChatForm, updateGroupChat, showChatOptions } =
    useSelector(toggleInitialState);

  return (
    <>
      <article className="w-full h-full flex ">
        <section className="basis-72 h-full border-r border-color_2">
          <header className="w-full h-14 px-4 border-b border-color_2">
            <SearchUsers />
          </header>
          {/* MARK: SIDEBAR MENU */}
          <div className="w-full" style={{ height: "calc(100% - 56px)" }}>
            <SidebarMenu />
          </div>
        </section>

        {/* MARK: CHAT MESSAGES */}
        <main className="flex-1 h-full">
          <ChatRoom />
        </main>
      </article>
      {groupChatForm && <GroupChatForm />}
      {updateGroupChat && <UpdateGroupChatForm update={true} />}
      {showChatOptions.bool && <RightClickMenu data={showChatOptions.data} />}
      <HandleSocket />
      <DeleteChat />
    </>
  );
};

export default Home;
