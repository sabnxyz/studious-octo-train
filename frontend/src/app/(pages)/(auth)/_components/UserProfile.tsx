"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-user";
import { Hourglass, LogOut, Zap } from "lucide-react";

export const UserProfile = () => {
  const { data: user } = useUser();

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-start gap-2 justify-start">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.profile_image} />
          <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <div className="flex items-center gap-1 font-semibold border-yellow-400 border bg-yellow-400/60 text-yellow-900 text-xs py-0.5 px-1 rounded">
            <Hourglass size={12} />
            <p>Free Trial</p>
          </div>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => {
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                  "_self"
                );
              }}
            >
              <LogOut size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Logout</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
