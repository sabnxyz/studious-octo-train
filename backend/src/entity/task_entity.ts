import { Entity, Column, ManyToOne } from "typeorm";
import ITask, { ETaskPriority, ETaskStatus } from "../interfaces/ITask";
import CommonFieldsEntity from "./common_fields_entity";
import UserEntity from "./user_entity";

@Entity({ name: "tasks" })
export default class TaskEntity extends CommonFieldsEntity implements ITask {
  @Column({ type: "integer" })
  task_id: number;

  @Column({ type: "text" })
  name: string;

  @Column({
    type: "enum",
    enum: ETaskStatus,
    default: "pending",
  })
  status: ETaskStatus;

  @Column({
    type: "enum",
    enum: ETaskPriority,
    default: "low",
  })
  priority: ETaskPriority;

  @Column({ type: "varchar", nullable: true, length: 255 })
  due: string;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;

  @Column({ type: "text", nullable: true })
  description: string;
}
