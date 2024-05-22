import { Ban } from 'lucide-react'
import { Message } from '../../../types/chat'
import { MessageState } from './message-state'
import { QuotedMessage } from './quoted-message'
import { isOnlyOneEmoji } from '../../../utils/isOneEmoji'
import { MESSAGES_TYPES } from '../../../constants'
import {FileInfo} from './file-info'

interface Props {
  message: Message
  messageListRef?: React.RefObject<HTMLUListElement>
  isMe?: boolean
}

export function MessageArticle ({
  message,
  messageListRef,
  isMe = true
}: Props) {
  const isAnEmoji = isOnlyOneEmoji(message.content)

  let reactions: Record<string, number> | null = null
  if (Object.keys(message.reactions ?? {}).length > 0) {
    reactions = Object.entries(message.reactions ?? {})
      .map(([, value]) => {
        return value
      })
      .reduce<Record<string, number>>((acc, reaction) => {
        if (Object.keys(acc).includes(reaction)) {
          acc[reaction]++
        } else {
          acc[reaction] = 1
        }
        return acc
      }, {})
  }

  return (
    <div className='relative mb-1'>
      <article
        className={`items-center rounded-lg pt-1 pb-1 px-1 ps-1 max-w-3xl whitespace-normal break-words border border-transparent ${
          isMe ? 'bg-gray-300' : 'bg-gray-100'
        }`}
      >
        {!message.isDeleted && message.replyToId && (
          <QuotedMessage
            quotedMessageId={message.replyToId}
            messageListRef={messageListRef}
          />
        )}

        {!message.isDeleted && message.type === MESSAGES_TYPES.IMAGE && message.file && (
          <img
            src={message.file.url}
            alt='message'
            className='max-w-80 max-h-[640px] w-auto h-auto rounded-lg mb-1'
          />
        )}

        {!message.isDeleted && message.type === MESSAGES_TYPES.VIDEO && message.file && (
          <video
            src={message.file.url}
            controls
            className='max-w-80 max-h-[640px] w-auto h-auto rounded-lg mb-1'
          />
        )}

        {!message.isDeleted && message.type === MESSAGES_TYPES.DOCUMENT && message.file && (
          <FileInfo file={message.file} />
        )}

        <div
          className={`${
            !isAnEmoji ? 'flex justify-between h-full pt-1 ps-1' : undefined
          }  `}
        >
          {!message.isDeleted && (
            <p
              className={`w-100 inline align-middle ${
                isAnEmoji ? 'text-5xl' : 'text-sm'
              }`}
            >
              {message.content}
            </p>
          )}
          {message.isDeleted && (
            <p className='text-sm font-light w-100 inline text-gray-400 italic'>
              <Ban className='w-4 h-4 text-gray-400 inline me-2 align-middle' />
              {isMe ? 'You deleted this message.' : 'This message was deleted.'}
            </p>
          )}

          <span
            className={`text-gray-500 items-end ms-2 flex space-x-1 self-end ${
              isAnEmoji ? 'mt-1' : 'mt-2'
            }`}
          >
            {message.isEdited && !message.isDeleted && (
              <small className='italic text-[10px]'>Edited</small>
            )}
            <time className='text-[10px]'>
              {message.createdAt
                .toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
                .toLowerCase()}
            </time>
            {!message.isDeleted && isMe && (
              <MessageState
                isSent={message.isSent}
                isDelivered={message.isDelivered}
                isRead={message.isRead}
              />
            )}
          </span>
        </div>
      </article>
      <span
        className={`${
          isMe ? 'right-2' : 'left-2'
        } absolute -mt-2 flex space-x-1 z-10`}
      >
        {reactions &&
          Object.entries(reactions).map(([reaction, count]) => (
            <span
              key={reaction}
              className={`${
                isMe
                  ? 'bg-gray-100 border border-gray-200'
                  : 'bg-gray-200 border border-gray-100'
              } py-[1px] px-[5px] rounded-full text-sm`}
            >
              {reaction}
              {count > 1 && (
                <small className='text-xs font-medium'>{count}</small>
              )}
            </span>
          ))}
      </span>
    </div>
  )
}
