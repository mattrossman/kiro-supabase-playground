"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoItem, Todo } from "@/components/todo-item";
import { TodoForm } from "@/components/todo-form";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type TodoRow = Tables<"todos">;

interface TodoListProps {
  initialTodos: TodoRow[];
  userId?: string;
}

function mapTodoFromDb(todo: TodoRow): Todo {
  return {
    id: todo.id,
    text: todo.title,
    completed: todo.completed || false,
    priority: (todo.priority as "low" | "medium" | "high") || "low",
  };
}

export function TodoList({ initialTodos, userId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos.map(mapTodoFromDb));
  const supabase = createClient();
  const router = useRouter();

  const handleAddTodo = async (text: string, priority: "low" | "medium" | "high") => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("todos")
      .insert({ title: text, user_id: userId, priority })
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      setTodos([mapTodoFromDb(data), ...todos]);
      router.refresh();
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
    } else {
      setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
      router.refresh();
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
      router.refresh();
    }
  };

  const handlePriorityChange = async (id: string, priority: "low" | "medium" | "high") => {
    const { error } = await supabase
      .from("todos")
      .update({ priority })
      .eq("id", id);

    if (error) {
      console.error("Error updating priority:", error);
    } else {
      setTodos(todos.map((t) => (t.id === id ? { ...t, priority } : t)));
      router.refresh();
    }
  };

  if (!userId) {
    return (
      <Card className="w-full max-w-2xl min-w-[500px]">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Please sign in to view your todos
          </p>
        </CardContent>
      </Card>
    );
  }

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
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onPriorityChange={handlePriorityChange}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

