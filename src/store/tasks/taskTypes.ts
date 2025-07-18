export interface Task {
  id: string;
  title: string;
  description: string | null;
  createAt: string;
  dueDate: string | null;
  columnId: string | null;
  userId: string;
  order: number;
}
export interface TaskState {
  fetch: {
    loading: boolean;
    error: string | null;
  };

  create: {
    loading: boolean;
    error: string | null;
  };

  update: {
    loading: boolean;
    error: string | null;
  };

  delete: {
    loading: boolean;
    error: string | null;
  };
  ids: string[];
  entities: Record<string, Task>;
}

export interface CreateTaskPayload {
  title: string;
  description: string | null;
  dueDate: string | null;
  columnId: string | null;
  userId: string;
  order: number;
}

export interface UpdateTaskPayload {
  id: string;
  changes: Partial<Task>;
}
