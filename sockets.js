import MsgContainer from './src/apis/msgContainer.js';
import { loggerInfo } from './config/log4.js';

//const productsApi = new ProductContainer();
const messagesApi = MsgContainer;

const Sockets = (io) => {
  io.on('connection', async (socket) => {
    loggerInfo.info(`\nUn cliente con el id: [${socket.id}] se ha conectado.`);

    /*// carga inicial de productos
    socket.emit('view-products', await productsApi.readProducts());*/

    // carga inicial de mensajes
    socket.emit('view-messages', await messagesApi.messageVcontroller());

    socket.on('disconnect', (_) => {
      loggerInfo.info(`El cliente con el id: [${socket.id}] se ha desconectado.\n`);
    });
  });
};

export default Sockets;