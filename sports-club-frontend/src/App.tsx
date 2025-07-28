import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationContainer } from "@/components/ui/notification-toast";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LoadingProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <NotificationContainer />
              </BrowserRouter>
            </TooltipProvider>
          </LoadingProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
