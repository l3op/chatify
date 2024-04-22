import { useAuth0 } from '@auth0/auth0-react'
import { Message as Props } from '../../types/chat'
import { CheckCheck } from 'lucide-react'
import { useSocketStore } from '../../store/socket'

export function Message ({ content, createdAt, senderId, isRead }: Props) {
  const { user: loggedUser } = useAuth0()
  const { chats } = useSocketStore()
  const isMe = senderId === loggedUser?.sub
  const chat = chats.find(chat => chat.user.id === senderId)

  const time = createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <article
      className={`flex flex-col space-y-2 ${
        isMe ? 'items-end' : 'items-start'
      }`}
    >
      <aside
        className={`flex items-start gap-2 ${
          isMe ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <img
          src={chat?.user.picture}
          width='28'
          height='28'
          alt={`Avatar of the user ${chat?.user.name} in the chat`}
          className='rounded-full align-top h-7 w-7 mt-2'
          style={{ aspectRatio: 28 / 28, objectFit: 'initial' }}
        />

        <span
          className={`flex items-center rounded-lg px-2 py-1 max-w-3xl ${
            isMe ? 'bg-gray-300' : 'bg-gray-100'
          }`}
        >
          <p className={`text-sm w-100 inline`}>{content}</p>
          <time
            className={`text-gray-500 float-end align-bottom text-[10px] mt-4 ms-5 inline`}
          >
            {time}
          </time>
          {isMe && (
            <CheckCheck
              className={`w-4 h-4 float-end align-bottom text-[10px] mt-4 ms-2 inline ${
                isRead ? 'text-blue-500' : 'text-gray-500'
              }`}
            />
          )}
        </span>
      </aside>
    </article>
  )
}
