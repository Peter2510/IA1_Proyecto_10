// Función para cargar el modelo si existe
const loadModel = async () => {
  try {
    //URL del modelo, por ejemplo:
    const modelUrl = './modelo_chatbot/model.json';  //url o ruta relativa donde está el modelo

    //intnto cargar el modelo
    //const model = await tf.loadLayersModel(modelUrl);
    console.log("Modelo cargado exitosamente.");
    //usar el modelo cargado para hacer predicciones o más acciones

  } catch (error) {
    console.error("Error al cargar el modelo:", error);
  }
};

loadModel();


const trainModel = async () => {


// //datos de entrenamiento para el entrenamiento del modelo
// // datos de entrenamiento: pares de preguntas y respuestas
const trainingData = [
    { input: "Hola", output: "¡Hola! ¿Cómo puedo ayudarte hoy?" },
    { input: "Quien te creo", output: "Estudiantes de ia"},
    { input: "Quien es tu dios", output: "tensorflow"},
    { input: "¿Cómo estás?", output: "Estoy bien, gracias. ¿Y tú?" },
    { input: "¿Qué puedes hacer?", output: "Puedo ayudarte con preguntas generales." },
    { input: "Quien eres?", output: "Puedo ayudarte con preguntas generales." },
    { input: "Adiós", output: "¡Adiós! Espero verte pronto." },
    { input: "¿Cuál es tu nombre?", output: "Soy un chatbot creado para ayudarte." },
    { input: "¿Cómo te llamas?", output: "No tengo un nombre, pero me puedes llamar Chatbot." },
    { input: "¿Qué día es hoy?", output: "Lo siento, no tengo acceso a la fecha actual." },
    { input: "¿Cuál es la capital de Francia?", output: "La capital de Francia es París." },
    { input: "¿Quién es el presidente de los Estados Unidos?", output: "El presidente de los Estados Unidos es Joe Biden." },
    { input: "¿Cuántos continentes hay?", output: "Hay 7 continentes en el mundo." },
    { input: "¿Cuántos días tiene un año?", output: "Un año tiene 365 días, excepto en los años bisiestos que tiene 366." },
    { input: "¿Qué es la inteligencia artificial?", output: "La inteligencia artificial es la simulación de procesos de inteligencia humana mediante sistemas informáticos." },
    { input: "¿Dónde está la Torre Eiffel?", output: "La Torre Eiffel está en París, Francia." },
    { input: "¿Qué es un chatbot?", output: "Un chatbot es un programa de computadora diseñado para simular una conversación con usuarios humanos." },
    { input: "¿Puedes hacer matemáticas?", output: "Sí, puedo ayudarte con problemas matemáticos simples." },
    { input: "¿Me puedes decir un chiste?", output: "Claro, aquí va uno: ¿Por qué el libro de matemáticas se deprimió? Porque tenía demasiados problemas." },
    { input: "¿Cuántos animales hay en el zoológico?", output: "No tengo acceso a esa información, pero un zoológico generalmente tiene muchos animales de diferentes especies." },
    { input: "¿Dónde puedo comprar una computadora?", output: "Puedes comprar computadoras en tiendas en línea o en tiendas físicas de tecnología." },
    { input: "¿Qué hora es?", output: "Lo siento, no puedo decirte la hora, ya que no tengo acceso a la hora actual." },
    { input: "¿Puedes traducir al inglés?", output: "Sí, puedo traducir. ¿Qué quieres traducir?" },
    { input: "¿Quién inventó la luz eléctrica?", output: "La luz eléctrica fue inventada por Thomas Edison." },
    { input: "¿Qué es la energía solar?", output: "La energía solar es la energía que se obtiene de la luz del sol." },
    { input: "¿Cómo se llama el río más largo del mundo?", output: "El río más largo del mundo es el río Amazonas." },
    { input: "¿Qué es la gravedad?", output: "La gravedad es la fuerza que atrae los objetos hacia el centro de la Tierra." },
    { input: "¿Quién escribió 'Don Quijote de la Mancha'?", output: "El autor de 'Don Quijote de la Mancha' es Miguel de Cervantes." },
    { input: "¿Qué es el clima?", output: "El clima se refiere a las condiciones atmosféricas a largo plazo en una región." },
    { input: "¿Qué es la física?", output: "La física es la ciencia que estudia la materia, la energía y sus interacciones." },
    { input: "¿Qué es la economía?", output: "La economía es la ciencia que estudia la producción, distribución y consumo de bienes y servicios." },
    { input: "¿Cuál es la moneda de Japón?", output: "La moneda de Japón es el yen." },
    { input: "¿Cómo puedo hacer una pizza?", output: "Para hacer una pizza necesitas masa, salsa, queso y tus ingredientes favoritos. Luego hornea a 180°C hasta que esté dorada." },
    { input: "¿Qué es un agujero negro?", output: "Un agujero negro es un área en el espacio donde la gravedad es tan fuerte que nada, ni la luz, puede escapar." },
    { input: "¿Cuál es el animal más rápido del mundo?", output: "El animal más rápido del mundo es el halcón peregrino." },
    { input: "¿Cuál es el océano más grande?", output: "El océano más grande es el océano Pacífico." },
    { input: "¿Cómo se forma un arco iris?", output: "Un arco iris se forma cuando la luz del sol se refracta en gotas de agua, descomponiéndose en los colores del espectro visible." },
    { input: "¿Qué es el reciclaje?", output: "El reciclaje es el proceso de convertir materiales usados en nuevos productos para reducir el desperdicio." },
    { input: "¿Puedo hablar contigo siempre?", output: "Sí, puedes hablar conmigo siempre que lo necesites. Estoy aquí para ayudarte." },
    { input: "¿Cómo se llama el presidente de España?", output: "España no tiene un presidente, sino un presidente del gobierno. El actual es Pedro Sánchez." },
    { input: "¿Cuántos países hay en el mundo?", output: "Actualmente, hay 195 países en el mundo." },
    { input: "¿Quién pintó la Mona Lisa?", output: "La Mona Lisa fue pintada por Leonardo da Vinci." },
    { input: "¿Qué es un sistema operativo?", output: "Un sistema operativo es el software que gestiona el hardware de una computadora y proporciona servicios para programas." },
    { input: "¿Cómo funciona la electricidad?", output: "La electricidad fluye a través de un circuito de conductores. Los electrones se mueven de un punto a otro, generando energía." },
    { input: "¿Quién descubrió América?", output: "Cristóbal Colón es reconocido por haber descubierto América en 1492." },
    { input: "¿Cuáles son las estaciones del año?", output: "Las estaciones del año son primavera, verano, otoño e invierno." },
    { input: "Historia de Don Quijote de la Mancha", output: "Don Quijote de la Mancha es el protagonista de la famosa novela Don Quijote de la Mancha, escrita por el autor español Miguel de Cervantes. La obra fue publicada en dos partes: la primera en 1605 y la segunda en 1615. Es una de las novelas más importantes y representativas de la literatura mundial."}, 
];

// Función de tokenización
const tokenize = (text) => {
  return text.split(' ').map(word => word.charCodeAt(0)); // tokenización sencilla basada en ASCII
};

// Preprocesamiento de datos
const inputs = trainingData.map(data => tokenize(data.input));
const outputs = trainingData.map((data, index) => index); // etiquetas numéricas para las salidas

// Convertir las etiquetas a formato one-hot
const oneHotOutputs = outputs.map(output => {
  const oneHot = Array(trainingData.length).fill(0); 
  oneHot[output] = 1; 
  return oneHot;
});

// Calcular el tamaño máximo de las secuencias
const maxInputLength = Math.max(...inputs.map(input => input.length));

// Asegurarse de que todas las entradas tengan el mismo tamaño
const paddedInputs = inputs.map(input => {
  const paddedInput = [...input];
  while (paddedInput.length < maxInputLength) {
    paddedInput.push(0);  // Rellenar con ceros si la secuencia es más corta que el máximo
  }
  return paddedInput.slice(0, maxInputLength);  // Ajustar para no exceder la longitud máxima
});

// Convertir los datos a tensores
const x = tf.tensor2d(paddedInputs).toFloat(); // Convertir a tipo float32
const y = tf.tensor2d(oneHotOutputs); // Convertir a one-hot

// Crear el modelo
const model = tf.sequential();

// Capa de embeddings
model.add(tf.layers.embedding({
  inputDim: 256,  // Tamaño del vocabulario
  outputDim: 32,  // Dimensión del embedding
  inputLength: maxInputLength,
  embeddingsInitializer: 'glorotNormal'  // Usar un inicializador eficiente para los embeddings
}));

// Capa LSTM
model.add(tf.layers.lstm({
  units: 64, // El número de unidades de la capa LSTM
  returnSequences: false,
  kernelInitializer: 'glorotNormal', // Usar un inicializador eficiente
  recurrentInitializer: 'glorotNormal' // Inicializar también los pesos recurrentes
}));

// Capa densa con inicialización eficiente
model.add(tf.layers.dense({
  units: trainingData.length,  // número de respuestas posibles
  activation: 'softmax',  // activación para clasificación
  kernelInitializer: 'glorotNormal'  // Usar glorotNormal para la inicialización
}));

// Compilar el modelo
model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',  // Función de pérdida adecuada para clasificación multiclase
  metrics: ['accuracy'],  // Métricas para evaluar el modelo
});

