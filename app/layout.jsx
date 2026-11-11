import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Ragusma Farms NG® | Fresh Poultry, Rabbits, Fish & Organic Farm Products',
  description: 'Official online farm store for Ragusma Farms. Order healthy live & frozen chickens, farm rabbits, fresh catfish, and organic manure with free delivery in Tunga and fast regional fulfillment.',
  keywords: 'Ragusma Farms, Live Chicken Minna, Frozen Chicken, Rabbits, Catfish Niger State, Poultry Farming Nigeria, Organic Manure Tunga',
  openGraph: {
    title: 'Ragusma Farms NG® | Quality Farm Products You Can Trust',
    description: 'Fresh farm-raised live & frozen chicken, breeding rabbits, fresh catfish, and organic manure straight from our farm to your home.',
    images: ['/assets/brand-sheet.webp'],
    locale: 'en_NG',
    type: 'website',
  },
  icons: {
    icon: '/assets/logo.jpg',
    apple: '/assets/logo.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/assets/logo.jpg" />
      </head>
      <body className="min-h-screen flex flex-col bg-cream-50 text-forest-950 antialiased selection:bg-forest-100 selection:text-forest-900">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

