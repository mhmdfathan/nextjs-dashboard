// /* eslint-disable */

// import { Metadata } from "next";
// import { fetchFilteredCustomers } from "@/app/lib/data";
// import CustomersTable from "@/app/ui/customers/table";

// export const metadata: Metadata = {
//   title: "Customers",
// };

// export default async function Page({
//   searchParams,
// }: {
//   // Declare searchParams as a Promise that resolves to an object with an optional query property
//   searchParams: Promise<{ query?: string }>;
// }) {
//   const resolvedSearchParams = await searchParams;
//   const query = resolvedSearchParams.query || "";
//   const customers = await fetchFilteredCustomers(query);

//   if (customers.length === 0) {
//     return (
//       <main>
//         <p>No customers found.</p>
//       </main>
//     );
//   }

//   return (
//     <main>
//       <CustomersTable customers={customers} />
//     </main>
//   );
// }

/* eslint-disable */

import { Metadata } from "next";
import { Suspense } from "react";
import { z } from "zod";
import { fetchFilteredCustomers } from "@/app/lib/data";
import CustomersTable from "@/app/ui/customers/table";
import { TableRowSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Customers",
};

const searchParamsSchema = z.object({
  query: z.string().optional(),
});

async function getCustomers(query: string) {
  let result: any[] = [];
  try {
    result = await fetchFilteredCustomers(query);
  } catch (error) {
    console.error("Error fetching customers:", error);
  } finally {
    console.log("Finished fetching customers");
  }
  return result;
}

export default async function Page({
  searchParams,
}: {
  // Define searchParams as an optional Promise so that it satisfies the constraint
  searchParams?: Promise<{ query?: string }>;
}) {
  // If searchParams is undefined, default to an empty object.
  const resolvedSearchParams = await (searchParams ?? Promise.resolve({}));

  // Validate and parse search parameters using Zod.
  const { query } = searchParamsSchema.parse(resolvedSearchParams);

  // Default to an empty string if query is undefined.
  const finalQuery = query || "";

  // Start fetching customers concurrently using our try-catch-finally helper.
  const customersPromise = getCustomers(finalQuery);

  return (
    <main>
      <Suspense fallback={<TableRowSkeleton />}>
        {/*
          Await the customersPromise within the Suspense boundary,
          allowing the rest of the page to render immediately.
        */}
        <CustomersTable customers={await customersPromise} />
      </Suspense>
    </main>
  );
}
