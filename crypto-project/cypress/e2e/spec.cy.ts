import {URL} from '../../src/const/const';
import { BitcoinInfo, CardanoInfo, CardanoInfoNew, firstPageCoins } from '../fixtures/mock';

let indexOfFirstIndex = 0;
const perPage = 10;
let coinId = '';
const countBitcoin = 2;
const countCordano = 1.1;
const newPricePortfolio = (
  Number(firstPageCoins.data[6].priceUsd) * countCordano
);
const oldPricePortfolio = (Number(CardanoInfo.data.priceUsd) * countCordano);


const getFullData = () => {
  cy.intercept('GET', `${URL}/assets?limit=3`).as('getTop');
  cy.intercept('GET', `${URL}/assets`).as('getAllCoins');
  cy.intercept('GET', `${URL}/assets?offset=${indexOfFirstIndex}&limit=${perPage}`).as('getCoinsOnPage');
};

const getCoinData = (coinId) => {
  cy.intercept('GET', `${URL}/assets/${coinId}`).as('getCoin');
}

beforeEach(() => {
  getFullData();
  cy.visit('/');
})

describe('header test', () => {
  it('should have list top 3', () => {
    cy.wait(['@getTop']);

    cy.get('[data-cy="list"]').should('be.exist');
    cy.get('[data-cy="list"]').children().should('have.length', 3);
    cy.get('[data-cy="list-item"]').contains('$');
    cy.get('[data-cy="list-item"]').each((item) => {
      expect(item).to.have.css('color', 'rgb(102, 255, 51)');
  });

  it('should have portfolio price', () => {
    cy.get('[data-cy="header-portfolio"]').should('be.exist');
    cy.get('[data-cy="header-portfolio"]').contains('0 USD');
  });
  })
})

describe('table coins test', () => {
  it('should have table with coins', () => {
    cy.location('hash').should('eq', '#/1')
    cy.wait(['@getAllCoins', '@getCoinsOnPage']);

    cy.get('[data-cy="coins-table"]').should('be.exist');
    cy.get('[data-cy="coins-table__body"]').should('be.exist').children().should('have.length', 11);
    cy.get('[data-cy="coins-table__caption"]').should('be.exist').children().should('have.length', 4);
  });

  it('should have pagination', () => {
    cy.get('[data-cy="pagination"]').should('be.exist');
    cy.get('[data-cy="pagination"]').children().should('have.length', 8);
    cy.get('[data-cy_active="pagination__item_active"]').should("have.length", 1).contains("1");
    cy.get('[data-cy_active="pagination__item_active"]').should("have.css", "opacity", '1');
    cy.get('[data-cy="pagination__dots"]').should("have.length", 1);
    cy.get('[data-cy="prev"]').should('be.exist').children().eq(0).should('be.disabled').should("have.css", "opacity", '0.4');
    cy.get('[data-cy="next"]').should('be.exist').children().eq(0).should('be.enabled').should("have.css", "opacity", '1');
  })

  it('should click pagination', () => {
    indexOfFirstIndex += 10;
    cy.get('[data-cy="pagination__item"]').eq(1).should('be.exist').click();
    cy.location('hash').should('eq', '#/2');
    cy.wait(['@getCoinsOnPage']);

    cy.get('[data-cy="prev"]').children().eq(0).should('be.exist').should('be.enabled').should("have.css", "opacity", '1');
    cy.get('[data-cy_active="pagination__item_active"]').should("have.length", 1).contains("2");

    cy.get('[data-cy="next"]').children().eq(0).should('be.enabled').click();
    cy.get('[data-cy_active="pagination__item_active"]').should("have.length", 1).contains("3");

    for(let i = 0; i < 5; i++){
      cy.get('[data-cy="next"]').children().eq(0).should('be.enabled').click();
    }
    cy.get('[data-cy_active="pagination__item_active"]').should("have.length", 1).contains("8");
    
    cy.get('[data-cy="pagination__item"]').eq(4).should('be.exist').click();
    cy.get('[data-cy="next"]').children().eq(0).should('be.disabled');
    cy.get('[data-cy="pagination__dots"]').should('be.exist');
  })
})

