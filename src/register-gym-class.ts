import { test, expect } from '@playwright/test';
import { CONFIG, sleep, generateClassesUrl } from './helpers.js'


test('register in gym class', async ({ page }) => {

  // Login
  await page.goto('https://crosshero.com/athletes/sign_in');

  await page.getByLabel('Email').click();

  await page.getByLabel('Email').fill(CONFIG.username);

  await page.getByLabel('Contraseña').click();

  await page.getByLabel('Contraseña').fill(CONFIG.password);

  await page.getByLabel('Contraseña').press('Enter');

  // Select classes
  await expect(page).toHaveURL('https://crosshero.com/dashboard/classes');

  await page.goto('https://crosshero.com/dashboard/classes');

  await page.goto(generateClassesUrl({baseClasesUrl: CONFIG.baseClasesUrl, daysToAdd: CONFIG.daysToAdd, gymProgramId: CONFIG.gymProgramId}));

  await page.getByRole('combobox', { name: 'Seleccione un horario' }).locator('span').nth(2).click();

  await page.getByRole('treeitem', { name: CONFIG.gymClassId }).click();

  await page.getByRole('button', { name: 'Reservar clase' }).click();

  await page.getByText('Clase reservada con éxito.').click();

  await sleep(10000)

});