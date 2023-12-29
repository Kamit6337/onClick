const joinRoom = (io, socket) => {
  socket.on("joinRoom", (arg, callback) => {
    const { rooms } = arg;

    rooms.forEach((room) => {
      socket.join(room);
    });

    callback({ status: "ok" });
  });
};

export default joinRoom;
