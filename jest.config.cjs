module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "tsconfig.json" }]
  },
  testMatch: ["**/test/**/*.spec.ts"],
  collectCoverage: false,
  verbose: false
};
