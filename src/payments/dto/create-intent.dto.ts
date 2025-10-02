import { IsInt, Min, IsString, Length, Matches } from "class-validator";

export class CreateIntentDto {
  @IsInt()
  @Min(1)
  amount!: number;

  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  currency!: string;

  @IsString()
  @Length(8, 64)
  idempotencyKey!: string;
}
