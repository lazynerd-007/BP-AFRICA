"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { IconFilter, IconPlus, IconSearch, IconUser, IconUsers, IconClock, IconMapPin, IconDeviceLaptop, IconActivity } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Super Administrator",
    status: "active",
    lastLogin: new Date("2023-11-10T14:32:18"),
    createdAt: new Date("2023-06-14T09:21:43"),
  },
  {
    id: 2,
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    role: "Administrator",
    status: "active",
    lastLogin: new Date("2023-11-09T11:15:27"),
    createdAt: new Date("2023-07-21T13:42:11"),
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Financial Administrator",
    status: "inactive",
    lastLogin: new Date("2023-10-28T09:54:06"),
    createdAt: new Date("2023-08-05T16:30:55"),
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "Manager",
    status: "active",
    lastLogin: new Date("2023-11-10T10:12:33"),
    createdAt: new Date("2023-09-12T08:22:41"),
  },
  {
    id: 5,
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    role: "Financial Administrator",
    status: "active",
    lastLogin: new Date("2023-11-07T16:48:22"),
    createdAt: new Date("2023-09-27T11:35:19"),
  },
];

// Mock data for user logs
const mockUserLogs = [
  {
    id: 1,
    userId: 1,
    userName: "Alex Johnson",
    action: "Login",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-10T14:32:18"),
  },
  {
    id: 2,
    userId: 2,
    userName: "Samantha Lee",
    action: "Password Change",
    ip: "172.16.254.1",
    location: "Kumasi, Ashanti Region, Ghana",
    device: "Firefox on Windows",
    timestamp: new Date("2023-11-09T11:15:27"),
  },
  {
    id: 3,
    userId: 1,
    userName: "Alex Johnson",
    action: "Created User",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-08T16:42:53"),
  },
  {
    id: 4,
    userId: 4,
    userName: "Emily Wilson",
    action: "Login",
    ip: "192.168.0.1",
    location: "Takoradi, Western Region, Ghana",
    device: "Safari on iOS",
    timestamp: new Date("2023-11-10T10:12:33"),
  },
  {
    id: 5,
    userId: 3,
    userName: "Michael Chen",
    action: "Password Reset Request",
    ip: "10.0.0.1",
    location: "Tamale, Northern Region, Ghana",
    device: "Edge on Windows",
    timestamp: new Date("2023-10-28T09:54:06"),
  },
  {
    id: 6,
    userId: 5,
    userName: "David Rodriguez",
    action: "Login Failed",
    ip: "192.168.2.254",
    location: "Cape Coast, Central Region, Ghana",
    device: "Chrome on Android",
    timestamp: new Date("2023-11-07T16:48:22"),
  },
  {
    id: 7,
    userId: 5,
    userName: "David Rodriguez",
    action: "Login",
    ip: "192.168.2.254",
    location: "Cape Coast, Central Region, Ghana",
    device: "Chrome on Android",
    timestamp: new Date("2023-11-07T16:50:03"),
  },
  {
    id: 8,
    userId: 2,
    userName: "Samantha Lee",
    action: "Updated User Role",
    ip: "172.16.254.1",
    location: "Kumasi, Ashanti Region, Ghana",
    device: "Firefox on Windows",
    timestamp: new Date("2023-11-06T14:22:19"),
  },
  {
    id: 9,
    userId: 1,
    userName: "Alex Johnson",
    action: "Logout",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-10T18:15:42"),
  },
  {
    id: 10,
    userId: 4,
    userName: "Emily Wilson",
    action: "Changed Settings",
    ip: "192.168.0.1",
    location: "Takoradi, Western Region, Ghana",
    device: "Safari on iOS",
    timestamp: new Date("2023-11-09T15:37:11"),
  },
  {
    id: 11,
    userId: 1,
    userName: "Alex Johnson",
    action: "Changed Settings",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-11T09:23:15"),
  },
  {
    id: 12,
    userId: 2,
    userName: "Samantha Lee",
    action: "Login",
    ip: "172.16.254.1",
    location: "Kumasi, Ashanti Region, Ghana",
    device: "Firefox on Windows",
    timestamp: new Date("2023-11-10T08:17:33"),
  },
  {
    id: 13,
    userId: 5,
    userName: "David Rodriguez",
    action: "Updated User Role",
    ip: "192.168.2.254",
    location: "Cape Coast, Central Region, Ghana",
    device: "Chrome on Android",
    timestamp: new Date("2023-11-08T13:42:07"),
  },
  {
    id: 14,
    userId: 3,
    userName: "Michael Chen",
    action: "Login",
    ip: "10.0.0.1",
    location: "Tamale, Northern Region, Ghana",
    device: "Chrome on Windows",
    timestamp: new Date("2023-11-05T07:30:22"),
  },
  {
    id: 15,
    userId: 1,
    userName: "Alex Johnson",
    action: "Password Change",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-07T11:05:38"),
  },
];

