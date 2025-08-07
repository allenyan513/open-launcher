'use client';
import {Button} from '@repo/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@repo/ui/form'
import {Input} from '@repo/ui/input';
import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {SimpleCreateProductRequest, simpleCreateProductSchema} from "@repo/shared/types";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '@repo/shared';
import {redirect, useRouter} from "next/navigation";
import {LoadingText} from "@repo/ui/loading-text";
import {DashboardRoot} from "@/components/dashboard/dashboard-root";
import {DashboardHeader} from "@/components/dashboard/dashboard-header";
import {DashboardContent} from "@/components/dashboard/dashboard-content";
import {useSession} from "@/context/UserProvider";
import {UserEntity} from "@repo/shared/types";

export function ProductSubmitPage(props: {
  lang?: string;
  productUrl?: string;
  productName?: string;
}) {
  const {lang, productName, productUrl} = props;
  const {user} = useSession({
    required: true,
    onUnauthenticated: (user: UserEntity | null | undefined) => {
      redirect(`/auth/signin?redirect=/${lang}/dashboard/submit?productUrl=${productUrl || ''}&productName=${productName || ''}`);
    }
  })
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<SimpleCreateProductRequest>({
    resolver: zodResolver(simpleCreateProductSchema),
    defaultValues: {
      url: productUrl || '',
      name: productName || '',
    },
  });

  const onSubmit = async (data: SimpleCreateProductRequest) => {
    try {
      setLoading(true);
      const newProduct = await api.products.create(data);
      setLoading(false);
      router.push(`/dashboard/products/${newProduct.id}/info`);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };

  const onError = (error: any) => {
    console.error(error);
  }

  return (
    <DashboardRoot>
      <DashboardHeader
        title={'Submit Product'}
        subtitle={'Submit your product to our platform.'}
        buttons={null}
      />
      <DashboardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log('submit', form.getValues());
              e.preventDefault();
              form.handleSubmit(onSubmit, onError)();
            }}
            className="flex flex-col gap-4 max-w-2xl">
            <FormField
              control={form.control}
              name="url"
              render={({field}) => (
                <div>
                  <FormLabel className="mb-2 text-md">
                    Product Link:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-product.url"
                      {...field}
                    />
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
                    <p>Product Name:</p>
                    <p className="text-sm text-gray-400">
                      {field.value ? field.value.length : 0}/32
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </div>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="ml-2"
            >
              <LoadingText
                isLoading={loading}
                loadingText={'Loading...'}
                normalText={'Continue'}/>
            </Button>
          </form>
        </Form>
      </DashboardContent>
    </DashboardRoot>


  );
}
