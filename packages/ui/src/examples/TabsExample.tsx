import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.js';

export function TabsExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Tabs Examples</h2>
      
      <Tabs defaultValue="account" className="w-full max-w-3xl">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100">
          <TabsTrigger value="account" className="text-blue-600 data-[state=active]:bg-blue-200">
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="text-green-600 data-[state=active]:bg-green-200">
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-amber-600 data-[state=active]:bg-amber-200">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-purple-600 data-[state=active]:bg-purple-200">
            Appearance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-4 border rounded-b-lg border-blue-200 bg-blue-50">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-700">Account Settings</h3>
            <p className="text-blue-600">Manage your account information and preferences.</p>
          </div>
        </TabsContent>
        <TabsContent value="password" className="p-4 border rounded-b-lg border-green-200 bg-green-50">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-700">Password Settings</h3>
            <p className="text-green-600">Change your password and security settings.</p>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="p-4 border rounded-b-lg border-amber-200 bg-amber-50">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-amber-700">Notification Preferences</h3>
            <p className="text-amber-600">Control how and when you receive notifications.</p>
          </div>
        </TabsContent>
        <TabsContent value="appearance" className="p-4 border rounded-b-lg border-purple-200 bg-purple-50">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-700">Appearance Settings</h3>
            <p className="text-purple-600">Customize the look and feel of your interface.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}