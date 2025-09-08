import React from 'react';
import { Badge, BadgeProps } from '../components/ui/badge.js';

export function BadgeExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Badge Examples</h2>
      
      <div className="flex flex-wrap gap-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    </div>
  );
}