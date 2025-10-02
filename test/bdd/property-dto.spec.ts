import fc from "fast-check";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { CreateIntentDto } from "../../src/payments/dto/create-intent.dto";

describe("Property-based DTO validation", () => {
  it("rejects dangerous or invalid fields for create-intent", () => {
    fc.assert(
      fc.property(
        fc.record({
          amount: fc.oneof(
            fc.integer({ max: 0 }),
            fc.integer({ min: 10 ** 9 })
          ),
          currency: fc.constantFrom("$", "{", "$gt", "€", "usd", "US1", "AAAA"),
          idempotencyKey: fc.string({ minLength: 0, maxLength: 7 }),
        }),
        (bad: unknown) => {
          const dto = plainToInstance(CreateIntentDto, bad as any);
          const errors = validateSync(dto);
          expect(errors.length).toBeGreaterThan(0);
        }
      )
    );
  });
});
