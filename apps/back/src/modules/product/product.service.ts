import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { v4 as uuidv4 } from 'uuid';
import { ProductStatus } from 'src/core/enums/ProductStatus';
import { AggregatorType } from 'src/core/enums/AggregatorType';
import { EventType } from 'src/core/enums/EventType';
import { ProductView } from './entity/product.view.entity';
import { EventEntity } from '../event/entity/event.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(ProductView)
    private readonly productRepository: Repository<ProductView>,
    private readonly eventService: EventService,
  ) {}

  async createProduct(
    userId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductView> {
    const product = {
      ...createProductDto,
      id: uuidv4(),
      seller_id: userId,
      buyer_id: null,
      auction_id: uuidv4(),
      status: ProductStatus.CREATED,
      updated_at: new Date(),
    };

    await this.eventService.createEvent(
      EventType.PRODUCT_CREATED,
      AggregatorType.PRODUCT,
      product,
    );

    return product;
  }

  async rejectProduct(
    productId: string,
    isRejected: boolean,
  ): Promise<{ success: boolean; message: string }> {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product with this id not exist');
    }

    if (product.status === ProductStatus.REJECTED) {
      throw new BadRequestException('Product id already rejected');
    }

    if (product.status === ProductStatus.VERIFIED) {
      throw new BadRequestException('Product id already verified');
    }

    const productStatus = isRejected
      ? ProductStatus.REJECTED
      : ProductStatus.VERIFIED;

    const updatedProduct = {
      ...product,
      status: productStatus,
      updated_at: new Date(),
    };

    const eventStatus = isRejected
      ? EventType.PRODUCT_REJECTED
      : EventType.PRODUCT_VERIFIED;

    await this.eventService.createEvent(
      eventStatus,
      AggregatorType.PRODUCT,
      updatedProduct,
    );

    return {
      success: true,
      message: isRejected ? 'Product was rejected' : 'Product was verified',
    };
  }

  async getAllProducts(): Promise<ProductView[]> {
    return this.productRepository.find();
  }

  async getProductById(product_id: string): Promise<ProductView> {
    const product = this.findProductById(product_id);

    if (!product) {
      throw new NotFoundException('Product with this id not exist');
    }

    return product;
  }

  async findProductById(id: string): Promise<ProductView | null> {
    const product = await this.productRepository.findOneBy({ id });

    return product ? product : null;
  }
}
