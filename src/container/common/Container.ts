import { ISocket } from '../../websocket/event/BindSocketEventManager';

export class Container {
  socketSet: {[x: string]: ISocket} = {};

  socketSetArray: ISocket[] = [];

  getSocket(socketId: number | string) {
    return this.socketSet[socketId];
  }

  setSocket(socketId: number | string, socket: ISocket) {
    this.socketSet[socketId] = socket;
    this.socketSetArray = Object.values(this.socketSet);
  }

  removeSocket(socketId: number | string) {
    if (Object.prototype.hasOwnProperty.call(this.socketSet, socketId)) {
      delete this.socketSet[socketId];
      this.socketSetArray = Object.values(this.socketSet);
    }
  }

  runForAll(cb: (socket: ISocket) => any) {
    this.socketSetArray.forEach(socket => {
      cb(socket);
    })
  }
}

export default new Container();
