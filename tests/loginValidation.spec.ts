import {test, expect} from '@playwright/test';  
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';

test.describe('login page - Validação dos textos e labels  ', () => {
    let loginPage:LoginPage;
    let landingPage:LandingPage;

    test.beforeEach(async ({page}) => {
        landingPage = new LandingPage(page);
        loginPage = new LoginPage(page);
        await loginPage.open()
        await loginPage.loginBTN.click()
    })
        test.describe('Validação de textos e labels ', () => {
        test('Verificar texto Entrar', async() => {
            await expect(loginPage.EntrarText).toBeVisible()
        }) 
        test('Verificar texto Auxiliar', async() => {
            await expect(loginPage.EntrarTextAux).toBeVisible()
        })

        test('Validar label Email', async() =>{
            await expect(loginPage.emailLabel).toBeVisible()            
        })

        test('validar labem Senha', async() => {
            await expect(loginPage.senhaLabel).toBeVisible()
        } )       
        
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

})