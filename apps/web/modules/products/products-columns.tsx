'use client';

import {ColumnDef} from '@tanstack/react-table';
import React, {useState} from 'react';
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
import {api, getFormatData2, ProductEntity} from "@repo/shared";
import {getStrapiMedia} from "@/utils";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export function columns(
  setData: any,
  config: Record<string, string>,
): ColumnDef<any>[] {

  const router = useRouter();

  const deleteOne = async (id: string) => {
    try {
      await api.products.deleteOne(id);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

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
      accessorKey: 'createdAt',
      header: 'Submitted At',
      cell: ({row}) => {
        const date = new Date(row.getValue('createdAt'));
        return <span>{getFormatData2(date.toString())}</span>;
      },
    },

    {
      accessorKey: 'launchDate',
      header: 'Launched At',
      cell: ({row}) => {
        const date = new Date(row.getValue('launchDate'));
        return <span>{getFormatData2(date.toString())}</span>;
      },
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
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                    deleteOne(product.id || '');
                    setData((prev: any) => prev.filter((item: any) => item.id !== product.id));
                    toast.success('Product deleted successfully');
                  }
                }}
                className="cursor-pointer text-red-500">
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
