import { AppDataSource } from "./data-source";

const connectDB = async () => {
  try {
    const response = await AppDataSource.initialize();

    console.log("Database connected");

    return response;
  } catch (error: any) {
    console.error(`Error in database connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
