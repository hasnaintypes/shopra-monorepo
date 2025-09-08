import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';

export function CardExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Card Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Account Overview</CardTitle>
            <CardDescription>View your account details and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">Your account balance:</p>
              <p className="text-2xl font-bold text-accent-foreground">$2,500.00</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Transactions</Button>
            <Button>Add Funds</Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-md bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Premium Plan</CardTitle>
            <CardDescription>Upgrade your account for more features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Unlimited transactions</li>
              <li>Priority customer support</li>
              <li>Advanced analytics</li>
              <li>Custom branding options</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500">Upgrade Now</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}