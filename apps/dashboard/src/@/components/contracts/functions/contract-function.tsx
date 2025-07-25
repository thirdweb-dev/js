"use client";

import type { AbiEvent, AbiFunction } from "abitype";
import { SearchIcon } from "lucide-react";
import {
  type Dispatch,
  lazy,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { toFunctionSelector } from "thirdweb/utils";
import { useDebounce } from "use-debounce";
import {
  type CodeEnvironment,
  CodeSegment,
} from "@/components/blocks/code/code-segment.client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabButtons } from "@/components/ui/tabs";
import { useContractFunctionSelectors } from "@/hooks/contract-ui/useContractFunctionSelectors";
import { cn } from "@/lib/utils";
import { COMMANDS, formatSnippet } from "../code-overview";
import { InteractiveAbiFunction } from "./interactive-abi-function";

const ContractFunctionComment = lazy(
  () => import("./contract-function-comment"),
);
interface ContractFunctionProps {
  fn: AbiFunction | AbiEvent;
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const ContractFunction: React.FC<{
  fn: AbiFunction | AbiEvent;
  contract?: ThirdwebContract;
  isLoggedIn: boolean;
}> = ({ fn, contract, isLoggedIn }) => {
  if (!contract) {
    return <ContractFunctionInputs fn={fn} />;
  }

  return (
    <ContractFunctionInner
      contract={contract}
      fn={fn}
      isLoggedIn={isLoggedIn}
    />
  );
};

function ContractFunctionInner(props: ContractFunctionProps) {
  const { contract, fn } = props;
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");
  const functionSelectorQuery = useContractFunctionSelectors(contract);
  const functionSelectors = functionSelectorQuery.data || [];
  const isERC721Query = useReadContract(ERC721Ext.isERC721, { contract });
  const isERC1155Query = useReadContract(ERC1155Ext.isERC1155, { contract });
  const isERC20 = useMemo(
    () => ERC20Ext.isERC20(functionSelectors),
    [functionSelectors],
  );

  const extensionNamespace = useMemo(() => {
    if (isERC20) {
      return "erc20";
    }
    if (isERC721Query.data) {
      return "erc721";
    }
    if (isERC1155Query.data) {
      return "erc1155";
    }
    return undefined;
  }, [isERC20, isERC721Query.data, isERC1155Query.data]);

  const functionSelector = useMemo(
    () => (fn?.type === "function" ? toFunctionSelector(fn) : undefined),
    [fn],
  );

  if (!fn) {
    return null;
  }

  const isFunction = "stateMutability" in fn;

  const isRead =
    isFunction &&
    (fn.stateMutability === "view" || fn.stateMutability === "pure");

  const commandsKey = isFunction
    ? isRead
      ? "read"
      : "write"
    : ("events" as const);

  const codeSnippet = formatSnippet(COMMANDS[commandsKey], {
    args: fn.inputs?.map((i) => i.name || ""),
    chainId: contract.chain.id,
    contractAddress: contract.address,
    extensionNamespace,
    fn,
  });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center flex-wrap gap-2 border-b pb-3 mb-3">
        <h3 className="text-lg font-semibold">{fn.name}</h3>
        {isFunction && <Badge variant="success">{fn.stateMutability}</Badge>}
        {functionSelector && (
          <CopyTextButton
            className="ml-auto text-xs font-mono py-1"
            copyIconPosition="right"
            textToCopy={functionSelector}
            textToShow={functionSelector}
            tooltip="The selector of this function"
          />
        )}
      </div>

      {isFunction && (
        <InteractiveAbiFunction
          abiFunction={fn}
          contract={contract}
          isLoggedIn={props.isLoggedIn}
          key={JSON.stringify(fn)}
        />
      )}

      {codeSnippet && (
        <div>
          <h3 className="text-base font-semibold mt-6 mb-3">
            Use this function in your app
          </h3>
          <CodeSegment
            environment={environment}
            setEnvironment={setEnvironment}
            snippet={codeSnippet}
            codeContainerClassName="bg-background"
          />
        </div>
      )}
      <ContractFunctionComment contract={contract} functionName={fn.name} />
    </div>
  );
}

function ContractFunctionInputs(props: { fn: AbiFunction | AbiEvent }) {
  const { fn } = props;
  const isFunction = "stateMutability" in fn;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center flex-wrap gap-2 border-b pb-3 mb-3">
        <h3 className="text-lg font-semibold">{fn.name}</h3>
        {isFunction && <Badge variant="success">{fn.stateMutability}</Badge>}
      </div>

      {fn.inputs?.length ? (
        <div>
          <h4 className="text-base font-semibold mb-3">Inputs</h4>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fn.inputs.map((input, idx) => (
                  <TableRow key={`${input.name}+${idx}}`}>
                    <TableCell className="font-medium py-3">
                      {input?.name ? (
                        <span className="font-mono">{input.name}</span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          No name defined
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-mono">{input.type}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : null}
    </div>
  );
}

interface ContractFunctionsPanelProps {
  fnsOrEvents: (AbiFunction | AbiEvent)[];
  contract?: ThirdwebContract;
  isLoggedIn: boolean;
}

type ExtensionFunctions = {
  extension: string;
  functions: AbiFunction[];
};

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  fnsOrEvents,
  contract,
  isLoggedIn,
}) => {
  // TODO: clean this up

  const functionsWithExtension = useMemo(() => {
    const allFunctions = fnsOrEvents.filter((f) => f.type === "function");
    const results: ExtensionFunctions[] = [];
    results.push({
      extension: "",
      functions: allFunctions,
    });
    return results;
  }, [fnsOrEvents]);

  const writeFunctions: ExtensionFunctions[] = useMemo(() => {
    return functionsWithExtension
      .map((e) => {
        const filteredFunctions = e.functions.filter(
          (fn) =>
            fn.stateMutability !== "pure" && fn.stateMutability !== "view",
        );
        if (filteredFunctions.length === 0) {
          return undefined;
        }
        return {
          extension: e.extension,
          functions: filteredFunctions,
        };
      })
      .filter((e) => e !== undefined) as ExtensionFunctions[];
  }, [functionsWithExtension]);

  const viewFunctions: ExtensionFunctions[] = useMemo(() => {
    return functionsWithExtension
      .map((e) => {
        const filteredFunctions = e.functions.filter(
          (fn) =>
            (fn as AbiFunction).stateMutability === "pure" ||
            (fn as AbiFunction).stateMutability === "view",
        );
        if (filteredFunctions.length === 0) {
          return undefined;
        }
        return {
          extension: e.extension,
          functions: filteredFunctions,
        };
      })
      .filter((e) => e !== undefined) as ExtensionFunctions[];
  }, [functionsWithExtension]);

  const events = useMemo(() => {
    return fnsOrEvents.filter((fn) => !("stateMutability" in fn)) as AbiEvent[];
  }, [fnsOrEvents]);

  const [selectedFunction, setSelectedFunction] = useState<
    AbiFunction | AbiEvent | undefined
  >(fnsOrEvents[0]);

  const [_keywordSearch, setKeywordSearch] = useState<string>("");
  const [keywordSearch] = useDebounce(_keywordSearch, 150);

  const [activeTab, setActiveTab] = useState<number>(0);

  const functionSection = (e: ExtensionFunctions) => {
    const filteredFunctions = keywordSearch
      ? e.functions.filter((o) =>
          o.name.toLowerCase().includes(keywordSearch.toLowerCase()),
        )
      : e.functions;

    return (
      <div key={e.extension} className="pb-6">
        <div className="flex flex-col gap-0.5">
          {selectedFunction &&
            filteredFunctions.map((fn) => (
              <FunctionsOrEventsListItem
                fn={fn}
                key={`${fn.name}_${fn.type}_${fn.inputs.length}`}
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
              />
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 h-full">
      {/* left */}
      <div className="bg-card rounded-lg border overflow-auto">
        {(writeFunctions.length > 0 || viewFunctions.length > 0) && (
          <div className="flex flex-col h-full relative">
            <TabButtons
              tabContainerClassName="px-3 pt-2"
              tabClassName="!text-sm"
              tabs={[
                ...(writeFunctions.length > 0
                  ? [
                      {
                        name: "Write",
                        onClick: () => setActiveTab(0),
                        isActive: activeTab === 0,
                      },
                    ]
                  : []),
                ...(viewFunctions.length > 0
                  ? [
                      {
                        name: "Read",
                        onClick: () => setActiveTab(1),
                        isActive: activeTab === 1,
                      },
                    ]
                  : []),
              ]}
            />

            <div className="sticky top-0 z-[1]">
              <div className="relative w-full">
                <SearchIcon className="-translate-y-1/2 absolute top-[50%] left-3 size-4 text-muted-foreground" />
                <Input
                  className="h-auto rounded-none border-x-0 border-t-0 bg-card py-3 pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onChange={(e) => setKeywordSearch(e.target.value)}
                  placeholder="Search"
                  value={_keywordSearch}
                />
              </div>
            </div>

            <div className="h-auto overflow-auto pt-2 px-2">
              {activeTab === 0 &&
                writeFunctions.length > 0 &&
                writeFunctions.map((e) => functionSection(e))}

              {activeTab === 1 &&
                viewFunctions.length > 0 &&
                viewFunctions.map((e) => functionSection(e))}
            </div>
          </div>
        )}
        {events.length > 0 && selectedFunction && (
          <div className="pt-2 px-4">
            {events.map((fn) => (
              <FunctionsOrEventsListItem
                fn={fn}
                key={`${fn.name}_${fn.type}_${fn.inputs.length}`}
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
              />
            ))}
          </div>
        )}
      </div>

      {/* right */}
      <div className="bg-card rounded-lg border p-4 overflow-auto">
        {selectedFunction && (
          <ContractFunction
            contract={contract}
            fn={selectedFunction}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
};

interface FunctionsOrEventsListItemProps {
  fn: AbiFunction | AbiEvent;
  selectedFunction: AbiFunction | AbiEvent;
  setSelectedFunction: Dispatch<
    SetStateAction<AbiFunction | AbiEvent | undefined>
  >;
}

const FunctionsOrEventsListItem: React.FC<FunctionsOrEventsListItemProps> = ({
  fn,
  selectedFunction,
  setSelectedFunction,
}) => {
  const isActive =
    selectedFunction?.name === fn.name &&
    selectedFunction.inputs?.length === fn.inputs?.length;
  return (
    <Button
      className={cn(
        "text-muted-foreground hover:text-foreground font-mono w-full justify-start h-auto px-2 py-1",
        isActive && "text-foreground bg-accent",
      )}
      onClick={() => {
        setSelectedFunction(fn);
      }}
      size="sm"
      variant="ghost"
    >
      {fn.name}
    </Button>
  );
};
