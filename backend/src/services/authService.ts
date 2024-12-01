import { DataSource, Repository } from "typeorm";
import * as yup from "yup";
import UserEntity from "../entity/user_entity";

export default class AuthService {
  private userRepository: Repository<UserEntity>;

  constructor(private datasource: DataSource) {
    this.userRepository = this.datasource.getRepository("User");
  }
}
