import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from datetime import datetime
# Función para cambiar el tema
def cambiar_tema():
    tema_actual = root.style.theme_use()
    print(tema_actual)
    nuevo_tema = "superhero" if tema_actual == "flatly" else "flatly"
    root.style.theme_use(nuevo_tema)
    actualizar_estilo_texto()
    icono_actualizado = actualizar_tema()
    boton_tema.config(image=icono_actualizado)

# Estilo para el recuadro
def actualizar_estilo_texto():
    if root.style.theme_use() == "superhero":  # Tema oscuro
        chat_box.config(bg="#333", fg="#fff", insertbackground="#fff")
    else:  # Tema claro
        chat_box.config(bg="#fff", fg="#000", insertbackground="#000")

# Estilo de la imagen tema
def actualizar_tema():
    if root.style.theme_use() == "superhero":  
        if not hasattr(root, "icono_tema_oscuro"):
            root.icono_tema_oscuro = ttk.PhotoImage(file="./img/iconmonstr-brightness-7-240.png")
            root.icono_tema_oscuro = root.icono_tema_oscuro.subsample(8)  
        return root.icono_tema_oscuro
    else: 
        if not hasattr(root, "icono_tema_claro"):
            root.icono_tema_claro = ttk.PhotoImage(file="./img/iconmonstr-weather-115-240.png")
            root.icono_tema_claro = root.icono_tema_claro.subsample(8)  
        return root.icono_tema_claro


def enviar_mensaje():
    mensaje_usuario = entrada.get()
    if mensaje_usuario:
        fecha_hora = obtener_fecha_hora()
        chat_box.config(state="normal")
        chat_box.insert("end", f"{fecha_hora} - Usuario: {mensaje_usuario}\n", "usuario")
        chat_box.yview("end")  # Desplazar hacia abajo
        entrada.delete(0, "end")

        respuesta_bot = f"Este es un mensaje simulado del bot."
        chat_box.insert("end", f"{fecha_hora} - Bot: {respuesta_bot}\n", "bot")
        chat_box.yview("end")  # Desplazar hacia abajo
        chat_box.config(state="disabled")


def obtener_fecha_hora():
    return datetime.now().strftime("%b %d, %Y")


############################    
############################    
############################    
############################    
# Crear ventana principal
root = ttk.Window(themename="flatly")
root.title("Botsy")
root.geometry("500x400")

# Etiqueta principal
ttk.Label(
    root, text="Botsy", font=("Arial", 30), bootstyle=INFO
).pack(pady=20)

# Caja de texto
chat_box = ttk.Text(root, width=60, height=15, wrap="word", state="disabled", font=("Arial", 12))
chat_box.tag_configure("usuario", foreground="#000000", justify="left", background="#34a416")  # Estilo para el mensaje del usuario (a la izquierda)
chat_box.tag_configure("bot", foreground="#000000", justify="right", background="#33a8ff")  # Estilo para el mensaje del bot (a la derecha)
chat_box.pack(padx=10, pady=10)

# Entrada de texto
entrada = ttk.Entry(root, width=50, bootstyle="success")
entrada.pack(pady=10)

# Frame 
botones_frame = ttk.Frame(root)
botones_frame.pack(pady=10)

# botones
boton = ttk.Button(botones_frame, text="Enviar", bootstyle=PRIMARY, command=enviar_mensaje)
boton.pack(side="left", padx=10)

#cambiar tema
icono_inicial = actualizar_tema()
boton_tema = ttk.Button(botones_frame, text="Cambiar Tema", command=cambiar_tema, bootstyle=SECONDARY, image=icono_inicial, compound="left", padding=(1, 1))
boton_tema.pack(side="left", padx=10)

# descargar
icono_descargar = ttk.PhotoImage(file="./img/iconmonstr-save-lined-240.png")
icono_descargar = icono_descargar.subsample(8)
boton_descargar = ttk.Button(botones_frame, text="Descargar", image=icono_descargar, command=cambiar_tema, bootstyle=DANGER, compound="left", padding=(1, 1))
boton_descargar.pack(side="left", padx=10, pady=10)

root.mainloop()
