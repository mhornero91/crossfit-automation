import * as playwright from 'playwright'
import { CONFIG, generateClassesUrl, sleep } from './helpers.js'

const locale = 'en-US;q=0.8,en;q=0.7;en-GB' // No parece funcionar
const timezone = 'Europe/Madrid'

const browser = await playwright.chromium.launch({
  headless: process.env.CI ? true : false, // Show the browser.
  locale: locale,
  timezone: timezone
})

const page = await browser.newPage()

try {
  // Login
  await page.goto('https://crosshero.com/athletes/sign_in');

  await page.getByLabel('Email').fill(CONFIG.username);
  await page.locator('id=athlete_password').fill(CONFIG.password)
  await page.keyboard.press('Enter');

  // Select classes
  await page.waitForURL('https://crosshero.com/dashboard/classes');
  await page.goto(generateClassesUrl({baseClasesUrl: CONFIG.baseClasesUrl, daysToAdd: CONFIG.daysToAdd, gymProgramId: CONFIG.gymProgramId}))
  await page.locator('id=select2-class_reservation_single_class_id-container').click()

  await page.getByRole('treeitem', { name: new RegExp(`${CONFIG.gymClassId}`) }).first().click()
  await page.waitForSelector('id=classes-sign-in')

  // Clic on sign in to class (apuntarse a clase)
  await page.locator('id=classes-sign-in').click()

  await page.getByText(/(Clase reservada con éxito.)|(Class successfully reserved.)/i).click() // Confirma que se ha registrado correctamente

} catch (e) {
  console.log(e)

} finally {
  await browser.close()

}

