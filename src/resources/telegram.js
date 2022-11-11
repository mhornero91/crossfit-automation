import { Telegraf } from 'telegraf'
import { CONFIG } from './helpers.js'

const bot = new Telegraf(CONFIG.telegram.botToken)

export async function sendTelegramMessage(chatId, message) {
  return await bot.telegram.sendMessage(chatId, message)
}

export async function sendTelegramImage({chatId, image, message }) {
  return await bot.telegram.sendPhoto(chatId, {source: image }, {caption: message})

}
