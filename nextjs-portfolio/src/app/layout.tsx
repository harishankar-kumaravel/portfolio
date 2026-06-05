import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harishankar K | Visual Designer for Branding, Motion Graphics & Packaging",
  description: "Portfolio of Harishankar K, a hybrid visual designer in India creating brand identities, packaging, social media creatives, campaign visuals, and motion graphics.",
  keywords: "Harishankar K, Harishankar portfolio, hybrid visual designer, visual designer India, graphic designer India, branding designer, motion graphics designer, packaging designer, social media creatives, campaign designer",
  authors: [{ name: "Harishankar K" }],
  creator: "Harishankar K",
  publisher: "Harishankar K",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  formatDetection: {
    telephone: true
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Harishankar K Portfolio",
    title: "Harishankar K | Hybrid Visual Designer",
    description: "Brand identity, packaging, social creatives, campaign visuals, and motion graphics by Harishankar K.",
    url: "https://harishankar.co.in/",
    images: [
      {
        url: "https://drive.google.com/thumbnail?id=1IK1ygKfcSddGASJA4FTUL0K-8A8TRj-7&sz=w1600",
        alt: "Selected visual design portfolio work by Harishankar K"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Harishankar K | Visual Designer",
    description: "Portfolio of Harishankar K, focused on branding, graphic design, packaging, social media creatives, and motion graphics.",
    images: ["https://drive.google.com/thumbnail?id=1IK1ygKfcSddGASJA4FTUL0K-8A8TRj-7&sz=w1600"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0B0E14" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Satoshi:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var savedTheme = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
