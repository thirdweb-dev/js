"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import { useState } from "react";

type IdentityReadScope = {
  id: "identity:read";
  type: "toggle";
  name: string;
  description: string;
  mandatory: true;
  initialState: true;
};

// type ContractWriteScope = {
//   id: "contracts:write";
//   type: "list";
//   name: string;
//   description: string;
//   mandatory: boolean;
//   initialState: string[];
// };

type AllContractsWriteScope = {
  id: "contracts:write";
  type: "toggle";
  name: string;
  description: string;
  mandatory: true;
  initialState: true;
};

type NativeSpend = {
  id: "native:spend";
  type: "number";
  name: string;
  description: string;
  mandatory: boolean;
  initialState: number;
  min?: number;
  max?: number;
  step?: number;
};

type ExpirationScope = {
  id: "expiration";
  type: "date";
  name: string;
  description: string;
  mandatory: boolean;
  initialState: Date;
};

export type Permission =
  | IdentityReadScope
  // | ContractWriteScope
  | AllContractsWriteScope
  | NativeSpend
  | ExpirationScope;

export type PermissionState = {
  "contracts:write": string[] | boolean;
  "identity:read": boolean;
  "native:spend"?: number;
  expiration?: Date;
};

export function PermissionCard(props: {
  name: string;
  permissions: Permission[];
  onAccept: (permissions: PermissionState) => void;
  onDeny: () => void;
}) {
  const [permissions, setPermissions] = useState<PermissionState>(() => {
    const initialState = {} as PermissionState;
    for (const perm of props.permissions) {
      if (perm.type === "toggle") {
        initialState[perm.id] = perm.mandatory;
      } else if (perm.type === "number") {
        initialState[perm.id] = perm.initialState || 0;
      } else if (perm.type === "date") {
        initialState[perm.id] = perm.initialState;
      }
    }
    return initialState;
  });

  const handleNumberInputPermission = (id: string, value: string) => {
    setPermissions((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleDateInputPermission = (id: string, value: string) => {
    setPermissions((prev) => ({ ...prev, [id]: new Date(value) }));
  };

  const mandatoryPermissions = props.permissions.filter((p) => p.mandatory);
  const editablePermissions = props.permissions.filter((p) => !p.mandatory);

  const renderPermission = (permission: Permission) => (
    <div
      key={permission.id}
      className="flex items-center justify-between space-x-4 py-2"
    >
      <div className="flex items-center space-x-2">
        {permission.mandatory && (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Label
              htmlFor={permission.id}
              className="cursor-help font-medium text-sm leading-none"
            >
              {permission.name}
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permission.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {!permission.mandatory && (
        <div className="flex items-center space-x-2">
          {permission.type === "number" && (
            <Input
              id={permission.id}
              type="number"
              value={permissions[permission.id] as number}
              onChange={(e) =>
                handleNumberInputPermission(permission.id, e.target.value)
              }
              min={permission.min}
              max={permission.max}
              step={permission.step}
              className="w-[100px]"
            />
          )}
          {permission.type === "date" && (
            <Input
              id={permission.id}
              type="date"
              value={
                (permissions[permission.id] as Date).toISOString().split("T")[0]
              }
              onChange={(e) =>
                handleDateInputPermission(permission.id, e.target.value)
              }
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>App Permissions</CardTitle>
          <CardDescription>
            Review and manage the permissions requested by{" "}
            <strong>{props.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold text-lg">Requried Permissions</h3>
            {mandatoryPermissions.map(renderPermission)}
          </div>
          {editablePermissions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold text-lg">
                  Configurable Permissions
                </h3>
                {editablePermissions.map(renderPermission)}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={props.onDeny}>
            Deny All
          </Button>
          <Button onClick={() => props.onAccept(permissions)}>Accept</Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
