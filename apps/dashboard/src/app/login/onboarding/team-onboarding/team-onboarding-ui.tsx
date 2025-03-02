"use client";

import type { RedirectBillingCheckoutAction } from "@/actions/billing";
import { useState } from "react";
import { TeamOnboardingLayout } from "../onboarding-layout";
import { ChooseTeamPlan } from "./ChooseTeamPlan";
import { TeamInfoForm, type TeamOnboardingData } from "./TeamInfoForm";

type TeamOnboardingProps = {
  redirectPath: string;
  redirectToCheckout: RedirectBillingCheckoutAction;
  sendTeamOnboardingData: (data: TeamOnboardingData) => Promise<void>;
  onSkipPlan: () => void;
  teamSlug: string;
};

type TeamOnboardingScreen = "show-plans" | "team-info";

export function TeamOnboardingUI(props: TeamOnboardingProps) {
  const [screen, setScreen] = useState<TeamOnboardingScreen>("team-info");

  return (
    <TeamOnboardingLayout currentStep={screen === "team-info" ? 1 : 2}>
      {screen === "team-info" && (
        <TeamInfoForm
          sendTeamOnboardingData={props.sendTeamOnboardingData}
          onComplete={() => {
            setScreen("show-plans");
          }}
        />
      )}

      {screen === "show-plans" && (
        <ChooseTeamPlan
          redirectPath={props.redirectPath}
          teamSlug={props.teamSlug}
          skipPlan={async () => {
            props.onSkipPlan();
          }}
          redirectToCheckout={props.redirectToCheckout}
        />
      )}
    </TeamOnboardingLayout>
  );
}
