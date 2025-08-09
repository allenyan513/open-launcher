import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  Logger,
} from '@nestjs/common';
import {JwtAuthGuard} from '@src/modules/auth/guards/jwt-auth.guards';
import {Jwt} from '@src/modules/auth/decorators/jwt.decorator';
import {ProductsService} from '@src/modules/products/products.service';
import {
  findAllRequestSchema,
  UpdateProductRequest,
  JwtPayload,
  SubmitProductRequest,
  SimpleCreateProductRequest, findLaunchesRequestSchema, submitProductSchema
} from '@repo/shared';
import {Response} from 'express';


@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Jwt() jwt: JwtPayload, @Body() request: SimpleCreateProductRequest) {
    return this.productsService.create(jwt.userId, request);
  }


  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submit(@Jwt() jwt: JwtPayload, @Body() request: SubmitProductRequest) {
    const validatedRequest = submitProductSchema.parse(request);
    return this.productsService.submit(jwt.userId, validatedRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('crawl')
  async crawlProductInfo(@Jwt() jwt: JwtPayload, @Body('url') url: string) {
    return this.productsService.crawlProductInfo(url);
  }

  @Post('findAll')
  async findAll(@Body() request: any) {
    const validatedRequest = findAllRequestSchema.parse(request);
    return this.productsService.findAll(null, validatedRequest);
  }

  @Post('findLaunches')
  async findLaunches(@Body() request: any) {
    const validatedRequest = findLaunchesRequestSchema.parse(request);
    return this.productsService.findLaunches(null, validatedRequest);
  }

  @Get('findProducts')
  async findProducts() {
    return this.productsService.findProducts();
  }

  @Get('findAllSlug')
  async findAllSlug() {
    return this.productsService.findAllSlug();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/badge.svg')
  async getBadgeSvgById(
    @Param('id') id: string,
    @Query('text') text: 'FEATURED ON' | 'LAUNCHED ON' = 'FEATURED ON',
    @Query('theme') theme: 'light' | 'dark' = 'light',
    @Res() res: Response,
  ) {
    const svgContent = await this.productsService.generateProductBadgeSvg(
      id,
      text,
      theme,
    );
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.send(svgContent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(@Body('url') url: string) {
    const targets = [process.env.NEXT_PUBLIC_APP_URL];
    return this.productsService.verifyEmbedCode(targets, url);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() request: UpdateProductRequest,
  ) {
    return this.productsService.update(jwt.userId, id, request);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.productsService.remove(jwt.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/findAll')
  async findMyAll(
    @Jwt() jwt: JwtPayload,
    @Body() request: any) {
    const validatedRequest = findAllRequestSchema.parse(request);
    return this.productsService.findAll(
      jwt.userId,
      validatedRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  async vote(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.productsService.vote(jwt.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unvote')
  async unvote(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.productsService.unvote(jwt.userId, id);
  }

}
