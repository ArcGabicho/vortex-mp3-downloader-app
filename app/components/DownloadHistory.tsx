"use client";

import { useState, useEffect } from "react";
import { Download, ExternalLink, Music, Calendar } from "lucide-react";
import { getUserDownloads, DownloadItem } from "../utils/firebase";
import { User } from "firebase/auth";
import toast from "react-hot-toast";

interface DownloadHistoryProps {
  user: User;
  refreshTrigger: number;
}

export default function DownloadHistory({ user, refreshTrigger }: DownloadHistoryProps) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDownloads = async () => {
    try {
      const result = await getUserDownloads(user.uid);
      if (result.error && result.downloads.length === 0) {
        // No mostrar error si simplemente no hay descargas
        setDownloads([]);
      } else if (result.error) {
        toast.error("Error al cargar el historial");
      } else {
        setDownloads(result.downloads);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [user.uid, refreshTrigger, fetchDownloads]);

  const handleDownload = (downloadUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Descarga iniciada");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (downloads.length === 0 && !loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center p-8 border border-gray-700 rounded-lg bg-gray-900/50">
        <p className="text-gray-400">Aún no tienes descargas. ¡Descarga tu primera canción!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Historial de Descargas</h2>
        <span className="text-gray-400">{downloads.length} descargas</span>
      </div>

      <div className="space-y-4">
        {downloads.map((download) => (
          <div
            key={download.id}
            className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-900/50 transition"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{download.title}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(download.createdAt)}</span>
                  </span>
                  <a
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-white transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver original</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(download.downloadUrl, download.title)}
                className="flex items-center space-x-2 border border-gray-700 rounded-full px-4 py-2 text-sm hover:bg-gray-800 transition"
              >
                <Download className="w-4 h-4" />
                <span>Descargar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {downloads.length > 0 && (
        <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50 text-center">
          <p className="text-sm text-gray-400">
            💡 Tip: Tus descargas se guardan automáticamente y puedes volver a descargarlas cuando quieras
          </p>
        </div>
      )}
    </div>
  );
}