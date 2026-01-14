import { Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import { AppLayout } from "@/components/AppLayout";
import ChatPage from "@/pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;
