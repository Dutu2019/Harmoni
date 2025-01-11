import { useContext } from "react"
import { userContext } from "../contexts/userContext"

export default function Home() {
  const context = useContext(userContext);
  return (
    <div>Home</div>
  )
}
