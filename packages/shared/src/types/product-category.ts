import { z } from 'zod';

export const PRODUCT_CATEGORY_GROUP = [
  {
    name: 'work-&-productivity',
    text: 'Work & Productivity',
  },
  {
    name: 'engineering-&-development',
    text: 'Engineering & Development',
  },
  {
    name: 'design-&-creative',
    text: 'Design & Creative',
  },
  {
    name: 'finance',
    text: 'Finance',
  },
  {
    name: 'social-&-community',
    text: 'Social & Community',
  },
  {
    name: 'marketing-&-sales',
    text: 'Marketing & Sales',
  },
  {
    name: 'ai',
    text: 'AI',
  },
  {
    name: 'health-&-fitness',
    text: 'Health & Fitness',
  },
  {
    name: 'travel',
    text: 'Travel',
  },
  {
    name: 'platforms',
    text: 'Platforms',
  },
  {
    name: 'product-add-ons',
    text: 'Product Add-ons',
  },
  {
    name: 'web3',
    text: 'Web3',
  },
  {
    name: 'physical-products',
    text: 'Physical Products',
  },
  {
    name: 'ecommerce',
    text: 'Ecommerce',
  },
  {
    name: 'other',
    text: 'Other',
  }
]

export const productCategoryTree = z.object({
  name: z.string(),
  text: z.string(),
  children: z.array(z.object({
    name: z.string(),
    text: z.string(),
  })).optional(),
})

export type ProductCategoryTree = z.infer<typeof productCategoryTree>;


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
