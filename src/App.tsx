import React, { useState } from 'react';
import { Circle, CheckCircle, PlusCircle, Trash2, GripVertical } from 'lucide-react';
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

import Logo from '../src/assets/Logo.svg';

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

  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="w-full bg-black h-[12.5rem] flex items-center justify-center -mb-16">
        <img src={Logo} alt="Logo" className="w-36 mx-20" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl -mt-16">
        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Adicione uma nova tarefa"
              className="flex-1 px-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-[#1E6F9F] text-white rounded-lg hover:bg-opacity-[0.5] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-stretch-center"
            >
              Criar
              <PlusCircle  className='ml-1'/>
            </button>
          </div>
        </form>

        <div className="flex justify-between mb-4 text-lg">
          <span className="text-white text-[#4EA8DE] flex justify-left">Tarefas Criadas:  <span className='text-gray-100 bg-[#333333] pl-2 pr-2 rounded-full ml-2'>{totalTasks}</span></span>
          <span className="text-[#8284FA]">Concluidas: <span className='bg-[#333333] text-[#D9D9D9] pl-2 pr-2 rounded-full ' >{totalTasks} de {completedTasks}</span></span>
        </div>

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
                  className={`   ${
                    todo.completed ? 'bg-red' : ''
                  }`}
                >
                  <div className={` bg-[#262626] rounded-md ${
                          todo.completed
                            ? 'flex items-center justify-between p-4 group transition-colors '
                            : 'flex items-center justify-between p-4 group '
                        }`}
                            >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`p-1 rounded transition-colors ${
                          todo.completed ? 'text-green-500' : 'text-gray-400'
                        }`}
                      >
                        {todo.completed ? (
                          <CheckCircle className="w-5 h-5 text-[#16aa02] bg-[#292a52] border-[#5E60CE] rounded-full " />
                        ) : (
                          <Circle className="w-5 h-5 text-[#4EA8DE]" />
                        )}
                      </button>
                      <span
                        className={`${
                          todo.completed
                            ? 'line-through text-[#808080]'
                            : 'text-[#F2F2F2]'
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