"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeftIcon,
  PlayIcon,
  PauseIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Dummy data for scheduled tasks
const scheduledTasks = [
  {
    id: 1,
    title: "Buy UNI",
    prompt: "Buy 0.01 ETH of UNI every day",
    interval: "6.75h",
    agent: "Trader",
    status: "active",
  },
  {
    id: 2,
    title: "Market Analysis",
    prompt: "Analyze market trends and send daily report",
    interval: "24h",
    agent: "Research",
    status: "paused",
  },
  {
    id: 3,
    title: "Portfolio Rebalance",
    prompt: "Rebalance portfolio based on risk parameters",
    interval: "7d",
    agent: "Trader",
    status: "active",
  },
];

// Dummy data for task templates
const taskTemplates = [
  {
    id: 1,
    name: "DCA Token",
    description: "Agent Trader",
    category: "trading",
  },
  {
    id: 2,
    name: "Sell at Target",
    description: "Agent Trader",
    category: "trading",
  },
  {
    id: 3,
    name: "Daily Research Report",
    description: "Agent Deep Research",
    category: "research",
  },
  {
    id: 4,
    name: "Copy Trader",
    description: "Agent Copycat",
    category: "trading",
  },
];

// Dummy execution history data
const getTaskExecutionHistory = (taskId: number) => [
  {
    id: 1,
    executedAt: "2025-01-26T10:30:00Z",
    status: "success",
    duration: "2.3s",
    result: `Task ${taskId}: Purchased 0.01 ETH of UNI at $12.45`,
  },
  {
    id: 2,
    executedAt: "2025-01-26T03:45:00Z",
    status: "success",
    duration: "1.8s",
    result: `Task ${taskId}: Purchased 0.01 ETH of UNI at $12.12`,
  },
  {
    id: 3,
    executedAt: "2025-01-25T20:15:00Z",
    status: "failed",
    duration: "0.5s",
    result: `Task ${taskId}: Insufficient balance for transaction`,
  },
  {
    id: 4,
    executedAt: "2025-01-25T13:30:00Z",
    status: "success",
    duration: "2.1s",
    result: `Task ${taskId}: Purchased 0.01 ETH of UNI at $11.98`,
  },
];

const getTaskStats = (taskId: number) => ({
  totalExecutions: 47 + taskId, // Vary stats based on taskId
  successfulExecutions: 44 + taskId,
  failedExecutions: 3,
  createdAt: "2025-01-15T09:00:00Z",
  lastExecuted: "2025-01-26T10:30:00Z",
  nextExecution: "2025-01-26T17:15:00Z",
});

