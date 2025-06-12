import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { PaymentMachineContext } from "../machines/paymentMachine.js";

/**
 * Storage key for payment machine snapshots
 */
const PAYMENT_SNAPSHOT_KEY = "thirdweb:bridge-embed:payment-snapshot";

/**
 * Serializable snapshot of the payment machine state
 */
export interface PaymentSnapshot {
  value: string; // Current state name
  context: Omit<PaymentMachineContext, "adapters">; // Context without adapters (not serializable)
  timestamp: number; // When snapshot was saved
}

/**
 * Saves a payment machine snapshot to storage
 *
 * @param storage - AsyncStorage instance for persistence
 * @param state - Current machine state name
 * @param context - Current machine context (adapters will be excluded)
 * @returns Promise that resolves when snapshot is saved
 */
export async function saveSnapshot(
  storage: AsyncStorage,
  state: string,
  context: PaymentMachineContext,
): Promise<void> {
  try {
    // Create serializable snapshot excluding adapters
    const snapshot: PaymentSnapshot = {
      value: state,
      context: {
        mode: context.mode,
        destinationToken: context.destinationToken,
        destinationAmount: context.destinationAmount,
        selectedPaymentMethod: context.selectedPaymentMethod,
        quote: context.quote,
        request: context.request,
        completedStatuses: context.completedStatuses,
        currentError: context.currentError
          ? {
              name: context.currentError.name,
              message: context.currentError.message,
              stack: context.currentError.stack,
            }
          : undefined,
        retryState: context.retryState,
      },
      timestamp: Date.now(),
    };

    // Serialize and save to storage
    const serializedSnapshot = JSON.stringify(snapshot);
    await storage.setItem(PAYMENT_SNAPSHOT_KEY, serializedSnapshot);
  } catch (error) {
    // Log error but don't throw - persistence failure shouldn't break the flow
    console.warn("Failed to save payment snapshot:", error);
  }
}

/**
 * Loads a payment machine snapshot from storage
 *
 * @param storage - AsyncStorage instance for persistence
 * @returns Promise that resolves to the loaded snapshot or null if not found/invalid
 */
export async function loadSnapshot(
  storage: AsyncStorage,
): Promise<PaymentSnapshot | null> {
  try {
    const serializedSnapshot = await storage.getItem(PAYMENT_SNAPSHOT_KEY);

    if (!serializedSnapshot) {
      return null;
    }

    const snapshot = JSON.parse(serializedSnapshot) as PaymentSnapshot;

    // Validate snapshot structure
    if (!snapshot.value || !snapshot.context || !snapshot.timestamp) {
      console.warn("Invalid payment snapshot structure, ignoring");
      await clearSnapshot(storage);
      return null;
    }

    // Check if snapshot is too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - snapshot.timestamp > maxAge) {
      console.warn("Payment snapshot expired, clearing");
      await clearSnapshot(storage);
      return null;
    }

    return snapshot;
  } catch (error) {
    console.warn("Failed to load payment snapshot:", error);
    // Clear corrupted snapshot
    await clearSnapshot(storage);
    return null;
  }
}

/**
 * Clears the payment machine snapshot from storage
 *
 * @param storage - AsyncStorage instance for persistence
 * @returns Promise that resolves when snapshot is cleared
 */
export async function clearSnapshot(storage: AsyncStorage): Promise<void> {
  try {
    await storage.removeItem(PAYMENT_SNAPSHOT_KEY);
  } catch (error) {
    console.warn("Failed to clear payment snapshot:", error);
  }
}

/**
 * Checks if a valid payment snapshot exists in storage
 *
 * @param storage - AsyncStorage instance for persistence
 * @returns Promise that resolves to true if valid snapshot exists
 */
export async function hasSnapshot(storage: AsyncStorage): Promise<boolean> {
  const snapshot = await loadSnapshot(storage);
  return snapshot !== null;
}
