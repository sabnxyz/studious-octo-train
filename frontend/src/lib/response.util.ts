import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export const handleAxiosError = (err: AxiosError) => {
  console.log("status", JSON.stringify(err));
  if (err?.response?.data) {
    toast({
      title: "An error occurred.",
      description: (err.response.data as { message: string })?.message,
      variant: "destructive",
      duration: 3500,
    });

    return null;
  }

  if (err?.response?.status === 500) {
    toast({
      title: "An error occurred.",
      description: "Internal server error",
      variant: "destructive",
      duration: 3500,
    });

    return null;
  }

  toast({
    title: "An error occurred.",
    description:
      "Too many requests or unexpected error occured, please try again later.",
    variant: "destructive",
    duration: 3500,
  });

  return null;
};

export const handleError = (
  message: string,
  title: string = "An error occured"
) => {
  toast({
    title: title,
    description: message,
    variant: "destructive",
    duration: 3500,
  });
};

export const handleSuccess = (message: string) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
    duration: 3500,
  });

  return true;
};
