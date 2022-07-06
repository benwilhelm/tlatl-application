describe('forecast page', () => {
  it('should fetch forecast by zip', () => {
    cy.visit('http://localhost:1234');

    const input = cy.get('input[name=zip]');
    const submit = cy.get('input[type=submit');

    input.type('44118');
    submit.click();

    cy.contains(/forecast for zip code 44118/i);
    cy.contains(/skies are api response/i);
  });

  it('allows user to recover from error states', () => {
    cy.visit('http://localhost:1234');

    cy.get('input[name=zip]').as('input');
    cy.get('input[type=submit').as('submit');

    cy.get('@input').type('foo');
    cy.get('@submit').click();

    cy.contains(/invalid zip/i);

    cy.get('@input').clear();
    cy.get('@input').type('00500');
    cy.get('@submit').click();

    cy.contains(/invalid zip/i).should('not.exist');
    cy.contains(/something went wrong/i);

    cy.get('@input').clear();
    cy.get('@input').type('60660');
    cy.get('@submit').click();

    cy.contains(/invalid zip/i).should('not.exist');
    cy.contains(/something went wrong/i).should('not.exist');

    cy.contains(/forecast for zip code 60660/i);
    cy.contains(/skies are api response/i);
  });
});
