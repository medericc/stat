import './globals.css';

export const metadata = {
    title: "Léna Stats",
    description: "Les stats détaillées en direct.",
    icons: {
        icon: "/favicon.ico", // Pour le favicon par défaut
        shortcut: "/favicon.ico", // Pour les navigateurs type iOS
        apple: "/apple-touch-icon.png", // iPhone/iPad
    },
    openGraph: {
      title: "Léna Stats",
      description: "Le play by play en direct.",
      url: "https://lenastats.vercel.app/",
      siteName: "Léna Stats",
      images: [
        {
          url: "https://lenastats.vercel.app/preview.jpg", // Mets une image propre ici !
          width: 1200,
          height: 630,
          alt: "Site de la Léna",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image", // ✅ Correction ici
      title: "Léna Stats",
      description: "Les stats détaillées en direct.",
      images: ["https://lenastats.vercel.app/preview.jpg"], // Même image que Open Graph
    },
  };
  



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="fr">
          <body className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
          <header className="bg-gradient-to-r from-red-800 to-red-900 text-white p-8 text-4xl font-extrabold text-center shadow-md">
    LIVESTATS
</header>
              <main className="container mx-auto mt-4">{children}</main>
          </body>
      </html>
  );
}
