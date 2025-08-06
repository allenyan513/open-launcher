'use client';
import React, {use, useEffect, useState} from 'react';
import {CreateProductRequest, createProductSchema} from '@repo/shared/types';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '@repo/shared/api-client';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@repo/ui/form';
import {Input} from '@repo/ui/input';
import {Button} from '@repo/ui/button';
import {Textarea} from '@repo/ui/textarea';
import {UploadContainer} from '@/components/upload-container';
import {BiImage} from 'react-icons/bi';
import {useRouter} from 'next/navigation';
import {TagSelectorFormField} from '@/modules/products/products-tag-selector-form-field';
import {useForm} from 'react-hook-form';
import slugify from 'slugify';

export function ProductsSubmitInfo(props: {
  lang: string;
  productId: string;
}) {
  const {lang, productId} = props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  // const [isCrawling, setIsCrawling] = useState<boolean>(false);

  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      id: undefined,
      url: '',
      name: '',
      tagline: '',
      description: '',
      icon: '',
      screenshots: [],
      group: '',
      productCategoryIds: [],
    },
  });

  useEffect(() => {
    if (!productId) {
      return;
    }
    api.products
      .findOne(productId)
      .then((product) => {
        if (product) {
          form.reset({
            id: product.id,
            name: product.name,
            description: product.description || '',
            url: product.url,
            icon: product.icon || '',
            tagline: product.tagline || '',
            screenshots: product.screenshots || [],
            group: product.group,
            productCategoryIds: product?.productCategories?.map((c) => c.id) || [],
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  }, [productId]);

  const handleUpdate = async () => {
    try {
      if (!productId) {
        toast.error('Product ID is required for update.');
        return;
      }
      setLoading(true);
      const values = form.getValues();
      const response = await api.products.updateOne(productId, {
        ...values,
      });
      toast.success('Product updated successfully!');
      setLoading(false);
      router.push(`/dashboard/products/${productId}/plan`);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update product. Please try again.');
    }
  };

  // const handleCrawlProductInfo = async () => {
  //   try {
  //     const url = form.getValues('url');
  //     setIsCrawling(true);
  //     const response = await api.products.crawlOne(url || '');
  //     const {title, description, faviconUrl, screenshotUrl} = response;
  //     form.setValue('name', title);
  //     form.setValue('description', description);
  //     form.setValue('icon', faviconUrl);
  //     form.setValue('screenshots', [screenshotUrl || '']);
  //     setIsCrawling(false);
  //   } catch (error) {
  //     setIsCrawling(false);
  //     toast.error('Failed to fetch product info. Please try again.');
  //   }
  // };

  // const onSubmit = async (data: CreateProductRequest) => {
  //   try {
  //     setLoading(true);
  //     const newProduct = await api.products.create(data);
  //     setLoading(false);
  //     router.push(`/dashboard/products/new/${newProduct.id}`);
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error('Failed to submit product. Please try again.');
  //   }
  // };
  //
  // const onError = (error: any) => {
  //   console.error(error);
  // };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
          // if (form.getValues('submitOption') === 'crawl-product-info') {
          //   handleCrawlProductInfo();
          // } else if (form.getValues('submitOption') === 'update') {
          //   handleUpdate();
          // } else {
          //   form.handleSubmit(onSubmit, onError)();
          // }
        }}
        className="flex flex-col gap-6"
      >
        {/*<h2 className="text-lg font-semibold">*/}
        {/*  Main Info <Required />*/}
        {/*</h2>*/}
        <FormField
          control={form.control}
          name="url"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md">
                Link to the Product
              </FormLabel>
              <FormControl>
                {/*<div className="flex flex-row gap-2 items-center">*/}
                <Input
                  disabled={true}
                  placeholder="https://your-product.url"
                  {...field}
                />
                {/*<Button*/}
                {/*  onClick={() => {*/}
                {/*    form.setValue('submitOption', 'crawl-product-info');*/}
                {/*  }}*/}
                {/*  disabled={true}*/}
                {/*>*/}
                {/*  {isCrawling ? 'Loading...' : 'Auto-fill'}*/}
                {/*</Button>*/}
                {/*</div>*/}
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>Name of the Product</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/32
                </p>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={true}
                  placeholder="Your Product Name"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
              <p className="text-sm text-gray-500 mt-2 mx-2">
                {process.env.NEXT_PUBLIC_APP_URL}/products/
                {slugify(form.watch('name') || '', {
                  lower: true,
                  strict: true,
                })}
              </p>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="tagline"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>Tagline</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/64
                </p>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe your product in a few words"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md flex flex-row justify-between items-center">
                <p>Description of the Product</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/260
                </p>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="h-24"
                  placeholder="Describe your product in detail"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <TagSelectorFormField form={form}/>

        <FormField
          control={form.control}
          name="icon"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md">Icon</FormLabel>
              <FormControl>
                {/*<Input placeholder="https://icon.url" {...field} />*/}
                <div className="flex flex-row items-center gap-2">
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Product Icon"
                      className="w-11 h-11 rounded border border-gray-300"
                    />
                  )}
                  <UploadContainer
                    accept={'image/*'}
                    onUploadSuccess={(url) => {
                      field.onChange(url);
                    }}
                  >
                    <BiImage
                      className="w-11 h-11 text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"/>
                  </UploadContainer>
                </div>
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="screenshots"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md flex flex-col items-start">
                <p>Gallery</p>
                <p className="text-sm text-gray-500">
                  The first image will be used as the social preview when
                  your link is shared online. We recommend at least 3 or
                  more images.
                </p>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 w-full overflow-x-auto">
                    {(field.value || []).map(
                      (url: string, index: number) => (
                        <div
                          key={index}
                          className="relative group w-48 h-auto aspect-video"
                        >
                          <img
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="rounded border border-gray-300 w-48 h-auto aspect-video object-cover"
                          />
                          <Button
                            type="button"
                            size={'sm'}
                            onClick={() => {
                              const updated = field?.value?.filter(
                                (_, i) => i !== index,
                              );
                              field.onChange(updated);
                            }}
                            className="absolute h-8 top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                  <UploadContainer
                    accept={'image/*'}
                    onUploadSuccess={(url) => {
                      // field.onChange(url);
                      const newUrls = [url];
                      field.onChange([
                        ...(field.value || []),
                        ...newUrls,
                      ]);
                    }}
                  >
                    <BiImage
                      className="w-11 h-11 text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"/>
                  </UploadContainer>
                </div>
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        {/*{mode === 'new' && (*/}
        {/*  <Button*/}
        {/*    disabled={loading}*/}
        {/*    onClick={() => {*/}
        {/*      form.setValue('submitOption', 'free-submit');*/}
        {/*    }}*/}
        {/*    type="submit"*/}
        {/*    size={'lg'}*/}
        {/*    className="w-full"*/}
        {/*  >*/}
        {/*    Next Step: Select Submission Plan*/}
        {/*  </Button>*/}
        {/*)}*/}
        {/*{mode === 'edit' && (*/}
        <Button
          disabled={loading}
          size="lg"
          type="submit"
          onClick={() => {
            form.setValue('submitOption', 'update');
          }}
        >
          Next Step: Select Submission Plan
        </Button>
        {/*)}*/}
      </form>
    </Form>
  );
}
