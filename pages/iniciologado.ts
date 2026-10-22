
import { Page, Locator } from '@playwright/test';
import test from 'node:test';

export class HomeLogado  {
    readonly page:Page;

  // Elementos da login Page
    readonly MenuLateral : Locator;
    readonly InícioBtn : Locator;
    readonly extratoBtn : Locator;
    readonly investirBtn : Locator;
    readonly metasBtn   : Locator;
    readonly FamiliaBtn : Locator;
    readonly perfilBtn  : Locator;
    readonly sairBtnLateral :  Locator;
    readonly sairBtnHeader : Locator;
    readonly alertasbTN : Locator;
    readonly CentroDeNotificações: Locator; // este locator deve ir para a pagina Alertas quando ela estiver pronta
    readonly MeuPerfilHeader: Locator;
    readonly CentralDoUsuário: Locator; // este locator deve ir para a pagina perfil quando ela estiver pronta

   
      constructor(page : Page) {
        this.page = page;

        this.MenuLateral = page
          .locator('nav')
          .filter({
            has: page.getByRole('button',{
              name:'Início',
              exact: true
            } )
          })

        this.InícioBtn = this.MenuLateral.getByRole('button', {
          name: 'Início',
          exact: true
        });
        
        this.extratoBtn = this.MenuLateral.getByRole('button', {
          name: 'Extrato',
          exact: true
        });

        this.investirBtn = this.MenuLateral.getByRole('button', {
          name: 'Investir',
          exact:true
        })
        this.metasBtn = this.MenuLateral.getByRole('button', {
          name:'Metas',
          exact: true
        })

        this.FamiliaBtn = this.MenuLateral.getByRole('button', {
          name:'Família',
          exact:true
        })
        this.perfilBtn = this.MenuLateral.getByRole('button', {
          name:'Perfil',
          exact:true
        })

        this.sairBtnLateral = page
          .getByRole('complementary')
          .getByRole('button', {
            name:'Sair da conta',
            exact:true
        }) 

        this.sairBtnHeader = page.getByRole('button', {
          description: 'Sair da conta',
          exact: true
        })  
        
// este bloco deve ir para a pagina Alertas 
        this.alertasbTN = page.getByRole('button',{
          name: 'Alertas',
          exact: true
        } )

        this.CentroDeNotificações = page.getByText('Centro de Notificações')
// este bloco deve ir para a pagina Alertas 
// este bloco deve ir para a pagina perfil 
        this.MeuPerfilHeader = page.locator('[title="Meu perfil"]')

        this.CentralDoUsuário = page.getByText('Central do Usuário')
// este bloco deve ir para a pagina perfil       
  }
}