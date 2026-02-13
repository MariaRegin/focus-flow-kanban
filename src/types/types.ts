export type Status = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  status: Status;
  created_at: string;
}
