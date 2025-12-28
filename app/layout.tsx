import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kogbodi International School - Results Portal",
  description: "Secure result management system for students, teachers, parents and admins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <div className="container py-8">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Kogbodi International School
            </h1>
            <p className="text-lg text-gray-600">Results Management System</p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
