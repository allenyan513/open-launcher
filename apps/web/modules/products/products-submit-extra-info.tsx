'use client';
import React, {use, useEffect, useState} from 'react';
import {
  UpdateProductRequest, updateProductSchema
} from '@repo/shared/types';
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
import {Button} from '@repo/ui/button';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {Textarea} from "@repo/ui/textarea";
import {SocialLinkInput} from "@/components/dashboard/sociallink-input";

export function ProductsSubmitExtraInfo(props: {
  lang: string;
  productId: string;
}) {
  const {lang, productId} = props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<UpdateProductRequest>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      longDescription: '',
      features: '',
      useCase: '',
      howToUse: '',
      faq: '',
      socialLinks: [],
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
            longDescription: product.longDescription || '',
            features: product.features || '',
            useCase: product.useCase || '',
            howToUse: product.howToUse || '',
            faq: product.faq || '',
            socialLinks: product.socialLinks || [],
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
      setLoading(false);
      router.push(`/dashboard/products/${productId}/plan`);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update product. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name={'socialLinks'}
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                Social Media Links
              </FormLabel>
              <FormControl>
                <SocialLinkInput
                  value={field.value || []}
                  onChange={(links) => {
                    field.onChange(links);
                  }}/>
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name={'longDescription'}
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>What is your product about?</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/500
                </p>
              </FormLabel>
              <FormControl>
                <Textarea className='h-32' {...field} />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="features"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>What are the key features of your product?</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/500
                </p>
              </FormLabel>
              <FormControl>
                <Textarea className='h-32' {...field} />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="useCase"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>What is the primary use case of your product?</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/500
                </p>
              </FormLabel>
              <FormControl>
                <Textarea className='h-32' {...field} />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="howToUse"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>What are the steps to use your product?</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/500
                </p>
              </FormLabel>
              <FormControl>
                <Textarea className='h-32' {...field} />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="faq"
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md justify-between items-center">
                <p>Any frequently asked questions about your product?</p>
                <p className="text-sm text-gray-400">
                  {field.value ? field.value.length : 0}/500
                </p>
              </FormLabel>
              <FormControl>
                <Textarea className='h-32' {...field} />
              </FormControl>
              <FormMessage/>
            </div>
          )}
        />
        <Button
          disabled={loading}
          size="lg"
          type="submit"
          className='max-w-sm'>
          Next
        </Button>
      </form>
    </Form>
  );
}
