const pagePrefix = '/shamir-secret-sharing';

describe('integer arithmetic page', () => {
    it('renders links correctly', () => {
        cy.visit('/');
        cy.get('button').contains('finite field arithmetic').click();
        cy.location('pathname').should('eq', `${pagePrefix}/finite-field`);

        cy.visit('/');
        cy.get('button')
            .contains('finite field - share / reconstruct tool')
            .click();
        cy.location('pathname').should(
            'eq',
            `${pagePrefix}/finite-field-string`,
        );
    });
});

describe('finite field arithmetic page', () => {
    it('renders links correctly', () => {
        cy.visit('/finite-field');
        cy.get('button').contains('integer arithmetic').click();
        cy.location('pathname').should('eq', pagePrefix);

        cy.visit('/finite-field');
        cy.get('button')
            .contains('finite field - share / reconstruct tool')
            .click();
        cy.location('pathname').should(
            'eq',
            `${pagePrefix}/finite-field-string`,
        );
    });
});

describe('finite field - share / reconstruct tool page', () => {
    it('renders links correctly', () => {
        cy.visit('/finite-field-string');
        cy.get('button').contains('integer arithmetic').click();
        cy.location('pathname').should('eq', pagePrefix);

        cy.visit('/finite-field-string');
        cy.get('button').contains('finite field arithmetic').click();
        cy.location('pathname').should('eq', `${pagePrefix}/finite-field`);
    });

    it('reconstructs the secret', () => {
        cy.visit('/finite-field-string');
        const secret = `
        abc
        def
        🗝️🔐⚔️
        jasjhbadfbdh asdasd asd`;
        cy.get('[data-test-name="secret"]').clear().type(secret);

        cy.get('button').contains('Load shares from previous step').click();
        cy.get('button').contains('Reconstruct').click();
        cy.get('[data-test-name="reconstructed-secret"]').should(
            'contain',
            secret,
        );
    });
});
