import { IsNumber } from 'class-validator';

export class WithdrawTransactionDto {
  @IsNumber()
  readonly accountId: number;

  @IsNumber()
  readonly amount: number;
}

export class DepositTransactionDto {
  @IsNumber()
  readonly accountId: number;

  @IsNumber()
  readonly amount: number;
}

export class transferTransactionDto {
  @IsNumber()
  readonly from: number;

  @IsNumber()
  readonly to: number;

  @IsNumber()
  readonly amount: number;
}
