import { AccountsService } from './accounts.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() account): Promise<void> {
    await this.accountsService.create(account);
  }
}
