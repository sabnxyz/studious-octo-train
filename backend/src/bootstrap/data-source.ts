import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import Entities from "../entity";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url:
    process.env.NODE_ENV === "development"
      ? process.env.POSTGRES_CONNECTION_STRING_DEV
      : process.env.POSTGRES_CONNECTION_STRING,
  synchronize: true,
  logging: false,
  entities: [...Object.values(Entities)],
  extra: {
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 5000, // Return an error after 2 seconds if connection could not be established
  },
  useUTC: true,
};
export const AppDataSource = new DataSource(dataSourceOptions);

const connectDatabase = async (retries = 5): Promise<DataSource | null> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await AppDataSource.initialize();

      await response.query(`SET TIME ZONE 'UTC';`);
      console.log("Database connection established successfully.");
      return response;
    } catch (error: any) {
      console.error(
        `Attempt ${i + 1} - Error in database connection: ${error.message}`
      );
      if (i < retries - 1) {
        console.log("Retrying connection...");
        await new Promise((res) => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
      } else {
        console.error("All connection attempts failed.");
      }
    }
  }
  return null;
};

export { connectDatabase };
