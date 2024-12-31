import tensorflow as tf
import json
import os
import numpy as np



# Cargar los datos originales
with open("original-dialogues.json", "r", encoding="utf8") as file:
    original_data = json.load(file)

# Función para normalizar solo las propiedades de texto
def normalize_text(data):
    for item in data:
        if isinstance(item.get("text"), str):
            item["text"] = (
                item["text"]
                .encode("utf-8")
                .decode("utf-8")
                .lower()
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
            )
    return data

normalized_data = normalize_text(original_data)

# Guardar los datos normalizados
with open("dialogues.json", "w", encoding="utf8") as file:
    json.dump(normalized_data, file, ensure_ascii=False, indent=2)

# Cargar los datos ya normalizados
with open("dialogues.json", "r", encoding="utf8") as file:
    data = json.load(file)

# Preprocesar los datos para convertir diálogos en pares de entrenamiento
def preprocess_data(data):
    pairs = []
    for i in range(len(data) - 1):
        pairs.append({"input": data[i]["text"], "output": data[i + 1]["text"]})
    return pairs

pairs = preprocess_data(data)

# Crear vocabulario
def create_vocabulary(data):
    vocab = set()
    for text in data:
        for word in text.split():
            vocab.add(word.lower())
    return list(vocab)

vocab = create_vocabulary([pair["input"] for pair in pairs])
vocab_size = len(vocab)

# Crear índice único para cada frase de salida
unique_responses = list(set(pair["output"] for pair in pairs))
response_to_index = {response: index for index, response in enumerate(unique_responses)}
index_to_response = {index: response for response, index in response_to_index.items()}

# Codificar texto a vectores
def encode_text(text, vocab):
    encoded = np.zeros(len(vocab), dtype=np.float32)
    for word in text.split():
        if word in vocab:
            index = vocab.index(word)
            encoded[index] = 1
    return encoded

# Preprocesar datos de entrenamiento
inputs = np.array([encode_text(pair["input"], vocab) for pair in pairs])
outputs = np.array([response_to_index[pair["output"]] for pair in pairs])

# Convertir las salidas a one-hot
outputs_one_hot = tf.one_hot(outputs, len(unique_responses))

# Crear el modelo
def create_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation="relu", input_shape=(vocab_size,)),
        tf.keras.layers.Dense(len(unique_responses), activation="softmax")
    ])
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    return model

model = create_model()

# Entrenar el modelo
def train():
    model.fit(inputs, outputs_one_hot, epochs=15, batch_size=16)
    os.makedirs("./modelo_chatbot", exist_ok=True)
    model.save("./modelo_chatbot.keras")

train()

# # Interfaz de usuario para probar
# def chat():
#     print("Escribe tu pregunta (escribe 'salir' para terminar):")
#     while True:
#         input_text = input("> ").strip().lower()
#         if input_text == "salir":
#             print("Adiós")
#             break
#         encoded_input = encode_text(input_text, vocab)
#         prediction = model.predict(np.array([encoded_input]))
#         response_index = np.argmax(prediction)
#         print(index_to_response.get(response_index, "No entiendo eso."))

# chat()



































import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
# import ttkbootstrap as ttk
# from ttkbootstrap.constants import *
# from datetime import datetime


#hora, el tema, iconos y que este centrado y boton del chat

#configuración principal
root = tk.Tk()
root.title("Botsi")
root.geometry("1200x700")
root.resizable(False, False)

# Colores
BG_COLOR = "#222831"
TEXT_COLOR = "#eeeeee"
ENTRY_BG = "#393e46"
BUTTON_BG = "#00adb5"
BUTTON_FG = "#ffffff"
CHAT_BG = "#30475e"
CHAT_ENTRY_BG = "#1c1e21"

#notebook para múltiples chats
notebook = ttk.Notebook(root)
notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

#diccionario para almacenar frames y textos de chat
chats = {}

