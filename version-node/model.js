const tf = require('@tensorflow/tfjs');

//datos de entrenamiento para el entrenamiento del modelo
// datos de entrenamiento: pares de preguntas y respuestas
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

//convierte el texto en vectores numéricos ( para esto se usa los coigos ASCII de las letras -> tipo parser) 
const tokenize = (text) => {
  return text.split(' ').map(word => word.charCodeAt(0)); //se convierte cada palabra en su código ASCII
};

//preprocesar los datos de entrada y salida
const inputs = trainingData.map(data => tokenize(data.input));
const outputs = trainingData.map((data, index) => index); //convertimos las respuestas en índices únicos para simplificar

// convertir las etiquetas a formato one-hot
const oneHotOutputs = outputs.map(output => {
  const oneHot = Array(trainingData.length).fill(0); 
  oneHot[output] = 1; 
  return oneHot;
});

// calcular el tamaño máximo de la secuencia de entrada
const maxInputLength = Math.max(...inputs.map(input => input.length));

// asegurarnos de que todas las entradas tengan el mismo tamaño
const paddedInputs = inputs.map(input => {
  const paddedInput = [...input];
  while (paddedInput.length < maxInputLength) {
    paddedInput.push(0); // rellenar con ceros si la secuencia es más corta que el máximo
  }
  return paddedInput.slice(0, maxInputLength); // asegurarse de que no exceda la longitud máxima
});

// convertir los datos a tensores
const x = tf.tensor2d(paddedInputs).toFloat(); // convertir la entrada a float32
const y = tf.tensor2d(oneHotOutputs); // convertir las salidas a one-hot y a tensor

// crear el modelo
const model = tf.sequential();

// capa de embeddings para convertir palabras en vectores
model.add(tf.layers.embedding({
  inputDim: 256,  // tamaño del vocabulario (usamos 256 para cubrir el rango ASCII)
  outputDim: 32,  // dimensión del embedding (puedes cambiarla)
  inputLength: maxInputLength,  // longitud máxima de entrada
}));

// capa LSTM para procesar secuencias de longitud variable
model.add(tf.layers.lstm({ units: 64, returnSequences: false }));

// capa densa para la clasificación
model.add(tf.layers.dense({ units: trainingData.length, activation: 'softmax' }));
//model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [maxLength] }));

// compilar el modelo con categoricalCrossentropy
model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

// entrenar el modelo
model.fit(x, y, {
  epochs: 110,
  batchSize: 4,
}).then(() => {
  console.log("Entrenamiento completado.");

  // función para predecir una respuesta
  const predictResponse = (inputText) => {
    const tokenizedInput = tokenize(inputText); // convertimos el texto a códigos ASCII
    const paddedInput = [...tokenizedInput];
    while (paddedInput.length < maxInputLength) {
      paddedInput.push(0); // rellenar con ceros
    }
    const inputTensor = tf.tensor2d([paddedInput.slice(0, maxInputLength)]).toFloat(); // convertir a float32

    model.predict(inputTensor).data().then(predictions => {
      const predictedIndex = predictions.indexOf(Math.max(...predictions)); // seleccionar la clase con la mayor probabilidad
      console.log("Respuesta: " + trainingData[predictedIndex].output);
    });
  };

  // simular la interacción con el chatbot
  const userInput = "Como naciste?";
  console.log("Usuario: " + userInput);
  predictResponse(userInput); // predice la respuesta para la entrada del usuario
});
