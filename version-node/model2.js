const tf = require('@tensorflow/tfjs-node');

// Crear vocabulario
function createVocabulary(data) {
  const vocab = { '<PAD>': 0, '<OOV>': 1 }; // Indices reservados
  let index = 2;

  data.split(' ').forEach(word => {
    if (!vocab[word]) vocab[word] = index++;
  });

  return vocab;
}

// Tokenización segura
function tokenize(text, vocab) {
  return text.split(' ').map(word => vocab[word] || vocab['<OOV>']);
}

// Preprocesamiento: convertir los datos de entrada y salida a tensores
function preprocessData(pairs, vocab, maxInputLen, maxTargetLen) {
  const X = [];
  const y = [];

  for (const pair of pairs) {
    const inputTokens = tokenize(pair.input, vocab);
    const targetTokens = tokenize(pair.target, vocab);

    const padSequence = (sequence, length) => {
      while (sequence.length < length) sequence.unshift(0); 
      return sequence.slice(-length);
    };

    const inputPadded = padSequence(inputTokens, maxInputLen);
    const targetPadded = padSequence(targetTokens, maxTargetLen);

    X.push(inputPadded);
    y.push(targetPadded);
  }

  const X_tensor = tf.tensor2d(X, [X.length, maxInputLen], 'int32');
  const y_tensor = tf.tensor2d(y, [y.length, maxTargetLen], 'int32');
  const y_one_hot = tf.oneHot(y_tensor, Object.keys(vocab).length);

  return { X: X_tensor, y: y_one_hot, vocabSize: Object.keys(vocab).length, maxInputLen };
}

// Crear el modelo
function createModel(maxInputLen, vocabSize) {
  const model = tf.sequential();

  model.add(tf.layers.embedding({
    inputDim: vocabSize,
    outputDim: 64,
    inputLength: maxInputLen,
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: vocabSize,
    activation: 'softmax',
  }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  model.summary();
  return model;
}

async function main() {
  const trainingPairs = [
    { input: "hola soy", target: "un chatbot" },
    { input: "te ayudo con", target: "tus preguntas" },
    { input: "soy un modelo", target: "de lenguaje" },
    { input: "cómo estás", target: "estoy bien" },
    { input: "preguntas frecuentes", target: "te puedo responder" }
  ];

  const rawText = trainingPairs.flatMap(pair => pair.input + ' ' + pair.target).join(' ');
  const vocab = createVocabulary(rawText);
  const vocabSize = Object.keys(vocab).length;
  console.log("Vocabulario creado:", vocab);

  const { X, y, maxInputLen } = preprocessData(trainingPairs, vocab, 5, 5);

  const model = createModel(5, vocabSize);

  console.log('Entrenando el modelo...');
  await model.fit(X, y, {
    epochs: 20,
    batchSize: 2,
  });

  console.log('¡Modelo entrenado exitosamente!');
}

main();
