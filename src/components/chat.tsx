import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

interface Sender {
  image: string;
  is_kyc_verified: boolean;
  self: boolean;
  user_id: string;
}

interface Chat {
  id: string;
  message: string;
  sender: Sender;
  time: string;
}

interface ApiResponse {
  chats: Chat[];
  from: string;
  to: string;
  name: string;
  status: string;
}

const ChatComponent: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  let scrolled = false;

  const fetchChats = useCallback(
    async (pageNumber: number) => {
      if (!hasMore) return;

      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `https://qa.corider.in/assignment/chat?page=${pageNumber}`
        );
        const newChats = response.data.chats;
        if (newChats.length === 0) {
          setHasMore(false);
        } else {
          setChats((prevChats) => [...newChats.reverse(), ...prevChats]);
          setPage(pageNumber + 1);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    fetchChats(0);
  }, [fetchChats]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "10px",
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loading && hasMore) {
        fetchChats(page);
      }
    }, options);

    const firstChatMessage = chatContainerRef.current?.firstElementChild;
    if (firstChatMessage) {
      observerRef.current.observe(firstChatMessage);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, page, hasMore, fetchChats]);

  useEffect(() => {
    if (lastMessageRef.current && !scrolled) {
      scrolled = true;
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen pt-[125px] pb-[80px]">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto  px-4 py-2">
        {loading && (
          <div className="h-10 flex items-center justify-center">
            <span className="text-sm text-gray-500">
              Loading older messages...
            </span>
          </div>
        )}
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`flex ${
              chat.sender.self ? "justify-end" : "justify-start"
            } mb-4`}
            ref={index === chats.length - 1 ? lastMessageRef : null}
          >
            {!chat.sender.self && (
              <img
                src={chat.sender.image}
                alt="Sender"
                className="w-8 h-8 rounded-full mr-2 self-start"
              />
            )}
            <div
              className={`flex flex-col ${
                chat.sender.self ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[90%] ${
                  chat.sender.self
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white text-black rounded-tl-none"
                }`}
              >
                <p className="text-sm">{chat.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(chat.time)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
