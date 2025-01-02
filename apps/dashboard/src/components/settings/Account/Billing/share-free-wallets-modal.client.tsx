"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DynamicHeight } from "../../../../@/components/ui/DynamicHeight";
import { XIcon } from "../../../icons/brand-icons/XIcon";

export function ShareFreeWalletsModal(props: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [screen, setScreen] = useState<"base" | "email">("base");

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="z-[10001] p-0 md:max-w-[380px]"
        dialogOverlayClassName="z-[10000]"
      >
        <DynamicHeight>
          {screen === "base" && (
            <div className="fade-in-0 animate-in duration-300">
              <DialogHeader className="p-6 text-center">
                <div className="mb-4 flex justify-center gap-2">
                  <VibrantSmileIcon className="size-16" />
                </div>
                <DialogTitle className="mb-1 text-lg">
                  Congratulations!
                </DialogTitle>
                <DialogDescription className="text-balance text-base text-muted-foreground">
                  You are getting free wallets for the next 12 months
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 border-border border-t p-6">
                <Button variant="outline" className="gap-2" asChild>
                  <TrackedLinkTW
                    href={`https://x.com/intent/post?text=${encodeURIComponent(twitterPostBody)}`}
                    target="_blank"
                    category="share-free-wallets"
                    label="twitter-share"
                  >
                    <XIcon className="size-4" />
                    Share on X
                  </TrackedLinkTW>
                </Button>
                <Button
                  variant="primary"
                  className="gap-2"
                  onClick={() => setScreen("email")}
                >
                  <MailIcon className="size-4 shrink-0" />
                  Share via Email
                </Button>
              </div>
            </div>
          )}

          {screen === "email" && (
            <SendEmailScreen goBack={() => setScreen("base")} />
          )}
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}

const emailFormSchema = z.object({
  email: z.string().email(),
  app: z.string(),
});

