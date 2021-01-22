/// <reference types="cypress" />

describe('Test log out', () => {
    beforeEach('login to the app', () => {        
        cy.loginToApplication()
    })

    it('verify use can log out successfully', ()=>{
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })
})


// npx cypress open
// npx cypress run "That's will run the cypress in the terminal and create a video for the test"¨
// npx cypress run --spec "cypress/integration/secondTest.spec.js" and that will create a video 
// but in case if we don't want to record a video:_ 
// => go to cypress.json and add:
//  "video": flase

// npx cypress run --browser chrome

// To run two commands at the same time:
// 1. npm install --save-dev start-server-and-test
// 2. npm run cypress:e2e (check out the package.json)
