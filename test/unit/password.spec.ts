const {
  getPasswordCost,
  PASSWORD_COST,
} = require("../../src/security/password");

describe("Password hashing parameters", () => {
  it("enforces minimum cost", () => {
    expect(getPasswordCost()).toBeGreaterThanOrEqual(12);
  });

  it("matches the exported constant", () => {
    expect(getPasswordCost()).toBe(PASSWORD_COST);
  });
});
