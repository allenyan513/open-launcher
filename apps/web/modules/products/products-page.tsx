import {DashboardHeader} from "@/components/dashboard/dashboard-header";
import {DashboardRoot} from "@/components/dashboard/dashboard-root";
import {columns} from "@/modules/products/products-columns";
import {api} from "@repo/shared/api-client";
import {DataTable} from "@repo/ui/data-table";
import {ColumnFiltersState, SortingState} from "@tanstack/react-table";
import {ProductSubmitDialog} from "@/modules/products/products-submit-dialog";

export function ProductsPage(props: {
  lang: string;
}) {
  const {lang} = props;
  const fetchReviews = async (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState,
  ) => {
    const res = await api.products.findMyAll({
      page: pageIndex + 1,
      pageSize: pageSize,
      orderBy: {
        field: 'createdAt',
        direction: 'desc'
      },
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
            <ProductSubmitDialog/>
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
