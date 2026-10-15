import * as React from "react";

import { Button } from "./button";

type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "aria-label"> & { "aria-label": string };

export function IconButton({ "aria-label": ariaLabel, ...props }: IconButtonProps) {
  return <Button aria-label={ariaLabel} size="icon" {...props} />;
}
