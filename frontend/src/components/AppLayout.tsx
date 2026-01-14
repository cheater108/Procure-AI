import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
};
