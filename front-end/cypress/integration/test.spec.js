/// <reference types="cypress" />

describe("Add new video and interact with recomendations", () => {
  beforeEach(() => {
    cy.clearDb();
  });

  const video = {
    name: "musica",
    link: "https://www.youtube.com/watch?v=FPtst9csI6I",
    like: 10,
  };

  it("should create a new video", () => {
    cy.visit("http://localhost:3000/");
    cy.intercept("GET", "http://localhost:5000/recommendations").as("load");
    cy.wait("@load");

    cy.get("input[placeholder=Name]").type(video.name);
    cy.get("input[placeholder='https://youtu.be/...']").type(video.link);

    cy.intercept("POST", "http://localhost:5000/recommendations").as("create");
    cy.get("button").click();
    cy.wait("@create").then((i) => {
      const { statusCode } = i.response;
      expect(statusCode).to.eq(201);
    });

    cy.contains(video.name);
  });

  it("should increase number of recomendation", () => {
    cy.seedDb();
    cy.visit("http://localhost:3000/");

    cy.get("article").first().find("svg").first().click();
    cy.contains(`${video.like + 1}`).should("not.be.undefined");
  });

  it("should decrease number of recomendation", () => {
    cy.seedDb();
    cy.visit("http://localhost:3000/");

    cy.get("article").first().find("svg").last().click();
    cy.contains(`${video.like - 1}`).should("not.be.undefined");
  });
});

describe("Access pages", () => {
  beforeEach(() => {
    cy.seedDb();
  });
  afterEach(() => {
    cy.clearDb();
  });

  it("should apear video player on random page", () => {
    cy.visit("http://localhost:3000/random");

    cy.get("article").first().find("iframe").should("be.visible");
  });

  it("should apear video player on top page", () => {
    cy.visit("http://localhost:3000/top");

    cy.get("article").first().find("iframe").should("be.visible");
  });
});
