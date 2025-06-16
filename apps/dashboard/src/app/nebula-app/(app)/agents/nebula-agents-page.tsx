"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChartIcon,
  BrainCircuitIcon,
  ChevronLeftIcon,
  CodeIcon,
  GraduationCapIcon,
  PaletteIcon,
  PlusIcon,
  RocketIcon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Dummy data for agents
const featuredAgents = [
  {
    id: 1,
    name: "Research Assistant",
    description:
      "Do hours worth of research, analyze papers & extract insights in minutes",
    creator: "agent.com",
    icon: "📚",
  },
  {
    id: 2,
    name: "Math Tutor",
    description: "Access computation, math, curated knowledge & real-time data",
    creator: "agent.com",
    icon: "🧮",
  },
  {
    id: 3,
    name: "Video Generator",
    description:
      "AI video maker powered by VideoAgent. Generate and edit videos",
    creator: "agent.com",
    icon: "🎬",
  },
  {
    id: 4,
    name: "Code Assistant",
    description: "Effortlessly design anything: media posts and more",
    creator: "agent.com",
    icon: "💻",
  },
];

const trendingAgents = [
  {
    id: 1,
    name: "Agent Name",
    description: "Expert astrologer Agent. Predicts Futures from your prompts.",
    creator: "agent.com",
    icon: "🔮",
    rank: 1,
  },
  {
    id: 2,
    name: "Agent Name",
    description: "Enhance research with deeper insights & discovery.",
    creator: "agent.com",
    icon: "🔬",
    rank: 2,
  },
  {
    id: 3,
    name: "Agent Name",
    description: "IMPROVE QUICKLY with an efficient study companion.",
    creator: "agent.com",
    icon: "📖",
    rank: 3,
  },
  {
    id: 4,
    name: "Humanize AI",
    description: "Agent Name",
    creator: "agent.com",
    icon: "🤖",
    rank: 4,
  },
];

const categories = [
  { name: "Top Picks", icon: TrendingUpIcon },
  { name: "Trading", icon: BarChartIcon },
  { name: "Productivity", icon: RocketIcon },
  { name: "Research & Analysis", icon: SearchIcon },
  { name: "Education", icon: GraduationCapIcon },
  { name: "Art", icon: PaletteIcon },
  { name: "Programming", icon: CodeIcon },
];

export function NebulaAgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Top Picks");

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="font-semibold text-xl">Agents</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="default" asChild>
              <Link href="/agents/create">Create</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <BrainCircuitIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <h2 className="font-semibold text-3xl">Agents</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Discover and create custom versions of Nebula that combine
              instructions, extra knowledge, and any combination of skills.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Agents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "secondary" : "ghost"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
            <Button variant="ghost" size="sm">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Featured Section */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 font-semibold text-lg">Featured</h3>
              <p className="text-muted-foreground text-sm">
                Curated top picks from this week
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {featuredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer p-5 transition-shadow hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-2xl">
                      {agent.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">Agent {agent.id}</h4>
                      <p className="line-clamp-2 text-muted-foreground text-sm">
                        {agent.description}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        By {agent.creator}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 font-semibold text-lg">Trending</h3>
              <p className="text-muted-foreground text-sm">
                Most popular Agents by our community
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {trendingAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors hover:bg-accent"
                >
                  <div className="w-8 font-bold text-2xl text-muted-foreground">
                    {agent.rank}
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-2xl">
                    {agent.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm">{agent.name}</h4>
                    <p className="line-clamp-1 text-muted-foreground text-xs">
                      {agent.description}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      By {agent.creator}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
