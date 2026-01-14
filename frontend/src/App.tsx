import { Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import { AppLayout } from "@/components/AppLayout";
import ChatPage from "@/pages/ChatPage";
import RfpPage from "@/pages/RfpPage";
import RfpDetailsPage from "@/pages/RfpDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="rfps" element={<RfpPage />} />
        <Route path="rfps/:id" element={<RfpDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