describe('coin page test', () => {
  it('should have information about coin', () => {
    cy.intercept('GET', `${URL}/assets/bitcoin`, BitcoinInfo).as('getBitcoin');
    coinId = 'bitcoin';
    getCoinData(coinId);
    indexOfFirstIndex = 0;
    cy.wait(['@getTop', '@getAllCoins']);
    cy.get('[data-cy="coins-table__row"]').eq(0).should('be.exist').children().eq(0).click();


    cy.get('[data-cy="coin-name"]').should('be.exist').contains(`${coinId}`, { matchCase: false });
    cy.get('[data-cy="information"]').children().should('have.length', 5);
    cy.get('[data-cy="information__item"]').eq(0).contains(`${BitcoinInfo.data.symbol}`);
    cy.get('[data-cy="information__item"]').eq(1).contains(`${Number(BitcoinInfo.data.priceUsd).toFixed(4)}`);
    cy.get('[data-cy="information__item"]').eq(2).contains(`${Number(BitcoinInfo.data.changePercent24Hr).toFixed(2)}`)

    cy.get('[data-cy="coin-add"]').contains("add").should("be.enabled");
    cy.get('[data-cy="coin-chart"]').should('be.exist');

    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(2000);

    cy.get('[data-cy="coin-name"]').should('be.exist').contains('ethereum', { matchCase: false });
  });
});

describe('navigation test', () => {
  it('come back coin page', () => {
    cy.intercept('GET', `${URL}/assets/bitcoin`, BitcoinInfo).as('getBitcoin');
    cy.wait(['@getTop', '@getAllCoins']);
    cy.get('[data-cy="coins-table"]').should('be.exist');
    cy.get('[data-cy="next"]').children().eq(0).should('be.enabled').click();
    cy.wait(2000);
    
    cy.get('[data-cy_active="pagination__item_active"]').should("have.length", 1).contains("2");
    cy.get('[data-cy="coin-link"]').eq(0).should('be.exist').click();
    cy.wait(2000);

    cy.get('[data-cy="arrow-back"]').should('be.exist').click();
    cy.wait(2000);
    cy.location('hash').should('eq', '#/2');
    cy.get('[data-cy="coins-table"]').should('be.exist');
    cy.get('[data-cy_active="pagination__item_active"]').should("have.length", 1).contains("2");

  });
});

