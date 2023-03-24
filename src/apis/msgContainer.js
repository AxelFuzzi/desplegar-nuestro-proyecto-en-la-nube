import express from 'express';
const app = express();
import messageService from '../service/message.js'
import { loggerError } from '../../config/log4.js';


class messageContainer{
  constructor(modelo){
    this.modelo = modelo
  }

  async messageVcontroller (req, res, next) {
    try {

      let contenido = await messageService.vistaMessage();

        if(contenido.length == 0){

          throw new Error('no hay mensajes en la base de datos')

        }else{
          
          return contenido
          
        }

    } catch (error) {
      loggerError.error(error)

    }
  }
}

export default new messageContainer();
