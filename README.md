# 🎵 Vortex MP3 Downloader - Next.js - Firebase

<p align="center">
  <img src="https://i.imgur.com/Ev5HUKb.png" alt="YouTube to MP3 Frontend" width="600"/>
</p>

Aplicación web construida con **Next.js** y **Firebase** que permite convertir videos de YouTube en archivos MP3 utilizando una API backend desarrollada con FastAPI.

---

## 🔗 Enlace a la API

Asegúrate de tener corriendo la [API FastAPI](https://github.com/ArcGabicho/vortex-mp3-downloader-api) que provee el endpoint para procesar las descargas.

---

## 🌐 Características

- Interfaz moderna con Next.js y Tailwind CSS.
- Ingreso de URL de YouTube.
- Progreso de descarga.
- Descarga directa del archivo MP3 generado por la API.
- Validación de URL y manejo de errores.

---

## 🚀 Deploy en Vercel

Despliega esta app fácilmente en Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📦 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArcGabicho/music-mp3-downloader-app.git
```

### 2. Abrir el directorio del proyecto

```bash
cd music-mp3-downloader-app
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

```bash
# URL base de la API FastAPI
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
NEXT_PUBLIC_FIREBASE=CHISTE?
```

### 5. Ejecutar en local

```bash
npm run dev

```
---

```bash
mortex-mp3-downloader/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── DownloadForm.tsx
│   ├── pages/
│   │   └── index.tsx
│   ├── styles/
│   │   └── globals.css
│   └── utils/
│       └── api.ts
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```
---

## 📤 Consumo de la API

La aplicación realiza una solicitud POST al endpoint:

```bash
POST /download-mp3
```

```bash
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
}
```

---

## ✨ Tecnologías Utilizadas

- Next.js
- React.js
- TypeScript
- Tailwind
- Axios
- Firebase Auth
- Firebase Firestore
- Firebase Storage
---

## 🧠 Autor

**Gabriel Polack**  
Consultor TI & Arquitecto de Sofware   
📎 [LinkedIn](https://linkedin.com/in/gabriel-polack-castillo/)  
💻 [GitHub](https://github.com/ArcGabicho)

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la [Licencia MIT](LICENSE).
