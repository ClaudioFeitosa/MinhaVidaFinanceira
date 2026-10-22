import {test, expect} from '@playwright/test';  
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';
import { HomeLogado } from '../pages/iniciologado';
import 'dotenv/config';
import process from 'node:process';

test.describe('Área logada - inicio', () => {
    let loginPage: LoginPage;
    let landingPage: LandingPage;
    let homeLogado:HomeLogado;  
    
        test.beforeEach(async({page}) =>{
        loginPage = new LoginPage(page);
        landingPage = new LandingPage(page);
        homeLogado = new HomeLogado(page);
       
        await landingPage.open();
        
    });

    test.describe('Validação de botões da pagina Inicias ', () => {
        test('Validar menu laterial', async() =>{
        await expect(homeLogado.MenuLateral).toBeVisible();
        await expect(homeLogado.InícioBtn).toBeVisible();
        await expect(homeLogado.extratoBtn).toBeVisible();
        await expect(homeLogado.investirBtn).toBeVisible();
        await expect(homeLogado.metasBtn).toBeVisible();
        await expect(homeLogado.FamiliaBtn).toBeVisible();        
        })

        test ('Validar se as opções de sair estão visiveis', async() => {
        await expect(homeLogado.sairBtnLateral).toBeVisible();
        await expect(homeLogado.sairBtnHeader).toBeVisible();
        })

        test('Validar funcionamento do botão sair -LATERAL', async() =>{
        await homeLogado.sairBtnLateral.click();
        })

        test('validar botão sair no HEADER', async() => {
        await homeLogado.sairBtnHeader.click();
        })

        test('Validar sino de alertas', async() =>{
            await expect(homeLogado.alertasbTN).toBeVisible()
        })

        test('validar click no Sino de alertas', async() =>{
            await homeLogado.alertasbTN.click()
            await expect(homeLogado.CentroDeNotificações).toBeVisible()
        })
        
        test('Verificar o botão Meu Perfil no Header', async() => {
            await expect(homeLogado.MeuPerfilHeader).toBeVisible
        })

        test('Verificar se o click no botão Meu Perfil no Header redireciona para o perfil', async() =>{
            await homeLogado.MeuPerfilHeader.click()
            await expect(homeLogado.CentralDoUsuário).toBeVisible()
        })
    })
});