import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import type { Team } from "@/api/team/get-team";
import { FileInput } from "@/components/blocks/FileInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  maxTeamNameLength,
  maxTeamSlugLength,
  teamNameSchema,
  teamSlugSchema,
} from "../../../(app)/team/[team_slug]/(team)/~/settings/general/common";

type TeamData = {
  name?: string;
  slug?: string;
  image?: File;
};

const formSchema = z.object({
  image: z.instanceof(File).optional(),
  name: teamNameSchema,
  slug: teamSlugSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function TeamInfoFormUI(props: {
  updateTeam: (data: TeamData) => Promise<Team>;
  onComplete: (updatedTeam: Team) => void;
  isTeamSlugAvailable: (slug: string) => Promise<boolean>;
  teamSlug: string;
  client: ThirdwebClient;
}) {
  const form = useForm<FormValues>({
    defaultValues: {
      image: undefined,
      name: "",
      slug: "",
    },
    resolver: zodResolver(formSchema),
  });

  const [disableSlugSuggestion, setDisableSlugSuggestion] = useState(false);
  const name = form.watch("name");
  const slug = form.watch("slug");
  const [debouncedSlug] = useDebounce(slug, 500);
  const [debouncedName] = useDebounce(name, 500);

  const { data: suggestedSlug, isFetching: isCalculatingSlug } = useQuery({
    enabled: !!debouncedName && !disableSlugSuggestion,
    queryFn: async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const computedSlug = computeSlug(name, attempt);
        if (teamSlugSchema.safeParse(computedSlug).error) {
          return null;
        }
        const isAvailable = await props.isTeamSlugAvailable(computedSlug);

        if (isAvailable) {
          return computedSlug;
        }
      }

      return null;
    },
    queryKey: ["suggest-team-slug", debouncedName],
    retry: false,
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (suggestedSlug && !disableSlugSuggestion) {
      form.setValue("slug", suggestedSlug, {
        shouldValidate: true,
      });
    }
  }, [suggestedSlug, form, disableSlugSuggestion]);

  const shouldValidateSlug =
    !!debouncedSlug &&
    !form.getFieldState("slug").invalid &&
    debouncedSlug !== props.teamSlug &&
    suggestedSlug !== debouncedSlug;

  const { data: isSlugAvailable, isFetching: isCheckingSlug } = useQuery({
    enabled: shouldValidateSlug,
    queryFn: () => {
      return props.isTeamSlugAvailable(debouncedSlug);
    },
    queryKey: ["checkTeamSlug", debouncedSlug],
    retry: false,
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (isSlugAvailable === undefined) {
      return;
    }
    if (!isSlugAvailable) {
      form.setError("slug", {
        message: "This URL is already taken",
        type: "manual",
      });
    } else {
      const isValidSlugError = form.formState.errors.slug?.type === "manual";
      if (isValidSlugError) {
        form.clearErrors("slug");
      }
    }
  }, [isSlugAvailable, form]);

  const submit = useMutation({
    mutationFn: props.updateTeam,
  });

  async function onSubmit(values: FormValues) {
    submit.mutate(values, {
      onError(error) {
        console.error(error);
        toast.error("Failed to submit team details");
      },
      onSuccess(updatedTeam) {
        props.onComplete(updatedTeam);
      },
    });
  }

  return (
    <div className="rounded-lg border bg-card ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 p-4 lg:p-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange } }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Team Avatar</FormLabel>
                  <FormDescription>
                    Enhance your team profile by adding a custom avatar
                  </FormDescription>
                  <FormMessage />
                  <div className="h-3" />
                  <FormControl>
                    <FileInput
                      accept={{ "image/*": [] }}
                      className="w-28 rounded-full bg-background"
                      client={props.client}
                      disableHelperText
                      setValue={(file) => onChange(file)}
                      value={value}
                    />
                  </FormControl>
                  <div className="h-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Team Name
                    <span className="ml-1 text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Company Inc."
                      {...field}
                      maxLength={maxTeamNameLength}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your team's name on thirdweb
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Team URL
                    <span className="ml-1 text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex rounded-lg border border-border">
                      <div className="flex items-center self-stretch rounded-l-lg border-border border-r bg-card px-3 font-mono text-muted-foreground/80 text-sm">
                        thirdweb.com/team/
                      </div>
                      <Input
                        {...field}
                        className="truncate border-0 font-mono"
                        maxLength={maxTeamSlugLength}
                        onChange={(e) => {
                          setDisableSlugSuggestion(true);
                          field.onChange(e);
                        }}
                        placeholder="my-team"
                      />
                      {(isCheckingSlug || isCalculatingSlug) && (
                        <div className="-translate-y-1/2 fade-in-0 absolute top-1/2 right-3 duration-300">
                          <Spinner className="size-4" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is your team's URL namespace on thirdweb
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end border-t p-4 lg:px-6">
            <Button className="gap-2" size="sm" type="submit">
              Continue
              {submit.isPending ? (
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

const computeSlug = (name: string, attempt: number) => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
};
