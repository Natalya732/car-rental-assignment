import { listingData } from "@/shared/utils/mock-data/listing-data";

import { RENTAL_STATUS } from "@/features/dashboard/types";

export async function GET() {
  const resultObj = {
    total: listingData.length || 0,
    pending:
      listingData.filter((item) => item.status === RENTAL_STATUS.PENDING)
        .length || 0,
    approved:
      listingData.filter((item) => item.status === RENTAL_STATUS.APPROVED)
        .length || 0,
    rejected:
      listingData.filter((item) => item.status === RENTAL_STATUS.REJECTED)
        .length || 0,
  };

  return Response.json({
    data: resultObj,
    success: true,
  });
}
