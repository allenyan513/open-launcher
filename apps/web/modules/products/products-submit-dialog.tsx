import {Button} from '@repo/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog';
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
import {BsPlusCircle} from "react-icons/bs";
import {SimpleCreateProductRequest, simpleCreateProductSchema} from "@repo/shared/types";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '@repo/shared';
import {useRouter} from "next/navigation";

export function ProductSubmitDialog(props: {}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<SimpleCreateProductRequest>({
    resolver: zodResolver(simpleCreateProductSchema),
    defaultValues: {
      url: '',
      name: '',
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BsPlusCircle className="text-2xl"/>
          Submit Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Product</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log('submit', form.getValues());
              e.preventDefault();
              form.handleSubmit(onSubmit, onError)();
            }}
            className="flex flex-col gap-4">
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
              Continue
            </Button>
          </form>
        </Form>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
