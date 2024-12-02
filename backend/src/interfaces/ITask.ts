import IBase from "./IBase";
import IUser from "./IUser";

export enum ETaskStatus {
  "PENDING" = "pending",
  "ONGOING" = "ongoing",
  "COMPLETED" = "completed",
}

export enum ETaskPriority {
  "HIGH" = "high",
  "MEDIUM" = "medium",
  "LOW" = "low",
}

export default interface ITask extends IBase {
  name: string;
  description?: string;
  task_id: number;
  status: ETaskStatus;
  priority: ETaskPriority;
  due?: string;
  user: IUser;
}
