describe('Add Book Duplicate Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navigate to Book Reviews page
    cy.visit('http://localhost:3000/add-book');
  });

  it('prevents duplicate book entries', () => {
    // Add first book
    cy.get('input[name="title"]').clear().type('Duplicate Book');
    cy.get('input[name="author"]').clear().type('Same Author');
    cy.get('select[name="genre"]').select('History');
    cy.get('input[value="English"]').check();
    cy.get('select[name="edition"]').select('1st Edition');
    cy.get('input[name="pages"]').type('100');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--005').first().click();
    cy.get('button').contains(/Add Book/i).click();

    // Try to add again
    cy.get('input[name="title"]').clear().type('Duplicate Book');
    cy.get('input[name="author"]').clear().type('Same Author');
    cy.get('select[name="genre"]').select('History');
    cy.get('input[value="English"]').check();
    cy.get('select[name="edition"]').select('1st Edition');
    cy.get('input[name="pages"]').type('100');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--005').first().click();
    cy.get('button').contains(/Add Book/i).click();

    cy.contains('A book with the same title and author already exists.');
  });
}); 