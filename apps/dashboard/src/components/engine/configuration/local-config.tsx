export const LocalConfig: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Local wallets are natively supported with no configuration required.
        Wallets are stored encrypted in Engine's database.
      </p>
    </div>
  );
};
