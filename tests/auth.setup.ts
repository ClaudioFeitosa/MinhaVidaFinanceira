import {test as setup, expect} from '@playwright/test'
import { LoginPage } from '../pages/login'
import { LandingPage } from '../pages/landing';
import 'dotenv/config';
import process from 'node:process';




setup ('Autenticar usuario', async({page}) =>{
    const loginPage = new LoginPage(page);
    const landingPage = new LandingPage(page)
    
    await landingPage.open();
    await landingPage.entrarButton.click()
    await loginPage.loginComSucesso(
        process.env.lite_valid_USER_EMAIL!,
        process.env.lite_Valid_USER_PASSWORD!
    );

    await expect(page.getByText('Visão Geral', { exact: true })).toBeVisible() 
    
    await page.context().storageState({
        path:'playwright/.auth/user.json'
    })

})

