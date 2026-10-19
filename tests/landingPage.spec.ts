import {test, expect} from '@playwright/test';
import { LandingPage } from '../pages/landing';


test.describe('Landigng ', () => {
    let landingPage:LandingPage;

    test.beforeEach(async ({page}) => {
        landingPage = new LandingPage(page);
        await landingPage.open()
    })

    test.describe('LandingPage - Nav', () =>{
        test('AppName', async ({ page }) => {
            await expect(landingPage.appName).toBeVisible()
        })  

        test('deve exibir o link Recursos', async ({ page }) => {
            await expect(landingPage.resourcesLink ).toBeVisible()
        })  
        test('deve navegar ao clicar em Recursos', async ({ page }) => {
            await landingPage.resourcesLink.click();

            await expect(page).toHaveURL('https://minha-vida-financeira-a16d2.web.app/#features') 
        })

        test('deve exibir o link família', async ({ page }) => {
            await expect(landingPage.familyLink ).toBeVisible()
        })  
        test('deve navegar ao clicar em família', async ({ page }) => {
            await landingPage.familyLink.click();

            await expect(page).toHaveURL('https://minha-vida-financeira-a16d2.web.app/#family') 
        })
        
        test('deve exibir o link Planos', async ({ page }) => {
            await expect(landingPage.planosLink ).toBeVisible()
        })  
        test('deve navegar ao clicar em Planos', async ({ page }) => {
            await landingPage.planosLink.click();

            await expect(page).toHaveURL('https://minha-vida-financeira-a16d2.web.app/#plans') 
        })

        test('deve exibir o link Entrar', async ({ page }) => {
            await expect(landingPage.entrarButton ).toBeVisible()
        })  
        test('deve navegar ao clicar em Entrar', async ({ page }) => {
            await landingPage.entrarButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Entrar',
                    exact: true
                })
            ).toBeVisible();
        })

        test('deve exibir o botão Começar Grátis', async ({ page }) => {
            await expect(landingPage.comecarGratisButton ).toBeVisible()
        })  
        test('deve navegar ao clicar no botão Começar Grátis', async ({ page }) => {
            await landingPage.comecarGratisButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();
        })
        
    })
    test.describe('LandingPage - Body', () => {
        test('deve exibir o botão Criar Conta Grátis', async ({ page }) => {
        await expect(landingPage.criarContaGratisButton).toBeVisible()

        })  
        test('deve navegar ao clicar em Criar Conta Grátis', async ({ page }) => {
            await landingPage.criarContaGratisButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();
        })
        test('deve exibir o botão Já tenho conta', async ({ page }) => {
        await expect(landingPage.jaTenhoContaButton ).toBeVisible()

        })  
        test('deve navegar ao clicar em Já tenho conta', async ({ page }) => {
            await landingPage.jaTenhoContaButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Entrar',
                    exact: true
                })
            ).toBeVisible();
        })
        test('deve exibir o botão Experimentar Grátis', async ({ page }) => {
            await expect(landingPage.experimenteGratisButton).toBeVisible()
        }) 
        test('deve navegar ao clicar no botão Experimentar Grátis ', async ({ page }) => {
            await landingPage.experimenteGratisButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();
        })
        test('deve exibir o botão Criar Grátis - Seção Planos ', async ({ page }) => {
            await expect(landingPage.criarContaGratisPlansButton).toBeVisible()
        })
        test('deve navegar ao clicar no botão Experimentar Grátis - Seção Planos', async ({ page }) => {
            await landingPage.criarContaGratisPlansButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();
        })
        test('deve exibir o botão Assinar Premium - Seção Planos ', async ({ page }) => {
            await expect(landingPage.AssinarPremiumPlan).toBeVisible()
        })
        test('deve navegar ao clicar no botão Assinar Premium - Seção Planos', async ({ page }) => {
            await landingPage.AssinarPremiumPlan.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();
        })
        test('deve exibir o botão Criar Conta Gratis- Seção Pronto para assumir o controle? ', async ({ page }) => {
            await expect(landingPage.criarContaGratisCtaButton).toBeVisible()
        })
        test('deve navegar ao clicar no botão Criar Conta Gratis- Seção Pronto para assumir o controle?', async ({ page }) => {
            await landingPage.criarContaGratisCtaButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();

        })
        test('deve exibir o botão Já Tenho Conta- Seção Pronto para assumir o controle? ', async ({ page }) => {
            await expect(landingPage.jatenhoContaCtaButton).toBeVisible()
        })
        test('deve navegar ao clicar no Já Tenho Conta- Seção Pronto para assumir o controle?', async ({ page }) => {
            await landingPage.jatenhoContaCtaButton.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Entrar',
                    exact: true
                })
            ).toBeVisible();
        })
    })
    test.describe('LandingPage - Footer', () => {

        test('AppName no Rodapé', async ({ page }) => {
            await expect(landingPage.appNameFooter).toBeVisible()
        })

        test('deve exibir o botão Login no footer? ', async ({ page }) => {
            await expect(landingPage.loginBtn).toBeVisible()
    })        
       test('deve navegar ao clicar no botão login do footer', async ({ page }) => {
            await landingPage.loginBtn.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Entrar',
                    exact: true
                })
            ).toBeVisible();
        })

        test('deve exibir o botão Cadastro no footer? ', async ({ page }) => {
        await expect(landingPage.cadastroBtn).toBeVisible()
        })
        
       test('deve navegar ao clicar no botão Cadastro do footer', async ({ page }) => {
            await landingPage.cadastroBtn.click();
            await expect (
                page.getByRole('heading', {
                    name: 'Criar conta',
                    exact: true
                })
            ).toBeVisible();
        })
        
    })
    
})

