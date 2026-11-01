# Crónicas del Aventurero

App de mejora de hábitos con estilo RPG de fantasía medieval. Es una PWA: se instala en el celular desde el navegador, funciona sin internet y guarda los datos solo en el teléfono.

## Qué incluye

- **8 áreas de vida**, cada una con su atributo: Salud (Vitalidad), Ejercicio (Fuerza), Conocimiento (Intelecto), Hobbies (Destreza), Vida profesional (Prestigio), Mente y espíritu (Maná), Social y familia (Carisma), Finanzas y hogar (Fortuna).
- **Tres tipos de tareas**: diarias (con días de la semana y rachas), hábitos ± (buenos dan XP, malos quitan vida) y misiones únicas (con fecha límite opcional).
- **Héroe** con clase (Aventurero, Mago, Espadachín, Sanador, Erudito, Bardo, Mercader), nivel, vida, XP, oro y un radar de atributos.
- **14 personajes listos para elegir** y un **retrato estilo anime personalizable**: sexo (femenino o masculino), raza, peinado, cabello, ojos, piel, expresión, barba, atuendo y accesorio, sobre un fondo de taberna. También puedes usar un **emblema medieval**.
- **12 razas** inspiradas en Mushoku Tensei, cada una con sus rasgos y descripción: humano, elfo, medio elfo, enano, mediano, raza bestia (lobo, gato o conejo), migurd, superd, raza demoníaca, raza celestial, raza marina y raza dragón.
- **Sastrería**: armadura, corona, diadema y corona de flores se compran con oro. Todos los objetos tienen su descripción; toca uno en la tienda para ver su ficha.
- Cada tarea puede tener su propio ícono.
- **Rangos**: Principiante → Intermedio → Avanzado → Santo → Rey → Emperador → Dios, tanto para el héroe como para cada atributo.
- **Jefe semanal**: cada vicio es un monstruo (Wyrm de la Pereza, Lich de la Procrastinación…). Tus tareas le hacen daño; los malos hábitos lo curan.
- **Tienda**: pociones, pergamino protector de rachas, elixir de doble XP y recompensas reales que tú defines.
- **24 logros**, crónica con mapa de actividad de 12 semanas e informe del amanecer (lo que olvidaste ayer).
- **5 temas de color**: Taberna del Gremio (predeterminado), Crónica del Viajero, Arcano Azul, Furia Carmesí y Bosque Plateado, con luz cálida de ventana, brillo de chimenea y motas de luz.
- Respaldo: exportar e importar un archivo JSON desde Gremio → Ajustes.

## Probarla en la PC

```bash
python -m http.server 5173
```

Luego abre http://localhost:5173.

## Instalarla en el celular

La instalación requiere que la app esté publicada en una dirección **https**. La opción más simple y gratuita es GitHub Pages:

1. Sube esta carpeta a un repositorio de GitHub.
2. En el repositorio: Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. Abre la dirección que te da GitHub (`https://<usuario>.github.io/<repo>/`) en el celular:
   - **Android (Chrome)**: menú ⋮ → *Instalar app* / *Agregar a pantalla principal*.
   - **iPhone (Safari)**: botón Compartir → *Agregar a inicio*.

## Estructura

```
index.html            Estructura de la página
css/styles.css        Estilos y los 4 temas
js/avatar.js          Retratos, emblemas y prendas de la sastrería
js/app.js             Lógica del juego y pantallas
sw.js                 Service worker (modo sin conexión)
manifest.webmanifest  Datos para instalar la app
icons/                Íconos de la app
```

Al cambiar archivos, sube el número de `CACHE` en `sw.js` para que los celulares descarguen la nueva versión.
