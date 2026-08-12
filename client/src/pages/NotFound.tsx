import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <Card className="mx-4 w-full max-w-lg border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardContent className="pb-8 pt-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-100" />
                <AlertCircle className="relative h-16 w-16 text-red-500" />
              </div>
            </div>

            <h1 className="mb-2 text-4xl font-bold text-slate-900">404</h1>

            <h2 className="mb-4 text-xl font-semibold text-slate-700">Page introuvable</h2>

            <p className="mb-8 leading-relaxed text-slate-600">
              La page demandée n’existe pas ou a été déplacée.
            </p>

            <div id="not-found-button-group" className="flex justify-center">
              <Button onClick={handleGoHome} className="min-h-11 bg-gray-900 px-6 text-white hover:bg-gray-800">
                <Home className="mr-2 h-4 w-4" />
                Retour à l’accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
