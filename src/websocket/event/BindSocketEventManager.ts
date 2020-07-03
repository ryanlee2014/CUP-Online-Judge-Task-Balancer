import { Socket } from 'socket.io';
import ConcurrentLock from '../../lib/decorator/ConcurrentLock';

interface ISocket extends Socket {
  socketId: number
}

interface ISubmissionInfo {
  solution_id: number,
  source: string,
  custom_input: string | undefined | null,
  test_run: boolean,
  language: number,
  user_id: string,
  problem_id: number,
  spj: boolean,
  time_limit: number,
  memory_limit: number
}

interface ISubmissionRequest {
  solutionId: string,
  data: any,
  admin: boolean,
  no_sim: boolean,
  priority: number
}

interface IRejectInfo {
  reason: string,
  solutionId: number | string
}

class BindSocketEventManager {

  id = 0;

  socketSet = {};

  distinceSocketSet = {};

  constructor() {

  }

  @ConcurrentLock
  async incrementId() {
    ++this.id;
    this.id %= 1000;
  }

  public async bindSocket(socket: ISocket) {
    socket.socketId = this.id;
    this.distinceSocketSet[this.id] = socket;
    await this.incrementId();
  }

  setSocket(solutionId: string, socket: Socket) {
    this.socketSet[solutionId] = socket;
  }

  getSocket(solutionId: string): Socket {
    return this.socketSet[solutionId];
  }

  removeSocket(solutionId: string) {
    if (this.socketSet[solutionId]) {
      setTimeout(() => {
        delete this.socketSet[solutionId];
      }, 60000);
    }
  }
}

export default new BindSocketEventManager();
