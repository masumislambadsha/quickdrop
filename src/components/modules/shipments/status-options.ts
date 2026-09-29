export const SHIPMENT_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "REQUESTED", label: "Requested" },
  { value: "PICKED_UP", label: "Picked up" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const DELIVERY_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "PICKED_UP", label: "Picked up" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "FAILED", label: "Failed" },
  { value: "RETURNED", label: "Returned" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

export const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "COURIER", label: "Courier" },
  { value: "ADMIN", label: "Admin" },
];
