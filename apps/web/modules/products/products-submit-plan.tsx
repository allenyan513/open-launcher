'use client';

import React, {use, useEffect, useState, useRef} from 'react';
import {Button, buttonVariants} from '@repo/ui/button';
import {
  SubmitProductRequest,
  submitProductSchema,
  CreateOneTimePaymentResponse,
} from '@repo/shared/types';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useUserContext} from '@/context/UserProvider';
import {api} from '@repo/shared/api-client';
import toast from 'react-hot-toast';
import {Form, FormControl, FormField, FormLabel, FormMessage} from '@repo/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/alert-dialog';
import {DatePicker} from "@repo/ui/data-picker";
import {BsAward, BsBarChart, BsClock, BsHouseDoor} from "react-icons/bs";
import {IconHome, IconAward, IconClock, IconChartBarPopular, IconRocket, IconCheck} from "@tabler/icons-react";
import {cn} from "@repo/ui/lib/utils";
import {LoadingText} from "@repo/ui/loading-text";
import {ProductsSubmitLaunchBadge} from "@/modules/products/products-submit-launch-badge";


function LaunchPlan(props: {
  title: string;
  price: React.ReactNode;
  benefits: {
    icon: React.ReactNode;
    description: string;
  }[],
  isSelected: boolean;
  onClick: (e: any) => void;
  className?: string;
}) {
  const {title, price, benefits, isSelected, className} = props;
  return (
    <div
      className={cn("border rounded-md p-6 text-center flex flex-col justify-between gap-8", className)}>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className='text-3xl font-semibold text-start mt-2'>
          {price}
        </p>
        <ul className="text-start mt-4 flex flex-col gap-2">
          {benefits.map((benefit, index) => (
            <li key={index} className='flex flex-row gap-2 text-gray-600'>
              <span className='mt-1'>{benefit.icon}</span>
              <span className='flex-1'>{benefit.description}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        variant={isSelected ? 'default' : 'outline'}
        className="w-full"
        onClick={props.onClick}
      >
        {isSelected ? (
          'Current Plan'
        ) : (
          'Choose'
        )}
      </Button>
    </div>
  );
}

export function ProductsSubmitPlan(props: {
  lang: string;
  productId: string;
}) {
  const {lang, productId} = props;
  const form = useForm<SubmitProductRequest>({
    resolver: zodResolver(submitProductSchema),
    defaultValues: {
      id: productId,
      launchDate: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000),
      submitOption: 'standard-launch'
    },
  });

  const router = useRouter();
  const {user} = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [launchPlan, setLaunchPlan] = useState<'standard-launch' | 'verified-launch' | 'premium-launch'>('standard-launch');
  const [productSlug, setProductSlug] = useState('');

  const onSubmit = async () => {
    try {
      const values = form.getValues();
      setLoading(true);
      const response = await api.products.submit({
        id: values.id,
        launchDate: values.launchDate,
        submitOption: values.submitOption,
      });
      if (response.code === 200) {
        setLoading(false);
        toast.success('Product Submitted Successfully!');
        router.push(`/dashboard/products`);
      } else if (response.code === 600) {
        const data = response.data as CreateOneTimePaymentResponse;
        const {sessionUrl} = data;
        setLoading(false);
        setIsCheckDialogOpen(true);
        window.open(sessionUrl, '_blank');
      } else {
        setLoading(false);
        const message = response.message;
        toast.error(message || 'Failed to submit product. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };

  const onError = (error: any) => {
    console.error(error);
  };

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
            launchDate: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000),
            submitOption: 'standard-launch'
          });
          setProductSlug(product.slug || '');
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  }, [productId]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit, onError)();
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <FormLabel className="mb-2 text-md">
            Select your launch plan:
          </FormLabel>
          <div className={'grid grid-cols-1 md:grid-cols-3 gap-4'}>
            <LaunchPlan
              title={'Standard Launch'}
              price={'Free'}
              benefits={[
                {
                  icon: <IconHome className="h-4 w-4"/>,
                  description: 'Live on homepage for multiple days',
                },
                {
                  icon: <IconChartBarPopular className="h-4 w-4"/>,
                  description: 'Badge for top 3 ranking product',
                },
                {
                  icon: <IconAward className="h-4 w-4"/>,
                  description: 'High authority backlink for top 3 ranking products',
                },
                {
                  icon: <IconClock className="h-4 w-4"/>,
                  description: 'Standard launch queue',
                },
              ]}
              isSelected={launchPlan === 'standard-launch'}
              onClick={(e) => {
                e.preventDefault();
                setLaunchPlan('standard-launch');
                form.setValue('launchDate', new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000));
                form.setValue('submitOption', 'standard-launch');
              }}
              className={'border-gray-300 bg-gray-50'}
            />
            <LaunchPlan
              title={'Pro Launch'}
              price={'Free'}
              benefits={[
                {
                  icon: <IconHome className="h-4 w-4"/>,
                  description: 'Live on homepage for multiple days',
                },
                {
                  icon: <IconChartBarPopular className="h-4 w-4"/>,
                  description: 'Badge for top 3 ranking product',
                },
                {
                  icon: <IconAward className="h-4 w-4"/>,
                  description: 'High authority backlink for top 3 ranking products',
                },
                {
                  icon: <IconCheck className="h-4 w-4"/>,
                  description: 'Embedded voting badge on your website',
                },
                {
                  icon: <IconRocket className="h-4 w-4"/>,
                  description: 'Instantly verified and listed',
                }
              ]}
              isSelected={launchPlan === 'verified-launch'}
              onClick={(e) => {
                e.preventDefault();
                setLaunchPlan('verified-launch');
                form.setValue('launchDate', new Date());
                form.setValue('submitOption', 'verified-launch');
              }}
              className={'border-green-400 bg-green-100'}
            />
            <LaunchPlan
              title={'Premium Launch'}
              price={
                <>
                  <span>$9.9</span>
                  <span className='text-sm font-normal'>/launch</span>
                </>
              }
              benefits={[
                {
                  icon: <IconHome className="h-4 w-4"/>,
                  description: 'Live on homepage for multiple days',
                },
                {
                  icon: <IconChartBarPopular className="h-4 w-4"/>,
                  description: 'Badge for top 3 ranking product',
                },
                {
                  icon: <IconAward className="h-4 w-4"/>,
                  description: 'High authority backlink for top 3 ranking products',
                },
                {
                  icon: <IconClock className="h-4 w-4"/>,
                  description: 'Listing in the featured section',
                },
                {
                  icon: <IconRocket className="h-4 w-4"/>,
                  description: 'Instantly listed without review',
                },
              ]}
              className={'border-amber-200 bg-amber-100'}
              isSelected={launchPlan === 'premium-launch'}
              onClick={(e) => {
                e.preventDefault();
                setLaunchPlan('premium-launch');
                form.setValue('launchDate', new Date());
                form.setValue('submitOption', 'premium-launch');
              }}
            />
          </div>
        </div>

        {launchPlan === 'verified-launch' && (
          <ProductsSubmitLaunchBadge
            productSlug={productSlug}
          />
        )}


        <FormField
          control={form.control}
          name={'launchDate'}
          render={({field}) => (
            <div>
              <FormLabel className="mb-2 text-md">
                Choose your launch date
              </FormLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                disabled={(date) => {
                  // 如何是 ‘standard-launch’类型， 必须要大于当前时间+7天
                  if (launchPlan === 'standard-launch') {
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + 8);
                    return date < minDate;
                  }
                  // 如果是其他类型， 只要大于当前时间即可
                  return date < new Date();
                }}
              />
            </div>
          )}
        />

        <p className={cn("text-sm text-gray-500 mt-2",
          launchPlan === 'premium-launch' ? '' : 'hidden'
        )}>
          Current Balance: <span className='font-bold text-black'>${user?.balance?.toString()}</span>
        </p>

        <Button
          disabled={loading}
          className="mt-4 w-full md:max-w-sm">
          <LoadingText isLoading={loading}
                       loadingText={'Submitting...'}
                       normalText={'Launch it'}/>
        </Button>

        {/*<AlertDialog>*/}
        {/*  <AlertDialogContent>*/}
        {/*    <AlertDialogHeader>*/}
        {/*      <AlertDialogTitle>Are you sure?</AlertDialogTitle>*/}
        {/*      <AlertDialogDescription>*/}
        {/*        You are about to submit your product for a one-time fee of*/}
        {/*        <span className="text-red-500"> $9.9</span>. This will allow your*/}
        {/*        product to be listed immediately without the need for reviews.*/}
        {/*        <br/>*/}
        {/*        <br/>*/}
        {/*        Please ensure that all information is correct before proceeding.*/}
        {/*      </AlertDialogDescription>*/}
        {/*    </AlertDialogHeader>*/}
        {/*    <AlertDialogFooter>*/}
        {/*      <AlertDialogCancel>Cancel</AlertDialogCancel>*/}
        {/*      <AlertDialogAction*/}
        {/*        type="submit"*/}
        {/*        onClick={() => {*/}
        {/*          form.setValue('submitOption', 'paid-submit');*/}
        {/*          form.handleSubmit(onSubmit)();*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        Confirm*/}
        {/*      </AlertDialogAction>*/}
        {/*    </AlertDialogFooter>*/}
        {/*  </AlertDialogContent>*/}
        {/*</AlertDialog>*/}

        <AlertDialog open={isCheckDialogOpen} onOpenChange={setIsCheckDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {/*支付成功了吗？*/}
                Do you have a successful payment?
              </AlertDialogTitle>

              <AlertDialogDescription>
                {/*充值成功后，点击“继续”按钮以完成产品提交。*/}
                After successful payment, click the "Continue" button to complete
                the product submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={() => {
                  form.setValue('submitOption', 'premium-launch');
                  form.handleSubmit(onSubmit)();
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </form>
    </Form>
  );
}
