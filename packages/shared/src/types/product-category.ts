import { z } from 'zod';

export const ProductCategoryGroup = {
  workProductivity: 'Work & Productivity',
  engineeringDevelopment: 'Engineering & Development',
  designCreative: 'Design & Creative',
  finance: 'Finance',
  socialCommunity: 'Social & Community',
  marketing_features: 'Marketing Features',
  ai: 'AI',
  healthFitness: 'Health & Fitness',
  travel: 'Travel',
  platforms: 'Platforms',
  productAddOns: 'Product Add-ons',
  web3: 'Web3',
  physicalProducts: 'Physical Products',
  ecommerce: 'Ecommerce',
};

export const productCategorySchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(24, 'Name must be less than 24 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(48, 'Slug must be less than 48 characters'),
  group: z.string().min(1, 'Group is required'),
  whoToUse: z.string().optional(),
  howItWork: z.string().optional(),
  advantages: z.string().optional(),
  description: z.string().optional(),
  faqs: z.string().optional(),
  features: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductCategoryEntity = z.infer<typeof productCategorySchema>;

export const findAllProductCategoriesRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).optional(),
  group: z.string().optional(),
  orderBy: z.object({
    field: z.string().optional(),
    direction: z.enum(['asc', 'desc']).optional(),
  }).optional(),
});

export type FindAllProductCategoriesRequest = z.infer<typeof findAllProductCategoriesRequestSchema>;


export const createProductCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be less than 32 characters'),
  slug: z.string().optional(),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
});

export type CreateProductCategoryRequest = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryRequest = Partial<CreateProductCategoryRequest>
