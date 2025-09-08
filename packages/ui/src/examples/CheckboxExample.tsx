import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Checkbox Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border rounded-md bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-700">Terms and Conditions</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white" />
            <Label htmlFor="terms" className="text-blue-700">Accept terms and conditions</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white" />
            <Label htmlFor="marketing" className="text-blue-700">Receive marketing emails</Label>
          </div>
        </div>
        
        <div className="space-y-4 p-4 border rounded-md bg-purple-50">
          <h3 className="text-lg font-semibold text-purple-700">Notification Preferences</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="email" className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white" defaultChecked />
            <Label htmlFor="email" className="text-purple-700">Email notifications</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="sms" className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white" defaultChecked />
            <Label htmlFor="sms" className="text-purple-700">SMS notifications</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="push" className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white" />
            <Label htmlFor="push" className="text-purple-700">Push notifications</Label>
          </div>
        </div>
      </div>
    </div>
  );
}