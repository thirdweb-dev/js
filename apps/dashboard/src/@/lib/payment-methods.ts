import type Stripe from "stripe";

export type ExtendedPaymentMethod = Stripe.PaymentMethod & {
  isDefault: boolean;
};

function formatExpiryDate(month: number, year: number): string {
  // Format as "Valid until MM/YYYY"
  return `Valid until ${month}/${year}`;
}

function isExpiringSoon(month: number, year: number): boolean {
  const today = new Date();
  const expiryDate = new Date(year, month - 1, 1); // First day of expiry month
  const monthsDifference =
    (expiryDate.getFullYear() - today.getFullYear()) * 12 +
    (expiryDate.getMonth() - today.getMonth());
  return monthsDifference >= 0 && monthsDifference <= 2; // Within next 3 months
}

function isExpired(month: number, year: number): boolean {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = today.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return true;
  }

  return false;
}

export function formatPaymentMethodDetails(method: Stripe.PaymentMethod): {
  label: string;
  expiryInfo?: string;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
} {
  switch (method.type) {
    case "card": {
      if (!method.card) {
        return { label: "Unknown card" };
      }
      return {
        label: `${method.card.brand} ${method.card.funding || ""} •••• ${method.card.last4}`,
        expiryInfo: formatExpiryDate(
          method.card.exp_month,
          method.card.exp_year,
        ),
        isExpiringSoon: isExpiringSoon(
          method.card.exp_month,
          method.card.exp_year,
        ),
        isExpired: isExpired(method.card.exp_month, method.card.exp_year),
      };
    }

    case "us_bank_account": {
      if (!method.us_bank_account) {
        return { label: "Unknown bank account" };
      }
      return {
        label: `${method.us_bank_account.bank_name} ${method.us_bank_account.account_type} •••• ${method.us_bank_account.last4}`,
      };
    }

    case "sepa_debit": {
      if (!method.sepa_debit) {
        return { label: "Unknown SEPA account" };
      }
      return {
        label: `SEPA Direct Debit •••• ${method.sepa_debit.last4}`,
      };
    }

    default:
      return {
        label: `${method.type.replace("_", " ")}`,
      };
  }
}