// User form schema for validation
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  bdmTag: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState(mockUsers)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [logSearchQuery, setLogSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [userLogs] = useState(mockUserLogs)
  
  // Define roles
  const roles = [
    "Super Administrator",
    "Administrator",
    "Financial Administrator",
    "Manager",
    "Business Development Manager"
  ]
  
  // Define log action types
  const actionTypes = [
    "Login",
    "Logout",
    "Password Change",
    "Password Reset Request",
    "Created User",
    "Updated User Role",
    "Login Failed",
    "Changed Settings"
  ]
  
  // Setup form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      bdmTag: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Filter logs based on search, action, date, and user
  const filteredLogs = userLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(logSearchQuery.toLowerCase()) || 
      log.ip.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.device.toLowerCase().includes(logSearchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesUser = userFilter === "all" || log.userId.toString() === userFilter;
    
    let matchesDate = true;
    const today = new Date();
    const logDate = new Date(log.timestamp);
    
    if (dateFilter === "today") {
      matchesDate = logDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      matchesDate = logDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === "thisWeek") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = logDate >= weekAgo;
    }
    
    return matchesSearch && matchesAction && matchesDate && matchesUser;
  });
  
  // Count user actions
  const userActionCounts = userLogs.reduce((acc, log) => {
    acc[log.userId] = (acc[log.userId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Handle form submission
  const onSubmit = (data: UserFormValues) => {
    setIsCreatingUser(true);
    
    // Simulate API call to create user
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        name: data.name,
        email: data.email,
        role: data.role,
        status: "active",
        lastLogin: new Date(),
        createdAt: new Date(),
      };
      
      setUsers([...users, newUser]);
      setIsCreatingUser(false);
      form.reset();
      
      toast.success(`User ${data.name} created successfully`);
    }, 1500);
  };
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  
  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage user accounts and access permissions
        </p>
      </div>
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="view">
            <IconUsers className="h-4 w-4 mr-2" />
            View Users
          </TabsTrigger>
          <TabsTrigger value="create">
            <IconPlus className="h-4 w-4 mr-2" />
            Create User
          </TabsTrigger>
          <TabsTrigger value="logs">
            <IconActivity className="h-4 w-4 mr-2" />
            User Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">Users</CardTitle>
                  <CardDescription>Manage system users and their permissions</CardDescription>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <Badge variant="outline" className="mr-2">
                    Total: {users.length}
                  </Badge>
                  <Badge variant="secondary">
                    Active: {users.filter(u => u.status === "active").length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative w-full md:w-1/3">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <IconFilter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm mr-2">Filters:</span>
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials(user.name)}`} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.role === "Super Administrator" 
                                ? "destructive" 
                                : user.role === "Administrator" 
                                  ? "default" 
                                  : user.role === "Financial Administrator" 
                                    ? "secondary" 
                                    : "outline"
                            }
                            className="font-normal"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "secondary" : "outline"}
                            className={`font-normal ${user.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" : ""}`}
                          >
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.createdAt.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-xl font-semibold">Create New User</CardTitle>
              <CardDescription>Add a new user to the system</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines what permissions and access the user will have
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("role") === "Business Development Manager" && (
                    <FormField
                      control={form.control}
                      name="bdmTag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BDM Tag</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter BDM tag" {...field} />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for this Business Development Manager
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Must be at least 8 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Re-enter your password to confirm
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="min-w-[150px]"
                      disabled={isCreatingUser}
                    >
                      {isCreatingUser ? (
                        <>
                          <IconUser className="mr-2 h-4 w-4 animate-pulse" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <IconPlus className="mr-2 h-4 w-4" />
                          Create User
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">User Activity Logs</CardTitle>
                  <CardDescription>Track user activity across the system</CardDescription>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <Badge variant="outline" className="mr-2">
                    Total Logs: {userLogs.length}
                  </Badge>
                  <Badge variant="secondary">
                    Today: {userLogs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString()).length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative w-full md:w-1/3">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-9"
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <IconFilter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm mr-2">Filters:</span>
                  </div>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {actionTypes.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="w-[180px]">User</TableHead>
                      <TableHead className="w-[120px]">Action</TableHead>
                      <TableHead className="w-[130px]">IP Address</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead className="w-[180px]">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{getInitials(log.userName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span>{log.userName}</span>
                                {userActionCounts[log.userId] > 2 && (
                                  <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs bg-amber-50 text-amber-700 border-amber-200">
                                    {userActionCounts[log.userId]}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">User #{log.userId}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              log.action.includes("Failed") 
                                ? "destructive" 
                                : log.action === "Login" || log.action === "Logout"
                                  ? "outline" 
                                  : log.action.includes("Password")
                                    ? "secondary" 
                                    : "default"
                            }
                            className="font-normal"
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center">
                            <IconDeviceLaptop className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {log.ip}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconMapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {log.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.device}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center">
                            <IconClock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {formatDateTime(log.timestamp)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No logs found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
                <span className="text-sm text-muted-foreground">Showing {filteredLogs.length} of {userLogs.length} logs</span>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <IconActivity className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Activity logs are retained for 90 days</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">Badge shows users with multiple activities</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 