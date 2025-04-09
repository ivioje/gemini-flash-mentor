
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User } from "lucide-react";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.fullName || 'User'} className="h-16 w-16 rounded-full" />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.fullName || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => window.location.href = '/user/sign-out'}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Study Preferences</CardTitle>
                <CardDescription>
                  Customize your study experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Preference settings will be added here in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
