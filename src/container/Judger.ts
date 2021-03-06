import { Container } from './common/Container';

class Judger extends Container {
  status = {};

  constructor() {
    super();
    setInterval(() => {
      this.runForAll((judgerSocket) => {
        judgerSocket.emit("status", {});
      });
    }, 10000);

  }

  setStatus(socketId: number | string, status: any) {
    this.status[socketId] = status;
  }

  removeStatus(socketId: number | string) {
    if (Object.prototype.hasOwnProperty.call(this.status, socketId)) {
      delete this.status[socketId];
    }
  }

  removeSocket(socketId: number | string) {
    super.removeSocket(socketId);
    this.removeStatus(socketId);
  }

  getStatus() {
    const payload = {free_judger: []};
    for (let i in this.status) {
      if (Object.prototype.hasOwnProperty.call(this.status, i)) {
        payload.free_judger.push(...this.status[i].free_judger);
      }
    }
    return payload;
  }

  getRandomSocket() {
    const length = this.socketSetArray.length;
    return this.socketSetArray[this.getRandomInt(0, length)];
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export default new Judger();
