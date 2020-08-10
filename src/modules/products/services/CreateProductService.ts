import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const product = { name, price, quantity };

    const productRecovered = await this.productsRepository.findByName(name);

    if (productRecovered) {
      throw new AppError('name already exists');
    }

    return await this.productsRepository.create(product);
  }
}

export default CreateProductService;
