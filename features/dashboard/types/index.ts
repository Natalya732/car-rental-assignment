export enum RENTAL_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface CarListing {
  id: string;
  carName: string;
  price: number;
  servicedDate: string;
  status: RENTAL_STATUS;
  location: string;
  submittedBy: string;
  createdAt: string;
  actionBy?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface FetchListingStatusResponse {
  data: DashboardStats;
  success: boolean;
}

export interface FetchCarListingsResponse {
  data: CarListing[];
  totalCount: number;
}
