import { Page, Locator } from '@playwright/test';

export class GoogleAuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly seguinteBtn: Locator;
    readonly senhaInput: Locator;
 

    constructor(page: Page) {
        this.page = page;

        this.emailInput = page.getByLabel('Email or phone');

        this.seguinteBtn = page.getByRole('button', {
            name:'Next',
            exact:true});

        this.senhaInput = page.getByLabel('Password');
    }

    async preencherEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async ClicarSeguinte() {
        await this.seguinteBtn.click()
    }

    async preencherSenha(senha: string) {
        await this.senhaInput.fill(senha);

    }
}