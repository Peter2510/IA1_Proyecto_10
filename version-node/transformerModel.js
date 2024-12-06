const tf = require('@tensorflow/tfjs');

function createTransformerModel(vocabSize, sequenceLength) {
  const d_model = 32; 
  const num_heads = 2;
  const dff = 64;

  const input = tf.input({ shape: [sequenceLength] });

  const embedding = tf.layers.embedding({ inputDim: vocabSize, outputDim: d_model });
  const embedding_output = embedding.apply(input);

  const attention_output = tf.layers.dense({ units: d_model, activation: 'relu' }).apply(embedding_output);

  const ffn_output = tf.layers.dense({ units: d_model, activation: 'relu' }).apply(attention_output);

  const output = tf.layers.dense({ units: vocabSize, activation: 'softmax' }).apply(ffn_output);

  const model = tf.model({ inputs: input, outputs: output });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

module.exports = { createTransformerModel };
