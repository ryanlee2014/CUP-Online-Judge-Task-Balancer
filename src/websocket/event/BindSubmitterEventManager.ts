import { ISocket } from './BindSocketEventManager';
import { BindTypeEventManager } from './common/BindTypeEventManager';
import Submitter from '../../container/Submitter';
import Judger from '../../container/Judger';

interface ISubmissionRequest {
  solutionId: string,
  data: any,
  admin: boolean,
  no_sim: boolean,
  priority: number
}

class BindSubmitterEventManager extends BindTypeEventManager {
  bindEvents(socket: ISocket) {
    this.bindStatusEvent(socket);
    this.bindSubmissionEvent(socket);
    this.bindDisconnectEvent(socket);
    this.register(socket);
  }

  register(socket: ISocket) {
    socket.emit('status', Judger.getStatus());
  }

  bindStatusEvent(socket: ISocket) {
    socket.on('status', () => {
      socket.emit('status', Judger.getStatus());
    });
  }

  bindSubmissionEvent(socket: ISocket) {
    socket.on('submission', async (payload: ISubmissionRequest) => {
      const { solutionId } = payload;
      Submitter.setSocket(solutionId, socket);
      const judgerSocket = Judger.getRandomSocket();
      judgerSocket.emit('submission', payload);
    });
  }

  bindDisconnectEvent(socket: ISocket) {
    socket.on('disconnect', async () => {
      this.removeSocket(Submitter, socket.socketId);
    });
  }
}

export default new BindSubmitterEventManager();
