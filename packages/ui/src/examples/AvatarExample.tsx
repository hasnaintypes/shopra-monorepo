import React from 'react';
import { Avatar } from '../components/ui/avatar.js';

export function AvatarExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Avatar Examples</h2>
      
      <div className="flex flex-wrap gap-4">
        <Avatar>
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium">JD</span>
          </div>
        </Avatar>
        
        <Avatar>
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-primary-foreground">AB</span>
          </div>
        </Avatar>
        
        <Avatar>
          <img 
            src="https://github.com/shadcn.png" 
            alt="@shadcn"
            className="aspect-square h-full w-full"
          />
        </Avatar>
      </div>
    </div>
  );
}