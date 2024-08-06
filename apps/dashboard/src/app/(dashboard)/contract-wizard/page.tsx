'use client';

import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';

function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  return (
    <div ref={setNodeRef} className={`${isOver ? 'text-green-300' : ''} w-[250px] h-[100px] border-2 border-dashed border-white flex items-center justify-center`}>
      {props.children}
    </div>
  );
}

import { useDraggable } from '@dnd-kit/core';

function Draggable(props: any) {
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
      className='w-[100px] h-[50px] border-2 border-dashed border-white'
      {...listeners}
      {...attributes}
    >
      {props.children}
    </button>
  );
}

export default function Page() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = (
    <Draggable>Drag me</Draggable>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : null}
      <Droppable>
        {isDropped ? draggableMarkup : 'Drop here'}
      </Droppable>
    </DndContext>
  );

  function handleDragEnd(event) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }
}
