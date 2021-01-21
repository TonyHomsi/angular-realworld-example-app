/// <reference types="cypress" />

describe('Test with backend', ()=> {
    beforeEach('login to the app', ()=> {
        // cy.server()
        // cy.route('GET','**/tags', 'fixture:tags.json') Old version

        // 1st way to do it
        // cy.intercept('GET','**/tags', {fixture:'tags.json'})

        // 2nd way
        cy.intercept({method:'Get', path:'tags'}, {fixture:'tags.json'})

        cy.loginToApplication()
    })

    it('VERIFY CORRECT REQUEST AMD RESPONSE', () =>{

        // cy.server()
        cy.intercept('POST', '**/articles').as('postArticles')


        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the Articless')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr =>{
            console.log(xhr)
            //expect(xhr.status).to.equal(200)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body of the Articless')
            expect(xhr.response.body.article.description).to.equal('This is a description')
        })

    })

    it('intercepting and modifying the request and response', () =>{

        //cy.intercept('POST', '**/articles', (req) => {
           // req.body.article.description = "This is a description 2"
        // }).as('postArticles')


        cy.intercept('POST', '**/articles', (req) => {
            req.reply( res => {
                expect(res.body.article.description).to.equal('This is a description')
                res.body.article.description = "This is a description 2"
            })
        }).as('postArticles')


        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the Articless')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr =>{
            console.log(xhr)
            //expect(xhr.status).to.equal(200)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body of the Articless')
            expect(xhr.response.body.article.description).to.equal('This is a description 2')
        })

    })

    it('should gave tags with routing object' , ()=> {
        cy.get('.tag-list')
        .should('contain', 'Cypress')
        .and('contain','automation')
        .and('contain', 'Testing')
    })

    it('verify global feed likes count', ()=> {
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercept('GET', '**/articles*', {fixture:'articles.json'})


        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then( listOfbuttons =>{
            expect(listOfbuttons[0]).to.contain('5')
            expect(listOfbuttons[1]).to.contain('7')
        })

        cy.fixture('articles').then( file => {
            const articleLink= file.articles[1].slug
            cy.intercept('POST','**/articles/'+articleLink+'/favorite', file)
        })

        cy.get('app-article-list button')
        .eq(1)
        .click()
        .should('contain','8')
        
    })

})