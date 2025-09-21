import React from 'react';

import { cn } from './utils.js';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn('text-sm font-medium text-gray-900', className)} {...props} />;
}
