import ChatBox from "@/components/custom/ChatBox"
import { userContext } from "@/contexts/userContext"
import { useState, useContext, useEffect } from "react"
import { Cross } from "lucide-react";

export default function Chat() {
    const [activeChat, setActiveChat] = useState(false);
    const data = useContext(userContext);
    const fetchChat = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/chat`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            });
            if (response.ok) {
                setActiveChat(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
    }
    };
    useEffect(() => {
        fetchChat();
    }, []);

    const user = data.data.user;
    if (!user) {
        return <h1>Loading...</h1>
    }

    const createChat = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/create-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            });
            const result = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
    }
    setActiveChat(true);
}
    
  return (
    <>
        <section>
            {user.role=="student" ?
                    <div className="flex flex-col items-center min-h-screen bg-gray-100">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 m-6">
                        We're here to help
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Let us listen to your concerns and help you with your problems.
                    </p>
                    {activeChat ? 
                    <ChatBox /> :
                    <button onClick={createChat} className="flex gap-2 mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-6 rounded">
                       <Cross/> Start Chat
                    </button>
                    }
                </div> : <ChatBox />
            }

        </section>
    </>
  )
}
