"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CheckCircle, Edit, XCircle } from "lucide-react";

import React from "react";
import { useMemo, useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { CarListing, RENTAL_STATUS } from "../types";

interface ListingsTableProps {
  loading?: boolean;
  listings: CarListing[];
  onEdit: (listing: CarListing) => void;
  onStatusChange: (id: string, status: RENTAL_STATUS) => void;
  paginationDetail: {
    handleNext: () => void;
    handlePrev: () => void;
    totalPages: number | undefined;
    currentPage: number;
  };
  handleSearch: (field: string, val: string) => void;
}

function TableHandler({
  loading,
  listings,
  onEdit,
  onStatusChange,
  paginationDetail,
  handleSearch,
}: ListingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchKey, setSearchKey] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleStatusChange = (id: string, status: RENTAL_STATUS) => {
    onStatusChange(id, status);
  };

  const columns: ColumnDef<CarListing>[] = useMemo(
    () => [
      {
        accessorKey: "carName",
        header: "Car",
        cell: ({ row }) => <div>{row.getValue("carName")}</div>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const price = parseFloat(row.getValue("price"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(price);
          return <div className="font-medium">{formatted}/day</div>;
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <div>{row.getValue("location")}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              variant={
                status === "approved"
                  ? "default"
                  : status === "rejected"
                    ? "destructive"
                    : "secondary"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "submittedBy",
        header: "Submitted By",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("submittedBy")}</div>
        ),
      },
      {
        accessorKey: "actionBy",
        header: "Action By",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("actionBy")}</div>
        ),
      },
      {
        accessorKey: "servicedDate",
        header: "Serviced Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("servicedDate"));
          return (
            <div className="text-sm">{date.toLocaleDateString("en-in")}</div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const listing = row.original;
          const isPending = listing.status === RENTAL_STATUS.PENDING;

          return (
            <div className="flex items-center gap-2">
              {isPending && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(listing.id, RENTAL_STATUS.APPROVED)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(listing.id, RENTAL_STATUS.REJECTED)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <XCircle className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(listing)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onStatusChange],
  );

  const table = useReactTable({
    data: listings,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by car title..."
          value={searchKey}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch("name", searchKey.trim() == "" ? "" : searchKey);
            }
          }}
          onChange={(e) => {
            if (e.target.value === "") {
              handleSearch("name", "");
            }
            setSearchKey(e.target.value);
          }}
          className="max-w-sm"
        />
        <Select
          value={filterValue}
          onValueChange={(value) => {
            setFilterValue(value);
            handleSearch("status", value === "all" ? "" : value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{filterValue || "Filter by status"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={RENTAL_STATUS.PENDING}>Pending</SelectItem>
            <SelectItem value={RENTAL_STATUS.APPROVED}>Approved</SelectItem>
            <SelectItem value={RENTAL_STATUS.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {loading ? (
                        <Skeleton className="h-[32px] rounded-md w-full" />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={paginationDetail.handlePrev}
            disabled={paginationDetail.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={paginationDetail.handleNext}
            disabled={
              paginationDetail.currentPage === paginationDetail.totalPages
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ListingsTable = React.memo(TableHandler);
