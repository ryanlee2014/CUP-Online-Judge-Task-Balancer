import { Container } from './common/Container';
import { ISocket } from '../websocket/event/BindSocketEventManager';

class Submitter extends Container {
  runForAll(cb: (socket: ISocket) => any) {
    this.socketSetArray.forEach(socket => {
      cb(socket);
    })
  }
}

export default new Submitter();
