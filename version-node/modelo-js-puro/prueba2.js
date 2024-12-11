// Función para calcular TF de un término en un documento
function termFrequency(term, document) {
    const words = document.split(/\W+/);
    const termCount = words.filter(word => word.toLowerCase() === term.toLowerCase()).length;
    return termCount / words.length;
}

// Función para calcular IDF de un término en el corpus
function inverseDocumentFrequency(term, corpus) {
    const docCount = corpus.length;
    const containingDocs = corpus.filter(doc => doc.toLowerCase().includes(term.toLowerCase())).length;
    return Math.log((docCount + 1) / (containingDocs + 1)) + 1; // +1 para evitar división por cero
}

// Función para calcular el vector TF-IDF de un documento
function tfidfVector(document, corpus, terms) {
    return terms.map(term => termFrequency(term, document) * inverseDocumentFrequency(term, corpus));
}

// Función para obtener todos los términos únicos del corpus
function extractUniqueTerms(corpus) {
    const termsSet = new Set();
    corpus.forEach(doc => {
        doc.split(/\W+/).forEach(word => termsSet.add(word.toLowerCase()));
    });
    return Array.from(termsSet);
}

// Función para calcular la similitud coseno
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Función principal para comparar el texto de entrada con el corpus
function compareWithInput(inputText, corpus) {
    const terms = extractUniqueTerms(corpus.concat(inputText));
    const inputVector = tfidfVector(inputText, corpus, terms);

    let highestSimilarity = -1;
    let mostSimilarDocIndex = -1;

    corpus.forEach((doc, index) => {
        const docVector = tfidfVector(doc, corpus, terms);
        const similarity = cosineSimilarity(inputVector, docVector);
        console.log(`Similitud del coseno con entrada ${index + 1}:`, similarity);

        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            mostSimilarDocIndex = index;
        }
    });

    return mostSimilarDocIndex;
}

// Corpus y texto de entrada

