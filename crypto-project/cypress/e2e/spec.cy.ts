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

describe('header test', () => {
  it('should have list top 3', () => {
    getFullData();
    cy.visit('/');
    cy.wait(['@getTop']);

    cy.get('.list').should('be.exist');
    cy.get('.list').children().should('have.length', 3);
    cy.get('.list__item').contains('$');
    cy.get('.list__item').each((item) => {
      expect(item).to.have.css('color', 'rgb(102, 255, 51)');
  });

  it('should have portfolio price', () => {
    cy.get('.header__portfolio').should('be.exist');
    cy.get('.header__portfolio').contains('0 USD');
  });
  })
})

describe('table coins test', () => {
  it('should have table with coins', () => {
    getFullData();
    cy.visit('/');
    cy.location('hash').should('eq', '#/1')
    cy.wait(['@getAllCoins', '@getCoinsOnPage']);

    cy.get('.table').should('be.exist');
    cy.get('.table__body').should('be.exist').children().should('have.length', 11);
    cy.get('.table__row').eq(0).should('be.exist').children().should('have.length', 4);
  });

  it('should have pagination', () => {
    cy.visit('/');
    cy.get('.pagination').should('be.exist');
    cy.get('.pagination').children().should('have.length', 8);
    cy.get(".pagination__item_active").should("have.length", 1).contains("1");
    cy.get(".pagination__item_active").should("have.css", "opacity", '1');
    cy.get(".pagination__dots").should("have.length", 1);
    cy.get('[data-dest-id="prev"]').should('be.exist').children().eq(0).should('be.disabled').should("have.css", "opacity", '0.4');
    cy.get('[data-dest-id="next"]').should('be.exist').children().eq(0).should('be.enabled').should("have.css", "opacity", '1');
  })

  it('should click pagination', () => {
    cy.visit('/');
    indexOfFirstIndex += 10;
    getFullData();
    cy.get('.pagination__item').eq(1).should('be.exist').click();
    cy.location('hash').should('eq', '#/2');
    cy.wait(['@getCoinsOnPage']);

    cy.get('[data-dest-id="prev"]').children().eq(0).should('be.exist').should('be.enabled').should("have.css", "opacity", '1');
    cy.get(".pagination__item_active").should("have.length", 1).contains("2");

    cy.get('[data-dest-id="next"]').children().eq(0).should('be.enabled').click();
    cy.get(".pagination__item_active").should("have.length", 1).contains("3");

    for(let i = 0; i < 5; i++){
      cy.get('[data-dest-id="next"]').children().eq(0).should('be.enabled').click();
    }
    cy.get(".pagination__item_active").should("have.length", 1).contains("8");
    
    cy.get('.pagination__item').eq(4).should('be.exist').click();
    cy.get('[data-dest-id="next"]').children().eq(0).should('be.disabled');
    cy.get('.pagination__dots').should('be.exist');
  })
})

describe('coin page test', () => {
  it('should have information about coin', () => {
    getFullData();
    cy.intercept('GET', `${URL}/assets/bitcoin`, BitcoinInfo).as('getBitcoin');
    coinId = 'bitcoin';
    getCoinData(coinId);
    indexOfFirstIndex = 0;
    cy.visit('/');
    cy.wait(['@getTop', '@getAllCoins']);
    cy.get('.table__row').eq(1).should('be.exist').children().eq(0).click();


    cy.get('.main__title').should('be.exist').contains(`${coinId}`, { matchCase: false });
    cy.get('.information').children().should('have.length', 5);
    cy.get('.information__item').eq(0).contains(`${BitcoinInfo.data.symbol}`);
    cy.get('.information__item').eq(1).contains(`${Number(BitcoinInfo.data.priceUsd).toFixed(4)}`);
    cy.get('.information__item').eq(2).contains(`${Number(BitcoinInfo.data.changePercent24Hr).toFixed(2)}`)

    cy.get("button").contains("add").should("be.enabled");
    cy.get('.coin__chart').should('be.exist');

    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(2000);

    cy.get('.main__title').should('be.exist').contains('ethereum', { matchCase: false });
  });
});

describe('navigation test', () => {
  it('come back coin page', () => {
    getFullData();
    cy.intercept('GET', `${URL}/assets/bitcoin`, BitcoinInfo).as('getBitcoin');
    cy.visit('/');
    cy.wait(['@getTop', '@getAllCoins']);
    cy.get('.main__table').should('be.exist');
    cy.get('[data-dest-id="next"]').children().eq(0).should('be.enabled').click();
    cy.wait(2000);
    
    cy.get(".pagination__item_active").should("have.length", 1).contains("2");
    cy.get(".item__link").eq(0).should('be.exist').click();
    cy.wait(2000);

    cy.get(".main__link").should('be.exist').click();
    cy.wait(2000);
    cy.location('hash').should('eq', '#/2');
    cy.get('.main__table').should('be.exist');
    cy.get(".pagination__item_active").should("have.length", 1).contains("2");

  });
});

