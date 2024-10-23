"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox, Radio, RadioGroup } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import { Users2 } from "lucide-react";
import { Building } from "lucide-react";
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

interface RadioCardType {
  register: UseFormRegister<FormData>;
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  className: string;
}

function RadioCard({
  register,
  value,
  label,
  description,
  icon,
  className,
}: RadioCardType) {
  return (
    <Radio
      className={className}
      key={value}
      value={value}
      {...register("userType")}
    >
      {icon}
      <h5 className="font-semibold text-lg tracking-tight">{label}</h5>
      <p className="font-regular text-sm tracking-tight">{description}</p>
    </Radio>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      interests: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  const nextStep = async () => {
    const fields =
      step === 1
        ? ["email"]
        : step === 2
          ? ["userType", "name", "role", "industry"]
          : ["interests"];
    const isStepValid = await trigger(fields as Array<keyof FormData>);
    if (isStepValid) setStep(step + 1);
  };

  const Step1: React.FC<StepProps> = ({ register, errors }) => (
    <div>
      <FormControl className="flex flex-col space-y-2">
        <FormLabel>What's your email?</FormLabel>
        <Input
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
        <RadioGroup>
          <RadioCard
            className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center data-[state=checked]:border-blue"
            value="developer"
            label="Developer"
            description="I am building an application or game"
            register={register}
            icon={<Users2 className="size-8" />}
          />
          <RadioCard
            className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center data-[state=checked]:border-blue"
            value="studio"
            label="Studio"
            description="I am building multiple applications or games"
            register={register}
            icon={<Building className="size-8" />}
          />
        </RadioGroup>

        <FormErrorMessage>
          {errors.userType && <span>{errors.userType.message}</span>}
        </FormErrorMessage>
      </FormControl>
      {/* Name */}
      <FormControl className="flex flex-col space-y-2">
        <FormLabel>What's the name of your company?</FormLabel>
        <Input
          id="name"
          type="text"
          placeholder="Hooli, Inc."
          {...register("name")}
        />
      </FormControl>
      <FormControl className="flex flex-col space-y-2">
        <FormLabel>What's your role?</FormLabel>
        <Select {...register("role")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"Select Role"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={"founder"} value={"founder"}>
                Founder
              </SelectItem>
              <SelectItem key={"product"} value={"product"}>
                Product
              </SelectItem>
              <SelectItem key={"developer"} value={"developer"}>
                Developer
              </SelectItem>
              <SelectItem key={"biz-dev"} value={"biz-dev"}>
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
        <Select {...register("industry")}>
          <SelectTrigger className="w-[180px]">
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

  const Step3: React.FC<StepProps> = ({ register }) => (
    <div className="flex flex-col space-y-4">
      <FormControl>
        <div className="grid w-full grid-cols-3 items-center justify-center gap-1">
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="SOCIAL_LOGIN"
              value="SOCIAL_LOGIN"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Social Login
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="WALLET_CONECTORS"
              value="WALLET_CONECTORS"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Wallet Connectors
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="SPONSOR_TRANSACTIONS"
              value="SPONSOR_TRANSACTIONS"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Sponsor Transactions
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="UNIFIED_IDENTITY"
              value="UNIFIED_IDENTITY"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Unified Identity
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="CUSTOM_AUTH"
              value="CUSTOM_AUTH"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Custom Auth
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="QUERY_BLOCKCHAIN_DATA"
              value="QUERY_BLOCKCHAIN_DATA"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Query Blockchain Data
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="AUTO_TXN_MGMT"
              value="AUTO_TXN_MGMT"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Automated Transaction Management
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="GAMING_TOOLS"
              value="GAMING_TOOLS"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Gaming Tools
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="TOKEN_SWAPS"
              value="TOKEN_SWAPS"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Token Swaps
              </h5>
            </Checkbox>
          </Card>
          <Card className="flex h-40 w-40 flex-col items-center justify-center space-y-2 text-center">
            <Checkbox
              key="FIAT_ONRAMPS"
              value="FIAT_ONRAMPS"
              {...register("interests")}
            >
              <h5 className="font-semibold text-lg tracking-tight">
                Fiat Onramps
              </h5>
            </Checkbox>
          </Card>
        </div>
      </FormControl>
    </div>
  );

  return (
    <div className="relative flex h-screen place-items-center bg-muted/30 md:flex-row">
      <main className="z-10 flex w-full gap-6">
        {/* Left Panel */}
        <div className="items-between relative flex h-screen w-1/2 flex-col p-12">
          <div className="flex flex-col space-y-2">
            <h1 className="font-semibold text-xl tracking-tight">
              {step === 3 ? "Tell us what you need." : "Tell us about you."}
            </h1>
            <h3 className="font-regular text-muted-foreground text-sm tracking-tight">
              This will help us personalize your experience.
            </h3>
          </div>
          <form className="my-8">
            {step === 1 && <Step1 register={register} errors={errors} />}
            {step === 2 && <Step2 register={register} errors={errors} />}
            {step === 3 && <Step3 register={register} errors={errors} />}
          </form>
          <div className="absolute bottom-12 box-border flex w-full items-center justify-between">
            {/* Stepper */}
            <div className="flex space-x-4">
              <div
                className={
                  step === 1
                    ? "h-3 w-12 rounded-md bg-white transition ease-in-out"
                    : "h-3 w-12 rounded-md bg-secondary transition ease-in-out"
                }
              />
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
                  onClick={() => setStep(step - 1)}
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
        </div>
        <div className="h-screen w-1/2 bg-gradient-to-r from-purple-500 to-pink-500" />
      </main>
    </div>
  );
}
