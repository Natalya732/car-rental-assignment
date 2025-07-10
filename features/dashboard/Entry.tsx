"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { useCallback, useMemo, useState } from "react";

import { Toaster } from "@/shared/components/ui/sonner";

import { useAuth } from "@/features/auth/context/AuthContext";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { EditListingDialog } from "@/features/dashboard/components/EditListingDialog";
import { ListingsTable } from "@/features/dashboard/components/ListingsTable";
import { StatsCards } from "@/features/dashboard/components/StatsCards";

import { updateListingDetails } from "./services/cars";
import { fetchCarListings, fetchListingStatus } from "./services/cars-server";
import {
  CarListing,
  FetchCarListingsResponse,
  FetchListingStatusResponse,
  RENTAL_STATUS,
} from "./types";

interface DashboardPageProps {
  initialListings?: FetchCarListingsResponse;
  initialStats?: FetchListingStatusResponse;
}

export default function DashboardPage({
  initialListings,
  initialStats,
}: DashboardPageProps) {
  const { user } = useAuth();
  const [queryParams, setQueryParams] = useState({
    pagination: {
      rows: 20,
      page: 1,
      loading: false,
    },
    search: {
      name: "",
      status: "",
    },
  });

  const [editingListing, setEditingListing] = useState<CarListing | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const listingsQueryKey = ["car-listings", JSON.stringify(queryParams)];
  const { data: listings, isFetching: isListingsLoading } = useQuery({
    queryKey: listingsQueryKey,
    queryFn: () =>
      fetchCarListings({
        page: queryParams.pagination.page,
        limit: queryParams.pagination.rows,
        searchObj: queryParams.search,
      }),
    placeholderData: keepPreviousData,
    initialData:
      queryParams.pagination.page === 1 &&
      queryParams.search.name === "" &&
      queryParams.search.status === ""
        ? initialListings
        : undefined,
    staleTime: Infinity,
  });
  const { data: listingStats } = useQuery({
    queryKey: ["car-stats"],
    queryFn: fetchListingStatus,
    initialData: initialStats,
    staleTime: Infinity,
  });
  const updateListingMutation = useMutation({
    mutationFn: updateListingDetails,
  });

  const handleEdit = useCallback((listing: CarListing) => {
    setEditingListing(listing);
    setIsEditDialogOpen(true);
  }, []);

  const handleSearch = useCallback((field: string, val: string) => {
    if (!field || val === undefined) return;
    if (!["name", "status"].includes(field)) return;
    setQueryParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: 1 },
      search: { ...prev.search, [field]: val },
    }));
  }, []);

  const handleNextPage = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: prev.pagination.page + 1 },
    }));
  }, []);

  const handlePrevPage = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: prev.pagination.page - 1 },
    }));
  }, []);

  const totalPages = useMemo(() => {
    if (listings?.totalCount)
      return Math.ceil(listings?.totalCount / queryParams.pagination.rows);
  }, [listings?.totalCount, queryParams.pagination.rows]);

  const handleStatusChange = useCallback(
    async (id: string, status: RENTAL_STATUS) => {
      queryClient.setQueryData(
        listingsQueryKey,
        (oldData: FetchCarListingsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((listing) =>
              listing.id === id
                ? {
                    ...listing,
                    status,
                    actionBy: user?.email,
                  }
                : listing,
            ),
          };
        },
      );

      await updateListingMutation.mutateAsync({
        id,
        status,
        actionBy: user?.email,
      });

      queryClient.invalidateQueries({
        queryKey: ["car-stats"],
      });
    },
    [queryClient, queryParams, listingsQueryKey],
  );

  const handleEditSave = useCallback(
    async (updatedListing: Partial<CarListing>) => {
      if (!editingListing) return;

      await updateListingMutation.mutateAsync({
        ...updatedListing,
        id: editingListing?.id,
      });

      queryClient.setQueryData(
        listingsQueryKey,
        (oldData: FetchCarListingsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((listing) =>
              listing.id === editingListing?.id
                ? {
                    ...listing,
                    ...updatedListing,
                    actionBy:
                      updatedListing?.status === listing.status
                        ? listing.actionBy
                        : user?.email,
                  }
                : listing,
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["car-stats"],
      });
    },
    [queryClient, listingsQueryKey, editingListing],
  );

  const isRefreshing = useMemo(() => {
    const listingsData = listings?.data ?? [];
    return isListingsLoading && listingsData?.length > 0;
  }, [isListingsLoading, listings?.data]);

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Manage and review car rental listings submitted by users.
            </p>
          </div>

          <StatsCards stats={listingStats?.data || null} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Car Listings</h3>
              <div className="text-sm font-semibold text-muted-foreground">
                {isListingsLoading
                  ? "Loading..."
                  : `${listings?.totalCount} listings`}
              </div>
            </div>

            {isListingsLoading && !isRefreshing ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : (
              <ListingsTable
                loading={isRefreshing}
                listings={listings?.data ?? []}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                paginationDetail={{
                  handleNext: handleNextPage,
                  handlePrev: handlePrevPage,
                  totalPages,
                  currentPage: queryParams.pagination.page,
                }}
                handleSearch={handleSearch}
              />
            )}
          </div>
        </div>
      </DashboardLayout>

      <EditListingDialog
        listing={editingListing}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingListing(null);
        }}
        onSave={handleEditSave}
      />

      <Toaster />
    </>
  );
}
