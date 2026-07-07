import { Outlet } from "react-router-dom";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function Layout() {
  return (
    <>
      <GlobalNavbar />
      <Outlet />
      <Footer />
      <WhatsAppButton />
      <ChatbotWidget />
    </>
  );
}
