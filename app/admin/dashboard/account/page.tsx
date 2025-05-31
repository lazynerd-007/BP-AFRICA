"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconUser, IconMail, IconPhone, IconEdit, IconUpload, IconAlertCircle, IconDeviceFloppy, IconUserCircle, IconHistory } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/store";

export default function AccountPage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const userData = {
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+233 54 123 4567",
    role: user?.role || "Admin",
    department: "Finance",
    joinDate: "Jan 15, 2023",
    lastLogin: "May 20, 2023 - 14:30",
    avatar: "/avatars/user.jpg"
  };
  
  // Mock form state
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the actual update
    setIsEditing(false);
    // Success notification would go here
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">
            <IconUserCircle className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="activity">
            <IconHistory className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>Cancel</>
                  ) : (
                    <>
                      <IconEdit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="w-full">
                      <IconUpload className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input 
                            id="role"
                            value={userData.role}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button type="submit" className="w-full md:w-auto">
                          <IconDeviceFloppy className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <IconUser className="mr-2 h-4 w-4" />
                          Full Name
                        </dt>
                        <dd className="mt-1 text-sm">{userData.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <IconMail className="mr-2 h-4 w-4" />
                          Email Address
                        </dt>
                        <dd className="mt-1 text-sm">{userData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center">
                          <IconPhone className="mr-2 h-4 w-4" />
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm">{userData.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                        <dd className="mt-1 text-sm">{userData.role}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                        <dd className="mt-1 text-sm">{userData.department}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Join Date</dt>
                        <dd className="mt-1 text-sm">{userData.joinDate}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    name="currentPassword"
                    type="password" 
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      name="newPassword"
                      type="password" 
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      name="confirmPassword"
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <Alert>
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Password must be at least 8 characters and include a number, uppercase letter, and special character.
                  </AlertDescription>
                </Alert>
                
                <Button type="button" className="mt-2">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent login activity and account changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Login History</h3>
                  <div className="mt-2 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Logged in from Chrome on Mac</p>
                          <p className="text-sm text-muted-foreground">
                            IP: 192.168.1.{100 + i} • Location: Accra, Ghana
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {i === 1 ? 'Just now' : `${i} day${i > 1 ? 's' : ''} ago`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Account Changes</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Password changed</p>
                        <p className="text-sm text-muted-foreground">
                          Your account password was changed
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">2 weeks ago</p>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Email updated</p>
                        <p className="text-sm text-muted-foreground">
                          Your email address was updated
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">1 month ago</p>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Account created</p>
                        <p className="text-sm text-muted-foreground">
                          Your account was created
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">3 months ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 