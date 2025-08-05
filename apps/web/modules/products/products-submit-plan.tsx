'use client';

import React, {use, useEffect, useState, useRef} from 'react';
import {Button, buttonVariants} from '@repo/ui/button';
import {
  CreateProductRequest,
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
import {LoadingText} from '@repo/ui/loading-text';
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

const badgeEmbedCode = `
<a href="{{endpointUrl}}/products/{{productIdOrSlug}}" target="_blank">
<img src="{{endpointUrl}}/api/products/{{productIdOrSlug}}/badge.svg?theme={{theme}}"
  style="width: 230px; height: 54px;"
  width="230"
  height="54" />
</a>
`;

function getBadgeEmbedCode(
  productIdOrSlug: string,
  theme: 'light' | 'dark' = 'light',
  endpointUrl?: string,
): string {
  const defaultEndpointUrl = endpointUrl || 'http://localhost';
  return badgeEmbedCode
    .replace(/{{productIdOrSlug}}/g, productIdOrSlug)
    .replace(/{{endpointUrl}}/g, defaultEndpointUrl)
    .replace(/{{theme}}/g, theme)
    .trim();
}

function PaidSubmitOption(props: {
  form: any;
  loading: boolean;
  onSubmit: (data: CreateProductRequest) => void;
  isCheckDialogOpen: boolean;
  setIsCheckDialogOpen: (open: boolean) => void;
  currentBalance: string;
}) {
  const {
    form,
    loading,
    onSubmit,
    isCheckDialogOpen,
    setIsCheckDialogOpen,
    currentBalance,
  } = props;
  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
      <h3 className="text-xl font-semibold">Paid Submit</h3>
      <h4 className="text-sm text-gray-500 ml-2">
        Instant listing with premium perks
      </h4>
      <ul className={'text-start list-disc pl-4 mt-4'}>
        <li>Get listed immediately—no reviews required</li>
        <li>Your product appears at the top of the listing page</li>
        <li>Receive a “Featured” badge</li>
      </ul>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={loading} size="lg" className="w-full mt-4">
            Submit for $9.9
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit your product for a one-time fee of
              <span className="text-red-500"> $9.9</span>. This will allow your
              product to be listed immediately without the need for reviews.
              <br/>
              <br/>
              Please ensure that all information is correct before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              onClick={() => {
                form.setValue('submitOption', 'paid-submit');
                form.handleSubmit(onSubmit)();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                form.setValue('submitOption', 'paid-submit');
                form.handleSubmit(onSubmit)();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-sm text-gray-500 mt-2">
        {/*Current Balance: ${user?.balance?.toString() || 0}*/}
        Current Balance: ${currentBalance}
      </p>
    </div>
  );
}

function FreeSubmitOption(props: {
  form: any;
  productId: string;
  loading: boolean;
}) {
  const {form, loading, productId} = props;
  const badgeEmbedCodeLight = getBadgeEmbedCode(
    productId,
    'light',
    process.env.NEXT_PUBLI_ENDPOINT_URL as string,
  );
  const badgeEmbedCodeDark = getBadgeEmbedCode(
    productId,
    'dark',
    process.env.NEXT_PUBLI_ENDPOINT_URL as string,
  );

  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
      <h3 className="text-xl font-semibold">Free Submit</h3>
      <h4 className="text-sm text-gray-500 ml-2">
        Embed widget and write reviews to get listed
      </h4>

      <div className="text-start py-4">
        <h4>1. Embed a widget on your website:</h4>
        <div className="flex flex-col items-start gap-8 px-3 py-3">
          <div className="flex flex-col gap-1">
            <div dangerouslySetInnerHTML={{__html: badgeEmbedCodeLight}}/>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(badgeEmbedCodeLight);
                toast.success('Embed code copied to clipboard!');
              }}
            >
              Copy embed code
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <div dangerouslySetInnerHTML={{__html: badgeEmbedCodeDark}}/>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(badgeEmbedCodeDark);
                toast.success('Embed code copied to clipboard!');
              }}
            >
              Copy embed code
            </Button>
          </div>
        </div>
      </div>

      <Button
        disabled={loading}
        variant="default"
        size="lg"
        type="submit"
        className="w-full"
        onClick={() => {
          form.setValue('submitOption', 'free-submit');
        }}
      >
        {loading ? (
          <LoadingText>Submitting...</LoadingText>
        ) : (
          'Verify and Submit'
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
      submitOption: 'free-submit',
    },
  });

  const router = useRouter();
  const {user, syncSession} = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = form.getValues();
      const response = await api.products.updateOne(productId, {
        ...values,
      }); // 你需要实现这个API
      toast.success('Product updated successfully!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update product. Please try again.');
    }
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      console.log('Submitting product with data:', data);
      setLoading(true);
      const response = await api.products.submit(data);
      if (response.code === 200) {
        setLoading(false);
        toast.success('Product Submitted Successfully!');
        await syncSession();
        router.push(`/dashboard/${productId}/overview`);
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
            submitOption: 'free-submit',
          });
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
          console.log('form submit', form.getValues());
          e.preventDefault();
          if (form.getValues('submitOption') === 'update') {
            handleUpdate();
          } else {
            console.log('form submit hhh');
            form.handleSubmit(onSubmit, onError)();
          }
        }}
        className="flex flex-col"
      >
        {/*<div className="flex flex-row items-center justify-between mb-4 mt-8">*/}
        {/*  <h2 className="text-lg font-semibold">Submit Options</h2>*/}
        {/*</div>*/}
        <FormLabel className="mb-2 text-md">
          Submission Plan
        </FormLabel>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
          <FreeSubmitOption
            form={form}
            productId={productId}
            loading={loading}
          />
          <PaidSubmitOption
            form={form}
            loading={loading}
            onSubmit={onSubmit}
            isCheckDialogOpen={isCheckDialogOpen}
            setIsCheckDialogOpen={setIsCheckDialogOpen}
            currentBalance={user?.balance?.toString() || '0'}
          />
        </div>
        {/*<Link*/}
        {/*  href={`/dashboard/products`}*/}
        {/*  className="text-gray-500  hover:text-gray-600 hover:underline cursor-pointer underline"*/}
        {/*>*/}
        {/*  <p className="mt-4 text-sm">or do it later</p>*/}
        {/*</Link>*/}
      </form>
    </Form>
  );
}
