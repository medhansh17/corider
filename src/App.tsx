import React, { useState, useEffect } from "react";
import axios from "axios";
import CHeader from "./components/header";
import Footer from "./components/footer";
import ChatComponent from "./components/chat";
import { Toaster, toast } from "react-hot-toast";
import useOnlineStatus from "./hooks/onlineStatus.tsx";

const toastoptions = {
  className: " border border-black text-xl",
  duration: 5000,

  success: {
    duration: 3000,
    theme: {
      primary: "#F5ED02",
      secondary: "black",
    },
  },
  error: {
    duration: 3000,
    theme: {
      primary: "#F5ED02",
      secondary: "black",
    },
  },
};

const App: React.FC = () => {
  const [chatData, setChatData] = useState<any>(null);
  const isOnline = useOnlineStatus();

  const fetchChatData = async () => {
    if (isOnline) {
      try {
        const response = await axios.get(
          "https://qa.corider.in/assignment/chat?page=0"
        );
        setChatData(response.data);
        localStorage.setItem("chatData", JSON.stringify(response.data));
        toast.success("Chat data fetched successfully!");
      } catch (error) {
        console.error("Error fetching chat data:", error);
        toast.error("Error fetching chat data!");
      }
    } else {
      toast.error("You are offline, showing cached chat data");
      const cachedChatData = localStorage.getItem("chatData");
      if (cachedChatData) {
        setChatData(JSON.parse(cachedChatData));
      }
    }
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  if (!chatData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <div className="relative">
        {!isOnline && (
          <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-2">
            You are offline
          </div>
        )}
        <CHeader
          tripName={chatData.name}
          from={chatData.from}
          to={chatData.to}
        />
        <ChatComponent />
        <Footer placeholder={chatData.chats[0]?.sender?.name || "User"} />
      </div>
      <Toaster position="bottom-right" toastOptions={toastoptions} />
    </>
  );
};

export default App;
