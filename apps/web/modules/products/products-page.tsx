import {DashboardHeader} from "@/components/dashboard/dashboard-header";
import {DashboardRoot} from "@/components/dashboard/dashboard-root";
import {columns} from "@/modules/products/products-columns";
import {api} from "@repo/shared/api-client";
import {DataTable} from "@repo/ui/data-table";
import {ColumnFiltersState, SortingState} from "@tanstack/react-table";
import {Button} from "@repo/ui/button";
import {BsPlusCircle} from "react-icons/bs";
import React from "react";
import {useRouter} from "next/navigation";

export function ProductsPage(props: {
  lang: string;
}) {
  const {lang} = props;
  const router = useRouter();
  const fetchReviews = async (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState,
  ) => {
    const res = await api.products.findMyAll({
      page: pageIndex + 1,
      pageSize: pageSize,
      orderBy: [{
        field: 'createdAt',
        direction: 'desc'
      }],
    });
    return {
      data: res.items,
      pageCount: res.meta.pageCount,
      totalRowCount: res.meta.total,
    };
  }
  return (
    <DashboardRoot>
      <DashboardHeader
        title={'My Products'}
        subtitle={'Manage your products here.'}
        buttons={
          <>
            <Button
              size={'lg'}
              variant={'outline'}
              onClick={() => {
                router.push(`/${lang}/dashboard/submit`);
              }}
            >
              <BsPlusCircle className="text-2xl"/>
              Submit Product
            </Button>
          </>
        }
      />
      <DataTable
        fetchData={fetchReviews}
        columns={columns}
        config={{}}
      />
    </DashboardRoot>
  );
}
