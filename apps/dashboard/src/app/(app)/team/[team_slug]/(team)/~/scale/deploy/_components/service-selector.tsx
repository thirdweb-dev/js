import { CheckIcon } from "lucide-react";
import { useMemo } from "react";
import { UpsellBannerCard } from "@/components/blocks/UpsellBannerCard";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type Service = "rpc" | "insight" | "account-abstraction";

export type ServiceConfig = {
  id: Service;
  name: string;
  description: string;
  monthlyPrice: number;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
  features: string[];
  upsellReason: string;
};

export function ServiceSelector(props: {
  services: ServiceConfig[];
  selectedServices: ServiceConfig[];
  setSelectedServices: (services: ServiceConfig[]) => void;
}) {
  const nextServiceToAdd = useMemo(() => {
    // find the first service that is not in the selected services yet
    return props.services.find((service) => {
      return !props.selectedServices.find((s) => s.id === service.id);
    });
  }, [props.services, props.selectedServices]);

  const upsellTitle = useMemo(() => {
    if (!nextServiceToAdd) {
      return "You are getting the maximum 15% bundle discount!";
    }

    switch (props.selectedServices.length) {
      case 1:
        return `Add ${nextServiceToAdd.name} to get a 10% bundle discount!`;
      case 2:
        return `Add ${nextServiceToAdd.name} to get the maximum 15% bundle discount!`;
      default:
        return "You are getting the maximum 15% bundle discount!";
    }
  }, [props.selectedServices.length, nextServiceToAdd]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4">
        {props.services.map((service) => {
          const isSelected = props.selectedServices.includes(service);

          return (
            <ServiceCheckboxCard
              isSelected={isSelected}
              key={service.id}
              onToggle={(toggledService) => {
                // if the service is required, don't allow it to be toggled
                if (toggledService.required) {
                  return;
                }

                props.setSelectedServices(
                  isSelected
                    ? props.selectedServices.filter(
                        (s) => s.id !== toggledService.id,
                      )
                    : [...props.selectedServices, toggledService],
                );
              }}
              service={service}
            />
          );
        })}
      </div>
      {/* Upsell additional services */}

      <UpsellBannerCard
        cta={
          nextServiceToAdd
            ? {
                onClick: () => {
                  if (nextServiceToAdd) {
                    props.setSelectedServices([
                      ...props.selectedServices,
                      nextServiceToAdd,
                    ]);
                  }
                },
                text: `Add ${nextServiceToAdd?.name}`,
              }
            : undefined
        }
        description={
          nextServiceToAdd?.upsellReason ||
          "🎉 Congratulations, you are getting our best deal!"
        }
        title={upsellTitle}
      />
    </div>
  );
}

function ServiceCheckboxCard(props: {
  service: ServiceConfig;
  isSelected: boolean;
  onToggle: (service: ServiceConfig) => void;
}) {
  return (
    <Label
      className={cn(
        "hover:bg-accent/50 flex gap-6 rounded-lg border px-6 py-4 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/10 cursor-pointer items-center",
        props.service.required && "cursor-not-allowed",
      )}
    >
      <Checkbox
        checked={props.isSelected}
        onCheckedChange={() => props.onToggle(props.service)}
      />
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <props.service.icon className="w-5 h-5 text-primary hidden lg:block" />
              <h3 className="font-semibold text-lg">{props.service.name}</h3>
              {props.service.required && (
                <Badge variant="secondary">
                  <span className="hidden lg:inline mr-1">Always </span>Included
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{props.service.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${props.service.monthlyPrice.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              per month
            </div>
          </div>
        </div>

        <div className="grid-cols-2 gap-2 hidden lg:grid">
          {props.service.features.map((feature) => (
            <div className="flex items-center space-x-1 text-sm" key={feature}>
              <CheckIcon className="w-3 h-3 shrink-0 text-success-text" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Label>
  );
}
