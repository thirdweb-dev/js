"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { motion } from "framer-motion";
import { Users2 } from "lucide-react";
import { Building } from "lucide-react";
import React from "react";
import { useState } from "react";
import {
  type FieldErrors,
  type SubmitHandler,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";

interface FormData {
  email: string;
  userType: string;
  name: string;
  role: string;
  industry: string;
  interests: string[];
}

interface StepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

// Displays the radio item as a button-like element
const RadioGroupItemButton = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group flex min-w-32 cursor-pointer items-center space-x-3 space-y-0 rounded-md border-2 px-3 py-4 font-medium transition-all hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-hover:border-nonce data-[state=checked]:border-inverted",
        className,
      )}
      {...props}
    >
      <Label className="cursor-pointer">{props.children}</Label>
    </RadioGroupPrimitive.Item>
  );
});

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      interests: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  const watchInterests = watch("interests");

  const Footer: React.FC = () => {
    return (
      <div className="absolute right-0 bottom-0 left-0 box-border flex w-full items-center justify-between overflow-auto p-12">
        {/* Stepper */}
        <div className="flex space-x-4">
          {/* <div
          className={
            step === 1
              ? "h-3 w-12 rounded-md bg-white transition ease-in-out"
              : "h-3 w-12 rounded-md bg-secondary transition ease-in-out"
          }
        /> */}
          <div
            className={
              step === 2
                ? "h-3 w-12 rounded-md bg-white transition ease-in-out"
                : "h-3 w-12 rounded-md bg-secondary transition ease-in-out"
            }
          />
          <div
            className={
              step === 3
                ? "h-3 w-12 rounded-md bg-white transition ease-in-out"
                : "h-3 w-12 rounded-md bg-secondary transition ease-in-out"
            }
          />
        </div>
        <div className="flex space-x-4">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDirection(-1);
                setStep(step - 1);
              }}
            >
              Back
            </Button>
          )}
          {step < 3 && (
            <Button type="button" variant="primary" onClick={nextStep}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    );
  };

  const nextStep = async () => {
    const fields =
      step === 1
        ? ["email"]
        : step === 2
          ? ["userType", "name", "role", "industry"]
          : ["interests"];
    const isStepValid = await trigger(fields as Array<keyof FormData>);
    if (isStepValid) {
      setDirection(1);
      setStep(step + 1);
      fields.map((field) => {
        register(field as keyof FormData);
      });
    }
  };

  const Step1: React.FC<StepProps> = ({ register, errors }) => (
    <div>
      <FormControl className="box-border flex-col space-y-2">
        <FormLabel>What's your email?</FormLabel>
        <Input
          className="w-1/2"
          id="email"
          type="email"
          placeholder="user@example.com"
          {...register("email", { required: "Email is required" })}
        />
        <FormErrorMessage>
          {errors.email && <span>{errors.email.message}</span>}
        </FormErrorMessage>
      </FormControl>
    </div>
  );

  const Step2: React.FC<StepProps> = ({ register, errors }) => (
    <div className="flex flex-col space-y-8">
      {/* User Type */}
      <FormControl>
        <RadioGroup
          defaultValue={getValues("userType")}
          className="flex space-x-4"
          onValueChange={(value) => setValue("userType", value)}
        >
          <RadioGroupItemButton
            value="Developer"
            className="aspect-square max-w-[180px] rounded-xl border border-foreground/25 p-4 hover:border-foreground"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <Users2 className="size-8" />
              <h5 className="font-semibold text-white text-xl">Developer</h5>
              <p className="font-regular text-white leading-snug">
                I am building an application or game
              </p>
            </div>
          </RadioGroupItemButton>
          <RadioGroupItemButton
            value="Studio"
            className="aspect-square max-w-[180px] rounded-xl border border-foreground/25 p-4 hover:border-foreground"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <Building className="size-8" />
              <h5 className="font-semibold text-white text-xl">Studio</h5>
              <p className="font-regular text-white leading-snug">
                I am building multiple applications or games
              </p>
            </div>
          </RadioGroupItemButton>
        </RadioGroup>

        <FormErrorMessage>
          {errors.userType && <span>{errors.userType.message}</span>}
        </FormErrorMessage>
      </FormControl>
      {/* Name */}
      <FormControl className="flex flex-col space-y-2">
        <FormLabel>What's the name of your company?</FormLabel>
        <Input
          className="w-1/2"
          id="name"
          type="text"
          placeholder="Hooli, Inc."
          {...register("name")}
        />
      </FormControl>
      <FormControl className="flex flex-col space-y-2">
        <FormLabel>What's your role?</FormLabel>
        <Select
          defaultValue={getValues("role")}
          onValueChange={(value) => {
            setValue("role", value);
          }}
        >
          <SelectTrigger id="role" className="w-1/2">
            <SelectValue placeholder={"Select Role"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={"founder"} value={"Founder"}>
                Founder
              </SelectItem>
              <SelectItem key={"product"} value={"Product"}>
                Product
              </SelectItem>
              <SelectItem key={"developer"} value={"Developer"}>
                Developer
              </SelectItem>
              <SelectItem key={"biz-dev"} value={"Business Development"}>
                Business Development
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <FormErrorMessage>
          {errors.role && <span>{errors.role.message}</span>}
        </FormErrorMessage>
      </FormControl>
      <FormControl className="flex flex-col space-y-2">
        <FormLabel>What industry is your company in?</FormLabel>
        <Select
          defaultValue={getValues("industry")}
          onValueChange={(value) => {
            setValue("industry", value);
          }}
        >
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder={"Select Industry"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"consumer"} value={"consumer"}>
              Consumer
            </SelectItem>
            <SelectItem key={"defi"} value={"defi"}>
              DeFi
            </SelectItem>
            <SelectItem key={"gaming"} value={"gaming"}>
              Gaming
            </SelectItem>
            <SelectItem key={"social"} value={"social"}>
              Social
            </SelectItem>
          </SelectContent>
        </Select>

        <FormErrorMessage>
          {errors.industry && <span>{errors.industry.message}</span>}
        </FormErrorMessage>
      </FormControl>
    </div>
  );

  const interestValues = [
    {
      key: "SOCIAL_LOGIN",
      label: "Social Login",
      description:
        "Let users login to your app with Email, Phone, Telegram, and more",
    },
    {
      key: "WALLET_CONECTORS",
      label: "Wallet Connectors",
      description: "Allow users to connect to over 350 web3 wallets",
    },
    {
      key: "SPONSOR_TRANSACTIONS",
      label: "Sponsor Transactions",
      description:
        "Abstract away signatures & gas using Account Abstraction and set up sponsorship rules",
    },
    {
      key: "UNIFIED_IDENTITY",
      label: "Unified Identity",
      description:
        "Enable your users to link multiple onchain and offchain identities to a single ID",
    },
    {
      key: "CUSTOM_AUTH",
      label: "Custom Auth",
      description: "Authenticate with your backend using SIWE or JWT",
    },
    {
      key: "QUERY_BLOCKCHAIN_DATA",
      label: "Query Blockchain Data",
      description: "All your data are belong to us",
    },
    {
      key: "AUTO_TXN_MGMT",
      label: "Automated Transaction Management",
      description: "Scale transaction throughput with nonce management",
    },
    {
      key: "GAMING_TOOLS",
      label: "Gaming Tools",
      description: "Everything you need to build a game",
    },
    {
      key: "TOKEN_SWAPS",
      label: "Token Swaps",
      description:
        "Bridge to and from tokens on any EVM, directly in your application",
    },
    {
      key: "FIAT_ONRAMPS",
      label: "Fiat Onramps",
      description:
        "Allow users to purchase with a credit card within your application.",
    },
  ];

  const Step3: React.FC<StepProps> = ({ register }) => (
    <div className="flex max-h-[700px] flex-col space-y-4 overflow-scroll">
      <FormControl>
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
          {interestValues.map((interest) => {
            const checkedInterests = watchInterests || [];
            const isChecked = checkedInterests.includes(interest.key);

            return (
              <label
                key={interest.key}
                className="cursor-pointer"
                htmlFor={`interest-${interest.key}`}
              >
                <Card
                  className={cn(
                    "flex aspect-[4/2] flex-col items-start justify-start space-y-1 p-4 transition-colors hover:bg-muted md:aspect-[3/1] lg:aspect-[3/1] xl:aspect-[16/9]",
                    isChecked && "border-primary bg-muted",
                  )}
                >
                  <Checkbox
                    className="sr-only"
                    value={interest.key}
                    {...register("interests")}
                    id={`interest-${interest.key}`}
                  />
                  <h5 className="font-semibold text-lg tracking-tight">
                    {interest.label}
                  </h5>
                  <p className="font-regular text-foreground/75 text-sm tracking-tight">
                    {interest.description}
                  </p>
                </Card>
              </label>
            );
          })}
        </div>
      </FormControl>
    </div>
  );

  const variants = {
    enter: { opacity: 0, x: 200 * direction },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 * direction },
  };

  const transition = {
    type: "spring",
    bounce: 0,
    duration: 0.45,
  };

  return (
    <div className="relative flex h-screen place-items-center bg-muted/30 md:flex-row">
      <main className="z-10 flex w-full gap-6">
        {/* Left Panel */}
        <div className="items-between relative box-border flex h-screen w-1/2 flex-col overflow-hidden p-12">
          <div className="flex flex-col space-y-2">
            <h1 className="font-semibold text-xl tracking-tight">
              {step === 3 ? "Tell us what you need." : "Tell us about you."}
            </h1>
            <h3 className="font-regular text-muted-foreground text-sm tracking-tight">
              {step === 3
                ? "What are you looking to include in your project? Select as many as you want."
                : "This will help us personalize your experience."}
            </h3>
          </div>
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <form className="my-8">
              {step === 1 && <Step1 register={register} errors={errors} />}
              {step === 2 && <Step2 register={register} errors={errors} />}
              {step === 3 && <Step3 register={register} errors={errors} />}
            </form>
          </motion.div>
          <Footer />
        </div>
        {/* Right Panel */}
        <div className="flex h-screen w-1/2 animate-gradient-x flex-col items-center justify-center bg-gradient-to-r from-[#25369F] via-[#290259] to-[#3E0D45]">
          <Card className="flex w-[275px] items-center rounded-xl border-muted transition-all ">
            <CardContent className="flex items-center space-x-4 p-4">
              {getValues("userType") ? (
                getValues("userType") === "Developer" ? (
                  <Users2 className="size-8" />
                ) : (
                  <Building className="size-8" />
                )
              ) : null}
              <div className="flex flex-col">
                <h5 className="font-regular font-sm text-white">
                  {getValues("email") ?? "a1...b2"}
                </h5>

                <h5
                  className={`font-sm text-foreground/50 ${getValues("role") ? "" : "hidden"}`}
                >
                  {getValues("role")}
                </h5>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
