import { IAccountsRepository } from './accounts.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: IAccountsRepository) {}

  async create(data) {
    return await this.accountsRepository.createAccount(data);
  }
}
