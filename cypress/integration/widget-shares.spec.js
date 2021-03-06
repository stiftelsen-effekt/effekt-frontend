/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')

        sessionStorage.clear()
    })

    it('Goes through the mutual functionality between all donation methods', () => {
        cy.get('#donation-btn').click()
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('[data-cy=method-bank]').click()
        cy.onPaneOffset(1)

        let randomName = Math.random().toString(36).substring(7)
        let randomMail = randomName + '@testeffekt.com'
        let ssn = "123456789"
        cy.get('[data-cy=name]').type(randomName)
        cy.get('[data-cy=name]').should('have.value', randomName)
        cy.get('[data-cy=email]').type(randomMail)
        cy.get('[data-cy=email]').should('have.value', randomMail)
        cy.get('[data-cy=check-tax-deduction]').not('[disabled]').check().should('be.checked')
        cy.get('[data-cy=check-privacy-policy]').click()
        cy.get('[data-cy=ssn]').type(ssn)
        cy.nextPane('basic')
        cy.onPaneOffset(2)
        
        cy.get('[data-cy=check-select-split]').click()
        cy.nextPane('amount')
        cy.onPaneOffset(3)

        cy.server()
        let organizationsSplit = []
        cy.request('GET', 'https://data.gieffektivt.no/organizations/active').then((response) => {
            let orgs = response.body.content

            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            //Fills in all shares to equal 100
            for (let i = 0; i < orgs.length; i++) { 
                if (i != orgs.length - 1) {
                    let split = parseInt(orgs.length)

                    organizationsSplit.push({id: orgs[i].id, split: split.toString()})
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(split)
                }
                else {
                    let remainder = parseInt(100 - (orgs.length-1) * orgs.length)

                    organizationsSplit.push({id: orgs[i].id, split: remainder.toString()})
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(remainder)
                }
            }
        })
        
        cy.route('POST', '/donations/register*').as('register')
        cy.route('POST', '/donations/bank/pending*').as('pending')
        cy.nextPane('shares')
        cy.onPaneOffset(4)

        //Referrals are simply hidden when submitting, so offset should remain 4
        cy.getInPane('referral', '#referral-list li').first().click()
        cy.onPaneOffset(4)

        const assertRegisterObject = {
            donor: {
                name: randomName,
                email: randomMail,
                ssn: ssn,
                newsletter: false
            },
            amount: null,
            method: 2,
            organizations: organizationsSplit
        }

        cy.wait(['@register', '@pending']).then((xhrs) => {
            const registerRequest = xhrs[0]
            const pendingRequest = xhrs[1]

            expect(registerRequest.request.body).to.deep.equal(assertRegisterObject)

            expect(registerRequest.responseBody.status).to.equal(200)
            expect(pendingRequest.responseBody.status).to.equal(200)
        })
    })
})
