import ChatBox from "@/components/custom/ChatBox"
import { userContext } from "@/contexts/userContext"
import { useState, useContext } from "react"
import { Cross } from "lucide-react";

export default function Chat() {
    const [activeChat, setActiveChat] = useState(false);
    const data = useContext(userContext);
    const user = data.data.user;
    if (!user) {
        return <h1>Loading...</h1>
    }
    console.log(user);
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
                    <button onClick={() => setActiveChat(true)} className="flex gap-2 mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-6 rounded">
                       <Cross/> Start Chat
                    </button>
                    }
                </div> :
                <ChatBox />
            }

        </section>
    </>
  )
}
