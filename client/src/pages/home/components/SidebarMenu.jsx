import UseUserRooms from "../../../hooks/query/UseUserRooms";

/* eslint-disable react/prop-types */
const SidebarMenu = ({ activeRoom, showRoomChats }) => {
  const { data } = UseUserRooms(true);

  return (
    <div className="w-72 h-full border-r border-color_2">
      {data?.rooms.length > 0 ? (
        data.rooms.map((room, i) => {
          const { id, name, members } = room;

          return (
            <div
              key={i}
              className={`w-full cursor-pointer hover:bg-color_3 hover:text-color_1 pl-6 border-b border-color_2 p-3 flex items-center gap-4 ${
                id === activeRoom && "bg-color_3 text-color_1"
              }`}
              onClick={() => showRoomChats(id)}
            >
              <img
                src={members[0].photo}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div>{name || members[0].name}</div>
                <div className="text-xs">{!name && members[0].email}</div>
              </div>
            </div>
          );
        })
      ) : (
        <div>Sorry, no chat available</div>
      )}
    </div>
  );
};

export default SidebarMenu;
