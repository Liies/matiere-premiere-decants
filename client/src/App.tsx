import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
const Home = lazy(() => import("./pages/Home"));
const HomePremium = lazy(() => import("./pages/HomePremium"));

const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

function PageLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-6 text-sm uppercase tracking-[0.2em] text-gray-500">
      Chargement de la collection…
    </main>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
      <Route path={"/"} component={HomePremium} />
      <Route path={"/home-classic"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/account"} component={Account} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/about"} component={About} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
