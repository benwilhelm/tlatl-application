describe('get forecast', () => {
  it('makes request and loads result', () => {
    cy.visit('http://localhost:1234');

    const input = cy.get('input[name=zip]');
    const submit = cy.get('input[type=submit]');

    input.type('60660');
    submit.click();

    cy.contains('Fetching...');

    cy.contains('skies: DB RESPONSE - current');
  });
});
