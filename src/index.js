import * as playwright from 'playwright'
import { CONFIG, generateClassesUrl, calculateClassDay } from './resources/helpers.js'
import { sendTelegramMessage, sendTelegramImage } from './resources/telegram.js'

const locale = 'en-US;q=0.8,en;q=0.7;en-GB' // No parece funcionar
const timezone = 'Europe/Madrid'

const browser = await playwright.chromium.launch({
  headless: process.env.CI ? true : false, // Show the browser.
  locale: locale,
  timezone: timezone,
  timeout: 1000
})

const page = await browser.newPage()
const classDate = calculateClassDay(CONFIG.daysToAdd)
const classDateBeauty = classDate.toISOString().split('T')[0]

try {
  // Login
  await page.goto('https://crosshero.com/athletes/sign_in');

  await page.getByLabel('Email').fill(CONFIG.username);
  await page.locator('id=athlete_password').fill(CONFIG.password)
  await page.keyboard.press('Enter');

  // Select classes
  await page.waitForURL('https://crosshero.com/dashboard/classes')

  await page.goto(generateClassesUrl({baseClasesUrl: CONFIG.baseClasesUrl, classDate: classDate, gymProgramId: CONFIG.gymProgramId}))
  await page.locator('id=select2-class_reservation_single_class_id-container').click()

  await page.getByRole('treeitem', { name: new RegExp(`${CONFIG.gymClassSelector}`) }).first().click()
  await page.waitForSelector('id=classes-sign-in')

  // Clic on sign in to class (apuntarse a clase)
  await page.locator('id=classes-sign-in').click()

  await page.getByText(/(Clase reservada con éxito.)|(Class successfully reserved.)/i).click() // Confirma que se ha registrado correctamente

  await sendTelegramMessage(CONFIG.telegram.chatId, `Clase reservada con éxito.\nUsuario: ${CONFIG.username}\nDía: ${classDateBeauty}\nSelector: ${CONFIG.gymClassSelector}`)

} catch (e) {
  const screenshotBuffer = await page.screenshot()
  const errorMessage = `ERROR. No se puede reservar la siguiente clase:\nUsuario: ${CONFIG.username}\nDía: ${classDateBeauty}\nSelector: ${CONFIG.gymClassSelector} \n-----------------------\nError:\n${e}`
  await sendTelegramImage({chatId: CONFIG.telegram.chatId, image: screenshotBuffer, message: errorMessage })
  throw e

} finally {
  await browser.close()
}
