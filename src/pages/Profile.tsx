
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.name || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleLogout}>
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
