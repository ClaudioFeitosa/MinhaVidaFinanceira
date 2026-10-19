import {test, expect} from '@playwright/test';  
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';
import { GoogleAuthPage } from '../pages/googleAuthPage';
import 'dotenv/config';
import process from 'node:process';

function obterVariavelAmbiente(nome: string): string {
    const valor = process.env[nome];

    if (!valor) {
        throw new Error(
            `A variável de ambiente ${nome} não foi definida.`
        );
    }

    return valor;
}


const Email = obterVariavelAmbiente('valid_USER_EMAIL');
const password = obterVariavelAmbiente('Valid_USER_PASSWORD');
const Emailinvalido = obterVariavelAmbiente('invalid_USER_EMAIL');
const passwordinvalido = obterVariavelAmbiente('inValid_USER_PASSWORD');   

test.describe('Login Page Validação das iterações - botões e logar ', () => {
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
 
        test('login Valido com Email e Senha validos', async({page}) => {
            await loginPage.preencherEmailInput(Email)
            await loginPage.preencherSenhaInput(password)
            await loginPage.EntrarnacontaBtn.click()
            await expect(page.getByText('Visão Geral', { exact: true })).toBeVisible()  
        })

        test('login Valido com email invalido', async() => {
            await loginPage.preencherEmailInput(Emailinvalido)
            await loginPage.preencherSenhaInput(password)
            await loginPage.EntrarnacontaBtn.click()
            loginPage.credenciasInvalidas.visible()
        })

        test('login Valido com senha invalida', async() => {
            await loginPage.preencherEmailInput(Email);
            await loginPage.preencherSenhaInput(passwordinvalido);
            await loginPage.EntrarnacontaBtn.click();
            loginPage.credenciasInvalidas.visible();
        })   
        
    })
    
})