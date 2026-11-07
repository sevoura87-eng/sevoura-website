export interface Stats {
  registered_users: number;
  customers: number;
  new_users_7d: number;
  active_users_7d: number;
  total_orders: number;
  confirmed_orders?: number;
  today_paid_orders?: number;
  today_paid_revenue_paise?: number;
  paying_customers?: number;
  today_orders: number;
  today_revenue_paise: number;
  paid_orders: number;
  unpaid_orders: number;
  payment_pending_orders: number;
  failed_payments: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  booked_revenue_paise: number;
  collected_revenue_paise: number;
  avg_order_paise: number;
  orders_by_status: Record<string, number>;
  payments_by_status: Record<string, { count: number; amount_paise: number }>;
}
