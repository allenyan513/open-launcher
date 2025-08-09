import {z} from 'zod';
import {productCategorySchema} from "./product-category";

export const ProductLaunchesType = {
  today: 'today',
  yesterday: 'yesterday',
  thedaybeforeyesterday: 'thedaybeforeyesterday',
  last7days: 'last7days',
  last30days: 'last30days',
}

export const ProductStatus = {
  pending: 'pending',
  scheduled: 'scheduled',
  reviewing: 'reviewing',
  rejected: 'rejected',
  approved: 'approved',
};

export const simpleCreateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be less than 32 characters'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
});
export type SimpleCreateProductRequest = z.infer<typeof simpleCreateProductSchema>;

export const createProductSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be less than 32 characters'),
  slug: z.string().optional(),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  tagline: z
    .string()
    .min(1, 'Tagline is required')
    .max(64, 'Tagline must be less than 64 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(260, 'Description must be less than 260 characters'),
  icon: z.string().url('Invalid URL').min(1, 'Icon URL is required'),
  screenshots: z.array(z.string().url('Invalid URL')).optional(),
  productCategoryIds: z.array(z.string()).optional(),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  tagline: z
    .string()
    .min(1, 'Tagline is required')
    .max(64, 'Tagline must be less than 64 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(260, 'Description must be less than 260 characters')
    .optional(),
  icon: z.string().url('Invalid URL').min(1, 'Icon URL is required'),
  screenshots: z.array(z.string().url('Invalid URL')).optional(),
  productCategoryIds: z.array(z.string()).optional(),
  longDescription: z.string()
    .max(500, 'Long description must be less than 500 characters')
    .optional(),
  features: z.string()
    .max(500, 'Features must be less than 500 characters')
    .optional(),
  useCase: z.string()
    .max(500, 'Use Cases must be less than 500 characters')
    .optional(),
  howToUse: z.string()
    .max(500, 'How to use must be less than 500 characters')
    .optional(),
  faq: z.string().optional(),
  socialLinks: z.array(z.string().optional()),
  launchDate: z.date().optional(),
});
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;

export const submitProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  launchDate: z.coerce.date(),
  submitOption: z.enum([
    'standard-launch',
    'verified-launch',
    'premium-launch',
  ]),
});

export type SubmitProductRequest = z.infer<typeof submitProductSchema>;

export const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(24, 'Name must be less than 24 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(48, 'Slug must be less than 48 characters'),
  userId: z.string().min(1, 'User ID is required'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  status: z
    .nativeEnum(ProductStatus)
    .default(ProductStatus.reviewing)
    .optional(),
  icon: z.string().url('Invalid URL').min(1, 'Icon URL is required'),
  screenshots: z.array(z.string().url('Invalid URL')).optional(),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(160, 'Description must be less than 160 characters')
    .optional(),
  featured: z.boolean().default(false),
  voteCount: z.coerce.number().int().default(0),
  productCategories: z.lazy(() => z.array(productCategorySchema)).optional(),
  longDescription: z.string().optional(),
  features: z.string().optional(),
  useCase: z.string().optional(),
  howToUse: z.string().optional(),
  faq: z.string().optional(),
  socialLinks: z.array(z.string().optional()).optional(),
  launchDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.any().optional(),
  productContents: z.lazy(() => z.array(productContentSchema)).optional(),
});

export type ProductEntity = z.infer<typeof productSchema>;

export const findAllRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).optional(),
  status: z.array(z.nativeEnum(ProductStatus)).optional(),
  search: z.string().optional(),
  orderBy: z.array(
    z.object({
      field: z.string().optional(),
      direction: z.enum(['asc', 'desc']).optional(),
    })
  ).optional(),
  productCategorySlug: z.string().optional(),
  productCategoryId: z.string().optional(),
});

export type FindAllRequest = z.infer<typeof findAllRequestSchema>;

export const findLaunchesRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).optional(),
  launchesType: z.nativeEnum(ProductLaunchesType).default(ProductLaunchesType.today),
});

export type FindLaunchesRequest = z.infer<typeof findLaunchesRequestSchema>;

export const crawlProductResponseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  faviconUrl: z.string().url('Invalid URL').optional(),
  screenshotUrl: z.string().url('Invalid URL').optional(),
});
export type CrawlProductResponse = z.infer<typeof crawlProductResponseSchema>;

export const productContentSchema = z.object({
  id: z.string().min(1, 'Product Content ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  language: z.string().min(1, 'Language is required'),
  tagline: z.string().optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  features: z.string().optional(),
  useCase: z.string().optional(),
  howToUse: z.string().optional(),
  faq: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProductContentEntity = z.infer<typeof productContentSchema>;

export const productVoteSchema = z.object({
  id: z.string().min(1, 'Product Vote ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProductVoteEntity = z.infer<typeof productVoteSchema>;
