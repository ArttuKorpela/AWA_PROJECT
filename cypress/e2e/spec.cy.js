
describe('template spec', () => {
  beforeEach(() => {
    localStorage.setItem("token","")
    cy.visit('http://localhost:5000')
  })

  it('Loads the page', () => {
    cy.get('[data-testid="login-and-register"]').should("be.visible")
  })

  it('load the login', () => {
    cy.get('[data-testid="login-card"]')

  });

  it('Change to register', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="register-card"]').should("be.visible");
  });

  it('Try to login with without credentials', () => {
    cy.get('[data-testid="email-field"]').type("notavalidemail@email.com")
    cy.get('[data-testid="password-field"]').type("password")
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="email-field"]').contains("Incorrect Email")
  });

  it('Create a new account',  () => {
    cy.get('[data-testid="register-button"]').click()
    cy.get('[data-testid="firstname-field"]').type("Arthur")
    cy.get('[data-testid="lastname-field"]').type("McGorbel")
    cy.get('[data-testid="register-email-field"]').type("validemail@email.com")
    cy.get('[data-testid="password-field"]').type("Password123!")
    cy.get('[data-testid="punchline-field"]').type("Hello!")
    cy.get('[data-testid="bio-field"]').type("I am a Lord.")
    cy.get('[data-testid="picture-field"]').selectFile('cypress/fixtures/John_the_business_man.png', { force: true })
    cy.get('[data-testid = "create-user-button"]').click()
    cy.get('[data-testid="login-card"]').should('be.visible')// If succesful login card should be seen
  });

  it('Try to login with an incorrect password', () => {
    cy.get('[data-testid="top-login-button"]').click();
    cy.get('[data-testid="email-field"]').type("validemail@email.com")
    cy.get('[data-testid="password-field"]').type("wrongPassword123!")
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="password-field"]').should('contain', 'Password incorrect')
  });

  it('Successfully login with correct email and password', () => {
    cy.get('[data-testid="email-field"]').type("validemail@email.com")
    cy.get('[data-testid="password-field"]').type("Password123!")
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="home-card"]').should('be.visible')
  });

  it('Should remember login info', () => {
    //Login
    cy.get('[data-testid="email-field"]').type("validemail@email.com")
    cy.get('[data-testid="password-field"]').type("Password123!")
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="home-card"]').should('be.visible')
    //Refresh the page
    cy.visit('http://localhost:5000')
    //Check that the home card is visible
    cy.get('[data-testid="home-card"]').should('be.visible')
  })

  it('Should not be able to see screen if token is deleted', () => {
    //Login
    cy.get('[data-testid="email-field"]').type("validemail@email.com")
    cy.get('[data-testid="password-field"]').type("Password123!")
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="home-card"]').should('be.visible')
    cy.clearLocalStorage("token")//Delete the JWT token
    cy.visit('http://localhost:5000') // Reload the site
    cy.get('[data-testid="login-and-register"]').should("be.visible")//Login and register pages should be visible
  })

  describe('User Deletion Test', () => {
    it('should delete the current user', () => {
      //Login
      cy.get('[data-testid="email-field"]').type("validemail@email.com")
      cy.get('[data-testid="password-field"]').type("Password123!")
      cy.get('[data-testid="login-button"]').click()
      cy.wait(1000);
      //Retrieve the token from local storage
      cy.window().then(win => {
        const token = win.localStorage.getItem('token');

        // Ensure the token is not null
        if (!token) {
          throw new Error('Token not found');
        }

        //Send the DELETE request with the bearer token
        cy.request({
          method: 'DELETE',
          url: '/api/user/',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).then(response => {
          // Check if the user is successfully deleted
          expect(response.status).to.eq(200);
          expect(response.body.message).to.include('deleted');
        });
      });
    });
  });


})

