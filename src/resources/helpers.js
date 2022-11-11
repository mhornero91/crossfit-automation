import * as dotenv from 'dotenv'
dotenv.config()

function validateEnvironmentsVars(environmentVars) {
  for (const environmentVar of environmentVars) {
    if (!process.env[environmentVar]) {
      throw new Error(`You have to set the environment variable '${environmentVar}'`)
    }
  }
}

validateEnvironmentsVars([
  'PASS',
  'USER',
  'GYM_PROGRAM_ID',
  'GYM_CLASS_SELECTOR',
  'TELEGRAM_TOKEN'
])

export const CONFIG = {
  username: String(process.env.USER),
  password: String(process.env.PASS),
  daysToAdd: parseInt(process.env.DAYS_TO_ADD ?? 7), // Número de días a futuro para hacer la reserva,
  baseClasesUrl: 'https://crosshero.com/dashboard/classes',
  gymProgramId: String(process.env.GYM_PROGRAM_ID),
  gymClassSelector: String(process.env.GYM_CLASS_SELECTOR),
  telegram: {
    chatId: -891780803,
    botToken: process.env.TELEGRAM_TOKEN
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function calculateClassDay(daysToAdd) {
  const today = new Date()
  const objectiveDate = new Date()
  objectiveDate.setDate(today.getDate() + daysToAdd)

  return objectiveDate
}

export function generateClassesUrl({baseClasesUrl, gymProgramId, classDate}) {
  const [year, month, day] = classDate.toISOString().split('T')[0].split('-')
  const dateUrlFormat = [day, month, year].join('%2F')

  return `${baseClasesUrl}?date=${dateUrlFormat}&program_id=${gymProgramId}`
}

