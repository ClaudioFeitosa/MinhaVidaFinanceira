
import { Page, Locator } from '@playwright/test';

export class LoginPage  {
    readonly page:Page;

  // Elementos da login Page
    readonly loginBTN : Locator;
    readonly voltarBtn : Locator;
    readonly ContinuarComGoogleBtn : Locator;
    readonly emailInput: Locator;
    readonly senhaInput: Locator;
    readonly EntrarnacontaBtn: Locator;
    readonly credenciasInvalidas : Locator;
    readonly EntrarText : Locator;
    readonly EntrarTextAux : Locator;
    readonly emailLabel : Locator;
    readonly senhaLabel: Locator;
 


      constructor(page : Page) {
        this.page = page
        
        this.loginBTN = page
            .getByRole('button', {
                name:'Entrar',
                exact:true
        })

        this.voltarBtn = page
            .getByRole('button', {
                name:'Voltar',
                exact:true
            })

        this.ContinuarComGoogleBtn = page
            .getByRole('button', {
                name:'Continuar com Google',
                exact:true
            })

        this.senhaInput = page
            .getByLabel('current-password')

        this.EntrarnacontaBtn = page
            .getByRole('button', {
                name:'Entrar na conta',
                exact:true
        })

        this.emailInput = page.getByPlaceholder('seu@email.com')

        this.senhaInput = page.getByPlaceholder('••••••••')

        this.credenciasInvalidas = page
            .getByText('E-mail ou senha incorretos. Verifique suas credenciais.')

        this.EntrarText = page
            .getByText('Entrar', {
                exact:true
            })
        
        this.EntrarTextAux = page
            .getByText('Acesse sua conta para continuar.', {
                exact:true
            })

        this.emailLabel = page.locator('label', {
                hasText:'E-mail'
        })

        this.senhaLabel = page.locator('label', {
                hasText:'Senha'
        })
    }

    async preencherEmailInput(email: string) {
        await this.emailInput.fill(email);
    }

    async preencherSenhaInput(password: string) {
        await this.senhaInput.fill(password)
    }

    async loginComSucesso(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.senhaInput.fill(password);
        await this.EntrarnacontaBtn.click()
    }

      // Acessa a Landing Page
    async open() {
        await this.page.goto('/');
  }
}