// Entrenamiento del modelo
console.log("Iniciando el entrenamiento...");
model.fit(x, y, {
  epochs: 1,
  callbacks: {
    onEpochEnd: (epoch, logs) => {
      console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss.toFixed(4)}, Accuracy = ${logs.acc.toFixed(4)}`);
    }
  }
}).then(async () => {
  console.log("Entrenamiento completado.");

   // Convertir el modelo a formato JSON
   const modelJson = await model.toJSON();
  
   // Guardar la arquitectura del modelo en un archivo JSON
   //fs.writeFileSync('./modelo.json', JSON.stringify(modelJson));
  
   // Guardar la arquitectura del modelo en un archivo JSON
  fs.writeFileSync(modelPath, JSON.stringify(modelJson));
 
   // Obtener los pesos del modelo
   const modelWeights = await model.getWeights();
 
   // Convertir los pesos a un buffer binario
   const weightBuffers = await Promise.all(modelWeights.map(weight => weight.data()));
   const weightBufferArray = Buffer.concat(weightBuffers.map(buffer => Buffer.from(buffer.buffer)));
 
   // Guardar los pesos en un archivo binario
   //fs.writeFileSync('./modelo_weights.bin', weightBufferArray);

   // Guardar los pesos en un archivo binario
  fs.writeFileSync(weightsPath, weightBufferArray);
 
   console.log('Modelo guardado como archivos JSON y binarios');

  // // Función para predecir la respuesta
  // const predictResponse = (inputText) => {
  //   const tokenizedInput = tokenize(inputText); // Convertir el texto a códigos ASCII
  //   const paddedInput = [...tokenizedInput];
  //   while (paddedInput.length < maxInputLength) {
  //     paddedInput.push(0); // Rellenar con ceros
  //   }
  //   const inputTensor = tf.tensor2d([paddedInput.slice(0, maxInputLength)]).toFloat();

  //   model.predict(inputTensor).data().then(predictions => {
  //     const predictedIndex = predictions.indexOf(Math.max(...predictions));  // Seleccionar la clase con la mayor probabilidad
  //     console.log("Respuesta: " + trainingData[predictedIndex].output);  // Imprimir la respuesta
  //   });
  // };

  // // Simular interacción con el chatbot
  // const userInput = "Como naciste?";
  // console.log("Usuario: " + userInput);
  // predictResponse(userInput); // Predecir la respuesta para la entrada del usuario
});
};
trainModel();