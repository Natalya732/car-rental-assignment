import React from "react";

import DashboardPage from "@/features/dashboard/Entry";
import {
  fetchCarListings,
  fetchListingStatus,
} from "@/features/dashboard/services/cars-server";

async function Dashboard() {
  // Fetch initial data server-side (similar to getServerSideProps)
  const initialListings = await fetchCarListings({
    page: 1,
    limit: 20,
    searchObj: { name: "", status: "" },
  });

  const initialStats = await fetchListingStatus();

  return (
    <DashboardPage
      initialListings={initialListings}
      initialStats={initialStats}
    />
  );
}

export default Dashboard;