function SendEmailScreen(props: {
  goBack: () => void;
}) {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      app: "default",
    },
  });

  return (
    <div className="fade-in-0 animate-in duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <div className="p-6">
            <DialogHeader className="text-center">
              <div className="mb-4 flex justify-center gap-2">
                <VibrantEmailIcon className="size-16" />
              </div>
              <DialogTitle className="mb-1 text-lg">
                Share via Email
              </DialogTitle>
              <DialogDescription className="text-balance text-base text-muted-foreground">
                Give the gift of unlimited wallets to another dev
              </DialogDescription>
            </DialogHeader>

            <div className="h-4" />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="h-4" />

            <FormField
              control={form.control}
              name="app"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Share with</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => form.setValue("app", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Email App" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectGroup>
                          <SelectItem value="default">
                            Default Email App
                          </SelectItem>
                          <SelectItem value="gmail">Gmail</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-3 border-border border-t p-6">
            <Button variant="outline" className="gap-2" onClick={props.goBack}>
              <ChevronLeftIcon className="size-4" />
              Back
            </Button>

            {!form.formState.isValid ? (
              <Button variant="primary" className="gap-2" type="submit">
                <MailIcon className="size-4 shrink-0" />
                Share via Email
              </Button>
            ) : (
              <Button variant="primary" className="gap-2" asChild>
                <TrackedLinkTW
                  href={
                    form.watch("app") === "gmail"
                      ? openGmailEmailApp(form.watch("email"))
                      : openDefaultEmailApp(form.watch("email"))
                  }
                  target="_blank"
                  category="share-free-wallets"
                  label="email-share"
                >
                  <MailIcon className="size-4 shrink-0" />
                  Share via Email
                </TrackedLinkTW>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function openDefaultEmailApp(email: string) {
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailPostBody)}`;
}

function openGmailEmailApp(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailPostBody)}`;
}

const twitterPostBody = `\
Just claimed the free, unlimited wallets offer from @thirdweb!  🚀

No more per-wallet pricing, full support for web, mobile, and console.

Here's to building without constraints ✨

👉 https://thirdweb.com/unlimited-wallets 👈`;

const emailSubject = "You've unlocked Unlimited Wallets!";

const emailPostBody = `\
Hey there,

I just came across something that might interest you. thirdweb is offering free, unlimited wallets for developers.
I've claimed it and thought you might want to take a look too.

Here's the lowdown:
* It's completely free
* No more per-wallet pricing constraints
* Full support for web, mobile, and console development

I'm pretty excited about the possibilities this opens up for building without limitations. You can check it out here: https://thirdweb.com/unlimited-wallets

Let me know what you think if you decide to give it a try!`;

function VibrantSmileIcon(props: {
  className?: string;
}) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      role="presentation"
    >
      <path
        d="M1 32C1 14.8792 14.8792 1 32 1C49.1208 1 63 14.8792 63 32C63 49.1208 49.1208 63 32 63C14.8792 63 1 49.1208 1 32Z"
        fill="url(#paint0_linear_754_5630)"
        fillOpacity="0.08"
      />
      <path
        d="M1 32C1 14.8792 14.8792 1 32 1C49.1208 1 63 14.8792 63 32C63 49.1208 49.1208 63 32 63C14.8792 63 1 49.1208 1 32Z"
        stroke="url(#paint1_linear_754_5630)"
        strokeWidth="2"
      />
      <path
        d="M26.2857 34.8567C26.2857 34.8567 28.4286 37.7139 32 37.7139C35.5714 37.7139 37.7143 34.8567 37.7143 34.8567M36.2857 27.7139H36.3M27.7143 27.7139H27.7286M46.2857 31.9996C46.2857 39.8894 39.8898 46.2853 32 46.2853C24.1102 46.2853 17.7143 39.8894 17.7143 31.9996C17.7143 24.1098 24.1102 17.7139 32 17.7139C39.8898 17.7139 46.2857 24.1098 46.2857 31.9996ZM37 27.7139C37 28.1084 36.6802 28.4282 36.2857 28.4282C35.8912 28.4282 35.5714 28.1084 35.5714 27.7139C35.5714 27.3194 35.8912 26.9996 36.2857 26.9996C36.6802 26.9996 37 27.3194 37 27.7139ZM28.4286 27.7139C28.4286 28.1084 28.1088 28.4282 27.7143 28.4282C27.3198 28.4282 27 28.1084 27 27.7139C27 27.3194 27.3198 26.9996 27.7143 26.9996C28.1088 26.9996 28.4286 27.3194 28.4286 27.7139Z"
        stroke="url(#paint2_linear_754_5630)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_754_5630"
          x1="-4.34726"
          y1="20.5361"
          x2="61.0409"
          y2="66.8729"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_754_5630"
          x1="-4.34726"
          y1="20.5361"
          x2="61.0409"
          y2="66.8729"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_754_5630"
          x1="15.7735"
          y1="26.8818"
          x2="44.9647"
          y2="47.5678"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function VibrantEmailIcon(props: {
  className?: string;
}) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      role="presentation"
    >
      <path
        d="M1 32C1 14.8792 14.8792 1 32 1C49.1208 1 63 14.8792 63 32C63 49.1208 49.1208 63 32 63C14.8792 63 1 49.1208 1 32Z"
        fill="url(#paint0_linear_754_9605)"
        fillOpacity="0.08"
      />
      <path
        d="M1 32C1 14.8792 14.8792 1 32 1C49.1208 1 63 14.8792 63 32C63 49.1208 49.1208 63 32 63C14.8792 63 1 49.1208 1 32Z"
        stroke="url(#paint1_linear_754_9605)"
        strokeWidth="2"
      />
      <path
        d="M17.7144 24.857L29.3785 33.0219C30.3231 33.6831 30.7953 34.0137 31.309 34.1417C31.7628 34.2548 32.2374 34.2548 32.6911 34.1417C33.2048 34.0137 33.6771 33.6831 34.6216 33.0219L46.2858 24.857M24.5715 43.4284H39.4286C41.8289 43.4284 43.029 43.4284 43.9457 42.9613C44.7522 42.5504 45.4078 41.8948 45.8187 41.0884C46.2858 40.1716 46.2858 38.9715 46.2858 36.5713V27.4284C46.2858 25.0282 46.2858 23.8281 45.8187 22.9113C45.4078 22.1049 44.7522 21.4493 43.9457 21.0384C43.029 20.5713 41.8289 20.5713 39.4286 20.5713H24.5715C22.1713 20.5713 20.9712 20.5713 20.0544 21.0384C19.248 21.4493 18.5924 22.1049 18.1815 22.9113C17.7144 23.8281 17.7144 25.0282 17.7144 27.4284V36.5713C17.7144 38.9715 17.7144 40.1716 18.1815 41.0884C18.5924 41.8948 19.248 42.5504 20.0544 42.9613C20.9712 43.4284 22.1713 43.4284 24.5715 43.4284Z"
        stroke="url(#paint2_linear_754_9605)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_754_9605"
          x1="-4.34726"
          y1="20.5361"
          x2="61.0409"
          y2="66.8729"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_754_9605"
          x1="-4.34726"
          y1="20.5361"
          x2="61.0409"
          y2="66.8729"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_754_9605"
          x1="15.7736"
          y1="27.9056"
          x2="40.3444"
          y2="49.6705"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
