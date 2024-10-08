import { AnnouncementBanner } from "../../components/notices/AnnouncementBanner";

export function TeamsUIBanner() {
  return (
    <AnnouncementBanner
      label="You are exploring the new dashboard. Click here to go back to the legacy dashboard."
      href="/dashboard"
      trackingLabel="old-dashboard"
    />
  );
}

export function TryTeamsUIBanner() {
  return (
    <AnnouncementBanner
      label="Explore the new teams dashboard. Now in Beta."
      href="/team"
      trackingLabel="team-dashboard"
    />
  );
}
