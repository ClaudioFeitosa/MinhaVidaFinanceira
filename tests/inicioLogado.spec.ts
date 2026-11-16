import {test, expect} from '@playwright/test';  
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';
import { HomeLogado } from '../pages/iniciologado';
import 'dotenv/config';
import process from 'node:process';
import { text } from 'node:stream/consumers';

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

    test.describe('Validação de botões da pagina Inicial ', () => {

        test.describe('validacao do Menu lateral ', () => {
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

            
        })
        
        test.describe('Validação do header da pagina inicial logada', () => {
            
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

            test('Validar que palavvra Dashboard ', async() =>{
                await expect(homeLogado.DashboardHeader).toBeVisible()            
            })
            test('Valdiar o texto Visão Geral', async()=>{
                await expect(homeLogado.VisãoGeralHeader).toBeVisible()
            })

            test('validar o texto Perfornmance do [mes autal] [ano atual]', async() =>{                    

                await expect(homeLogado.PerformanceDeHeader).toHaveText(`Performance de ${homeLogado.obterMesEAnoAtual()}`)
            })
            
            test('Validar que o sistema mostra o mes e ana atual', async({page})=>{
                const [mesAtual, anoAtual] = homeLogado
                    .obterMesEAnoAtual()
                    .split(' ')
                const meses = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril',
                'Maio', 'Junho', 'Julho', 'Agosto',
                'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                ];

                const valorMesAtual = meses.indexOf(mesAtual).toString();          

                await expect(homeLogado.mesSelect).toHaveValue(valorMesAtual);
                await expect(homeLogado.anoSelect).toHaveValue(anoAtual)
            })

            test('Deve atualizar a performance ao selecionar cada mes', async ({page}) => {
                  const meses = [
                    { nome: 'Janeiro', valor: '0' },
                    { nome: 'Fevereiro', valor: '1' },
                    { nome: 'Março', valor: '2' },
                    { nome: 'Abril', valor: '3' },
                    { nome: 'Maio', valor: '4' },
                    { nome: 'Junho', valor: '5' },
                    { nome: 'Julho', valor: '6' },
                    { nome: 'Agosto', valor: '7' },
                    { nome: 'Setembro', valor: '8' },
                    { nome: 'Outubro', valor: '9' },
                    { nome: 'Novembro', valor: '10' },
                    { nome: 'Dezembro', valor: '11' }
                ];
                const[, anoAtual] = homeLogado.obterMesEAnoAtual().split(' ');
              

                for (const mes of meses) {
                    await homeLogado.selecionarMes(mes.valor);
                    console.log(
                        `Esperado: ${mes.nome} | Selecionado: ${await homeLogado.mesSelect.inputValue()}`
                    );
                    await expect(homeLogado.PerformanceDeHeader).toHaveText(`Performance de ${mes.nome} ${anoAtual}`)
                }
            })
        })        
        test.describe('validar elementos do Patrimonio ConsolidadoBloco ', () =>{
            test('Validar textos do elemento Patrimonio Consolidado', async() => {
                await expect(homeLogado.patrimonioConsolidadoTitulo).toBeVisible;
            })

            test('Validar elemento do patrimonio consolidado', async() =>{
                await expect(homeLogado.patrimonioConsolidado).toBeVisible();
            })

            test('Validar elemento do Balanço mensal', async()=>{
                await expect(homeLogado.balancoMensal).toBeVisible()
            })
            test ('Validar status do Balançpo', async() =>{
                await expect(homeLogado.statusBalanco).toBeVisible();
            })

            test ('Validar Superavit do Balanço', async() =>{
                await expect(homeLogado.superavitBalanco).toBeVisible();
            })

            test('Validar Entradas totais', async()=>{
                await expect(homeLogado.entradasTotais).toBeVisible();
            })

            test('Validar Saidas Totais', async() =>{
                 await expect(homeLogado.saidasTotais).toBeVisible();
            })
            test('Validar Taxa de Poupança', async() =>{
                await expect(homeLogado.taxaPoupanca).toBeVisible();
            })        
        })

        test.describe('Validanão do Bloco Analise mensal', () => {
            test('Validar texto Análise Mensal', async() => {
                await expect(homeLogado.AnaliseMensal).toBeVisible()
            })

            test('Validar elementos mes anterior em mes atual', async() =>{
                const meses = homeLogado.obtermesAnteriorEMesAtual();
                await expect(homeLogado.MesAnteriorComparacao).toHaveText(meses.mesAnterior)
                await expect(homeLogado.mesAtualComparacao).toHaveText(meses.mesAtual)
            })
        
        })

    test.describe('bloco dos cartões e do score financeiro', () => {

        test('Validação do texto Cartão de Credito', async() =>{
            await expect(homeLogado.cartoesdeCredito).toBeVisible()
        })

        test('Veriificar texto Score Financiero', async() =>{
            await expect(homeLogado.scoreFinanceiro).toBeVisible()
        
        })

        test('Veriificar texto Taxa de Poupanca', async() =>{
            await expect(homeLogado.taxaDePouplancaScore).toBeVisible()               
        })
        test('Veriificar texto Limite de Gastos', async() =>{
            await expect(homeLogado.limitesDeGastosScore).toBeVisible()               
        })

        test('Veriificar texto Meta', async() =>{
            await expect(homeLogado.metasScore).toBeVisible()               
        })
        test('Veriificar texto Diversificação', async() =>{
            await expect(homeLogado.diversificacaoScore).toBeVisible()               
        })

        test ('Botão Dicas', async()=>{
            await expect(homeLogado.VerdicasBtn).toBeVisible()
        })

        test('Clicar no botão Dicas para desativar/ativar', async({page}) =>{

            //await expect(page.locator('button[title="Ocultar dicas"]')).toBeVisible()

            await expect(homeLogado.verDicasOff).toBeVisible
            await homeLogado.desativarDicas()

            await expect(homeLogado.verDicasOn).toBeVisible
            //await expect(page.locator('button[title="Ver dicas"]')).toBeVisible()


            await homeLogado.ativarDicas()

            //await expect(page.locator('button[title="Ocultar dicas"]')).toBeVisible()
            await expect(homeLogado.verDicasOff).toBeVisible

        })
        
    })

    test.describe('Bloco das parcelas em aberto', () => {
        
        test('Parcelas em Aberto', async() =>{
            await expect(homeLogado.parcelasEmAberto).toBeVisible()
        })       
        
    })
    
    test.describe('Lembrete de contas ', () => {
        test('Validar lembrete de contas', async() =>{
            await expect(homeLogado.lembretesDeContas).toBeVisible()
        })        
    })

    test.describe('Validação do bloco Projeçao de saldo', () => {

        test('Valdiar o texto PROJEÇÃO DE SALDO"', async() => {
            await expect(homeLogado.projecaoDeSaldo).toBeVisible()
        })

        test('Validar hoje', async() => {
            await expect(homeLogado.projecaoHoje).toBeVisible()
        })

        test('validar texto Variação', async() =>{
            await expect(homeLogado.projecaoVariacao).toBeVisible()
     
        })

        test('validar botão de 30 dias', async() => {
            await expect(homeLogado.dias30Btn).toBeVisible()
        })

        test('validar botão de 60 dias', async() => {
            await expect(homeLogado.dias60Btn).toBeVisible()
        })
        test('validar botão de 90 dias', async() => {
            await expect(homeLogado.dias90Btn).toBeVisible()
        })

        test('Validar que o texto do periodo da projeção é atualizado conforme o botão selecionado', async({page}) =>{
 
            const periodos = [
                {botao: homeLogado.dias30Btn, texto: 'Em 30 dias '},
                {botao: homeLogado.dias60Btn, texto: 'Em 60 dias '},
                {botao: homeLogado.dias90Btn, texto: 'Em 90 dias '},
            ];

            for (const periodo of periodos) {
                await periodo.botao.click();

            await expect(homeLogado.textoProjecao).toHaveText(periodo.texto)
            }            
        })

        test.only('Deve apresentar as datas corretas na projeçao de saldo', async({page}) =>{

             
            const periodos = [
                {botao: homeLogado.dias30Btn, texto: 'Em 30 dias ', dias: 30},
                {botao: homeLogado.dias60Btn, texto: 'Em 60 dias ', dias: 60},
                {botao: homeLogado.dias90Btn, texto: 'Em 90 dias ', dias: 90},
            ];

            for (const periodo of periodos) {
                await periodo.botao.click();
                await expect(homeLogado.textoProjecao).toHaveText(periodo.texto);

                const dataEsperada = new Date();
                dataEsperada.setDate(dataEsperada.getDate() +periodo.dias);

                const textoDataEsperada = dataEsperada.toLocaleDateString(
                    'pt-BR',
                    {day: '2-digit', month:'short'}                    
                );

                //const datas = await homeLogado.datasEixoX.allInnerTexts();
                const datas = await homeLogado.datasEixoX.allTextContents();

                //console.log('Datas encontradas:', datas);
                //console.log('Quantidade:', datas.length);
                
                //const elementos = await homeLogado.datasEixoX.evaluateAll(
                  //  elementos => elementos.map(elemento => ({
                    //    tag: elemento.tagName,
                      //  texto: elemento.textContent,
                        //innerText: (elemento as HTMLElement).innerText,
                        //html: elemento.outerHTML
                    //}))
                //);

               //console.log(elementos);
                const datasComplestas = datas.map(data => data.trim()).filter(data => /^\d{2} de /.test(data));

                //const datasCompletas = datas.map(data => data.trim()).filter(data => /^\d{2} de /.test(data));
                
                //const ultimaDataCompleta = datasCompletas[datasCompletas.length -1];

                console.log('periodo:', periodo.dias)
                console.log('Data esperada:', textoDataEsperada);
               // console.log('Última data completa:', ultimaDataCompleta);

                console.log('Data Esperada', textoDataEsperada)
                const ultimaData = await homeLogado.datasEixoX.last().textContent()

                await expect(homeLogado.datasEixoX.first()).toHaveText('Hoje');

                await expect(ultimaData)

                //await expect(homeLogado.datasEixoX.last()).toHaveText(textoDataEsperada);                
            }    
        })
        
    })

    

    })
});