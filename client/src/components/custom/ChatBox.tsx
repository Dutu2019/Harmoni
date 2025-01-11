import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/message`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const recieved = await res.json();
      if (recieved != messages) {
        setMessages(recieved);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: newMessage }),
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl h-[calc(100vh-6rem)] bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="bg-purple-500/10 dark:bg-purple-400/10 p-3 rounded-full">
          <MessageCircle className="w-6 h-6 text-purple-500 dark:text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          Chat
        </h1>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-purple-200 dark:border-purple-900 h-[calc(100%-8rem)] animate-scale-in">
        <ScrollArea className="h-[calc(100%-5rem)] p-6">
          <div className="space-y-6">
            {messages[1] && messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 shadow-md transition-all hover:shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 text-white"
                      : "bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-purple-100 dark:border-purple-800"
                  }`}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-purple-100 dark:border-purple-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-b-xl">
          <div className="flex gap-3">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 transition-all"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 text-white px-6 hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;