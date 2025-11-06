"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoItem, Todo } from "@/components/todo-item";
import { TodoForm } from "@/components/todo-form";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <Card className="w-full max-w-2xl min-w-[500px]">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TodoForm onAddTodo={handleAddTodo} />
        <div className="space-y-1">
          {todos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No todos yet. Add one above to get started!
            </p>
          ) : (
            todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

