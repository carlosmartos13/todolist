import React, { useState } from 'react';
import { CheckSquare, ClipboardList, Trash2, GripVertical }from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './components/SortableItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="flex items-center justify-center mb-8">
          <ClipboardList className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
        </header>

        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {todos.map((todo) => (
                <SortableItem
                  key={todo.id}
                  id={todo.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-100 ${
                    todo.completed ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className={`${
                          todo.completed
                            ? 'flex items-center justify-between p-4 group transition-colors bg-gray-100 '
                            : 'flex items-center justify-between p-4 group'
                        }`}
                            >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                          todo.completed ? 'text-green-500' : 'text-gray-400'
                        }`}
                      >
                        <CheckSquare className="w-5 h-5" />
                      </button>
                      <span
                        className={`${
                          todo.completed
                            ? 'line-through text-gray-'
                            : 'text-gray-700'
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default App;