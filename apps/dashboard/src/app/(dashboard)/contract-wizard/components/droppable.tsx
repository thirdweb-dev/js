import { useDroppable } from '@dnd-kit/core';

export function Droppable({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}
