describe('forecast page', () => {
  it('should fetch forecast by zip', () => {
    cy.visit('http://localhost:1234');

    const input = cy.get('input[name=zip]');
    const submit = cy.get('input[type=submit');

    input.type('44118');
    submit.click();

    cy.contains(/fetching/i);

    cy.contains(/forecast for zip code 44118/i);
    cy.contains(/skies are api response/i);
  });
});
