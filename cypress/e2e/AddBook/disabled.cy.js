describe('Add Book Button Disabled Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navigate to Add Book page
    cy.visit('http://localhost:3000/add-book');
  });

  it('button is disabled when form is empty', () => {
    cy.get('button').contains(/Add Book/i).should('be.disabled');
  });

  it('button is disabled when title is missing', () => {
    cy.get('input[name="author"]').type('Test Author');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('input[name="pages"]').type('250');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--015').first().click();
    
    cy.get('button').contains(/Add Book/i).should('be.disabled');
  });

  it('button is disabled when author is missing', () => {
    cy.get('input[name="title"]').type('Test Title');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('input[name="pages"]').type('250');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--015').first().click();
    
    cy.get('button').contains(/Add Book/i).should('be.disabled');
  });

  it('button is disabled when pages is missing', () => {
    cy.get('input[name="title"]').type('Test Title');
    cy.get('input[name="author"]').type('Test Author');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--015').first().click();
    
    cy.get('button').contains(/Add Book/i).should('be.disabled');
  });

  it('button is enabled when all required fields are filled', () => {
    cy.get('input[name="title"]').type('Test Title');
    cy.get('input[name="author"]').type('Test Author');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('input[name="pages"]').type('250');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--015').first().click();
    
    cy.get('button').contains(/Add Book/i).should('not.be.disabled');
  });
}); 