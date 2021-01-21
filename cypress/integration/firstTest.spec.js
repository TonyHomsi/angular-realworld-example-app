/// <reference types="cypress" />

describe('Test with backend', ()=> {
    beforeEach('login to the app', ()=> {
        cy.loginToApplication()
    })

    it.only('should log in', () =>{
        cy.log('Yes we logged in!')
    })

})