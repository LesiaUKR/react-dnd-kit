import './App.css';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Column } from './components/Column/Column';
import { Input } from './components/Input/Input';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Add tests to homepage' },
    { id: 2, title: 'Fix styling in about section' },
    { id: 3, title: 'Learn how to center a div' },
  ]);

  //створимо нову таску
  const addTask = (title) => {
    setTasks((tasks) => [...tasks, { id: tasks.length + 1, title }]);
  };

  //визначаємо індекс Таски, яку тягнемо
  const getTaskPos = (id) => tasks.findIndex((task) => task.id === id);

  //переміщає таску,яку тягнемо (active) на місце таски, на яку наводимо(over)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    //якщо id таски, яку тягнемо співпадає із id таски, на котру хочемо перемістити
    //то нічого не робимо
    if (active.id === over.id) return;
    //визначаємо на місце якої таски ми перетягуємо таску і змінюємо
    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      //оновлюємо позиції всіх тасок на основі оригінальної(originalPos) і нової позиції(newPos) таски
      return arrayMove(tasks, originalPos, newPos);
    });
  };
  //використаємо sensors, щоб dnd працював від клавіатури\мишки\тач
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <div className="App">
      <h1>My Tasks ✅</h1>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <Input onSubmit={addTask} />
        <Column tasks={tasks} />
      </DndContext>
    </div>
  );
}
