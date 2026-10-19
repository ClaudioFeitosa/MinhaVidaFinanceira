
import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  // Elementos da Landing Page
  readonly appName        : Locator;
  readonly resourcesLink  : Locator;
  readonly familyLink     : Locator;
  readonly planosLink     : Locator;
  readonly entrarButton     : Locator;
  readonly comecarGratisButton  :Locator;
  readonly criarContaGratisButton     :Locator;
  readonly jaTenhoContaButton         :Locator;
  readonly experimenteGratisButton    :Locator;  
  readonly plansSection     : Locator;
  readonly criarContaGratisPlansButton    : Locator;
  readonly AssinarPremiumPlan   : Locator
  readonly ctaSection: Locator;
  readonly criarContaGratisCtaButton: Locator;
  readonly jatenhoContaCtaButton: Locator;
  readonly appNameFooter        : Locator;
  readonly loginBtn     : Locator;
  readonly cadastroBtn  : Locator;


  constructor(page: Page) {
    this.page = page;

    this.appName = page
      .getByRole('navigation')
      .getByText("Minha Vida Financeira")

    this.resourcesLink  = page
      .getByRole('link', {
        name:'Recursos',
        exact:true
      })

    this.familyLink = page 
      .getByRole('link', {
        name:'Família',
        exact:true
      })

    this.planosLink = page 
    .getByRole('link', {
      name:'Planos',
      exact:true
    })

    this.entrarButton = page 
    .getByRole('button', {
      name:'Entrar',
      exact:true
    })
    
    this.comecarGratisButton = page 
    .getByRole('button', {
      name:'Começar Grátis',
      exact:true
    })

    this.criarContaGratisButton = page 
      .locator('div')
      .filter({
        has:page.getByRole('heading', {
          name: 'Domine suas Finanças.'
        })
      })
    .getByRole('button', {
      name:'Criar Conta Grátis',
      exact:true
    })
    .first()
    
  
    this.jaTenhoContaButton = page 
      .locator('div')
      .filter({
        has:page.getByRole('heading', {
          name: 'Domine suas Finanças.'
        })
      })
    .getByRole('button', {
      name:'Já tenho conta',
      exact:true
    })
    .first()

    this.experimenteGratisButton= page
    .getByRole('button', {
      name:'Experimentar Grátis',
      exact:true
    })

    this.plansSection = page.locator('#plans');

    this.criarContaGratisPlansButton  = this.plansSection
      .getByRole('button', {
        name: 'Criar Conta Grátis',
        exact: true
      });

    this.AssinarPremiumPlan  = this.plansSection
      .getByRole('button', {
        name: 'Assinar Premium',
        exact: true
      });


    this.ctaSection = page
      .locator('section')
      .filter({
        has: page.getByRole('heading', {
            name: 'Pronto para assumir o controle?',
            exact: true
        })

      })
    this.criarContaGratisCtaButton = this.ctaSection
      .getByRole('button', {
        name: 'Criar Conta Grátis',
        exact: true
      })

    this.jatenhoContaCtaButton = this.ctaSection
      .getByRole('button', {
        name: 'Já tenho conta',
        exact: true
      })
    this.appNameFooter = page
      .getByRole('contentinfo')
      .getByText('Minha Vida Financeira',{
        exact:true 
      })

    this.loginBtn = page
      .getByRole('button', {
        name: 'Login', 
        exact:true
    })

    this.cadastroBtn = page 
      .getByRole('button',{
        name:'Cadastro',
        exact: true
    } )

  }
  // Acessa a Landing Page
  async open() {
    await this.page.goto('/');
  }
}
