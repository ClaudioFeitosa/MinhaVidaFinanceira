
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
    readonly DashboardHeader: Locator;
    readonly VisãoGeralHeader: Locator;
    readonly PerformanceDeHeader: Locator;
    readonly mesSelect: Locator;
    readonly anoSelect: Locator;
    //bloco proncipal do patrimonio consolidado
    readonly PatrimonioConsolidadoBloco: Locator;

    // elementos do bloco patrimonio consolidado
    readonly patrimonioConsolidadoTitulo: Locator;
    readonly patrimonioConsolidado: Locator;
    readonly balancoMensal: Locator;
    readonly statusBalanco: Locator;
    readonly superavitBalanco: Locator;
    readonly entradasTotais: Locator;
    readonly saidasTotais: Locator;
    readonly taxaPoupanca: Locator;
    //

    // bloco Analise mensal
    readonly AnaliseMensal : Locator;
    readonly mesesComparacao: Locator;
    readonly mesAtualComparacao: Locator;
    readonly MesAnteriorComparacao: Locator; 

    // Cartões de credito
    readonly cartoesdeCredito: Locator;
    //Score Financeiro
    readonly scoreFinanceiro: Locator;
    readonly scoreFinanceiroBloco: Locator;
    readonly taxaDePouplancaScore: Locator;
    readonly limitesDeGastosScore: Locator;
    readonly metasScore: Locator;
    readonly diversificacaoScore: Locator;

    readonly VerdicasBtn: Locator;
    readonly dicaspersonalizadas: Locator;
    readonly verDicasOn: Locator;
    readonly verDicasOff: Locator

    readonly parcelasEmAberto: Locator;

    readonly lembretesDeContas: Locator;

    readonly projecaoDeSaldo: Locator;
    readonly projecaoHoje: Locator;
    readonly projecaoVariacao: Locator;

    readonly dias30Btn: Locator;
    readonly dias60Btn: Locator;
    readonly dias90Btn:Locator;
    readonly textoProjecao: Locator;
   readonly datasEixoX: Locator;
    
    
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

        this.CentroDeNotificações = page.getByText('Centro de Notificações');
// este bloco deve ir para a pagina Alertas 
// este bloco deve ir para a pagina perfil 
        this.MeuPerfilHeader = page.locator('[title="Meu perfil"]');

        this.CentralDoUsuário = page.getByText('Central do Usuário');
