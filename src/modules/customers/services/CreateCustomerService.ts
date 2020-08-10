import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customer = { name, email };

    const customerRecovered = await this.customersRepository.findByEmail(
      customer.email,
    );

    if (customerRecovered) {
      throw new AppError('e-mail already exists');
    }

    return await this.customersRepository.create(customer);
  }
}

export default CreateCustomerService;
