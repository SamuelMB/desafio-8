import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Customer, customer => customer.id)
  customer: Customer;

  @OneToMany(type => OrdersProducts, ordersProducts => ordersProducts.order)
  order_products: OrdersProducts[];

  created_at: Date;

  updated_at: Date;
}

export default Order;
