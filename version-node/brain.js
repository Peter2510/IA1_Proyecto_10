// const brain = require('brain.js');

// // Crear una red neuronal
// const net = new brain.NeuralNetwork();

// // Datos de entrenamiento (pregunta y respuesta)
// const trainingData = [
//     { input: { hola: 1 }, output: { '¡Hola! ¿En qué puedo ayudarte?': 1 } },
//     { input: { cómo: 1, estás: 1 }, output: { 'Estoy bien, gracias. ¿Y tú?': 1 } },
//     { input: { qué: 1, tal: 1 }, output: { '¡Todo bien! ¿Cómo te puedo ayudar hoy?': 1 } },
//     { input: { cómo: 1, te: 1, llamas: 1 }, output: { 'Soy un chatbot creado para ayudarte.': 1 } },
//     { input: { cuál: 1, es: 1, tu: 1, nombre: 1 }, output: { 'No tengo un nombre, pero soy tu asistente.': 1 } },
//     { input: { ayuda: 1 }, output: { 'Claro, ¿en qué necesitas ayuda?': 1 } },
//     { input: { qué: 1, es: 1, tu: 1, propósito: 1 }, output: { 'Mi propósito es ayudarte a responder preguntas.': 1 } },
//     { input: { qué: 1, haces: 1 }, output: { 'Puedo responder preguntas y ayudarte con información.': 1 } },
//     { input: { gracias: 1 }, output: { '¡De nada! ¡Siempre estoy aquí para ayudarte!': 1 } },
//     { input: { adiós: 1 }, output: { '¡Hasta luego! ¡Que tengas un buen día!': 1 } },
//     { input: { cuál: 1, es: 1, la: 1, capital: 1, de: 1, españa: 1 }, output: { 'La capital de España es Madrid.': 1 } },
//     { input: { qué: 1, es: 1, un: 1, chatbot: 1 }, output: { 'Un chatbot es un programa diseñado para simular una conversación humana.': 1 } },
//     { input: { cuántos: 1, continentes: 1, hay: 1 }, output: { 'Hay 7 continentes en el mundo.': 1 } },
//     { input: { qué: 1, hora: 1, es: 1 }, output: { 'Lo siento, no puedo decirte la hora, pero puedes ver el reloj de tu dispositivo.': 1 } },
//     { input: { cuál: 1, es: 1, el: 1, clima: 1, hoy: 1 }, output: { 'Lo siento, no puedo verificar el clima, pero puedes buscarlo en línea.': 1 } },
//     { input: { cuántos: 1, días: 1, tiene: 1, febrero: 1 }, output: { 'Febrero tiene 28 días, o 29 en los años bisiestos.': 1 } },
//     { input: { qué: 1, es: 1, la: 1, inteligencia: 1, artificial: 1 }, output: { 'La inteligencia artificial es la simulación de procesos de inteligencia humana mediante máquinas.': 1 } },
//     { input: { quién: 1, descubrió: 1, américa: 1 }, output: { 'Cristóbal Colón descubrió América en 1492.': 1 } },
//     { input: { por: 1, qué: 1, es: 1, famoso: 1, leonardo: 1, da: 1, vinci: 1 }, output: { 'Leonardo da Vinci es famoso por ser un pintor, inventor y científico renacentista, conocido por obras como La Mona Lisa.': 1 } },
//     { input: { qué: 1, es: 1, la: 1, fotosíntesis: 1 }, output: { 'La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía.': 1 } },
//     { input: { qué: 1, es: 1, un: 1, agujero: 1, negro: 1 }, output: { 'Un agujero negro es una región del espacio con una gravedad tan fuerte que ni la luz puede escapar de ella.': 1 } },
//     { input: { quién: 1, pintó: 1, la: 1, última: 1, cena: 1 }, output: { 'La Última Cena fue pintada por Leonardo da Vinci.': 1 } },
//     { input: { qué: 1, es: 1, el: 1, cambio: 1, climático: 1 }, output: { 'El cambio climático se refiere a la variación global de las temperaturas y los patrones climáticos a lo largo del tiempo.': 1 } },
//     { input: { cuántos: 1, planetas: 1, hay: 1, en: 1, el: 1, sistema: 1, solar: 1 }, output: { 'En el sistema solar hay 8 planetas.': 1 } },
//     { input: { qué: 1, es: 1, un: 1, eclipse: 1 }, output: { 'Un eclipse es un fenómeno astronómico donde un cuerpo celeste oculta total o parcialmente a otro.': 1 } },
//     { input: { por: 1, qué: 1, se: 1, dice: 1, que: 1, el: 1, sol: 1, es: 1, una: 1, estrella: 1 }, output: { 'El Sol es una estrella porque produce luz y calor a través de reacciones nucleares.': 1 } },
//     { input: { qué: 1, es: 1, la: 1, teoría: 1, de: 1, la: 1, relatividad: 1 }, output: { 'La teoría de la relatividad, propuesta por Albert Einstein, establece que las leyes de la física son las mismas para todos los observadores.': 1 } },
//     { input: { quién: 1, escribió: 1, cien: 1, años: 1, de: 1, soledad: 1 }, output: { 'Cien años de soledad fue escrito por Gabriel García Márquez.': 1 } },
//     { input: { cómo: 1, se: 1, dice: 1, gracias: 1, en: 1, inglés: 1 }, output: { 'Se dice "thank you" en inglés.': 1 } },
//     { input: { qué: 1, significa: 1, la: 1, palabra: 1, amor: 1 }, output: { 'El amor es un sentimiento de afecto profundo y cariño hacia otra persona o cosa.': 1 } },
//     { input: { qué: 1, es: 1, una: 1, computadora: 1 }, output: { 'Una computadora es una máquina electrónica que procesa y almacena información.': 1 } },
//     { input: { quién: 1, es: 1, el: 1, presidente: 1, de: 1, méxico: 1 }, output: { 'El presidente de México es Andrés Manuel López Obrador (al momento de este entrenamiento).': 1 } },
//     { input: { cuál: 1, es: 1, el: 1, océano: 1, más: 1, grande: 1 }, output: { 'El océano Pacífico es el más grande del mundo.': 1 } }
// ];

