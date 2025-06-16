"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormLabel } from "tw-components";
import { z } from "zod";
import { useCreateAgent } from "../../hooks/agents/useCreateAgent";

const CreateAgentForm = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  prompt: z.string().min(3),
});

export function CreateAgentPage({ authToken }: { authToken: string }) {
  const form = useForm<z.infer<typeof CreateAgentForm>>({
    resolver: zodResolver(CreateAgentForm),
  });

  const { mutateAsync: createAgent, isPending } = useCreateAgent({ authToken });

  const handleCreate = async (data: z.infer<typeof CreateAgentForm>) => {
    const { error } = await createAgent({
      name: data.name,
      description: data.description,
      prompts: [
        {
          role: "system",
          content: data.prompt,
        },
      ],
    });
    if (!error) {
      toast.success("Agent created successfully");
    } else {
      toast.error("Failed to create agent");
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full flex-col overflow-y-auto"
        onSubmit={form.handleSubmit(handleCreate)}
      >
        {/* Header */}
        <div className="w-full border-b px-8 py-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/agents"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold text-xl">Create Agent</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                Create
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full flex-1">
          <div className="h-full w-full pt-4">
            <div className="grid w-full grid-cols-1 gap-8 px-8 pb-8 lg:grid-cols-2">
              {/* Left Column */}
              <div className="w-full space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter agent name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what your agent does"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full space-y-6">
                {/* Prompt */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your default system prompt"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
