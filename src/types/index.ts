export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type Condition = "NEW" | "GOOD" | "FAIR";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type PaymentMethod = "CARD" | "CASHAPP";

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  errorDetails?: { path: string; message: string }[] | null;
}

export interface Paginated<T> {
  items: T[];
  meta: ApiMeta;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: Role;
  status: UserStatus;
  profilePicture: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface GearSummary {
  id: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: string;
  condition: Condition;
  stock: number;
  availability: boolean;
  images: string[];
  categoryId: string;
  providerId: string;
  createdAt: string;
  category?: Pick<Category, "id" | "name">;
  provider?: { id: string; fullName: string; email?: string };
  _count?: { rentalOrders: number };
}

export interface Review {
  id: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  customer?: { id: string; fullName: string };
}

export interface GearDetail extends GearSummary {
  specifications: Record<string, string> | null;
  reviews: Review[];
}

export interface GearAvailability {
  gearId: string;
  availability: boolean;
  stock: number;
  capacity: number;
  bookedRanges: { from: string; to: string; quantity: number }[];
}

export interface Payment {
  id: string;
  rentalOrderId: string;
  amount: string;
  currency: string;
  method: PaymentMethod | null;
  transactionId: string | null;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  rentalOrder?: {
    id: string;
    status: RentalStatus;
    gear: { id: string; name: string };
  };
}

export interface RentalOrder {
  id: string;
  customerId: string;
  gearId: string;
  providerId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  quantity: number;
  totalAmount: string;
  status: RentalStatus;
  createdAt: string;
  gear: {
    id: string;
    name: string;
    brand: string;
    images?: string[];
    pricePerDay?: string;
  };
  customer?: { id: string; fullName: string; email: string };
  provider?: { id: string; fullName: string; email?: string };
  payment?: { id: string; status: PaymentStatus; amount: string } | null;
  review?: { id: string; rating?: number } | null;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  usersByRole: Record<Role, number>;
  totalGear: number;
  activeGear: number;
  totalCategories: number;
  totalRentals: number;
  rentalsByStatus: Record<RentalStatus, number>;
  totalRevenue: number;
  recentOrders: RentalOrder[];
}

export interface ProviderStats {
  totalGear: number;
  activeGear: number;
  pendingOrders: number;
  activeRentals: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<RentalStatus, number>;
  recentOrders: RentalOrder[];
}
