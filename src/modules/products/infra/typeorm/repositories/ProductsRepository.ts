import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    return await this.ormRepository.save({ name, price, quantity });
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return await this.ormRepository.findOne({ where: { name } });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);
    return await this.ormRepository.findByIds(ids);
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsRecovered = await this.findAllById(products);

    const map = productsRecovered.map(productRecovered => {
      const index = products.findIndex(
        product => product.id === productRecovered.id,
      );

      productRecovered.quantity =
        productRecovered.quantity - products[index].quantity;

      this.ormRepository.save(productRecovered);

      return productRecovered;
    });

    return map;
  }
}

export default ProductsRepository;
