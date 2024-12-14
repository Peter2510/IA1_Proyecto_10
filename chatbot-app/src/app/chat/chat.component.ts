import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from '@angular/common/http';
import { cuadernos } from '../models/cuadernos.interface';

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
      {
        pregunta: '¿Qué es TypeScript?',
        respuesta:
          'Es un superconjunto de JavaScript que añade tipado estático.',
        fecha: new Date('2024-12-11'),
      },
      {
        pregunta: '¿Cuál es la capital de Guatemala?',
        respuesta: 'Ciudad de Guatemala.',
        fecha: new Date('2024-12-10'),
      },
    ],
  };
  miCuaderno2: cuadernos = {
    nombre: 'cuaderno 2',
    todasPreguntas: [
      {
        pregunta: '¿Qué es Javascript?',
        respuesta: 'simon.',
        fecha: new Date('2024-12-11'),
      },
      {
        pregunta: '¿hola?',
        respuesta: 'que tal?',
        fecha: new Date('2024-12-10'),
      },
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

  constructor(
    private chatbotService: ChatbotService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    // mostrar cuadernos
    this.todosCuadernos.push(this.miCuaderno);
    this.todosCuadernos.push(this.miCuaderno2);

    await this.loadModel(); // Carga el modelo
    await this.loadDialogs(); // Carga el diálogo

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

    this.todaConversacion.forEach((valores) => {
      textoPlano += `Pregunta: ${valores.pregunta}\n`;
      textoPlano += `Respuesta: ${valores.respuesta}\n`;
      textoPlano += `Fecha: ${valores.fecha.toISOString()}\n\n`;
    });

    console.log(textoPlano);

    // Crear un Blob con el contenido del archivo de texto
    const blob = new Blob([textoPlano], { type: 'text/plain' });

    // Crear una URL de descarga para el archivo
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historial_conversacion.txt';
    link.click();

    // Liberar la URL del objeto
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

      const botResponse = await this.predictionsModel(this.userInput);
      let historialConversacion: HistorialConversacion = {
        pregunta: this.userInput,
        respuesta: botResponse,
        fecha: new Date(),
      };
      this.todaConversacion.push(historialConversacion);

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
    let nuevoCuaderno: cuadernos = {
      nombre: this.nuevoNombre,
      todasPreguntas: [],
    };
    //se agrega
    this.todosCuadernos.push(nuevoCuaderno);
  }

  //funcion de seleccion del cuaderno
  seleccionCuaderno(indice: number) {
    console.log(this.todosCuadernos.at(indice));
  }

  //funcion para eliminar el cuaderno
  eliminarCuaderno(indice: number) {
    this.todosCuadernos.splice(indice, 1);

    console.log(this.todosCuadernos);
  }

  // predict(input: any): any {
  //   if (!this.model) {
  //     console.error('El modelo aún no está cargado');
  //     return null;
  //   }

  //   // Realizar predicciones
  //   const tensorInput = tf.tensor(input);
  //   const prediction = this.model?.predict(tensorInput) as tf.Tensor;
  //   return prediction?.dataSync();
  // }

  //  trainingData = [
  //   { input: "Hola", output: "¡Hola! ¿Cómo puedo ayudarte hoy?" },
  //   { input: "Quien te creo", output: "Estudiantes de ia" },
  //   { input: "Quien es tu dios", output: "tensorflow" },
  //   { input: "¿Cómo estás?", output: "Estoy bien, gracias. ¿Y tú?" },
  //   { input: "¿Qué puedes hacer?", output: "Puedo ayudarte con preguntas generales." },
  //   { input: "Quien eres?", output: "Puedo ayudarte con preguntas generales." },
  //   { input: "Adiós", output: "¡Adiós! Espero verte pronto." },
  //   { input: "¿Cuál es tu nombre?", output: "Soy un chatbot creado para ayudarte." },
  //   { input: "¿Cómo te llamas?", output: "No tengo un nombre, pero me puedes llamar Chatbot." },
  //   { input: "¿Qué día es hoy?", output: "Lo siento, no tengo acceso a la fecha actual." },
  //   { input: "¿Cuál es la capital de Francia?", output: "La capital de Francia es París." },
  //   { input: "¿Quién es el presidente de los Estados Unidos?", output: "El presidente de los Estados Unidos es Joe Biden." },
  //   { input: "¿Cuántos continentes hay?", output: "Hay 7 continentes en el mundo." },
  //   { input: "¿Cuántos días tiene un año?", output: "Un año tiene 365 días, excepto en los años bisiestos que tiene 366." },
  //   { input: "¿Qué es la inteligencia artificial?", output: "La inteligencia artificial es la simulación de procesos de inteligencia humana mediante sistemas informáticos." },
  //   { input: "¿Dónde está la Torre Eiffel?", output: "La Torre Eiffel está en París, Francia." },
  //   { input: "¿Qué es un chatbot?", output: "Un chatbot es un programa de computadora diseñado para simular una conversación con usuarios humanos." },
  //   { input: "¿Puedes hacer matemáticas?", output: "Sí, puedo ayudarte con problemas matemáticos simples." },
  //   { input: "¿Me puedes decir un chiste?", output: "Claro, aquí va uno: ¿Por qué el libro de matemáticas se deprimió? Porque tenía demasiados problemas." },
  //   { input: "¿Cuántos animales hay en el zoológico?", output: "No tengo acceso a esa información, pero un zoológico generalmente tiene muchos animales de diferentes especies." },
  //   { input: "¿Dónde puedo comprar una computadora?", output: "Puedes comprar computadoras en tiendas en línea o en tiendas físicas de tecnología." },
  //   { input: "¿Qué hora es?", output: "Lo siento, no puedo decirte la hora, ya que no tengo acceso a la hora actual." },
  //   { input: "¿Puedes traducir al inglés?", output: "Sí, puedo traducir. ¿Qué quieres traducir?" },
  //   { input: "¿Quién inventó la luz eléctrica?", output: "La luz eléctrica fue inventada por Thomas Edison." },
  //   { input: "¿Qué es la energía solar?", output: "La energía solar es la energía que se obtiene de la luz del sol." },
  //   { input: "¿Cómo se llama el río más largo del mundo?", output: "El río más largo del mundo es el río Amazonas." },
  //   { input: "¿Qué es la gravedad?", output: "La gravedad es la fuerza que atrae los objetos hacia el centro de la Tierra." },
  //   { input: "¿Quién escribió 'Don Quijote de la Mancha'?", output: "El autor de 'Don Quijote de la Mancha' es Miguel de Cervantes." },
  //   { input: "¿Qué es el clima?", output: "El clima se refiere a las condiciones atmosféricas a largo plazo en una región." },
  //   { input: "¿Qué es la física?", output: "La física es la ciencia que estudia la materia, la energía y sus interacciones." },
  //   { input: "¿Qué es la economía?", output: "La economía es la ciencia que estudia la producción, distribución y consumo de bienes y servicios." },
  //   { input: "¿Cuál es la moneda de Japón?", output: "La moneda de Japón es el yen." },
  //   { input: "¿Cómo puedo hacer una pizza?", output: "Para hacer una pizza necesitas masa, salsa, queso y tus ingredientes favoritos. Luego hornea a 180°C hasta que esté dorada." },
  //   { input: "¿Qué es un agujero negro?", output: "Un agujero negro es un área en el espacio donde la gravedad es tan fuerte que nada, ni la luz, puede escapar." },
  //   { input: "¿Cuál es el animal más rápido del mundo?", output: "El animal más rápido del mundo es el halcón peregrino." },
  //   { input: "¿Cuál es el océano más grande?", output: "El océano más grande es el océano Pacífico." },
  //   { input: "¿Cómo se forma un arco iris?", output: "Un arco iris se forma cuando la luz del sol se refracta en gotas de agua, descomponiéndose en los colores del espectro visible." },
  //   { input: "¿Qué es el reciclaje?", output: "El reciclaje es el proceso de convertir materiales usados en nuevos productos para reducir el desperdicio." },
  //   { input: "¿Puedo hablar contigo siempre?", output: "Sí, puedes hablar conmigo siempre que lo necesites. Estoy aquí para ayudarte." },
  //   { input: "¿Cómo se llama el presidente de España?", output: "España no tiene un presidente, sino un presidente del gobierno. El actual es Pedro Sánchez." },
  //   { input: "¿Cuántos países hay en el mundo?", output: "Actualmente, hay 195 países en el mundo." },
  //   { input: "¿Quién pintó la Mona Lisa?", output: "La Mona Lisa fue pintada por Leonardo da Vinci." },
  //   { input: "¿Qué es un sistema operativo?", output: "Un sistema operativo es el software que gestiona el hardware de una computadora y proporciona servicios para programas." },
  //   { input: "¿Cómo funciona la electricidad?", output: "La electricidad fluye a través de un circuito de conductores. Los electrones se mueven de un punto a otro, generando energía." },
  //   { input: "¿Quién descubrió América?", output: "Cristóbal Colón es reconocido por haber descubierto América en 1492." },
  //   { input: "¿Cuáles son las estaciones del año?", output: "Las estaciones del año son primavera, verano, otoño e invierno." },
  //   { input: "Historia de Don Quijote de la Mancha", output: "Don Quijote de la Mancha es el protagonista de la famosa novela Don Quijote de la Mancha, escrita por el autor español Miguel de Cervantes. La obra fue publicada en dos partes: la primera en 1605 y la segunda en 1615. Es una de las novelas más importantes y representativas de la literatura mundial." },
  // ];

  // async predict(inputText: any): Promise<any> {
  //   //await this.loadModel();

  //   if (!this.model) {
  //     console.error('El modelo aún no está cargado');
  //     return null;
  //   }

  //   // Función de tokenización
  //   const tokenize = (text) => {
  //     return text.split(' ').map(word => word.charCodeAt(0)); // tokenización sencilla basada en ASCII
  //   };

  //   // Preprocesamiento de datos
  //   const inputs = this.trainingData.map(data => tokenize(data.input));

  //   // Calcular el tamaño máximo de las secuencias
  //   const maxInputLength = Math.max(...inputs.map(input => input.length));

  //   const tokenizedInput = tokenize(inputText); // Convertir el texto a códigos ASCII
  //   const paddedInput = [...tokenizedInput];
  //   while (paddedInput.length < maxInputLength) {
  //     paddedInput.push(0); // Rellenar con ceros
  //   }
  //   const inputTensor = tf.tensor2d([paddedInput.slice(0, maxInputLength)]).toFloat();

  //   const predictions = await (this.model.predict(inputTensor) as tf.Tensor).data();

  //   //this.model.predict(inputTensor).data().then(predictions => {
  //   const predictedIndex = Array.from(predictions).indexOf(Math.max(...predictions));
  //   //this.trainingData[predictedIndex].output;

  //   const respuesta = this.trainingData[predictedIndex].output;
  //   console.log("Respuesta: " + respuesta);  // Imprimir la respuesta
  //   return respuesta;
  //   //});
  // };
}
