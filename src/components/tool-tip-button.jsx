'use client';

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ToolTipButton({
  className = "",
  onClick = () => {},
  disabled = false,
  children,
  tooltip,
  side = 'top',
  variant = 'default',
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          variant={variant}
          disabled={disabled}
          className={`cursor-pointer capitalize ${className}`}
        >
          {children || 'children is empty'}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="capitalize"  side={side}>
        {tooltip || 'tooltip is empty'}
      </TooltipContent>
    </Tooltip>
  );
}
