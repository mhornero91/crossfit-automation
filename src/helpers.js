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
  'GYM_CLASS_ID',
  'GYM_PROGRAM_ID',
])

export const CONFIG = {
  username: String(process.env.USER),
  password: String(process.env.PASS),
  daysToAdd: parseInt(process.env.DAYS_TO_ADD ?? 7), // Número de días a futuro para hacer la reserva,
  baseClasesUrl: 'https://crosshero.com/dashboard/classes',
  gymProgramId: String(process.env.GYM_PROGRAM_ID),
  gymClassId: String(process.env.GYM_CLASS_ID)
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateClassesUrl({baseClasesUrl, gymProgramId, daysToAdd}) {
  const today = new Date()
  const objectiveDate = new Date()
  objectiveDate.setDate(today.getDate() + daysToAdd)
  const [year, month, day] = objectiveDate.toISOString().split('T')[0].split('-')
  const dateUrlFormat = [day, month, year].join('%2F')

  return `${baseClasesUrl}?date=${dateUrlFormat}&program_id=${gymProgramId}`
}

