const PaymentFailureCode = {
  BLOCKLIST: "blocklist",
  CARD_VELOCITY_EXCEEDED: "card_velocity_exceeded",
  CASHAPP_PAYMENT_DECLINED: "cashapp_payment_declined",
  CARD_DECLINE: "card_decline",
  DO_NOT_HONOR: "do_not_honor",
  EXPIRED_CARD: "expired_card",
  GENERIC_DECLINE: "generic_decline",
  HIGHEST_RISK_LEVEL: "highest_risk_level",
  INCORRECT_CVC: "incorrect_cvc",
  INCORRECT_NUMBER: "incorrect_number",
  INVALID_NUMBER: "invalid_number",
  INSUFFICIENT_FUNDS: "insufficient_funds",
  INVALID_ACCOUNT: "invalid_account",
  INVALID_AMOUNT: "invalid_amount",
  INVALID_CVC: "invalid_cvc",
  LOST_CARD: "lost_card",
  PICKUP_CARD: "pickup_card",
  PREVIOUSLY_DECLINED_DO_NOT_RETRY: "previously_declined_do_not_retry",
  PROCESSING_ERROR: "processing_error",
  REENTER_TRANSACTION: "reenter_transaction",
  REQUESTED_BLOCK_ON_INCORRECT_CVC: "requested_block_on_incorrect_cvc",
  REVOCATION_OF_ALL_AUTHORIZATIONS: "revocation_of_all_authorizations",
  RULE: "rule",
  TRANSACTION_NOT_ALLOWED: "transaction_not_allowed",
  TRY_AGAIN_LATER: "try_again_later",
};

export const getBillingPaymentMethodVerificationFailureResponse = (args: {
  paymentFailureCode: string;
}): {
  code: string;
  title: string;
  reason: string;
  resolution: string;
} => {
  const { paymentFailureCode } = args;

  switch (paymentFailureCode) {
    case PaymentFailureCode.INSUFFICIENT_FUNDS:
      return {
        code: PaymentFailureCode.INSUFFICIENT_FUNDS,
        title: "Insufficient funds",
        reason: `This card can't be accepted: Low card balance`,
        resolution: "Please try another payment method",
      };
    case PaymentFailureCode.INVALID_NUMBER:
    case PaymentFailureCode.INCORRECT_NUMBER:
    case PaymentFailureCode.INCORRECT_CVC:
      return {
        code: PaymentFailureCode.INCORRECT_NUMBER,
        title: "Incorrect Number",
        reason: `This card can't be accepted: Incorrect card number`,
        resolution:
          "Check your card number for typos or try a different payment method",
      };
    default:
      return {
        code: PaymentFailureCode.GENERIC_DECLINE,
        title: "Your payment method was declined",
        reason: `This card can't be accepted: declined by bank`,
        resolution: "Please update your payment method or contact your bank",
      };
  }
};

export const getRecurringPaymentFailureResponse = (args: {
  paymentFailureCode: string;
  amount?: number;
}): {
  code: string;
  title: string;
  reason: string;
  resolution: string;
} => {
  const { paymentFailureCode, amount } = args;

  switch (paymentFailureCode) {
    case PaymentFailureCode.INSUFFICIENT_FUNDS:
      return {
        code: PaymentFailureCode.INSUFFICIENT_FUNDS,
        title: "Insufficient funds",
        reason:
          "We are unable to process your payment due to insufficient funds in your account",
        resolution: `To continue using thirdweb services without interruption, please add ${
          amount ? `$${amount}` : "funds"
        } to your account or update your payment method`,
      };
    default:
      return {
        code: PaymentFailureCode.GENERIC_DECLINE,
        title: "We were unable to process your payment",
        reason: "Your payment method failed to process",
        resolution:
          "To continue using thirdweb services without interruption, please update your payment method or contact your bank",
      };
  }
};
