import { type ReactNode, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import InitialLoader from "./components/InitialLoader";
import { getInitialAnchorTargetId, INITIAL_LOADER_SESSION_KEY, shouldShowInitialLoader } from "@shared/initial-loader";
import { useCartSyncOnSignIn } from "@/hooks/useCartSyncOnSignIn";
import { PAGE_TRANSITION_DURATION_MS, shouldUseInstantPageTransition } from "@shared/page-transition";
const Home = lazy(() => import("./pages/Home"));
const loadHomePremium = () => import("./pages/HomePremium");
const HomePremium = lazy(loadHomePremium);

const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminCatalog = lazy(() => import("./pages/AdminCatalog"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

function PageLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-6 text-sm uppercase tracking-[0.2em] text-gray-500">
      Chargement de la collection…
    </main>
  );
}

function CartSyncOnSignIn() {
  useCartSyncOnSignIn();
  return null;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PageTransition({ location, children }: { location: string; children: ReactNode }) {
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (location === displayedLocation) {
      setDisplayedChildren(children);
      return;
    }

    const instant = prefersReducedMotion()
      || shouldUseInstantPageTransition(location)
      || shouldUseInstantPageTransition(displayedLocation);

    if (instant) {
      setDisplayedChildren(children);
      setDisplayedLocation(location);
      setIsLeaving(false);
      return;
    }

    setIsLeaving(true);
    const timer = window.setTimeout(() => {
      setDisplayedChildren(children);
      setDisplayedLocation(location);
      setIsLeaving(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, PAGE_TRANSITION_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [children, displayedLocation, location]);

  return (
    <div className={isLeaving ? "page-transition page-transition-leaving" : "page-transition"}>
      {displayedChildren}
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageLoading />}>
      <RouteTransitionSwitch />
    </Suspense>
  );
}

function RouteTransitionSwitch() {
  const [location] = useLocation();

  return (
    <PageTransition location={location}>
      <Switch>
      <Route path={"/"} component={HomePremium} />
      <Route path={"/home-classic"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/account"} component={Account} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/catalogue"} component={AdminCatalog} />
      <Route path={"/about"} component={About} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/wishlist"} component={Wishlist} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    if (typeof window === "undefined") return false;
    return shouldShowInitialLoader(
      window.location.pathname,
      window.sessionStorage.getItem(INITIAL_LOADER_SESSION_KEY) === "true",
      window.location.hash,
    );
  });

  useEffect(() => {
    if (showInitialLoader) void loadHomePremium();
  }, [showInitialLoader]);

  const dismissInitialLoader = useCallback(() => {
    window.sessionStorage.setItem(INITIAL_LOADER_SESSION_KEY, "true");
    setShowInitialLoader(false);

    const anchorTargetId = getInitialAnchorTargetId(window.location.hash);
    if (anchorTargetId) {
      const restoreAnchor = (attempt = 0) => {
        const target = document.getElementById(anchorTargetId);
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }

        if (attempt < 20) {
          window.requestAnimationFrame(() => restoreAnchor(attempt + 1));
        }
      };

      window.requestAnimationFrame(() => restoreAnchor());
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <CartSyncOnSignIn />
          {showInitialLoader ? <InitialLoader onComplete={dismissInitialLoader} /> : <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
