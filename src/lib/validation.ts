export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

/** Returns a 10-digit Indian mobile number or null */
export function normalizePhone(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(d)) return d;
  if (/^91[6-9]\d{9}$/.test(d)) return d.slice(2);
  if (/^0[6-9]\d{9}$/.test(d)) return d.slice(1);
  return null;
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isValidPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());

export function passwordIssues(pw: string): string | null {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Include at least one letter and one number.";
  return null;
}

export interface AddressInput {
  full_name: string;
  phone: string;
  house_number: string;
  street_locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

export const emptyAddress: AddressInput = {
  full_name: "", phone: "", house_number: "", street_locality: "",
  city: "", state: "", pincode: "", landmark: "",
};

export function validateAddress(a: AddressInput): Partial<Record<keyof AddressInput, string>> {
  const e: Partial<Record<keyof AddressInput, string>> = {};
  if (a.full_name.trim().length < 2) e.full_name = "Please enter the recipient's full name.";
  if (!normalizePhone(a.phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!a.house_number.trim()) e.house_number = "House / flat number is required.";
  if (a.street_locality.trim().length < 2) e.street_locality = "Street and locality are required.";
  if (a.city.trim().length < 2) e.city = "City is required.";
  if (!a.state.trim()) e.state = "Please choose a state.";
  if (!isValidPincode(a.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
  if (a.landmark.length > 120) e.landmark = "Keep the landmark under 120 characters.";
  return e;
}
