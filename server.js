import { Server as httpServer } from 'http';
import { Server as ioServer } from 'socket.io';
import cluster from 'cluster';
import { cpus } from 'os';
import parseArgs from 'minimist';

import app from './app.js';
import Sockets from './sockets.js';
import { loggerInfo, loggerError } from './config/log4.js';

/* ----------------------------- params settings ---------------------------- */
const options = { default: { port: 8080 } };
const args = parseArgs(process.argv.slice(2), options);
const clusterMode = process.argv[4] == 'CLUSTER';

/* ----------------------------- server settings ---------------------------- */
if (clusterMode && cluster.isPrimary) {
  const numCPUs = cpus().length;
  loggerInfo.info(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    const fecha = new Date().toLocaleString();
    loggerInfo.info(
      `Worker ${worker.process.pid} fue terminado a las: ${fecha}`
    );
    cluster.fork();
  });
} else {
  const serverHTTP = new httpServer(app);
  const io = new ioServer(serverHTTP);

  /* ----------------------------- socket settings ---------------------------- */
  Sockets(io);
  const server = serverHTTP.listen(args.port, () => {
    loggerInfo.info(`Servidor HTTP escuchando en el puerto ${server.address().port}`);

    loggerInfo.info(`PID WORKER ${process.pid}`);
  });

  server.on('error', (error) => {
    loggerError.error(`Error en el servidor: ${error.message}`);
  });
}

//node server.js --port 8080 FORK/CLUSTER

//node --prof server.js 

//node --prof-process fork-v8.log > result-fork-v8.txt

//artillery quick --count 20 -n 50 http://localHost:8080/info 50 request con 20 usuarios

//node --inspect server.js

//autocannon -c 100 -d 20 http://localHost:8080/info

//0x server.js --port 8080 FORK