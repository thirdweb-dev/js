"use client";

import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type EngineAlert,
  type EngineAlertRule,
  useEngineAlerts,
} from "@/hooks/useEngine";

export function RecentEngineAlertsSection(props: {
  alertRules: EngineAlertRule[];
  alertRulesIsLoading: boolean;
  engineId: string;
  teamIdOrSlug: string;
}) {
  // TODO - pagination
  // required : return the total number of alerts in response from API
  const alertsQuery = useEngineAlerts(
    props.engineId,
    props.teamIdOrSlug,
    100,
    0,
  );
  const alerts = alertsQuery.data ?? [];

  return (
    <RecentEngineAlertsSectionUI
      alertRules={props.alertRules}
      alerts={alerts}
      isLoading={alertsQuery.isLoading || props.alertRulesIsLoading}
      onAlertsUpdated={() => {
        alertsQuery.refetch();
      }}
    />
  );
}

export function RecentEngineAlertsSectionUI(props: {
  alertRules: EngineAlertRule[];
  alerts: EngineAlert[];
  isLoading: boolean;
  onAlertsUpdated: () => void;
}) {
  const { alerts, isLoading } = props;
  return (
    <section>
      <h2 className="mb-1 font-semibold text-2xl tracking-tight">
        Recent Alerts
      </h2>

      <div className="h-2" />

      {alerts.length === 0 || isLoading ? (
        <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-border">
          {isLoading ? <Spinner className="size-8" /> : "No alerts triggered."}
        </div>
      ) : (
        <RecentEngineAlertsTableUI
          alertRules={props.alertRules}
          alerts={alerts}
          onAlertsUpdated={props.onAlertsUpdated}
        />
      )}
    </section>
  );
}

function RecentEngineAlertsTableUI(props: {
  alertRules: EngineAlertRule[];
  alerts: EngineAlert[];
  onAlertsUpdated: () => void;
}) {
  const alertRulesMap = useMemo(() => {
    const map: Record<string, EngineAlertRule> = {};
    for (const alertRule of props.alertRules) {
      map[alertRule.id] = alertRule;
    }
    return map;
  }, [props.alertRules]);

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert Trigger</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.alerts.map((alert) => {
            let variant: BadgeProps["variant"];
            let status: string;
            if (alert.status === "pending") {
              variant = "warning";
              status = "Pending";
            } else if (alert.status === "firing") {
              variant = "destructive";
              status = "Triggered";
            } else if (alert.status === "resolved") {
              variant = "success";
              status = "Resolved";
            } else {
              return null;
            }

            return (
              <TableRow key={alert.id}>
                <TableCell>{alertRulesMap[alert.alertRuleId]?.title}</TableCell>

                <TableCell>
                  <Badge className="text-sm" variant={variant}>
                    {status}
                  </Badge>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {formatDistance(
                    new Date(alert.endsAt ?? alert.startsAt),
                    new Date(),
                    { addSuffix: true },
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
