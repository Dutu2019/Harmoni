import { useContext } from "react"
import { userContext } from "../contexts/userContext"

export default function Home() {
  const context = useContext(userContext);
  console.log(context);
  return (
    <div>Home</div>
  )
}
