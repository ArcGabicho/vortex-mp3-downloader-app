"use client";

import { useState } from "react";
import { Download, Link, Music, Loader } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";
import { saveDownload } from "../utils/firebase";
import { User } from "firebase/auth";

const urlSchema = z.object({
  url: z.string()
    .url("Por favor ingresa una URL válida")
    .refine(
      (url) => {
        const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(url);
      },
      "Solo se permiten URLs de YouTube"
    )
});

interface DownloadFormProps {
  user: User;
  onDownloadComplete: () => void;
}

export default function DownloadForm({ user, onDownloadComplete }: DownloadFormProps) {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadFromAPI = async (url: string) => {
    const API_URL = 'https://vortex-mp3-downloader-api-production.up.railway.app/download-mp3';
    
    // Realizar petición a la API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al descargar el archivo');
    }

    // Obtener información del archivo desde los headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'audio.mp3';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Obtener el blob del archivo
    const blob = await response.blob();
    
    // Extraer título del nombre de archivo (sin extensión)
    const title = filename.replace(/\.[^/.]+$/, '');
    
    // Crear URL temporal para descarga
    const downloadUrl = URL.createObjectURL(blob);
    
    // Guardar en Firestore
    const result = await saveDownload({
      url,
      title,
      downloadUrl: url, // Guardamos la URL original del video
      userId: user.uid
    });

    if (result.error) {
      throw new Error(result.error);
    }

    // Iniciar descarga automática
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL temporal después de un momento
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 100);

    return { title, filename };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = urlSchema.safeParse({ url });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      toast.loading("Descargando desde YouTube...", { id: "download" });
      
      // Simular progreso mientras se descarga
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      
      const result = await downloadFromAPI(url);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success(`¡${result.title} descargado!`, { id: "download" });
      
      setUrl("");
      onDownloadComplete();
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al procesar la descarga", { id: "download" });
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Descargar MP3</h2>
        <p className="text-gray-400">
          Pega la URL del video o canción que quieres descargar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">URL del video</label>
          <div className="relative">
            <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent border border-gray-700 rounded-full pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-white transition"
              placeholder="https://youtube.com/watch?v=..."
              disabled={isDownloading}
              required
            />
          </div>
        </div>

        {isDownloading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Descargando...</span>
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isDownloading || !url.trim()}
          className="w-full flex items-center justify-center space-x-3 bg-white text-black rounded-full px-8 py-4 text-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span>Descargando...</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>Descargar MP3</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h3 className="font-medium mb-2">Cómo usar:</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Pega una URL de YouTube (youtube.com o youtu.be)</li>
          <li>• El archivo MP3 se descargará automáticamente a tu PC</li>
          <li>• Se guardará en tu historial de descargas</li>
        </ul>
      </div>
    </div>
  );
}