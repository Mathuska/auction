import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { RolesGuardFactory } from 'src/common/guards/role.guard';
import { ProductView } from './entity/product.view.entity';

@Controller('product')
@ApiTags('products')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create product' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @User('id') userId: string,
  ): Promise<ProductView> {
    return await this.productService.createProduct(userId, createProductDto);
  }

  @Post('reject/:id')
  @UseGuards(RolesGuardFactory(['admin', 'employee']))
  @ApiOperation({ summary: 'Reject product' })
  async rejectProduct(
    @Param('id') productId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.productService.rejectProduct(productId, true);
  }

  @Post('verify/:id')
  @UseGuards(RolesGuardFactory(['admin', 'employee']))
  @ApiOperation({ summary: 'Verify product' })
  async verifyProduct(
    @Param('id') productId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.productService.rejectProduct(productId, false);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all products' })
  async getAllProducts(): Promise<ProductView[]> {
    return await this.productService.getAllProducts();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all products' })
  async getProductById(@Param('id') productId: string): Promise<ProductView> {
    return await this.productService.getProductById(productId);
  }
}
