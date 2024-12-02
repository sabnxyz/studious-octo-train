import IBase from "./IBase";
import ITask from "./ITask";

export default interface IUser extends IBase {
  name: string;
  email: string;
  profile_image: string;
  github_id: string;
  tasks?: ITask[];
  tasks_count?: number;
}