export function NebulaTasksPage() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    prompt: "",
    interval: "",
    agent: "",
  });

  const handleCreateTask = () => {
    // TODO: Implement task creation/editing when API is available
    if (editingTask) {
      toast.success("Task updated successfully");
    } else {
      toast.success("Task created successfully");
    }
    setShowCreateTask(false);
    setEditingTask(null);
    setNewTask({ title: "", prompt: "", interval: "", agent: "" });
  };

  const handleResetTask = () => {
    setShowCreateTask(false);
    setEditingTask(null);
    setNewTask({ title: "", prompt: "", interval: "", agent: "" });
  };

  const handleTaskAction = (action: string, taskId: number) => {
    if (action === "edited") {
      const task = scheduledTasks.find((t) => t.id === taskId);
      if (task) {
        setNewTask({
          title: task.title,
          prompt: task.prompt,
          interval: task.interval.replace(/[^\d]/g, ""), // Extract just the number
          agent: task.agent.toLowerCase(),
        });
        setEditingTask(taskId);
        setShowCreateTask(true);
      }
    } else {
      // TODO: Implement other task actions when API is available
      toast.success(`Task ${taskId} ${action} successfully`);
    }
  };

  const handleTemplateSelect = (template: (typeof taskTemplates)[0]) => {
    // TODO: Implement template selection when API is available
    toast.info(`Selected template: ${template.name}`);
  };

  if (showCreateTask) {
    return (
      <div className="flex h-full flex-col overflow-y-auto w-full">
        {/* Header */}
        <div className="border-b px-8 py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={handleResetTask}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-semibold text-xl">
                  {editingTask ? "Edit Task" : "Create Task"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {editingTask
                    ? "Modify your recurring task settings and view execution history"
                    : "Create a recurring task for agent to execute as often as every fifteen minutes"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleResetTask}>
                {editingTask ? "Cancel" : "Reset"}
              </Button>
              <Button onClick={handleCreateTask}>
                {editingTask ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="flex-1 w-full">
          <div className="w-full h-full px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Description of the task for humans"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={newTask.prompt}
                    onChange={(e) =>
                      setNewTask({ ...newTask, prompt: e.target.value })
                    }
                    placeholder="Instructions for the agent when executing the task"
                    className="min-h-[150px]"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="interval">Interval</Label>
                  <Input
                    id="interval"
                    value={newTask.interval}
                    onChange={(e) =>
                      setNewTask({ ...newTask, interval: e.target.value })
                    }
                    placeholder="The task will execute every ___ minutes"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Select an Agent</Label>
                  <Select
                    value={newTask.agent}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, agent: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Click to select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trader">Trader</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="copycat">Copycat</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The selected agent executes the task
                  </p>
                </div>
              </div>
            </div>

            {/* Execution History and Stats - Only show when editing */}
            {editingTask && (
              <div className="mt-8 space-y-6">
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Task Statistics
                  </h3>

                  {(() => {
                    const stats = getTaskStats(editingTask);
                    return (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            {stats.totalExecutions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Executions
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            {stats.successfulExecutions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Successful
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-red-600">
                            {stats.failedExecutions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Failed
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold">
                            {Math.round(
                              (stats.successfulExecutions /
                                stats.totalExecutions) *
                                100
                            )}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Success Rate
                          </div>
                        </Card>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {new Date(
                        getTaskStats(editingTask).createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Last Executed:
                      </span>{" "}
                      {new Date(
                        getTaskStats(editingTask).lastExecuted
                      ).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Next Execution:
                      </span>{" "}
                      {new Date(
                        getTaskStats(editingTask).nextExecution
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Recent Execution History
                  </h3>
                  <Card>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">
                              Executed At
                            </TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[100px]">
                              Duration
                            </TableHead>
                            <TableHead>Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getTaskExecutionHistory(editingTask).map(
                            (execution) => (
                              <TableRow key={execution.id}>
                                <TableCell>
                                  {new Date(
                                    execution.executedAt
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      execution.status === "success"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {execution.status}
                                  </span>
                                </TableCell>
                                <TableCell>{execution.duration}</TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                  {execution.result}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-xl">Autonomous Tasks</h1>
              <p className="text-sm text-muted-foreground">
                Create recurring tasks for agents to execute automatically on
                your schedule
              </p>
            </div>
          </div>

          <Button onClick={() => setShowCreateTask(true)}>Create Task</Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Scheduled Tasks */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Scheduled</h3>

                <Card>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px] min-w-[150px]">
                            Title
                          </TableHead>
                          <TableHead className="min-w-[200px]">
                            Prompt
                          </TableHead>
                          <TableHead className="w-[100px] min-w-[100px]">
                            Interval
                          </TableHead>
                          <TableHead className="w-[150px] min-w-[150px]">
                            Agent
                          </TableHead>
                          <TableHead className="w-[140px] min-w-[140px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">
                              {task.title}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {task.prompt}
                            </TableCell>
                            <TableCell>{task.interval}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                  {task.agent[0]}
                                </div>
                                {task.agent}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleTaskAction(
                                      task.status === "active"
                                        ? "paused"
                                        : "resumed",
                                      task.id
                                    )
                                  }
                                >
                                  {task.status === "active" ? (
                                    <PauseIcon className="h-4 w-4" />
                                  ) : (
                                    <PlayIcon className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleTaskAction("edited", task.id)
                                  }
                                >
                                  <EditIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleTaskAction("deleted", task.id)
                                  }
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Column - Templates */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Start with a Template
                </h3>

                <div className="space-y-3">
                  {taskTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
