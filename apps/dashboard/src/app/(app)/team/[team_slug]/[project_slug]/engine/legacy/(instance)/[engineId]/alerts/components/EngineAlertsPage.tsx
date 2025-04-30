"use client";

import {
  type EngineInstance,
  useEngineAlertRules,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ManageEngineAlertsSection } from "./ManageEngineAlerts";
import { RecentEngineAlertsSection } from "./RecentEngineAlerts";

export function EngineAlertsPage(props: {
  instance: EngineInstance;
  teamIdOrSlug: string;
}) {
  const alertRulesQuery = useEngineAlertRules(
    props.instance.id,
    props.teamIdOrSlug,
  );
  const alertRules = alertRulesQuery.data ?? [];

  return (
    <div>
      <ManageEngineAlertsSection
        alertRules={alertRules}
        engineId={props.instance.id}
        alertRulesIsLoading={alertRulesQuery.isLoading}
        teamIdOrSlug={props.teamIdOrSlug}
      />
      <div className="h-8" />
      <RecentEngineAlertsSection
        alertRules={alertRules}
        engineId={props.instance.id}
        alertRulesIsLoading={alertRulesQuery.isLoading}
        teamIdOrSlug={props.teamIdOrSlug}
      />
    </div>
  );
}