// este bloco deve ir para a pagina perfil
        this.DashboardHeader =page.getByRole('paragraph').filter({ hasText: 'Dashboard' })   

        this.VisãoGeralHeader = page.getByText('Visão Geral');

        this.PerformanceDeHeader = page.getByText(/^Performance de /);

        this.mesSelect = page.locator('select.period-select').nth(0);
        this.anoSelect = page.locator('select.period-select').nth(1);

        this.PatrimonioConsolidadoBloco = page.locator(
          'xpath=//div[contains(@class, "card-cq")][.//div[normalize-space(.)="Patrimônio Consolidado"]]'
        );

        // bloco de elementos do Patrimônio Consolidado
        //this.PatrimonioConsolidadoBloco = page.getByText('Patrimônio Consolidado');
        this.patrimonioConsolidadoTitulo = this.PatrimonioConsolidadoBloco.getByText('Patrimônio Consolidado')
        this.patrimonioConsolidado = this.PatrimonioConsolidadoBloco.locator('h1')
        this.balancoMensal = this.PatrimonioConsolidadoBloco.getByText('Balanço Mensal')
        this.statusBalanco = this.PatrimonioConsolidadoBloco.getByText('Status')
        this.superavitBalanco = this.PatrimonioConsolidadoBloco.getByText('SUPERÁVIT')
        this.entradasTotais = this.PatrimonioConsolidadoBloco.getByText('Entradas Totais')
        this.saidasTotais = this.PatrimonioConsolidadoBloco.getByText('Saídas Totais')
        this.taxaPoupanca = this.PatrimonioConsolidadoBloco.getByText('Taxa de Poupança')

        this.AnaliseMensal = page.getByText('Análise Mensal')

        this.mesesComparacao = page.locator('//div[contains(@class, "flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest")]')

        this.MesAnteriorComparacao = this.mesesComparacao.locator('span').nth(0);
        this.mesAtualComparacao = this.mesesComparacao.locator('span').nth(1);

        this.cartoesdeCredito = page.getByText('Cartões de Crédito')

        this.scoreFinanceiro = page.getByText('Score Financeiro')

        this.scoreFinanceiroBloco = page.locator('//div[contains(@class, "flex-1 w-full space-y-3")]')

        this.taxaDePouplancaScore = this.scoreFinanceiroBloco.getByText('Taxa de Poupança')

        this.limitesDeGastosScore = this.scoreFinanceiroBloco.getByText('Limites de Gastos')

        this.metasScore = this.scoreFinanceiroBloco.getByText('Metas')

        this.diversificacaoScore = this.scoreFinanceiroBloco.getByText('Diversificação')
        
        this.VerdicasBtn = page.locator(
          'button[title="Ver dicas"], button[title="Ocultar dicas"]')

        this.verDicasOn = page.locator(
          'button[title="Ver dicas"]'
        )

        this.verDicasOff = page.locator(
          'button[title="Ocultar dicas"]'
        )

        this.dicaspersonalizadas = page.getByText('Dicas personalizadas')

        this.parcelasEmAberto = page.getByText('Parcelas em Aberto')

        this.lembretesDeContas = page.getByText('Lembretes de Contas')

        this.projecaoDeSaldo = page.getByText('Projeção de Saldo')

        this.projecaoHoje = page.getByText('Hoje')

        this.projecaoVariacao = page.getByText('Variação')

        this.dias30Btn = page
          .getByRole('button',{
            name: '30d',
            exact: true
          })
        this.dias60Btn = page
          .getByRole('button',{
            name: '60d',
            exact: true
          })

        this.dias90Btn = page
          .getByRole('button',{
            name: '90d',
            exact: true
          })
        this.textoProjecao = page.locator('//p[contains(@class,"text-slate-400") and contains(text(),"Em ")]');

        this. datasEixoX = page.locator(
          '.recharts-xAxis .recharts-cartesian-axis-tick-value');

      } 

      
    obterMesEAnoAtual(): string{
      const dataAtual = new Date();
      
      const mesAtual = dataAtual.toLocaleDateString(
        'pt-BR',
        {month: 'long'}
      );

      const mesFormatado = 
        mesAtual.charAt(0).toLocaleUpperCase() + mesAtual.slice(1);

      const anoAtual = dataAtual.getFullYear();

      return `${mesFormatado} ${anoAtual}`;     
  }
    async selecionarMes(mes: string): Promise<void> {
      await this.mesSelect.selectOption(mes);
  
  }

    obtermesAnteriorEMesAtual(): {mesAnterior: string; mesAtual: string} {
      const dataAtual = new Date();
    
      const mesAtual = dataAtual.toLocaleDateString(
        'pt-BR',
        { month: 'short' }
      
      );
      const dataAnterior = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() - 1,
      );

      const mesAnterior = dataAnterior.toLocaleDateString(
        'pt-BR',
        {month: 'short'}
      );

      const abreviaMes = (mes: string) : string =>{
        return mes.replace('.', '').toLocaleUpperCase('pt-BR')
        .charAt(0) + mes.replace('.', '').slice(1);
      };

      return {
        mesAnterior: abreviaMes(mesAnterior),
        mesAtual: abreviaMes(mesAtual)
      }
    }
  async ativarDicas(): Promise<void> {
    const verDicas = this.page.locator('button[title="Ver dicas"]');
    await verDicas.click();
  }

  async desativarDicas(): Promise<void> {
    const desativarDicas = this.page.locator('button[title="Ocultar dicas"]');
    await desativarDicas.click();
  }

  async selecionarPeriodo(periodo:string) {
    await this.page.getByRole('button', {name:periodo}).click()
  }


}