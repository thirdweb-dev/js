import type { Team } from "@/api/team";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  CheckIcon,
  Globe,
  StoreIcon,
  UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const teamTypes = [
  {
    icon: UserIcon,
    label: "Developer",
    description: "I am building an app or game",
  },
  {
    icon: StoreIcon,
    label: "Studio",
    description: "I am building multiple apps or games",
  },
  {
    icon: Globe,
    label: "Ecosystem",
    description: "I am building a platform",
  },
] as const;

const teamScales = ["Startup", "Scaleup", "Enterprise"] as const;

const teamIndustries = [
  "Consumer",
  "DeFi",
  "Gaming",
  "Social",
  "AI",
  "Blockchain",
] as const;

const teamPlatformInterests = [
  "Connect",
  "Engine",
  "Contracts",
  "RPC",
  "Insight",
  "Nebula",
] as const;

const teamRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Smart Contract Engineer",
  "Founder",
  "Product Manager",
  "Business Development",
  "Finance",
] as const;

const productInterests = [
  "Connect",
  "Engine",
  "Contracts",
  "RPC",
  "Insight",
  "Nebula",
] as const;

const teamPlatforms = ["Web", "Backend", "Mobile", "Unity", "Unreal"] as const;

type TeamType = (typeof teamTypes)[number]["label"];

const teamFormSchema = z.object({
  team: z.object({
    name: z.string().min(1, "Team name is required"),
    type: z.enum(teamTypes.map((x) => x.label) as [TeamType, ...TeamType[]]),
    scale: z.enum(teamScales),
    industry: z.enum(teamIndustries),
    platforms: z.array(z.enum(teamPlatforms)),
    productInterests: z.array(z.enum(teamPlatformInterests)),
    chainInterests: z.array(z.number()),
  }),
  member: z.object({
    role: z.enum(teamRoles),
  }),
});

export type TeamOnboardingData = z.infer<typeof teamFormSchema>;

export function TeamInfoOnboarding(props: {
  onComplete: (params: {
    team: Team;
    account: Account;
  }) => void;
  sendTeamOnboardingData: (data: TeamOnboardingData) => Promise<void>;
}) {
  const sendTeamOnboardingData = useMutation({
    mutationFn: props.sendTeamOnboardingData,
  });

  const form = useForm<TeamOnboardingData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      team: {
        productInterests: [],
        platforms: [],
        chainInterests: [],
      },
    },
  });

  const onSubmit = (data: TeamOnboardingData) => {
    sendTeamOnboardingData.mutate(data);
  };

  // conditional fields ----
  const shouldShowPlatforms = form
    .watch("team.productInterests")
    .includes("Connect");

  const showShowChainInterests =
    form.watch("team.type") === "Developer" ||
    form.watch("team.type") === "Studio";

  // ensure that hidden fields have empty values
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!shouldShowPlatforms) {
      form.setValue("team.platforms", []);
    }
    if (!showShowChainInterests) {
      form.setValue("team.chainInterests", []);
    }
  }, [shouldShowPlatforms, showShowChainInterests, form]);

  return (
    <div>
      {/* Title + desc */}
      <div className="mb-7">
        <h2 className="font-semibold text-2xl tracking-tight">
          Tell us about your team
        </h2>
        <p className="text-muted-foreground text-sm">
          This will help us personalize your experience
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Team Name */}
          <FormField
            control={form.control}
            name="team.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your team name?</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-card" placeholder="My Team" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Team Type */}
          <FormField
            control={form.control}
            name="team.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your team type?</FormLabel>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {teamTypes.map((teamType) => (
                    <div
                      key={teamType.label}
                      className={cn(
                        "relative rounded-md border bg-card p-0 hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background",
                        field.value === teamType.label &&
                          "border-foreground/40",
                      )}
                    >
                      {field.value === teamType.label && (
                        <div className="absolute top-4 right-4 text-foreground">
                          <CheckIcon className="size-4" />
                        </div>
                      )}

                      <label className="flex w-full cursor-pointer flex-col px-3 py-4">
                        <input
                          type="radio"
                          className="sr-only"
                          checked={field.value === teamType.label}
                          onChange={() => field.onChange(teamType.label)}
                        />

                        <div className="mb-3 flex size-8 items-center justify-center rounded-full border p-0.5">
                          <teamType.icon className="size-4 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold tracking-tight">
                          {teamType.label}
                        </h3>
                        <p className="text-muted-foreground text-sm lg:text-xs">
                          {teamType.description}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Team Scale */}
          <FormField
            control={form.control}
            name="team.scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is the size of your team?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamScales.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Team Industry */}
          <FormField
            control={form.control}
            name="team.industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What industry is your company in?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Interests */}
          <FormField
            control={form.control}
            name="team.productInterests"
            render={() => (
              <FormItem>
                <FormLabel>What thirdweb products made you sign up?</FormLabel>

                <CheckboxCard>
                  {productInterests.map((product) => (
                    <FormField
                      key={product}
                      control={form.control}
                      name="team.productInterests"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2.5">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(product)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, product]
                                  : field.value?.filter(
                                      (value) => value !== product,
                                    );
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">{product}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </CheckboxCard>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Platforms */}
          {shouldShowPlatforms && (
            <FormField
              control={form.control}
              name="team.platforms"
              render={() => (
                <FormItem>
                  <FormLabel>What platforms do you use?</FormLabel>
                  <CheckboxCard>
                    {teamPlatforms.map((platform) => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name="team.platforms"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2.5">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, platform]
                                    : field.value?.filter(
                                        (value) => value !== platform,
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">{platform}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </CheckboxCard>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Chain Interests */}
          {showShowChainInterests && (
            <FormField
              control={form.control}
              name="team.chainInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Which chains are you interested in building on?
                  </FormLabel>
                  <FormControl>
                    <MultiNetworkSelector
                      selectedChainIds={field.value}
                      onChange={field.onChange}
                      disableChainId
                      className="bg-card"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Member Role */}
          <FormField
            control={form.control}
            name="member.role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your role in the team?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="min-w-32 gap-2"
              disabled={sendTeamOnboardingData.isPending}
            >
              Continue
              {sendTeamOnboardingData.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <ArrowRightIcon className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function CheckboxCard(props: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-card px-3 py-3">
      <div className="grid max-w-[420px] grid-cols-2 gap-4 lg:grid-cols-3">
        {props.children}
      </div>
    </div>
  );
}
