
import { Page, Locator } from '@playwright/test';

export class inicio  {
    readonly page:Page;

  // Elementos da login Page
    readonly loginBTN : Locator;
    readonly Início : Locator

    


      constructor(page : Page) {
        this.page = page
        
        this.Início = page
            .getByText('Início', {
                exact:true
        })
       
      // Acessa a Landing Page
  }
}