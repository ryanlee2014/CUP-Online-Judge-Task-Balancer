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
    socket.emit("status", {});
  }

  bindStatusEvent(socket: ISocket) {
    socket.on('status', (payload) => {
      Judger.setStatus(socket.socketId, payload);
      Submitter.runForAll((submitterSocket) => {
        submitterSocket.emit('status', payload);
      });
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
      Submitter.getSocket(solutionId).emit("reject_judge", payload);
    });
  }

  bindJudgerEvent(socket: ISocket) {
    socket.on('judger', (payload) => {
      const solutionId = payload.solution_id;
      const finish = payload.finish;
      Submitter.getSocket(solutionId).emit('judger', payload);
      if (finish) {
        // setTimeout(() => {
        //   Submitter.removeSocket(solutionId);
        // }, 1000);
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
