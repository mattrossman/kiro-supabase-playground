"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: "low" | "medium" | "high") => void;
}

const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
};

export function TodoItem({ todo, onToggle, onDelete, onPriorityChange }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <span
        className={cn(
          "flex-1 text-sm",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.text}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Badge variant={priorityConfig[todo.priority].variant} className="cursor-pointer">
              {priorityConfig[todo.priority].label}
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onPriorityChange(todo.id, "low")}>
            Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPriorityChange(todo.id, "medium")}>
            Medium
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPriorityChange(todo.id, "high")}>
            High
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

