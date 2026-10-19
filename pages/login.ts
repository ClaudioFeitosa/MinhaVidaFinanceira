
import { Page, Locator } from '@playwright/test';

export class LoginPage  {
    readonly page:Page;

  // Elementos da login Page
    readonly loginBTN : Locator;
    readonly voltarBtn : Locator;
    readonly ContinuarComGoogleBtn : Locator;
    readonly emailInput: Locator;
    readonly senhaInput: Locator;
    readonly EntrarnacontaBtn: Locator
    


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

    }

    async preencherEmailInput(email: string) {
        await this.emailInput.fill(email);
    }

    async preencherSenhaInput(password: string) {
        await this.senhaInput.fill(password)
    }

      // Acessa a Landing Page
    async open() {
        await this.page.goto('/');
  }
}