describe('modal window "add coin" test', () => {
  it('open/close modal', () => {
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    
    cy.get('[data-cy="add-coin_bitcoin"]').should('be.exist').click();
    cy.get('[data-cy="modal"]').should('be.exist');
    cy.screenshot("1-modalWindow-1400", {
      clip: { x: 0, y: 0, width: 1400, height: 900 },
    });
    cy.get('[data-cy="modal-close"]').should('be.exist').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('check input ', () => {
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    
    cy.get('[data-cy="add-coin_bitcoin"]').should('be.exist').click();
    cy.get('[data-cy="input-amount"]').should('be.exist').should('have.focus');
    cy.get('[data-cy="submit-amount"]').should('be.exist').should('be.disabled');

    cy.get('[data-cy="input-amount"]').type('-0.2');
    cy.get('[data-cy="submit-amount"]').should('be.disabled');
    cy.get('[data-cy="input-amount"]').clear().type('0');
    cy.get('[data-cy="submit-amount"]').should('be.disabled');
    cy.get('[data-cy="input-amount"]').clear().type('abbb');
    cy.get('[data-cy="input-amount"]').should('have.value', '');
    cy.get('[data-cy="input-amount"]').clear().type('2');
    cy.get('[data-cy="submit-amount"]').should('be.enabled').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('portfolio test', () => {
  it('add/delete coins in portfolio', () => {
    cy.intercept('GET', `${URL}/assets/bitcoin`, BitcoinInfo).as('getBitcoin');
    cy.intercept('GET', `${URL}/assets/cardano`, CardanoInfo).as('getCardano');

    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);

    cy.get('[data-cy="header-portfolio"]').should('be.exist').click();
    cy.get('[data-cy="portfolio"]').should('be.exist');
    cy.get('[data-cy="portfolio-empty"]').should('be.exist').contains('empty');
    cy.get('[data-cy="modal-close"]').should('be.exist').click();

    cy.get('[data-cy="add-coin_bitcoin"]').should('be.exist').click();
    cy.get('[data-cy="input-amount"]').type(`${countBitcoin}`);
    cy.get('[data-cy="submit-amount"]').should('be.enabled').click();
    cy.get('[data-cy="header-portfolio"]').click();
    cy.get('[data-cy="portfolio-table__body"]').should('be.exist');
    cy.get('[data-cy="coin-name"]').should('be.exist').contains('bitcoin');
    cy.get('[data-cy="coin-amount"]').should('be.exist').contains(`${countBitcoin}`);
    cy.get('[data-cy="modal-close"]').should('be.exist').click();

    cy.wait(['@getBitcoin']);
    cy.get('[data-cy="header-portfolio"]').contains(`${(Number(BitcoinInfo.data.priceUsd) * 2).toFixed(3)}`);

    cy.get('[data-cy="add-coin_cardano"]').should('be.exist').click();
    cy.get('[data-cy="input-amount"]').type(`${countCordano}`);
    cy.get('[data-cy="submit-amount"]').should('be.enabled').click();

    cy.wait(['@getCardano']);

    cy.get('[data-cy="header-portfolio"]').click();
    cy.get('[data-cy="portfolio-table__body"]').children().should("have.length", 2)
    cy.get('[data-cy="coin-name"]').should('be.exist').eq(1).contains('cardano');
    cy.get('[data-cy="coin-amount"]').should('be.exist').eq(1).contains(`${countCordano}`);
    cy.screenshot("1-addCoin-1400", {
      clip: { x: 0, y: 0, width: 1400, height: 900 },
    });
    cy.get('[data-cy="header-portfolio"]').contains(
      `${(
        Number(BitcoinInfo.data.priceUsd) * countBitcoin +
        Number(CardanoInfo.data.priceUsd) * countCordano
      ).toFixed(3)}`
    );

    cy.get('[data-cy="coin-delete"]').eq(0).children().eq(0).click();
    cy.get('[data-cy="portfolio-table__body"]').children().should("have.length", 1);
    cy.get('[data-cy="header-portfolio"]').contains(`${oldPricePortfolio.toFixed(3)}`);
    
    cy.screenshot("1-addCoin-1400", {
      clip: { x: 0, y: 0, width: 1400, height: 900 },
    });

    cy.intercept('GET', `${URL}/assets/cardano`, CardanoInfoNew).as('getCardanoNew');
    cy.intercept('GET', `${URL}/assets?offset=${indexOfFirstIndex}&limit=${perPage}`, firstPageCoins).as('getCoinsOnPage');

    cy.visit('/');
    cy.wait(['@getAllCoins', '@getCoinsOnPage', '@getCardanoNew']);
    cy.get('[data-cy="header-portfolio"]').contains(`${newPricePortfolio.toFixed(3)}`);
    cy.get('[data-cy="header-portfolio"]').contains(`${(Number(newPricePortfolio) - Number(oldPricePortfolio)).toFixed(3)}`);
  });
});

describe('screenshot mainPage test', () => {
  it('main page viewport 1440, 900', () => {
    cy.viewport(1440, 900);
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    cy.screenshot("1-mainPage-1440", {
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
  });
  it('main page viewport 768, 800', () => {
    cy.viewport(768, 800);
    getFullData();
    cy.visit('/');
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    cy.screenshot("1-mainPage-768", {
      clip: { x: 0, y: 0, width: 768, height: 800 },
    });
  });
  it('main page viewport 320, 600', () => {
    cy.viewport(320, 600);
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    cy.screenshot("1-mainPage-320", {
      clip: { x: 0, y: 0, width: 320, height: 600 },
    });
  });
});

describe('screenshot coinPage test', () => {
  it('coin page viewport 1440, 900', () => {
    getCoinData('ethereum');
    cy.viewport(1440, 900);
    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(['@getTop', '@getCoin']);
    cy.screenshot("1-coinPage-1440", {
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
  });
  it('coin page viewport 768, 800', () => {
    getCoinData('ethereum');
    cy.viewport(768, 800);
    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(['@getTop', '@getCoin']);
    cy.screenshot("1-coinPage-768", {
      clip: { x: 0, y: 0, width: 768, height: 800 },
    });
  });
  it('coin page viewport 320, 600', () => {
    getCoinData('ethereum');
    cy.viewport(320, 600);
    cy.visit("http://localhost:3000/#/1/ethereum");
    cy.wait(['@getTop', '@getCoin']);
    cy.screenshot("1-coinPage-320", {
      clip: { x: 0, y: 0, width: 320, height: 600 },
    });
  });
});