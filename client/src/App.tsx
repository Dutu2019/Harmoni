import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContextProvider from "@/contexts/userContext";
import Index from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import NavBar from "./components/custom/NavBar";

const App = () => (
  <div className="relative w-full h-full">
  <UserContextProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </UserContextProvider>
    </div>
);

export default App;