import { ISocket } from './BindSocketEventManager';
import { BindTypeEventManager } from './common/BindTypeEventManager';
import Judger from '../../container/Judger';
import Submitter from '../../container/Submitter';

class BindJudgerEventManager extends BindTypeEventManager {
  bindEvents(socket: ISocket) {
    this.bindStatusEvent(socket);
    this.bindChangeEvent(socket);
    this.bindRejectEvent(socket);
    this.bindJudgerEvent(socket);
    this.bindDisconnectionEvent(socket);
    this.register(socket);
  }

  register(socket: ISocket) {
    Judger.setSocket(socket.socketId, socket);
  }

  bindStatusEvent(socket: ISocket) {
    socket.on('status', (payload) => {
      Judger.setStatus(socket.socketId, payload);
    });
  }

  bindChangeEvent(socket: ISocket) {
    socket.on('change', (payload) => {
      Submitter.runForAll((submitterSocket) => {
        submitterSocket.emit('change', payload);
      });
    });
  }

  bindRejectEvent(socket: ISocket) {
    socket.on('reject_judge', (payload) => {
      const solutionId: string = payload.solutionId;
      Submitter.getSocket(solutionId).emit(payload);
    });
  }

  bindJudgerEvent(socket: ISocket) {
    socket.on('judger', (payload) => {
      const solutionId = payload.solution_id;
      const finish = payload.finish;
      Submitter.getSocket(solutionId).emit(payload);
      if (finish) {
        Submitter.removeSocket(solutionId);
      }
    });
  }

  bindDisconnectionEvent(socket: ISocket) {
    socket.on('disconnection', () => {
      this.removeSocket(Judger, socket.socketId);
    });
  }
}

export default new BindJudgerEventManager();
