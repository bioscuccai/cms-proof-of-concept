'use strict';
var io=new require('socket.io')();
io.set("origins", "*:*");

//io.sockets.emit("new_reading", data);

function setup(http){
  io.attach(http);
  io.on("connect", socket=>{
    console.log("connect");
  });
  return io;
}
module.exports ={
  setup,
  io
};