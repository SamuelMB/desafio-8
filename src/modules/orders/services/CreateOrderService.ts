import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('customer not found');
    }

    const productsRecovered = await this.productsRepository.findAllById(
      products.map(product => {
        return { id: product.id };
      }),
    );

    const map = products.map(product => {
      const index = this.findProductIndexById(productsRecovered, product.id);

      if (index === -1) {
        throw new AppError('Error on recovering product');
      }

      if (productsRecovered[index].quantity < product.quantity) {
        throw new AppError('order quantity is bigger than stock quantity');
      }

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: productsRecovered[index].price,
      };
    });

    await this.productsRepository.updateQuantity(products);

    return await this.ordersRepository.create({ customer, products: map });
  }

  private findProductIndexById(products: IProduct[], id: string) {
    return products.findIndex(product => product.id === id);
  }
}

export default CreateOrderService;