describe('modal window "add coin" test', () => {
  it('open/close modal', () => {
    getFullData();
    cy.visit('/');
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    
    cy.get('button[id=bitcoin').should('be.exist').click();
    cy.get('.modal').should('be.exist');
    cy.screenshot("1-modalWindow-1400", {
      clip: { x: 0, y: 0, width: 1400, height: 900 },
    });
    cy.get('.modal__button').should('be.exist').click();
    cy.get('.modal').should('not.exist');
  });

  it('check input ', () => {
    getFullData();
    cy.visit('/');
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);
    
    cy.get('button[id=bitcoin').should('be.exist').click();
    cy.get('input').should('be.exist').should('have.focus');
    cy.get('button[type=submit]').should('be.exist').should('be.disabled');

    cy.get('input').type('-0.2');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('input').clear().type('0');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('input').clear().type('abbb');
    cy.get('input').should('have.value', '');
    cy.get('input').clear().type('2');
    cy.get('button[type=submit]').should('be.enabled').click();
    cy.get('.modal').should('not.exist');
  });
});

describe('portfolio test', () => {
  it('add/delete coins in portfolio', () => {
    getFullData();
    cy.intercept('GET', `${URL}/assets/bitcoin`, BitcoinInfo).as('getBitcoin');
    cy.intercept('GET', `${URL}/assets/cardano`, CardanoInfo).as('getCardano');

    cy.visit('/');
    cy.wait(['@getTop', '@getAllCoins', '@getCoinsOnPage']);

    cy.get('.header__portfolio').should('be.exist').click();
    cy.get('.portfolio').should('be.exist');
    cy.get('.portfolio__info').should('be.exist').contains('empty');
    cy.get('.modal__button').should('be.exist').click();

    cy.get('button[id=bitcoin]').should('be.exist').click();
    cy.get('input').type(`${countBitcoin}`);
    cy.get('button[type=submit]').should('be.enabled').click();
    cy.get('.header__portfolio').click();
    cy.get('.portfolio-table__body').should('be.exist');
    cy.get('[data-test-id="coinName"]').should('be.exist').contains('bitcoin');
    cy.get('[data-test-id="coinAmount"]').should('be.exist').contains(`${countBitcoin}`);
    cy.get('.modal__button').should('be.exist').click();

    cy.wait(['@getBitcoin']);
    cy.get('.header__portfolio').contains(`${(Number(BitcoinInfo.data.priceUsd) * 2).toFixed(3)}`);

    cy.get('button[id=cardano]').should('be.exist').click();
    cy.get('input').type(`${countCordano}`);
    cy.get('button[type=submit]').should('be.enabled').click();

    cy.wait(['@getCardano']);

    cy.get('.header__portfolio').click();
    cy.get('.portfolio-table__body').children().should("have.length", 2)
    cy.get('[data-test-id="coinName"]').should('be.exist').eq(1).contains('cardano');
    cy.get('[data-test-id="coinAmount"]').should('be.exist').eq(1).contains(`${countCordano}`);
    cy.screenshot("1-addCoin-1400", {
      clip: { x: 0, y: 0, width: 1400, height: 900 },
    });
    cy.get(".header__portfolio").contains(
      `${(
        Number(BitcoinInfo.data.priceUsd) * countBitcoin +
        Number(CardanoInfo.data.priceUsd) * countCordano
      ).toFixed(3)}`
    );

    cy.get('[data-test-id="coinDelete"]').eq(0).children().eq(0).click();
    cy.get('.portfolio-table__body').children().should("have.length", 1);
    cy.get('.header__portfolio').contains(`${oldPricePortfolio.toFixed(3)}`);
    
    cy.screenshot("1-addCoin-1400", {
      clip: { x: 0, y: 0, width: 1400, height: 900 },
    });

    cy.intercept('GET', `${URL}/assets/cardano`, CardanoInfoNew).as('getCardanoNew');
    cy.intercept('GET', `${URL}/assets?offset=${indexOfFirstIndex}&limit=${perPage}`, firstPageCoins).as('getCoinsOnPage');

    cy.visit('/');
    cy.wait(['@getAllCoins', '@getCoinsOnPage', '@getCardanoNew']);
    cy.get('.header__portfolio').contains(`${newPricePortfolio.toFixed(3)}`);
    cy.get('.header__portfolio').contains(`${(Number(newPricePortfolio) - Number(oldPricePortfolio)).toFixed(3)}`);
  });
});

describe('screenshot mainPage test', () => {
  it('main page viewport 1440, 900', () => {
    cy.viewport(1440, 900);
    getFullData();
    cy.visit('/');
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
    getFullData();
    cy.visit('/');
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
    getFullData();
    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(['@getTop', '@getCoin']);
    cy.screenshot("1-coinPage-1440", {
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
  });
  it('coin page viewport 768, 800', () => {
    getCoinData('ethereum');
    cy.viewport(768, 800);
    getFullData();
    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(['@getTop', '@getCoin']);
    cy.screenshot("1-coinPage-768", {
      clip: { x: 0, y: 0, width: 768, height: 800 },
    });
  });
  it('coin page viewport 320, 600', () => {
    getCoinData('ethereum');
    cy.viewport(320, 600);
    getFullData();
    cy.visit('http://localhost:3000/#/1/ethereum');
    cy.wait(['@getTop', '@getCoin']);
    cy.screenshot("1-coinPage-320", {
      clip: { x: 0, y: 0, width: 320, height: 600 },
    });
  });
});