#función para agregar un nuevo chat
def agregar_chat():
    chat_id = f"Chat {len(chats) + 1}"
    frame = tk.Frame(notebook, bg=CHAT_BG)
    
    #crear el botón de cerrar
    close_button = tk.Button(frame, text="X", bg="#FF5733", fg="#ffffff", font=("Helvetica", 10, "bold"), bd=0, command=lambda: cerrar_chat(chat_id))
    close_button.pack(side=tk.TOP, anchor="ne", padx=5, pady=5)

    notebook.add(frame, text=chat_id)

    #scrollbar
    scrollbar = ttk.Scrollbar(frame, orient=tk.VERTICAL)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    #cuadro de texto para el chat
    chat_text = tk.Text(
        frame,
        bg=CHAT_BG,
        fg=TEXT_COLOR,
        font=("Helvetica", 12),
        wrap=tk.WORD,
        yscrollcommand=scrollbar.set,
        state=tk.DISABLED,
        bd=0,
        padx=10,
        pady=10,
    )
    chat_text.pack(fill=tk.BOTH, expand=True)
    scrollbar.config(command=chat_text.yview)

    #guardar el texto de chat en el diccionario
    chats[chat_id] = chat_text

#función para cerrar un chat
def cerrar_chat(chat_id):
    # Eliminar la pestaña del chat
    notebook.forget(chats[chat_id].master)
    del chats[chat_id]

#frame izquierdo (apartado para el botón de nuevo chat)
left_frame = tk.Frame(root, bg=BG_COLOR, width=150)  # Amplié el ancho del frame izquierdo
left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=10, pady=10)

#botón para agregar un nuevo chat
new_chat_button = tk.Button(
    left_frame,
    text="Nuevo Chat",
    bg=BUTTON_BG,
    fg=BUTTON_FG,
    font=("Helvetica", 12, "bold"),
    command=agregar_chat,
    bd=0,
    padx=5,
    pady=5,
)
new_chat_button.pack(side=tk.TOP, pady=10)

#frame para el área de entrada y botones
entry_frame = tk.Frame(root, bg=BG_COLOR)
entry_frame.pack(fill=tk.X, padx=10, pady=10)

#campo de entrada
entry = tk.Entry(
    entry_frame,
    bg=CHAT_ENTRY_BG,
    fg=TEXT_COLOR,
    font=("Helvetica", 14),
    insertbackground=TEXT_COLOR,
    bd=0,
)
entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10, pady=5)

#función para enviar mensajes
def enviar_mensaje(event=None):
    user_msg = entry.get().strip()
    if user_msg:
        current_tab = notebook.tab(notebook.select(), "text")
        chat_text = chats[current_tab]

        chat_text.config(state=tk.NORMAL)

        #mensaje del usuario (izquierda)
        chat_text.insert(tk.END, f"Tú: {user_msg}\n", "user")
        chat_text.tag_config("user", justify="left", foreground="#00adb5", font=("Helvetica", 12, "bold"))

        #respuesta del chatbot (derecha)
        encoded_input = encode_text(user_msg, vocab)
        prediction = model.predict(np.array([encoded_input]))
        response_index = np.argmax(prediction)
        print(index_to_response.get(response_index, "No entiendo eso."))

        
        bot_msg = index_to_response.get(response_index, "No entiendo eso.")
        chat_text.insert(tk.END, f"{bot_msg}\n", "bot")
        chat_text.tag_config("bot", justify="right", foreground=TEXT_COLOR, font=("Helvetica", 12))

        chat_text.config(state=tk.DISABLED)
        chat_text.yview(tk.END)
        entry.delete(0, tk.END)

#función para guardar el chat actual
def guardar_chat():
    current_tab = notebook.tab(notebook.select(), "text")
    chat_text = chats[current_tab]

    chat_text.config(state=tk.NORMAL)
    chat_content = chat_text.get("1.0", tk.END).strip()
    chat_text.config(state=tk.DISABLED)

    if chat_content:
        file_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Archivos de texto", "*.txt")],
            title="Guardar Chat",
            initialfile=current_tab,
        )
        if file_path:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(chat_content)

#botón de enviar
send_button = tk.Button(
    entry_frame,
    text="Enviar",
    bg=BUTTON_BG,
    fg=BUTTON_FG,
    font=("Helvetica", 12, "bold"),
    command=enviar_mensaje,
    bd=0,
    padx=10,
    pady=5,
)
send_button.pack(side=tk.RIGHT)

#botón para guardar el chat actual
save_chat_button = tk.Button(
    entry_frame,
    text="Guardar Chat",
    bg=BUTTON_BG,
    fg=BUTTON_FG,
    font=("Helvetica", 12, "bold"),
    command=guardar_chat,
    bd=0,
    padx=10,
    pady=5,
)
save_chat_button.pack(side=tk.LEFT, padx=5)

#agregar el primer chat por defecto
agregar_chat()

#asignar la tecla Enter para enviar mensajes
root.bind("<Return>", enviar_mensaje)

#iniciar la ventana
root.mainloop()
