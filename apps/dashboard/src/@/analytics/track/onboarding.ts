import { __internal__reportEvent } from "./__internal";

// ------------------
// Account onboarding
// ------------------

export function reportAccountEmailVerificationRequested(payload: {
  email: string;
}) {
  __internal__reportEvent("account email verification requested", {
    email: payload.email,
  });
}

export function reportAccountEmailVerified(payload: { email?: string }) {
  __internal__reportEvent(
    "account email verified",
    payload.email ? { email: payload.email } : null,
  );
}

export function reportAccountWalletLinkRequested(payload: { email: string }) {
  __internal__reportEvent("account wallet link requested", {
    email: payload.email,
  });
}

export function reportAccountWalletLinked() {
  __internal__reportEvent("account wallet linked", null);
}

// ------------------
// Team onboarding
// ------------------

export function reportTeamInviteMembersSent(payload: {
  inviteCount: number;
}) {
  __internal__reportEvent("team invite members sent", payload);
}

export function reportTeamInviteMembersSkipped() {
  __internal__reportEvent("team invite members skipped", null);
}

// ------------------
// Plan selection
// ------------------

export function reportPlanSelected(payload: { planSKU: string }) {
  __internal__reportEvent("plan selected", { planSKU: payload.planSKU });
}

export function reportPlanSelectSkipped() {
  __internal__reportEvent("plan select skipped", null);
}
