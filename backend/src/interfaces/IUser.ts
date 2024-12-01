import IBase from "./IBase";

export default interface IUser extends IBase {
  name: string;
  email: string;
  profileImage: string;
  githubId: string;
}
