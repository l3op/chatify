import { User } from "../types/chat"

const SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'
  
export async function getAllUsers(): Promise<User[] | undefined> {
    try {
      const response = await fetch(`${SERVER_DOMAIN}/users`)
      return await response.json()
    } catch (error) {
        console.log(error)
        return
    }
  }
