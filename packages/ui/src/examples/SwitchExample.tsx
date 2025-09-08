import React from 'react';
import { Switch } from '../components/ui/switch.js';
import { Label } from '../components/ui/label.js';

export function SwitchExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Switch Examples</h2>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" className="data-[state=checked]:bg-blue-500" />
          <Label htmlFor="airplane-mode" className="text-blue-700 font-medium">Airplane Mode</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="wifi" className="data-[state=checked]:bg-green-500" />
          <Label htmlFor="wifi" className="text-green-700 font-medium">WiFi</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="notifications" className="data-[state=checked]:bg-purple-500" />
          <Label htmlFor="notifications" className="text-purple-700 font-medium">Notifications</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="dark-mode" className="data-[state=checked]:bg-amber-500" />
          <Label htmlFor="dark-mode" className="text-amber-700 font-medium">Dark Mode</Label>
        </div>
      </div>
    </div>
  );
}