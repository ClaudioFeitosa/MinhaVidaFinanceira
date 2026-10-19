import {test, expect} from '@playwright/test';  
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';
import { GoogleAuthPage } from '../pages/googleAuthPage';
import 'dotenv/config';
import process from 'node:process';

test.describe('Landigng ', () => {
    let loginPage:LoginPage;
    let landingPage:LandingPage;
    let googleAuthPage:GoogleAuthPage;

    test.beforeEach(async ({page}) => {
        landingPage = new LandingPage(page);
        googleAuthPage = new GoogleAuthPage(page);
        loginPage = new LoginPage(page);

        loginPage = new LoginPage(page);
        await loginPage.open()
        await loginPage.loginBTN.click()
    })

    test.describe('Elementos da pagina de login ', () => {
        test('Verificar se existe o botão voltar', async({page}) => {
            await expect(loginPage.voltarBtn).toBeVisible()
        }) 

        test('Validar click no botão voltar', async({page}) =>{
            await loginPage.voltarBtn.click()
            await expect(landingPage.entrarButton).toBeVisible()            

        })
        
    })
    
    test.describe('Loging Google ', () => {

        test('Validar que o botão do google esta na pagina', async ({page}) =>{
            await expect(loginPage.ContinuarComGoogleBtn).toBeVisible()            
        })  
        test.skip('Validar login com o google - valido', async ({page}) =>{
            const popupPromise = page.waitForEvent('popup');

            await loginPage.ContinuarComGoogleBtn.click()

            const googlePage = await popupPromise;
            googleAuthPage = new GoogleAuthPage(googlePage);

               await expect(googlePage.getByText('Sign in', {exact:true})).toBeVisible()

            await googleAuthPage.preencherEmail('feitosaclaudio713@gmail.com')
            await googleAuthPage.ClicarSeguinte();
            await googleAuthPage.preencherSenha('minhaconta1@')
            await googleAuthPage.ClicarSeguinte()

        })       
        
    })
    
    test.describe('Login direto na aplicação ', () => {
        const Email = process.env.valid_USER_EMAIL;
        const password = process.env.Valid_USER_PASSWORD;

        test.only('login Valido com Email e Senha validos', async({page}) => {
            await loginPage.preencherEmailInput(Email)
            await loginPage.preencherSenhaInput(password)
            await loginPage.EntrarnacontaBtn.click()
            await expect(page.getByText('Visão Geral', { exact: true })).toBeVisible()           


        })
        
    })
    
})