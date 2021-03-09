/// <reference types="Cypress" />

import { paths } from "../../../../realworld/frontend/src/components/App";
import { noArticles } from "../../../../realworld/frontend/src/components/ArticleList";
import { strings } from "../../../../realworld/frontend/src/components/Register";

context("Signup flow", () => {
  it("The happy path should work", () => {
    const random = Math.floor(Math.random() * 100000);
    const user = {
      username: `Tester${random}`,
      email: `user+${random}@realworld.io`,
      password: "mysupersecretpassword"
    };
    // set up AJAX call interception
    cy.intercept("POST", "**/api/users").as("signup-request");

    cy.visit(paths.register);

    // form filling
    cy.findByPlaceholderText(strings.username).type(user.username);
    cy.findByPlaceholderText(strings.email).type(user.email);
    cy.findByPlaceholderText(strings.password).type(user.password);

    // form submit...
    cy.get("form")
      .within(() => cy.findByText(strings.signUp).click());

    // ... and AJAX call waiting
    cy.wait("@signup-request").should(interception => {
      let payload;

      // request check
      expect(interception.request.body)
        .to.have.property("user")
        .and.to.be.a("object");
      payload = interception.request.body.user;
      expect(payload).to.have.property("username", user.username);
      expect(payload).to.have.property("email", user.email);
      expect(payload).to.have.property("password", user.password);

      // status check
      expect(interception.response.statusCode).to.equal(200);

      // response check
      expect(interception.response.body)
        .to.have.property("user")
        .and.to.be.a("object");
      payload = interception.response.body.user;
      expect(payload).to.have.property("username", user.username.toLowerCase());
      expect(payload).to.have.property("email", user.email);
      expect(payload)
        .to.have.property("token")
        .and.to.be.a("string").and.not.to.be.empty;
    });

    // end of the flow
    cy.findByText(noArticles).should("be.visible");
  });
});
