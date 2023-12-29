const joinConnection = (io, socket) => {
  socket.emit("joinConnection", "ok", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

export default joinConnection;
