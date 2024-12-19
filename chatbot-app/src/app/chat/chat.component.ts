import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from '@angular/common/http';
import { cuadernos, preguntasRespuesta } from '../models/cuadernos.interface';
import { ServicioCuadernosService } from '../services/servicio-cuadernos.service';
import Swal from 'sweetalert2';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface HistorialConversacion {
  pregunta: string;
  respuesta: string;
  fecha: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  // para los cambios de temas
  temaActual: string = 'light';

  // para el historial de las conversaciones
  todaConversacion: HistorialConversacion[] = [];

  // para mostrar multiples cuadernos
  nuevoNombre!: string;

  mostrarCuadernos: boolean = false;
  cuadernoActual: any;
  todosCuadernos: cuadernos[] = [];
  miCuaderno: cuadernos = {
    nombre: 'cuaderno 1',
    todasPreguntas: [

    ],
  };


  // para el funcionamiento de la consola
  messages: { text: string; sender: string; date: Date; image: string }[] = [];
  private model: tf.LayersModel | null = null;
  userInput: string = '';
  userName: string = 'Usuario';
  botName: string = 'Chatbot';
  data: any = null;
  pairs: any = null;
  vocab: any = null;
  vocabSize: any = null;
  uniqueResponses: any = null;
  responseToIndex: any = null;
  inputs: any = null;
  outputs: any = null;
  indexToResponse: any;
  isMobileView = false;


  constructor(
    private chatbotService: ChatbotService,
    private http: HttpClient,
    private servicioCuadernos: ServicioCuadernosService,
    private breakpointObserver: BreakpointObserver
  ) { }

  async ngOnInit(): Promise<void> {
    // mostrar cuadernos
    this.todosCuadernos.push(this.miCuaderno);
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobileView = result.matches;
    });
    await this.loadModel(); //se carga el modelo
    await this.loadDialogs(); //se crga el dialogo

    if (this.data) {
      this.pairs = this.preprocessData(this.data);
      this.vocab = this.createVocabulary(this.pairs.map((p) => p.input));
      this.vocabSize = this.vocab.length;

      this.uniqueResponses = Array.from(
        new Set(this.pairs.map((pair) => pair.output))
      );
      this.responseToIndex = this.uniqueResponses.reduce(
        (obj, response, index) => {
          obj[response] = index;
          return obj;
        },
        {}
      );
      this.indexToResponse = Object.fromEntries(
        Object.entries(this.responseToIndex).map(([k, v]) => [v, k])
      );
      this.inputs = this.pairs.map((pair) =>
        this.encodeText(pair.input, this.vocab)
      );
      this.outputs = this.pairs.map(
        (pair) => this.responseToIndex[pair.output]
      );
      console.log('Preprocesamiento de datos completo.');
    } else {
      console.error('No se cargaron los datos correctamente.');
    }
  }

  async loadModel(): Promise<void> {
    try {
      const modelUrl = 'assets/modelo/model.json';
      this.model = await tf.loadLayersModel(modelUrl);
      console.log('Modelo cargado exitosamente');
    } catch (error) {
      console.error('Error al cargar el modelo:', error);
    }
  }

  async loadDialogs(): Promise<void> {
    try {
      const response = await this.http.get('assets/dialogues.json').toPromise();
      this.data = response;
      console.log('Datos cargados:', this.data);
    } catch (error) {
      console.error('Error al cargar el archivo de diálogos:', error);
    }
  }

  preprocessData(data: any) {
    const pairs: any[] = [];
    for (let i = 0; i < data.length - 1; i++) {
      pairs.push({ input: data[i].text, output: data[i + 1].text });
    }
    return pairs;
  }

  createVocabulary(data: any[]) {
    const vocab = new Set();
    data.forEach((text) => {
      text.split(' ').forEach((word) => vocab.add(word.toLowerCase()));
    });
    return Array.from(vocab);
  }

  encodeText(text: string, vocab: any[]) {
    const encoded = Array(this.vocabSize).fill(0);
    text
      .toLowerCase()
      .split(' ')
      .forEach((word) => {
        const index = vocab.indexOf(word);
        if (index !== -1) {
          encoded[index] = 1;
        }
      });
    return encoded;
  }

  async predictionsModel(input: string): Promise<string> {
    if (!this.model) {
      console.error('El modelo aún no está cargado.');
      return 'Error: Modelo no cargado';
    }

    const encodedInput = this.encodeText(input.toLowerCase(), this.vocab);

    const predictionTensor = this.model?.predict(
      tf.tensor2d([encodedInput])
    ) as tf.Tensor;

    if (predictionTensor) {
      try {
        const array = await predictionTensor.array();
        const responseIndex = array[0].indexOf(Math.max(...array[0]));
        console.log('Respuesta obtenida:', this.indexToResponse[responseIndex]);
        return this.indexToResponse[responseIndex] || 'No entiendo eso.';
      } catch (error) {
        console.error('Error procesando predicción:', error);
        return 'Error';
      }
    }

    console.error('No se pudo realizar la predicción correctamente.');
    return 'Error';
  }

  descargar() {
    let textoPlano = '';
  
    //verifica si hay un cuaderno seleccionado
    const indiceCuadernoSeleccionado = this.servicioCuadernos.getItem();
  
    if (indiceCuadernoSeleccionado !== null && this.todosCuadernos[indiceCuadernoSeleccionado]) {
      const cuadernoSeleccionado = this.todosCuadernos[indiceCuadernoSeleccionado];
      cuadernoSeleccionado.todasPreguntas.forEach((valores) => {
        textoPlano += `Pregunta: ${valores.pregunta}\n`;
        textoPlano += `Respuesta: ${valores.respuesta}\n`;
        textoPlano += `Fecha: ${valores.fecha.toISOString()}\n\n`;
      });
    } else {
      console.error('No hay cuaderno seleccionado o el índice es inválido.');
      return;
    }
  
    //crear un Blob con el contenido del archivo de texto
    const blob = new Blob([textoPlano], { type: 'text/plain' });
  
    //crear una URL de descarga para el archivo
    const url = window.URL.createObjectURL(blob);
  
    //crear un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historial_conversacion.txt';
    link.click();
  
    //liberar la URL del objeto
    window.URL.revokeObjectURL(url);
  }
  

  async sendMessage(): Promise<void> {
    if (this.userInput.trim()) {
      this.messages.push({
        text: this.userInput,
        sender: this.userName,
        date: new Date(),
        image: 'assets/user-avatar.png',
      });

      //const botResponse = await this.predictionsModel(this.userInput);
      const botResponse = await this.predictionsModel(this.userInput.normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize());
      let historialConversacion: HistorialConversacion = {
        pregunta: this.userInput,
        respuesta: botResponse,
        fecha: new Date(),
      };
      this.todaConversacion.push(historialConversacion);

      //aca se agregan las conversaciones
      const indice = this.servicioCuadernos.getItem();

      //verifica si el índice no es nulo antes de usarlo
      if (indice !== null) {
        let preguntas: preguntasRespuesta = {
          pregunta: this.userInput,
          respuesta: botResponse,
          fecha: new Date(),
        };
        this.todosCuadernos.at(indice)?.todasPreguntas.push(preguntas);
      } else {
        console.error('No hay un índice válido en localStorage.');
      }

      console.log(this.todaConversacion);

      setTimeout(() => {
        this.messages.push({
          text: botResponse,
          sender: this.botName,
          date: new Date(),
          image: 'assets/bot-avatar.png',
        });
      }, 1000);

      this.userInput = '';
    }
  }

  //funcion parfa crear nuevos cuadernos
  creacionCuaderno() {

    if (this.nuevoNombre == undefined || this.nuevoNombre == null || this.nuevoNombre.length == 0) {
      Swal.fire({
        title: "Ingresa un nombre",
        text: "Debes ingresar un nombre para el chat",
        icon: "warning"
      });
    } else {
      let nuevoCuaderno: cuadernos = {
        nombre: this.nuevoNombre,
        todasPreguntas: [],
      };
      //se agrega
      this.todosCuadernos.push(nuevoCuaderno);
      this.nuevoNombre = ''
    }
  }

  //funcion de seleccion del cuaderno
  seleccionCuaderno(indice: number) {
    console.log(this.todosCuadernos.at(indice));
    this.servicioCuadernos.setItem(indice);

    //elimina los mensajes actuales
    this.messages = [];

    // se define los mensajes por cuaderno
    this.todosCuadernos.at(indice)?.todasPreguntas.forEach((valores) => {
      //usuario
      this.messages.push({
        text: valores.pregunta,
        sender: this.userName,
        date: valores.fecha,
        image: 'assets/user-avatar.png',
      });
      //bot
      this.messages.push({
        text: valores.respuesta,
        sender: this.botName,
        date: valores.fecha,
        image: 'assets/bot-avatar.png',
      });
    });
  }

  //funcion para eliminar el cuaderno
  eliminarCuaderno(indice: number) {

    if (this.todosCuadernos.length == 1) {
      this.messages = [];
    } else {
      this.todosCuadernos.splice(indice, 1);

      console.log(this.todosCuadernos);
    }

  }

  //funcion par cambia de temas
  toggleTheme(): void {
    this.temaActual = this.temaActual === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.temaActual);
  }

}
