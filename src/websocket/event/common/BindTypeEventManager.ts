import BindSocketEventManager from '../BindSocketEventManager';
import { Container } from '../../../container/common/Container';

export class BindTypeEventManager {
  removeSocket(container: Container, socketId: number) {
    container.removeSocket(socketId);
    BindSocketEventManager.removeSocket(socketId);
  }
}
