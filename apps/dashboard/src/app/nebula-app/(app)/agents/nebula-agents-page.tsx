"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SearchIcon,
  PlusIcon,
  ChevronLeftIcon,
  TrendingUpIcon,
  BrainCircuitIcon,
  CodeIcon,
  BarChartIcon,
  GraduationCapIcon,
  PaletteIcon,
  RocketIcon,
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
            <Link
              href="/agents/my-agents"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              My Agents
            </Link>
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
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <BrainCircuitIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-semibold">Agents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover and create custom versions of Nebula that combine
              instructions, extra knowledge, and any combination of skills.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Agents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
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
              <h3 className="font-semibold text-lg mb-1">Featured</h3>
              <p className="text-sm text-muted-foreground">
                Curated top picks from this week
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
                      {agent.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">Agent {agent.id}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {agent.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
              <h3 className="font-semibold text-lg mb-1">Trending</h3>
              <p className="text-sm text-muted-foreground">
                Most popular Agents by our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-muted-foreground w-8">
                    {agent.rank}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
                    {agent.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm">{agent.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {agent.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
