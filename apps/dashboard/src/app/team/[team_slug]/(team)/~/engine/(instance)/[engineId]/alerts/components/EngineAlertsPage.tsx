"use client";

import {
  type EngineInstance,
  useEngineAlertRules,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ManageEngineAlertsSection } from "./ManageEngineAlerts";
import { RecentEngineAlertsSection } from "./RecentEngineAlerts";

export function EngineAlertsPage(props: {
  instance: EngineInstance;
}) {
  const alertRulesQuery = useEngineAlertRules(props.instance.id);
  const alertRules = alertRulesQuery.data ?? [];

  return (
    <div>
      <ManageEngineAlertsSection
        alertRules={alertRules}
        engineId={props.instance.id}
        alertRulesIsLoading={alertRulesQuery.isLoading}
      />
      <div className="h-8" />
      <RecentEngineAlertsSection
        alertRules={alertRules}
        engineId={props.instance.id}
        alertRulesIsLoading={alertRulesQuery.isLoading}
      />
    </div>
  );
}
