"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  IconBell, 
  IconTrash, 
  IconCheck, 
  IconX, 
  IconBellRinging, 
  IconInfoCircle,
  IconAlertTriangle,
  IconCreditCard,
  IconUser,
  IconServerBolt
} from "@tabler/icons-react";

export default function NotificationsPage() {
  // Mock notifications data
  const allNotifications = [
    {
      id: 1,
      title: "System Update Scheduled",
      message: "A system update is scheduled for tomorrow at 2:00 AM. The system will be unavailable for approximately 30 minutes.",
      timestamp: "2025-05-20T14:30:00",
      type: "system",
      read: false,
    },
    {
      id: 2,
      title: "New Transaction Received",
      message: "You have received a new transaction of GHS 15,000.00 from Merchant XYZ.",
      timestamp: "2025-05-20T10:15:00",
      type: "transaction",
      read: false,
    },
    {
      id: 3,
      title: "Password Changed",
      message: "Your account password was changed successfully. If you did not make this change, please contact support immediately.",
      timestamp: "2025-05-19T16:45:00",
      type: "security",
      read: true,
    },
    {
      id: 4,
      title: "New Merchant Onboarded",
      message: "Merchant ABC has been successfully onboarded to the platform.",
      timestamp: "2025-05-19T09:20:00",
      type: "merchant",
      read: true,
    },
    {
      id: 5,
      title: "Settlement Completed",
      message: "Settlement for transactions from May 15-18 has been completed successfully.",
      timestamp: "2025-05-18T17:30:00",
      type: "transaction",
      read: true,
    },
    {
      id: 6,
      title: "System Alert: High CPU Usage",
      message: "The system is experiencing high CPU usage. Technical team has been notified.",
      timestamp: "2025-05-18T11:10:00",
      type: "system",
      read: true,
    },
    {
      id: 7,
      title: "New User Added",
      message: "A new user account has been created for Jane Smith with Admin privileges.",
      timestamp: "2025-05-17T14:25:00",
      type: "security",
      read: true,
    },
  ];
  
  const [notifications, setNotifications] = useState(allNotifications);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : activeTab === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);
  
  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Delete a notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "system":
        return <IconServerBolt className="h-5 w-5 text-blue-600" />;
      case "transaction":
        return <IconCreditCard className="h-5 w-5 text-green-600" />;
      case "security":
        return <IconInfoCircle className="h-5 w-5 text-yellow-600" />;
      case "merchant":
        return <IconUser className="h-5 w-5 text-purple-600" />;
      default:
        return <IconBell className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="transaction">Transactions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            <IconCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <IconBellRinging className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No Notifications</h3>
            <p className="text-muted-foreground mt-1">
              You&apos;re all caught up! There are no notifications to display.
            </p>
          </CardContent>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <IconBellRinging className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No {activeTab} Notifications</h3>
            <p className="text-muted-foreground mt-1">
              There are no {activeTab === "unread" ? "unread" : activeTab} notifications to display.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Notification Center</CardTitle>
            <CardDescription>
              You have {filteredNotifications.filter(n => !n.read).length} unread 
              {activeTab !== "all" ? ` ${activeTab}` : ""} notification
              {filteredNotifications.filter(n => !n.read).length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg relative ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline">
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="secondary" className="ml-2">New</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <IconCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive urgent notifications via SMS
                </p>
              </div>
              <Switch id="sms-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            
            <Alert>
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Disabling all notification methods may cause you to miss important system alerts and updates.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 