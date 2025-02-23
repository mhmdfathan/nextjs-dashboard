/* eslint-disable */

import { Metadata } from "next";
import { fetchFilteredCustomers } from "@/app/lib/data";
import CustomersTable from "@/app/ui/customers/table";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page({
  searchParams,
}: {
  // Declare searchParams as a Promise that resolves to an object with an optional query property
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query || "";
  const customers = await fetchFilteredCustomers(query);

  if (customers.length === 0) {
    return (
      <main>
        <p>No customers found.</p>
      </main>
    );
  }

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
