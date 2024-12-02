import { IUser } from "../interfaces";
import { Entity, Column, OneToMany } from "typeorm";
import CommonFieldsEntity from "./common_fields_entity";
import TaskEntity from "./task_entity";
import ITask from "../interfaces/ITask";

@Entity({ name: "users" })
export default class UserEntity extends CommonFieldsEntity implements IUser {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  profile_image: string;

  @Column({ type: "varchar", length: 255 })
  github_id: string;

  @Column({ type: "integer", default: 0 })
  tasks_count: number;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: ITask[];
}
