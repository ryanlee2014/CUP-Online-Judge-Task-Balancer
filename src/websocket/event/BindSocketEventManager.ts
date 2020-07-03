import { Socket } from 'socket.io';
import ConcurrentLock from '../../lib/decorator/ConcurrentLock';
import BindSubmitterEventManager from './BindSubmitterEventManager';
import BindJudgerEventManager from './BindJudgerEventManager';

export interface ISocket extends Socket {
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

interface TypePayload {
  type: 'submitter' | 'judger'
}

class BindSocketEventManager {

  id = 0;

  socketSet = {};

  constructor() {

  }

  @ConcurrentLock
  async incrementId() {
    ++this.id;
    this.id %= 1000;
  }

  public async bindSocket(socket: ISocket) {
    socket.socketId = this.id;
    await this.incrementId();
    this.setSocket(socket.socketId, socket);
    socket.on('type', (payload: TypePayload) => {
      switch (payload.type) {
        case 'submitter':
          BindSubmitterEventManager.bindEvents(socket);
          break;
        case 'judger':
          BindJudgerEventManager.bindEvents(socket);
          break;
        default:
          return;
      }
    });
  }

  setSocket(socketId: string | number, socket: Socket) {
    this.socketSet[socketId] = socket;
  }

  getSocket(socketId: string | number): Socket {
    return this.socketSet[socketId];
  }

  removeSocket(socketId: string | number) {
    if (this.socketSet[socketId]) {
      setTimeout(() => {
        delete this.socketSet[socketId];
      }, 60000);
    }
  }
}

export default new BindSocketEventManager();