// // Entrenando la red neuronal
// net.train(trainingData);

// // Función para responder preguntas
// function getResponse(inputText) {
//     // Convertir el texto de entrada a un formato adecuado
//     const formattedInput = formatText(inputText);

//     // Obtener la respuesta de la red neuronal
//     const output = net.run(formattedInput);

//     // Seleccionar la respuesta con la puntuación más alta
//     return getHighestScoreResponse(output);
// }

// // Convertir el texto de entrada en un formato adecuado para la red neuronal
// function formatText(inputText) {
//     const formatted = {};
//     const words = inputText.toLowerCase().split(' ');

//     words.forEach((word) => {
//         formatted[word] = 1;
//     });

//     return formatted;
// }

// // Obtener la respuesta con la puntuación más alta
// function getHighestScoreResponse(output) {
//     let highestScore = -Infinity;
//     let response = '';

//     for (const [key, value] of Object.entries(output)) {
//         if (value > highestScore) {
//             highestScore = value;
//             response = key;
//         }
//     }

//     return response;
// }

// // Probar el chatbot
// const userInput = 'hola'; // Aquí podrías poner la entrada del usuario
// const response = getResponse(userInput);
// console.log('Entrada:', response);
// console.log('Respuesta:', response);

const fs = require("fs");
const readline = require("readline");
const brain = require("brain.js");
const net = new brain.recurrent.LSTM();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let array = [];

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  if (data.toString() === "") {
    console.log("Network already trained");
    train();
  } else {
    //net.run(JSON.parse(data.toString()));
    net.fromJSON(JSON.parse(data));
    boot();
  }
});

const train = () => {
  console.log("Training...");
  const d = new Date();
  fs.readFile("eassy.txt", "utf8", (err, data) => {
    array = data.toString().split("."); //separar por oraciones
    net.train(array, {
      iterations: 500,
      errorThresh: 0.05,
      log: true,
      logPeriod: 100,
      //learningRate: 0.3,
      //momentum: 0.1,
      //callback: null,
      //callbackPeriod: 10,
      //timeout: Infinity
    });
    fs.writeFile("data.txt", JSON.stringify(net.toJSON()), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    console.log("Training finished in", new Date() - d / 1000, "s");
  });
};

const boot = () => {
  rl.question("Ask me something: ", (q) => {
    console.log(net.run(q));
    boot(); //ask question repedetlyñ
  });
};
