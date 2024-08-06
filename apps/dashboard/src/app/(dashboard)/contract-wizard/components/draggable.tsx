import { useDraggable } from '@dnd-kit/core';

export function Draggable({ children }: { children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
}


