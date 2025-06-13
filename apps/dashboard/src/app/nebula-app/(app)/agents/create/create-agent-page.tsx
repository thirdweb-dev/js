"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAgentPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [conversationStarters, setConversationStarters] = useState<string[]>([
    "",
  ]);
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([]);
  // const [capabilities, setCapabilities] = useState({
  //   trader: false,
  //   contractDeployment: false,
  //   codeInterpreter: false,
  // });

  const handleAddConversationStarter = () => {
    setConversationStarters([...conversationStarters, ""]);
  };

  const handleRemoveConversationStarter = (index: number) => {
    setConversationStarters(conversationStarters.filter((_, i) => i !== index));
  };

  const handleUpdateConversationStarter = (index: number, value: string) => {
    const updated = [...conversationStarters];
    updated[index] = value;
    setConversationStarters(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setKnowledgeFiles([...knowledgeFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setKnowledgeFiles(knowledgeFiles.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: Implement save functionality when API is available
    toast.success("Agent saved as draft");
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality when API is available
    toast.success("Agent published successfully");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
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
              <h1 className="text-xl font-semibold">Create Agent</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <Button variant="outline" onClick={handleSave}>
              Save
            </Button> */}
            <Button onClick={handlePublish}>Create</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex-1">
        <div className="w-full h-full pt-4">
          {/* <div className="flex justify-center py-8 w-full">
            <button className="relative w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground hover:border-foreground transition-colors group">
              <div className="flex items-center justify-center h-full">
                <PlusIcon className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={() =>
                  toast.info("Profile picture upload not implemented yet")
                }
              />
            </button>
          </div> */}

          <div className="w-full grid grid-cols-1 gap-8 px-8 pb-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="w-full space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter agent name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what your agent does"
                  className="min-h-[80px]"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="How should your agent behave? What should it do?"
                  className="min-h-[120px]"
                />
              </div>

              {/* Capabilities */}
              {/* <div className="space-y-2">
                <Label>Capabilities</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trader"
                      checked={capabilities.trader}
                      onCheckedChange={(checked) =>
                        setCapabilities({
                          ...capabilities,
                          trader: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="trader"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Trader
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contractDeployment"
                      checked={capabilities.contractDeployment}
                      onCheckedChange={(checked) =>
                        setCapabilities({
                          ...capabilities,
                          contractDeployment: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="contractDeployment"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Contract Deployment
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="codeInterpreter"
                      checked={capabilities.codeInterpreter}
                      onCheckedChange={(checked) =>
                        setCapabilities({
                          ...capabilities,
                          codeInterpreter: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="codeInterpreter"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-not-allowed"
                    >
                      Code Interpreter & Data Analysis
                    </label>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Right Column */}
            <div className="w-full space-y-6">
              {/* Conversation Starters */}
              <div className="space-y-2">
                <Label>Conversation starters</Label>
                <div className="space-y-2">
                  {conversationStarters.map((starter, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={starter}
                        onChange={(e) =>
                          handleUpdateConversationStarter(index, e.target.value)
                        }
                        placeholder="Enter a conversation starter"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveConversationStarter(index)}
                        disabled={conversationStarters.length === 1}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddConversationStarter}
                    className="w-full"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add conversation starter
                  </Button>
                </div>
              </div>

              {/* Knowledge */}
              <div className="space-y-2">
                <Label>Knowledge</Label>
                <div className="space-y-2">
                  {knowledgeFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="truncate text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      className="pointer-events-none w-full"
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
