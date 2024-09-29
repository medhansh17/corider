import React, { useState, useEffect } from "react";
import axios from "axios";
import CHeader from "./components/header";
import Footer from "./components/footer";
import ChatComponent from "./components/chat";
import { Toaster, toast } from "react-hot-toast";
import useOnlineStatus from "./hooks/onlineStatus";

const toastOptions = {
  className: "border border-black text-xl",
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
  const isOnline = useOnlineStatus();
  const [chatData, setChatData] = useState<any>(null);

  const fetchChatData = async () => {
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
  };

  useEffect(() => {
    if (isOnline) {
      fetchChatData();
    } else {
      const cachedData = localStorage.getItem("chatData");
      if (cachedData) {
        setChatData(JSON.parse(cachedData));
      } else {
        alert("Offline , check network");
      }
    }
  }, [isOnline]);

  if (!chatData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <div className="relative">
        <CHeader
          tripName={chatData.name}
          from={chatData.from}
          to={chatData.to}
        />
        <ChatComponent />
        <Footer placeholder={chatData.chats[0]?.sender?.name || "User"} />
      </div>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
    </>
  );
};

export default App;
