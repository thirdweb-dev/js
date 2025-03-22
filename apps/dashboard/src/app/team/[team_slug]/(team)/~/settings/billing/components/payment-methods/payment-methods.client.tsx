"use client";

import {
  createSetupIntent,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} from "@/actions/stripe-actions";
import type { Team } from "@/api/team";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  type ExtendedPaymentMethod,
  formatPaymentMethodDetails,
} from "@/lib/payment-methods";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, CreditCard, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddPaymentMethodForm } from "./add-payment-method-form.client";
import { PaymentMethodIcon } from "./payment-method-icon";

interface PaymentMethodsClientProps {
  team: Team;
  paymentMethods: ExtendedPaymentMethod[];
  isEmpty: boolean;
}

export function PaymentMethodsClient({
  team,
  paymentMethods,
  isEmpty,
}: PaymentMethodsClientProps) {
  const router = useDashboardRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deletePaymentMethod(id);
      setDeleteConfirmation(null);
      router.refresh(); // Refresh the page to get updated data
    } catch (err) {
      setError("Failed to delete payment method. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsSettingDefault(id);
      await setDefaultPaymentMethod(team, id);
      router.refresh(); // Refresh the page to get updated data
    } catch (err) {
      setError("Failed to set default payment method. Please try again.");
      console.error(err);
    } finally {
      setIsSettingDefault(null);
    }
  };

  const SETIMutation = useMutation({
    mutationFn: createSetupIntent,
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleAddCardSuccess = () => {
    SETIMutation.reset();
    router.refresh(); // Refresh the page to get updated data
  };

  const maxCards = 3;
  const cardPaymentMethods = paymentMethods.filter(
    (method) => method.type === "card",
  );
  const canAddMoreCards = cardPaymentMethods.length < maxCards;

  return (
    <SettingsCard
      header={{
        title: "Payment Methods",
        description:
          "Payments for your plan, add-ons, and usage are made using the default payment method.",
      }}
      errorText={error ?? undefined}
      noPermissionText={undefined}
      bottomText={
        canAddMoreCards
          ? `At most, ${maxCards} cards can be added.`
          : `Maximum of ${maxCards} cards reached.`
      }
      saveButton={{
        label: "Add Card",
        onClick: () => SETIMutation.mutate(team),
        disabled: SETIMutation.isPending,
        isPending: SETIMutation.isPending,
      }}
    >
      {isEmpty ? (
        <div className="py-6 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 font-medium text-lg">No payment methods</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Add a payment method to get started.
          </p>
        </div>
      ) : (
        <Table className="-mb-6 border-t">
          <TableBody>
            {paymentMethods.map((method) => {
              const details = formatPaymentMethodDetails(method);
              const isCard = method.type === "card";

              return (
                <TableRow
                  key={method.id}
                  className="border-b last:border-0 hover:bg-transparent"
                >
                  <TableCell className="py-4 pl-0">
                    <div className="flex items-center space-x-3">
                      <PaymentMethodIcon
                        type={method.type}
                        brand={method.card?.brand}
                      />
                      <div>
                        <span className="font-medium capitalize">
                          {details.label}
                        </span>
                        {method.isDefault && (
                          <Badge className="ml-2 border-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
                            <CheckCircle className="mr-1 h-3 w-3 text-blue-700" />
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-4">
                      {details.expiryInfo && (
                        <span className="text-muted-foreground">
                          {details.isExpiringSoon && (
                            <Badge className="mr-2 border-0 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                              Expiring soon
                            </Badge>
                          )}
                          {details.isExpired && (
                            <Badge className="mr-2 border-0 bg-red-100 text-red-700 hover:bg-red-100">
                              Expired
                            </Badge>
                          )}
                          {details.expiryInfo}
                        </span>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Only show "Set as default" for card payment methods */}
                          {isCard && !method.isDefault && (
                            <DropdownMenuItem
                              onClick={() => handleSetDefault(method.id)}
                              disabled={isSettingDefault === method.id}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Set as default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirmation(method.id)}
                            disabled={method.isDefault}
                            className={
                              method.isDefault
                                ? "cursor-not-allowed opacity-50"
                                : "text-red-600"
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add Card Dialog */}
      <Dialog
        open={!!SETIMutation.data?.clientSecret}
        onOpenChange={(open) =>
          open ? SETIMutation.mutate(team) : SETIMutation.reset()
        }
      >
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit card or debit card to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AddPaymentMethodForm
              team={team}
              clientSecret={SETIMutation.data?.clientSecret ?? null}
              returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/billing`}
              showBillingName={true}
              showBillingAddressOption={true}
              showDefaultOption={true}
              showAuthorizationMessage={true}
              redirectOnSuccess={false}
              onSuccess={handleAddCardSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteConfirmation && (
            <div className="flex items-center space-x-4 rounded-md bg-muted p-4">
              <div className="rounded-md bg-background p-2">
                {(() => {
                  const method = paymentMethods.find(
                    (m) => m.id === deleteConfirmation,
                  );
                  if (!method) return null;
                  return (
                    <PaymentMethodIcon
                      type={method.type}
                      brand={method.card?.brand}
                    />
                  );
                })()}
              </div>
              <div>
                {(() => {
                  const method = paymentMethods.find(
                    (m) => m.id === deleteConfirmation,
                  );
                  if (!method) return null;

                  const details = formatPaymentMethodDetails(method);
                  return (
                    <>
                      <p className="font-medium capitalize">{details.label}</p>
                      {details.expiryInfo && (
                        <p className="text-muted-foreground text-sm">
                          {details.expiryInfo}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmation && handleDelete(deleteConfirmation)
              }
              disabled={isDeleting !== null}
            >
              {isDeleting ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsCard>
  );
}