const corpus = [{
        input: "Hola",
        output: "¡Hola! ¿Cómo puedo ayudarte hoy?"
    },
    {
        input: "Quien te creo",
        output: "Estudiantes de ia"
    },
    {
        input: "Quien es tu dios",
        output: "tensorflow"
    },
    {
        input: "¿Cómo estás?",
        output: "Estoy bien, gracias. ¿Y tú?"
    },
    {
        input: "¿Qué puedes hacer?",
        output: "Puedo ayudarte con preguntas generales."
    },
    {
        input: "Quien eres?",
        output: "Puedo ayudarte con preguntas generales."
    },
    {
        input: "Adiós",
        output: "¡Adiós! Espero verte pronto."
    },
    {
        input: "¿Cuál es tu nombre?",
        output: "Soy un chatbot creado para ayudarte."
    },
    {
        input: "¿Cómo te llamas?",
        output: "No tengo un nombre, pero me puedes llamar Chatbot."
    },
    {
        input: "¿Qué día es hoy?",
        output: "Lo siento, no tengo acceso a la fecha actual."
    },
    {
        input: "¿Cuál es la capital de Francia?",
        output: "La capital de Francia es París."
    },
    {
        input: "¿Quién es el presidente de los Estados Unidos?",
        output: "El presidente de los Estados Unidos es Joe Biden."
    },
    {
        input: "¿Cuántos continentes hay?",
        output: "Hay 7 continentes en el mundo."
    },
    {
        input: "¿Cuántos días tiene un año?",
        output: "Un año tiene 365 días, excepto en los años bisiestos que tiene 366."
    },
    {
        input: "¿Qué es la inteligencia artificial?",
        output: "La inteligencia artificial es la simulación de procesos de inteligencia humana mediante sistemas informáticos."
    },
    {
        input: "¿Dónde está la Torre Eiffel?",
        output: "La Torre Eiffel está en París, Francia."
    },
    {
        input: "¿Qué es un chatbot?",
        output: "Un chatbot es un programa de computadora diseñado para simular una conversación con usuarios humanos."
    },
    {
        input: "¿Puedes hacer matemáticas?",
        output: "Sí, puedo ayudarte con problemas matemáticos simples."
    },
    {
        input: "¿Me puedes decir un chiste?",
        output: "Claro, aquí va uno: ¿Por qué el libro de matemáticas se deprimió? Porque tenía demasiados problemas."
    },
    {
        input: "¿Cuántos animales hay en el zoológico?",
        output: "No tengo acceso a esa información, pero un zoológico generalmente tiene muchos animales de diferentes especies."
    },
    {
        input: "¿Dónde puedo comprar una computadora?",
        output: "Puedes comprar computadoras en tiendas en línea o en tiendas físicas de tecnología."
    },
    {
        input: "¿Qué hora es?",
        output: "Lo siento, no puedo decirte la hora, ya que no tengo acceso a la hora actual."
    },
    {
        input: "¿Puedes traducir al inglés?",
        output: "Sí, puedo traducir. ¿Qué quieres traducir?"
    },
    {
        input: "¿Quién inventó la luz eléctrica?",
        output: "La luz eléctrica fue inventada por Thomas Edison."
    },
    {
        input: "¿Qué es la energía solar?",
        output: "La energía solar es la energía que se obtiene de la luz del sol."
    },
    {
        input: "¿Cómo se llama el río más largo del mundo?",
        output: "El río más largo del mundo es el río Amazonas."
    },
    {
        input: "¿Qué es la gravedad?",
        output: "La gravedad es la fuerza que atrae los objetos hacia el centro de la Tierra."
    },
    {
        input: "¿Quién escribió 'Don Quijote de la Mancha'?",
        output: "El autor de 'Don Quijote de la Mancha' es Miguel de Cervantes."
    },
    {
        input: "¿Qué es el clima?",
        output: "El clima se refiere a las condiciones atmosféricas a largo plazo en una región."
    },
    {
        input: "¿Qué es la física?",
        output: "La física es la ciencia que estudia la materia, la energía y sus interacciones."
    },
    {
        input: "¿Qué es la economía?",
        output: "La economía es la ciencia que estudia la producción, distribución y consumo de bienes y servicios."
    },
    {
        input: "¿Cuál es la moneda de Japón?",
        output: "La moneda de Japón es el yen."
    },
    {
        input: "¿Cómo puedo hacer una pizza?",
        output: "Para hacer una pizza necesitas masa, salsa, queso y tus ingredientes favoritos. Luego hornea a 180°C hasta que esté dorada."
    },
    {
        input: "¿Qué es un agujero negro?",
        output: "Un agujero negro es un área en el espacio donde la gravedad es tan fuerte que nada, ni la luz, puede escapar."
    },
    {
        input: "¿Cuál es el animal más rápido del mundo?",
        output: "El animal más rápido del mundo es el halcón peregrino."
    },
    {
        input: "¿Cuál es el océano más grande?",
        output: "El océano más grande es el océano Pacífico."
    },
    {
        input: "¿Cómo se forma un arco iris?",
        output: "Un arco iris se forma cuando la luz del sol se refracta en gotas de agua, descomponiéndose en los colores del espectro visible."
    },
    {
        input: "¿Qué es el reciclaje?",
        output: "El reciclaje es el proceso de convertir materiales usados en nuevos productos para reducir el desperdicio."
    },
    {
        input: "¿Puedo hablar contigo siempre?",
        output: "Sí, puedes hablar conmigo siempre que lo necesites. Estoy aquí para ayudarte."
    },
    {
        input: "¿Cómo se llama el presidente de España?",
        output: "España no tiene un presidente, sino un presidente del gobierno. El actual es Pedro Sánchez."
    },
    {
        input: "¿Cuántos países hay en el mundo?",
        output: "Actualmente, hay 195 países en el mundo."
    },
    {
        input: "¿Quién pintó la Mona Lisa?",
        output: "La Mona Lisa fue pintada por Leonardo da Vinci."
    },
    {
        input: "¿Qué es un sistema operativo?",
        output: "Un sistema operativo es el software que gestiona el hardware de una computadora y proporciona servicios para programas."
    },
    {
        input: "¿Cómo funciona la electricidad?",
        output: "La electricidad fluye a través de un circuito de conductores. Los electrones se mueven de un punto a otro, generando energía."
    },
    {
        input: "¿Quién descubrió América?",
        output: "Cristóbal Colón es reconocido por haber descubierto América en 1492."
    },
    {
        input: "¿Cuáles son las estaciones del año?",
        output: "Las estaciones del año son primavera, verano, otoño e invierno."
    },
    {
        input: "Historia de Don Quijote de la Mancha",
        output: "Don Quijote de la Mancha es el protagonista de la famosa novela Don Quijote de la Mancha, escrita por el autor español Miguel de Cervantes. La obra fue publicada en dos partes: la primera en 1605 y la segunda en 1615. Es una de las novelas más importantes y representativas de la literatura mundial."
    },
];

const inputText = "dime el total de paises en el mundo?";
//genero un arreglo solo con inputs
const decisiones = corpus.map(tipo => tipo.input)

console.log(corpus, decisiones);

const mostSimilarDocument = compareWithInput(inputText, decisiones);

console.log(`Documento más similar (${mostSimilarDocument + 1}):`, corpus[mostSimilarDocument]);