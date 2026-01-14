import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="relative min-h-screen bg-background isolate">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      <Navbar />
      <Outlet />
    </div>
  );
};
