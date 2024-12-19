const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const readline = require("readline");
const path = require('path');

//cargar los datos originales
const originalData = JSON.parse(fs.readFileSync("original-dialogues.json", "utf8"));

//funcion para normalizar solo las propiedades de texto
const normalizedData = originalData.map(item => {
  if (typeof item.text === 'string') {
    //se aplica la normalización NFD, hacer el reemplazo de tildes y diacriticos, y luego normalizar a NFC
    item.text = item.text.normalize('NFD')
      .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")  //se eliminan las tildes
      .normalize();  //se vuelve a normalizar porque en el paso anterior se dividio los carateres :v
  }
  return item;
});

//con lo normalizado, se genera un nuevo archivo que luego ya se usa
fs.writeFileSync("dialogues.json", JSON.stringify(normalizedData, null, 2), "utf8");

//se cargan los datos ya normalizados
const data = JSON.parse(fs.readFileSync("dialogues.json", "utf8"));

//preprocesar los datos para convertir dialogos en pares de entrenamiento
const preprocessData = (data) => {
  const pairs = [];
  for (let i = 0; i < data.length - 1; i++) {
    pairs.push({ input: data[i].text, output: data[i + 1].text });
  }
  return pairs;
};

const pairs = preprocessData(data);
console.log(data)

//se crea diccionario de entrada y salida
const createVocabulary = (data) => {
  const vocab = new Set();
  data.forEach((text) => {
    text.split(" ").forEach((word) => vocab.add(word.toLowerCase()));
  });
  return Array.from(vocab);
};

const vocab = createVocabulary(pairs.map((p) => p.input));
const vocabSize = vocab.length;

//se creaa un indice unico para cada frase de salida
const uniqueResponses = Array.from(new Set(pairs.map((pair) => pair.output)));
const responseToIndex = uniqueResponses.reduce((obj, response, index) => {
  obj[response] = index;
  return obj;
}, {});
const indexToResponse = Object.fromEntries(
  Object.entries(responseToIndex).map(([k, v]) => [v, k])
);

//codificar texto a vectores
const encodeText = (text, vocab) => {
  const encoded = Array(vocabSize).fill(0);
  text.toLowerCase().split(" ").forEach((word) => {
    const index = vocab.indexOf(word);
    if (index !== -1) {
      encoded[index] = 1;
    }
  });
  return encoded;
};

//se proprocesan datos de entrenamiento
const inputs = pairs.map((pair) => encodeText(pair.input, vocab));
const outputs = pairs.map((pair) => responseToIndex[pair.output]);

//convertir las salidas a one-hot
const outputsOneHot = tf.oneHot(tf.tensor1d(outputs, "int32"), uniqueResponses.length);

//se crea el modelo
const createModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [vocabSize], units: 128, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: uniqueResponses.length, activation: "softmax" }));
  model.compile({
    optimizer: tf.train.adam(),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });
  return model;
};

const model = createModel();

// Entrenar el modelo
/*const train = async () => {
  const inputTensors = tf.tensor2d(inputs);
  await model.fit(inputTensors, outputsOneHot, {
    epochs: 1000,
    batchSize: 16,

  });
  console.log("Entrenamiento completado.");
};*/

const modelPath = path.join(__dirname, 'modelo_chatbot', 'model.json');

const dirPath = path.dirname(modelPath); //usamos la ruta de 'model.json' para obtener el directorio
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); //crea el directorio y cualquier directorio necesario
}

const train = async () => {
  const inputTensors = tf.tensor2d(inputs);
  await model.fit(inputTensors, outputsOneHot, {
    epochs: 40,
    batchSize: 16,
  }).then(async()=>{
    await model.save('file://'+dirPath);
  });
  console.log("Entrenamiento completado.");
};


//interfaz de usuario para probar
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

train().then(() => {
  console.log("Escribe tu pregunta");

  rl.on("line", (input) => {
    if (input.toLowerCase() === "salir") {
      console.log("Adiós");
      rl.close();
    } else {
      const encodedInput = encodeText(input.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize(), vocab);
      const prediction = model.predict(tf.tensor2d([encodedInput]));

      prediction.array().then((array) => {
        const responseIndex = array[0].indexOf(Math.max(...array[0]));
        console.log(indexToResponse[responseIndex] || "No entiendo eso.");
      });
    }
  });
});


