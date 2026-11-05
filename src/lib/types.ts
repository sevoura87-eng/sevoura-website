export type OrderStatus =
  | "order_placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "authorized" | "paid" | "failed" | "refunded";

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  price_paise: number;
  mrp_paise: number | null;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: "customer" | "admin";
  account_status: "active" | "suspended";
  created_at: string;
  last_login_at: string | null;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  house_number: string;
  street_locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  is_default: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  image_url: string | null;
  unit_price_paise: number;
  quantity: number;
  line_total_paise: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  ship_full_name: string;
  ship_phone: string;
  ship_house_number: string;
  ship_street_locality: string;
  ship_city: string;
  ship_state: string;
  ship_pincode: string;
  ship_landmark: string | null;
  subtotal_paise: number;
  shipping_paise: number;
  discount_paise: number;
  total_paise: number;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  delivered_at: string | null;
  order_items?: OrderItem[];
}

export interface StatusHistory {
  id: number;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  created_at: string;
}
