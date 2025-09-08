import React from 'react';
import { Button } from '../components/ui/button.js';

export function ButtonExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Button Examples</h2>
      
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button size="default">Default Size</Button>
        <Button size="sm">Small Size</Button>
        <Button size="lg">Large Size</Button>
        <Button size="icon">🔍</Button>
      </div>
    </div>
  );
}