import { IAccountsRepository } from './accounts.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('IAccountsRepository')
    private readonly accountsRepository: IAccountsRepository,
  ) {}

  async create(data) {
    return await this.accountsRepository.createAccount(data);
  }
}
