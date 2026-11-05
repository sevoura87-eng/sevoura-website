const MESSAGES: Record<string, string> = {
  not_authenticated: "Please sign in to continue.",
  account_suspended: "This account is suspended. Please contact hello@sevoura.com.",
  too_many_orders: "You've placed several orders in a short time. Please wait a few minutes and try again.",
  invalid_full_name: "Please enter the recipient's full name.",
  invalid_phone: "Please enter a valid 10-digit mobile number.",
  invalid_house_number: "House / flat number is required.",
  invalid_street: "Street and locality are required.",
  invalid_city: "City is required.",
  invalid_state: "Please choose a state.",
  invalid_pincode: "Please enter a valid 6-digit pincode.",
  invalid_items: "Your bag is empty or invalid. Please refresh and try again.",
  invalid_quantity: "Quantities must be between 1 and 10 per item.",
  product_unavailable: "An item in your bag is no longer available.",
  order_not_found: "We couldn't find that order.",
  order_not_cancellable: "This order can no longer be cancelled online. Please contact us.",
  order_paid_contact_support: "This order has been paid. Please contact us to cancel.",
  order_status_final: "Delivered or cancelled orders can't be changed.",
  admin_only: "You need admin access for this.",
  cannot_change_own_status: "You can't change your own account status.",
  "Invalid login credentials": "That email and password don't match. Please try again.",
  "Email not confirmed": "Please confirm your email first — check your inbox for the link.",
  "User already registered": "An account with this email already exists. Try signing in.",
};

export function friendlyError(err: unknown): string {
  const raw =
    typeof err === "string"
      ? err
      : err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Something went wrong.";
  if (raw.startsWith("insufficient_stock:")) {
    return `Sorry — we don't have enough stock of ${raw.split(":")[1]} for that quantity.`;
  }
  for (const key of Object.keys(MESSAGES)) {
    if (raw.includes(key)) return MESSAGES[key];
  }
  if (/rate limit/i.test(raw)) return "Too many attempts. Please wait a minute and try again.";
  if (/Failed to fetch|NetworkError/i.test(raw)) return "Network problem — please check your connection and try again.";
  return raw;
}
