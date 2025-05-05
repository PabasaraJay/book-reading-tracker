describe('Quote Collection UI', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
      cy.get('input#username').type('admin');
      cy.get('input#password').type('1234');
      cy.get('form').submit();
      cy.url().should('eq', 'http://localhost:3000/');
      
      // Navigate to Book Reviews page
      cy.visit('http://localhost:3000/quote-collection');
    });
  
    it('TC1: Should allow selecting a book', () => {
      cy.get('select').select(1);
      cy.get('select').should('have.value', '1');
    });
  
    it('TC2: Should add a valid quote', () => {
      const quoteText = 'This is a very meaningful quote.';
      
      // Fill in all required fields
      cy.get('select').select(1);
      cy.get('input[type="number"]').type('10');
      cy.get('textarea[placeholder="Enter your quote..."]').type(quoteText);
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Loved this part of the book.');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Verify the button is enabled and click it
      cy.contains('Add Quote').should('not.be.disabled').click();
      
      // Verify the quote appears in the list
      cy.get('.quotes-list').should('be.visible');
      cy.get('.quote-item').should('contain', quoteText);
    });
  
    it('TC3: Should show errors if required fields are missing', () => {
      // Try to add quote without filling any fields
      cy.contains('Add Quote').click({ force: true });
      
      // Wait for the form to be invalid
      cy.contains('Add Quote').should('be.disabled');
      
      // Wait for error messages to appear
      cy.wait(1000); // Give time for error messages to render
      
      // Verify error messages for each field
      cy.get('select').next('.error-message').should('be.visible')
        .and('contain', 'Please select a book');
      
      cy.get('input[type="number"]').next('.error-message').should('be.visible')
        .and('contain', 'Please enter a valid page number');
      
      cy.get('textarea[placeholder="Enter your quote..."]').next('.error-message').should('be.visible')
        .and('contain', 'Quote cannot be empty');
    });
  
    it('TC4: Should not allow overly long quote text', () => {
      // Fill in all required fields
      cy.get('select').select(1);
      cy.get('input[type="number"]').type('10');
      
      // Type a long quote and trigger validation
      const longQuote = 'A'.repeat(501);
      cy.get('textarea[placeholder="Enter your quote..."]')
        .type(longQuote)
        .blur(); // Trigger validation by removing focus
      
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Wait for error message to appear
      cy.wait(1000);
      
      // Verify the error message appears
      cy.get('textarea[placeholder="Enter your quote..."]').next('.error-message').should('be.visible')
        .and('contain', 'Quote cannot exceed 500 characters');
      
      // Verify the Add Quote button is disabled
      cy.contains('Add Quote').should('be.disabled');
    });
  
    it('TC5: Should detect duplicate quotes', () => {
      const quoteText = 'Duplicate quote test.';
      
      // Add first quote
      cy.get('select').select(1);
      cy.get('input[type="number"]').type('10');
      cy.get('textarea[placeholder="Enter your quote..."]').type(quoteText);
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Verify the button is enabled and click it
      cy.contains('Add Quote').should('not.be.disabled').click();
      
      // Wait for the quote to appear in the list
      cy.get('.quotes-list').should('be.visible');
      cy.get('.quote-item').should('contain', quoteText);
  
      // Try adding the same quote again
      cy.get('select').select(1);
      cy.get('input[type="number"]').clear().type('10');
      cy.get('textarea[placeholder="Enter your quote..."]').clear().type(quoteText);
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Try to add the duplicate quote
      cy.contains('Add Quote').click({ force: true });
      
      // Wait for error message to appear
      cy.wait(1000);
      
      cy.get('textarea[placeholder="Enter your quote..."]').next('.error-message').should('contain', 'This quote already exists');
    });
  
    it('TC6: Should allow editing a quote', () => {
      const originalQuote = 'Original Quote Text';
      const editedQuote = 'Edited Quote Text';
      
      // Add the original quote
      cy.get('select').select(1);
      cy.get('input[type="number"]').type('25');
      cy.get('textarea[placeholder="Enter your quote..."]').type(originalQuote);
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Verify the button is enabled and click it
      cy.contains('Add Quote').should('not.be.disabled').click();
      
      // Wait for the quote to appear in the list
      cy.get('.quotes-list').should('be.visible');
      cy.get('.quote-item').should('contain', originalQuote);
      
      // Edit the quote
      cy.contains(originalQuote).parent().find('.edit').click();
      cy.get('textarea[placeholder="Enter your quote..."]').clear().type(editedQuote);
      cy.contains('Update Quote').click();
      
      // Verify the edited quote appears in the list
      cy.get('.quotes-list').should('be.visible');
      cy.get('.quote-item').should('contain', editedQuote);
    });
  
    it('TC7: Should highlight dates with quotes in calendar', () => {
      // Add a quote with today's date
      cy.get('select').select(1);
      cy.get('input[type="number"]').type('42');
      cy.get('textarea[placeholder="Enter your quote..."]').type('Test quote for date highlighting');
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Click the date input to open the date picker
      cy.get('input[type="date"]').click();
      
      // Select today's date
      cy.get('.react-datepicker__day--today').click();
      
      // Verify the button is enabled and click it
      cy.contains('Add Quote').should('not.be.disabled').click();
      
      // Wait for the quote to be added
      cy.get('.quotes-list').should('be.visible');
      
      // Open the date picker again
      cy.get('input[type="date"]').click();
      
      // Verify today's date is highlighted
      cy.get('.react-datepicker__day--today')
        .should('have.class', 'react-datepicker__day--highlighted');
    });
  
    it('TC8: Should allow deleting a quote', () => {
      const quoteToDelete = 'Quote to be deleted';
      
      // Add the quote to be deleted
      cy.get('select').select(1);
      cy.get('input[type="number"]').type('50');
      cy.get('textarea[placeholder="Enter your quote..."]').type(quoteToDelete);
      cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
      cy.get('input[type="radio"][value="positive"]').check();
      
      // Verify the button is enabled and click it
      cy.contains('Add Quote').should('not.be.disabled').click();
      
      // Wait for the quote to appear in the list
      cy.get('.quotes-list').should('be.visible');
      cy.get('.quote-item').should('contain', quoteToDelete);
      
      // Delete the quote
      cy.contains(quoteToDelete).parent().find('.delete').click();
      cy.on('window:confirm', () => true);
      
      // Verify the quote is removed from the list
      cy.get('.quotes-list').should('not.contain', quoteToDelete);
    });
  });
  