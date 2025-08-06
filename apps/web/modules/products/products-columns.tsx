'use client';

import {ColumnDef} from '@tanstack/react-table';
import React from 'react';
import {BsCameraVideo, BsImage, BsThreeDots, BsPin} from 'react-icons/bs';
import {Button} from '@repo/ui/button';
import {ArrowUpDown} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@repo/ui/dropdown-menu';
import {getFormatData2, ProductEntity} from "@repo/shared";
import {getStrapiMedia} from "@/utils";
import {useRouter} from "next/navigation";

export function columns(
  setData: any,
  config: Record<string, string>,
): ColumnDef<any>[] {

  const router = useRouter();

  return [
    {
      id: 'product',
      header: 'Product',
      cell: ({row}) => {
        const product = row.original as ProductEntity;
        return (
          <div className="flex items-center space-x-2">
            {product.icon ? (
              <img
                src={getStrapiMedia(product.icon)}
                alt={product.name}
                className="h-8 w-8 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                <BsPin className="h-6 w-6 text-gray-500"/>
              </div>
            )}
            <span>{product.name}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'url',
      header: 'Link',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({row}) => {
        const status = row.getValue('status') as string;
        return (
          <span className={`text-sm font-medium ${status === 'approved' ? 'text-green-600' : 'text-red-500'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({column}) => {
        return (
          <Button
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="h-4 w-4"/>
          </Button>
        );
      },
      cell: ({row}) => {
        const date = new Date(row.getValue('createdAt'));
        return <span>{getFormatData2(date.toString())}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({row}) => {
        const product = row.original as ProductEntity;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <BsThreeDots/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/products/${product.slug}`);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/dashboard/products/${product.id}`);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-500">
                Delete
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the review.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        // deleteReview(review.id);
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
