describe('get forecast', () => {
  it('makes request and loads result', () => {
    cy.visit('http://localhost:1234');

    const input = cy.get('input[name=zip]').as('input');
    const submit = cy.get('input[type=submit]').as('submit');

    input.type('60660');
    submit.click();

    cy.contains('Fetching...');

    cy.contains(/forecast for zip code 60660/i);
    cy.contains(/skies are API RESPONSE/i);

    cy.get('@input').clear();
    cy.get('@input').should('have.value', '');

    cy.get('@input').type('foo');
    cy.get('@submit').click();

    // cy.contains(/invalid zip/i);
  });
});
