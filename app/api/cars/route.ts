import { listingData } from "@/shared/utils/mock-data/listing-data";

import { RENTAL_STATUS } from "@/features/dashboard/types";

function getFilteredData(name: string, status: string) {
  return listingData
    .filter((item) => {
      const matchWithName = name
        ? item.carName.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchWithStatus = status ? item.status === status : true;
    return matchWithName && matchWithStatus;
    })
    ?.sort(
      (a, b) =>
        new Date(b.servicedDate).getTime() - new Date(a.servicedDate).getTime(),
    );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const name = searchParams.get("name") || "";
  const status = searchParams.get("status") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  const initialIndex = (page - 1) * limit;
  const endIndex = initialIndex + limit;
  const filteredData = getFilteredData(name, status);

  const paginatedData = filteredData.slice(initialIndex, endIndex);

  return Response.json({
    totalCount: filteredData.length,
    data: paginatedData,
  });
}

export async function PUT(req: Request) {
  const body = await req.json();

  const { id, carName, price, servicedDate, status, location, actionBy } = body;
  if (!id) return Response.json({ error: "Id is required" }, { status: 404 });

  if (status && !Object.values(RENTAL_STATUS).includes(status)) {
    return Response.json({ error: "Invalid Status" }, { status: 400 });
  }
  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return Response.json(
      { error: "Price must be a positive number" },
      { status: 400 },
    );
  }

  const index = listingData.findIndex((item) => item.id === id);
  if (index === -1) {
    return Response.json(
      {
        error: "Listing not found",
      },
      {
        status: 404,
      },
    );
  }

  const updateData: Partial<(typeof listingData)[0]> = {};

  if (carName !== undefined) updateData.carName = carName;
  if (price !== undefined) updateData.price = price;
  if (servicedDate !== undefined) updateData.servicedDate = servicedDate;
  if (status !== undefined) updateData.status = status;
  if (location !== undefined) updateData.location = location;
  if (actionBy !== undefined) updateData.actionBy = actionBy;
  listingData[index] = {
    ...listingData[index],
    ...updateData,
  };

  return Response.json({
    message: "Listing updated successfully",
    data: listingData[index],
  });
}
