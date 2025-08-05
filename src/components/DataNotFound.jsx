import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DataNotFound({ title, message }) {
  return (
    <div className="flex justify-center items-center">
      <Alert className={"w-[80%]"}>
        <AlertTitle className={"capitalize"}>
          {title ?? "Success! Your changes have been saved"}
        </AlertTitle>
        {message == '' ?? (
          <AlertDescription className={"capitalize mt-2"}>
            {message}
          </AlertDescription>
        )}
      </Alert>
    </div>
  );
}
