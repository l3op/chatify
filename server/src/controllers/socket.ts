import {
  MessagesToRead,
  ServerMessage,
  ServerMessageDB
} from '../types/chat.js'
import { createClient } from '@libsql/client'
import { SOCKET_EVENTS } from '../constants/index.js'
import { io } from '../../index.js'
import { Socket } from 'socket.io'

const db = createClient({
  url: process.env.DB_URL ?? '',
  authToken: process.env.DB_AUTH_TOKEN ?? ''
})

export class SocketController {
  static async disconnect (): Promise<void> {
    console.log('User disconnected')
  }

  static async newMessage (message: ServerMessage): Promise<void> {
    const uuid = crypto.randomUUID()
    const created_at = new Date().toISOString()
    const createdMessage: ServerMessageDB = {
      uuid,
      ...message,
      created_at
    }

    try {
      await db.execute({
        sql: 'INSERT INTO messages (uuid, content, sender_id, receiver_id, is_read, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, created_at) VALUES (:uuid, :content, :sender_id, :receiver_id, :is_read, :is_edited, :is_deleted, :reply_to_id, :type, :resource_url, :chat_id, :created_at)',
        args: {
          uuid,
          ...message,
          created_at
        }
      })
    } catch (error) {
      console.error(error)
      return
    }

    io.emit(SOCKET_EVENTS.CHAT_MESSAGE, createdMessage)
  }

  static async readMessages (messages: MessagesToRead): Promise<void> {
    let selectResult
    let updateResult
    try {
      selectResult = await db.execute({
        sql: 'SELECT * FROM messages WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_read = FALSE',
        args: { ...messages }
      })

      updateResult = await db.execute({
        sql: 'UPDATE messages SET is_read = TRUE WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_read = FALSE',
        args: { ...messages }
      })

      if (
        selectResult.rowsAffected === updateResult.rowsAffected &&
        selectResult.rows.length > 0
      ) {
        selectResult.rows.forEach(row => {
          const message = {
            ...row
          }
          io.emit(SOCKET_EVENTS.READ_MESSAGE, message)
        })
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  static async recoverMessages (socket: Socket): Promise<void> {
    if (socket.recovered) {
      return
    }

    const offset = socket.handshake.auth.serverOffset ?? 0
    const loggedUserId = socket.handshake.auth.userId ?? ''

    try {
      const results = await db.execute({
        sql: `SELECT uuid, content, sender_id, receiver_id, is_read, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, created_at FROM messages WHERE created_at > :offset AND (sender_id = :loggedUserId OR receiver_id = :loggedUserId) ORDER BY created_at ASC`,
        args: { offset, loggedUserId }
      })

      results.rows.forEach(row => {
        const message = {
          ...row
        }
        socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, message)
      })
    } catch (e) {
      console.error(e)
      return
    }
  }
}
