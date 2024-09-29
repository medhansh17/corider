import React, { useState, useEffect } from "react";
import axios from "axios";
import CHeader from "./components/header";
import Footer from "./components/footer";
import ChatComponent from "./components/chat";

const App: React.FC = () => {
  const [chatData, setChatData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://qa.corider.in/assignment/chat?page=0")
      .then((response) => setChatData(response.data))
      .catch((error) => console.error("Error fetching chat data:", error));
  }, []);

  if (!chatData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="relative">
      <CHeader tripName={chatData.name} from={chatData.from} to={chatData.to} />
      <ChatComponent />
      <Footer placeholder={chatData.chats[0]?.sender?.name || "User"} />
    </div>
  );
};

export default App;
