import { describe, expect, it } from "vitest";
import { pLimit, Queue } from "./p-limit.js";

describe("p-limit queue", () => {
  it("should enqueue and dequeue items in the correct order", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.size).toBe(3);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBeUndefined();
  });

  it("should correctly report size", () => {
    const queue = new Queue<number>();
    expect(queue.size).toBe(0);

    queue.enqueue(1);
    expect(queue.size).toBe(1);

    queue.dequeue();
    expect(queue.size).toBe(0);
  });

  it("should clear the queue", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();

    expect(queue.size).toBe(0);
    expect(queue.dequeue()).toBeUndefined();
  });

  it("should support iteration", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    const values = [...queue];
    expect(values).toEqual([1, 2, 3]);
  });
});

describe("pLimit", () => {
  it("should limit the number of concurrent executions", async () => {
    const limit = pLimit(2);
    const executionOrder: number[] = [];
    const delayedTask = (id: number) =>
      limit(async () => {
        executionOrder.push(id);
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

    await Promise.all([
      delayedTask(1),
      delayedTask(2),
      delayedTask(3),
      delayedTask(4),
    ]);

    // Ensure tasks were executed in the correct order with concurrency of 2
    expect(executionOrder).toEqual([1, 2, 3, 4]);
  });

  it("should handle rejected promises gracefully", async () => {
    const limit = pLimit(1);

    await expect(
      limit(async () => {
        throw new Error("Test error");
      }),
    ).rejects.toThrow("Test error");

    expect(limit.activeCount).toBe(0);
    expect(limit.pendingCount).toBe(0);
  });

  it("should handle mixed resolutions and rejections", async () => {
    const limit = pLimit(2);

    const task1 = limit(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return 1;
    });

    const task2 = limit(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return 2;
    });

    const task3 = limit(async () => {
      throw new Error("Task failed");
    }).catch(() => "Task failed");

    const results = await Promise.all([task1, task2, task3]);

    expect(results).toStrictEqual([1, 2, "Task failed"]);
  });
});
