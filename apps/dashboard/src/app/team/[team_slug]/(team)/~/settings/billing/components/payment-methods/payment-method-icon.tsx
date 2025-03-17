import {
  BuildingIcon,
  CreditCardIcon,
  DollarSignIcon,
  EuroIcon,
  WalletIcon,
} from "lucide-react";

interface PaymentMethodIconProps {
  type: string;
  brand?: string;
  className?: string;
}

export function PaymentMethodIcon({
  type,
  brand,
  className = "h-6 w-6",
}: PaymentMethodIconProps) {
  if (type === "card" && brand) {
    // Return appropriate card brand icon
    switch (brand.toLowerCase()) {
      case "visa":
        return (
          <svg
            className={className}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Visa</title>
            <rect fill="#0E4595" width="32" height="32" rx="4" />
            <path
              fill="#fff"
              d="M13.2 18.6H10l2-12h3.2l-2 12zm11.6-11.7c-.6-.2-1.6-.5-2.8-.5-3.1 0-5.3 1.6-5.3 3.8 0 1.7 1.6 2.6 2.8 3.1 1.2.5 1.6.9 1.6 1.3 0 .7-.9 1-1.8 1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.4c.7.3 1.9.6 3.2.6 3 0 5-1.5 5-4 0-1.3-.8-2.3-2.6-3.2-.9-.5-1.5-.9-1.5-1.4 0-.5.6-1 1.8-1 1 0 1.8.2 2.4.4l.3.1.4-2.3z"
            />
            <path
              fill="#fff"
              d="M24 18.6h-2.5l-2.2-12h3.1l1.6 12zm-16.7-8l-3 7.3-.3-1.7-1-5.3c0-.4-.4-.5-.8-.5H0l-.1.2c.7.2 1.5.4 2.2.7l1.9 7.3h3.2l3.4-8h-3.3z"
            />
          </svg>
        );
      case "mastercard":
        return (
          <svg
            className={className}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mastercard</title>
            <rect fill="#16366F" width="32" height="32" rx="4" />
            <circle fill="#D9222A" cx="12" cy="16" r="7" />
            <circle fill="#EE9F2D" cx="20" cy="16" r="7" />
            <path fill="#16366F" d="M16 11.2a7 7 0 010 9.6 7 7 0 000-9.6z" />
            <path fill="#fff" d="M16 11.2a7 7 0 000 9.6 7 7 0 010-9.6z" />
          </svg>
        );
      case "amex":
        return (
          <svg
            className={className}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>American Express</title>
            <rect fill="#2557D6" width="32" height="32" rx="4" />
            <path
              fill="#fff"
              d="M4.5 15.5h2.3l.5-1.3.5 1.3h11.7v-.9l.2.9h2.5l.2-.9v.9h2.3V12H23l-.7 2-.8-2h-2.5v.8l-.4-.8h-3.3l-.5 1.1-.4-1.1h-2.8v.8l-.3-.8h-2.4l-1.6 3.5zm.3.8l-.7 1.7h1.7l.4-1 .4 1h7.5v-.7l.6.7h3.1l.6-.7v.7h3.1l.4-1 .4 1h1.7l-.7-1.7h-1.1l-.9 2.2-.9-2.2h-1.3v2.2l-.8-2.2h-1.3l-.7 2.2v-2.2h-2l-.4 1-.4-1h-2v2.2l-.8-2.2H8.6l-.9 2.2-.9-2.2H5.9z"
            />
          </svg>
        );
      case "discover":
        return (
          <svg
            className={className}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Discover</title>
            <rect fill="#F47216" width="32" height="32" rx="4" />
            <path
              fill="#fff"
              d="M16 7c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 15c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"
            />
            <path
              fill="#F47216"
              d="M16 13c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"
            />
          </svg>
        );
      default:
        return <CreditCardIcon className={className} />;
    }
  }

  // Handle other payment method types
  switch (type) {
    case "us_bank_account":
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-blue-600 ${className}`}
        >
          <BuildingIcon className="h-4 w-4 text-white" />
        </div>
      );
    case "sepa_debit":
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-blue-500 ${className}`}
        >
          <EuroIcon className="h-4 w-4 text-white" />
        </div>
      );
    case "au_becs_debit":
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-green-600 ${className}`}
        >
          <DollarSignIcon className="h-4 w-4 text-white" />
        </div>
      );
    default:
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-gray-600 ${className}`}
        >
          <WalletIcon className="h-4 w-4 text-white" />
        </div>
      );
  }
}
