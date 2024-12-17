export interface cuadernos {
  nombre: string;
  todasPreguntas: preguntasRespuesta[];
}

export interface preguntasRespuesta {
  pregunta: string;
  respuesta: string;
  fecha: Date;
}
