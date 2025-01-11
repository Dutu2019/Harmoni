import { useContext } from "react"
import { userContext } from "@/contexts/userContext"
import { Index, FloatingBubble } from "@/components/custom/Bubbles"

export default function Home() {
  const context = useContext(userContext);
  return (
    <>
      <Index/>
    </>
  )
}
