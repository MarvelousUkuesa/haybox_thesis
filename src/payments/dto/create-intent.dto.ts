import { IsInt, IsString } from "class-validator";

export class CreateIntentDto {
  // 🔴 SEED: accept 0/negative/huge amounts
  @IsInt()
  amount!: number;

  // 🔴 SEED: accept any string (e.g., "$", "{", "usd", "US1", "AAAA")
  @IsString()
  currency!: string;

  // 🔴 SEED: allow empty/short keys
  @IsString()
  idempotencyKey!: string;
}
