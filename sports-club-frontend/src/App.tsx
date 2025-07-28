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
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import TeamsPage from "./pages/TeamsPage";
import ForumPage from "./pages/ForumPage";
import PaymentsPage from "./pages/PaymentsPage";
import ProfilePage from "./pages/ProfilePage";
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
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="facilities" element={<FacilitiesPage />} />
                    <Route path="teams" element={<TeamsPage />} />
                    <Route path="forum" element={<ForumPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
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
