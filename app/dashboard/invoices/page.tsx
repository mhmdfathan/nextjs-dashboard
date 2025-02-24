// import Pagination from "@/app/ui/invoices/pagination";
// import Search from "@/app/ui/search";
// import Table from "@/app/ui/invoices/table";
// import { CreateInvoice } from "@/app/ui/invoices/buttons";
// import { lusitana } from "@/app/ui/fonts";
// import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
// import { Suspense } from "react";
// import { fetchInvoicesPages } from "@/app/lib/data";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Invoices",
// };

// export default async function Page(props: {
//   searchParams?: Promise<{
//     query?: string;
//     currentPage?: number;
//   }>;
// }) {
//   const searchParams = await props.searchParams;
//   const query = searchParams?.query || "";
//   const currentPage = searchParams?.currentPage || 1;
//   const totalPages = await fetchInvoicesPages(query);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder="Search invoices..." />
//         <CreateInvoice />
//       </div>
//       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
//         <Table query={query} currentPage={currentPage} />
//       </Suspense>
//       <div className="mt-5 flex w-full justify-center">
//         <Pagination totalPages={totalPages} />
//       </div>
//     </div>
//   );
// }

import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page(props: {
  searchParams?: {
    query?: string;
    currentPage?: number;
  };
}) {
  // Extract search parameters synchronously
  const query = props.searchParams?.query || "";
  const currentPage = props.searchParams?.currentPage
    ? Number(props.searchParams.currentPage)
    : 1;

  // Start fetching pagination data concurrently
  const totalPagesPromise = fetchInvoicesPages(query);

  // Render the heading, search, and action buttons immediately
  // The Table component (which does its own async fetching) will be suspended
  // until the data is ready; this is similar to the dashboard page approach.
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <div className="mt-4">
        <Suspense
          fallback={<InvoicesTableSkeleton />}
          key={query + currentPage}
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center">
        {/* Wait for pagination info to be available */}
        <Pagination totalPages={await totalPagesPromise} />
      </div>
    </div>
  );
}
