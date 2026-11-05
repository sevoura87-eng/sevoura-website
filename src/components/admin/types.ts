export interface Stats {
  registered_users: number;
  customers: number;
  new_users_7d: number;
  active_users_7d: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  booked_revenue_paise: number;
  collected_revenue_paise: number;
  avg_order_paise: number;
  orders_by_status: Record<string, number>;
  payments_by_status: Record<string, { count: number; amount_paise: number }>;
}
