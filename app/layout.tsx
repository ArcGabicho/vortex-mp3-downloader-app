import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
	title: "Vortex MP3 Downloader | Descarga música gratis",
	description: "Descarga música MP3 gratis, rápido y seguro. Convierte tus canciones favoritas en archivos MP3 al instante.",
	keywords: [
		"descargar mp3",
		"música gratis",
		"convertidor mp3",
		"descargar canciones",
		"Vortex MP3 Downloader"
	],
	openGraph: {
		title: "Vortex MP3 Downloader",
		description: "Descarga música MP3 gratis, rápido y seguro.",
		url: "https://vortex-mp3-downloader.vercel.app",
		siteName: "Vortex MP3 Downloader",
		images: [
			{
				url: "https://i.imgur.com/mU8Uxu2.png",
				width: 1200,
				height: 630,
				alt: "Vortex MP3 Downloader logo"
			}
		],
		locale: "es_ES",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Vortex MP3 Downloader",
		description: "Descarga música MP3 gratis, rápido y seguro.",
		images: ["https://i.imgur.com/mU8Uxu2.png"]
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1
		}
	}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#0A1128" />
                <link rel="icon" href="/favicon.ico" />
			</head>
			<body className="bg-black text-white">
				<Toaster position="top-right" />
				{children}
			</body>
		</html>
	);
}
