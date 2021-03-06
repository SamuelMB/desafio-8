import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const order = await container.resolve(FindOrderService).execute({ id });

    const orderFormatted = order?.order_products.map(orderProduct => {
      return { ...orderProduct, price: Number(orderProduct.price).toFixed(2) };
    });

    return response.json({ ...order, order_products: orderFormatted });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const order = await container
      .resolve(CreateOrderService)
      .execute({ customer_id, products });

    const orderFormatted = order.order_products.map(orderProduct => {
      return { ...orderProduct, price: Number(orderProduct.price).toFixed(2) };
    });

    return response
      .status(201)
      .json({ ...order, order_products: orderFormatted });
  }
}
