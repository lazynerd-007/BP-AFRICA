"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { IconAlertCircle, IconCheck, IconClock, IconRefresh, IconX, IconToolsOff, IconBellRinging, IconSend, IconCalendar } from "@tabler/icons-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Mock data for system status
const mockServices = [
  { 
    id: 1, 
    name: "API Gateway", 
    status: "operational", 
    uptime: "99.98%", 
    responseTime: 124,
    lastChecked: new Date(),
  },
  { 
    id: 2, 
    name: "Authentication Service", 
    status: "operational", 
    uptime: "99.95%", 
    responseTime: 187,
    lastChecked: new Date(),
  },
  { 
    id: 3, 
    name: "Payment Gateway", 
    status: "degraded", 
    uptime: "98.72%", 
    responseTime: 358,
    lastChecked: new Date(),
  },
  { 
    id: 4, 
    name: "Transaction Service", 
    status: "operational", 
    uptime: "99.99%", 
    responseTime: 146,
    lastChecked: new Date(),
  },
  { 
    id: 5, 
    name: "Database Cluster", 
    status: "operational", 
    uptime: "99.97%", 
    responseTime: 92,
    lastChecked: new Date(),
  },
  { 
    id: 6, 
    name: "Notification Service", 
    status: "operational", 
    uptime: "99.91%", 
    responseTime: 201,
    lastChecked: new Date(),
  },
  { 
    id: 7, 
    name: "Merchant Portal", 
    status: "down", 
    uptime: "95.45%", 
    responseTime: 0,
    lastChecked: new Date(),
  },
  { 
    id: 8, 
    name: "Admin Dashboard", 
    status: "operational", 
    uptime: "99.89%", 
    responseTime: 231,
    lastChecked: new Date(),
  },
];

const mockIncidents = [
  {
    id: 1,
    title: "Payment Gateway Timeout Issues",
    status: "investigating",
    created: new Date("2023-11-09T14:23:15"),
    updated: new Date("2023-11-09T15:45:30"),
    components: ["Payment Gateway"],
    updates: [
      {
        id: 1,
        status: "investigating",
        message: "We are investigating reports of increased latency with payment processing.",
        timestamp: new Date("2023-11-09T14:23:15")
      },
      {
        id: 2,
        status: "identified",
        message: "The issue has been identified as a connection problem with one of our payment processors.",
        timestamp: new Date("2023-11-09T15:45:30")
      }
    ]
  },
  {
    id: 2,
    title: "Merchant Portal Unreachable",
    status: "outage",
    created: new Date("2023-11-10T08:12:45"),
    updated: new Date("2023-11-10T08:45:10"),
    components: ["Merchant Portal", "API Gateway"],
    updates: [
      {
        id: 1,
        status: "investigating",
        message: "We're investigating issues with the Merchant Portal being unreachable.",
        timestamp: new Date("2023-11-10T08:12:45")
      },
      {
        id: 2,
        status: "identified",
        message: "We've identified a network issue affecting access to the Merchant Portal.",
        timestamp: new Date("2023-11-10T08:25:30")
      },
      {
        id: 3,
        status: "outage",
        message: "We are experiencing a complete outage of the Merchant Portal. Engineers are working to restore service.",
        timestamp: new Date("2023-11-10T08:45:10")
      }
    ]
  }
];

// Form schema for incident creation
const incidentFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  components: z.string().min(1, "Must select at least one component"),
  status: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

export default function SystemStatusPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState("00:00")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false)
  const [incidents, setIncidents] = useState(mockIncidents)
  const [isSubmittingIncident, setIsSubmittingIncident] = useState(false)
  
  // Calculate system status summary
  const operationalCount = mockServices.filter(s => s.status === "operational").length
  const degradedCount = mockServices.filter(s => s.status === "degraded").length
  const downCount = mockServices.filter(s => s.status === "down").length
  
  const overallStatus = downCount > 0 
    ? "major-outage" 
    : degradedCount > 0 
      ? "partial-outage" 
      : "operational"
  
  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      title: "",
      components: "",
      status: "investigating",
      message: "",
    },
  });
  
  // Simulate refresh data
  const refreshData = () => {
    setRefreshing(true)
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
      setLastRefreshed(new Date())
    }, 1500)
  }
  
  // Format the incident status
  const formatIncidentStatus = (status: string) => {
    switch (status) {
      case "investigating":
        return { label: "Investigating", color: "default" };
      case "identified":
        return { label: "Identified", color: "secondary" };
      case "monitoring":
        return { label: "Monitoring", color: "secondary" };
      case "resolved":
        return { label: "Resolved", color: "secondary" };
      case "outage":
        return { label: "Outage", color: "destructive" };
      default:
        return { label: status, color: "default" };
    }
  }
  
  const toggleMaintenanceMode = (checked: boolean) => {
    if (checked) {
      setConfirmDialogOpen(true)
    } else {
      // Turn off maintenance mode immediately
      setMaintenanceMode(false)
      toast.success("Maintenance mode disabled")
    }
  }
  
  const confirmMaintenanceMode = async () => {
    setIsSending(true)
    
    // Simulate API call to enable maintenance mode and send emails
    setTimeout(() => {
      setMaintenanceMode(true)
      setConfirmDialogOpen(false)
      setIsSending(false)
      
      const scheduledText = scheduledDate 
        ? `scheduled for ${format(scheduledDate, "PP")} at ${scheduledTime}`
        : "activated immediately";
        
      toast.success(`Maintenance mode ${scheduledText}`)
    }, 2000)
  }
  
  const onSubmitIncident = (data: IncidentFormValues) => {
    setIsSubmittingIncident(true);
    
    // Simulate API call
    setTimeout(() => {
      const newIncident = {
        id: incidents.length + 1,
        title: data.title,
        status: data.status,
        created: new Date(),
        updated: new Date(),
        components: [data.components],
        updates: [
          {
            id: 1,
            status: data.status,
            message: data.message,
            timestamp: new Date()
          }
        ]
      };
      
      setIncidents([newIncident, ...incidents]);
      setIsSubmittingIncident(false);
      setIncidentDialogOpen(false);
      form.reset();
      
      toast.success("Incident created successfully");
    }, 1500);
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
        </div>
        
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={refreshing}
          >
            <IconRefresh className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      
      {/* Maintenance Mode Control */}
      <Card className="mb-6 border-2 border-dashed">
        <CardHeader className={`${maintenanceMode ? "bg-yellow-100/50 dark:bg-yellow-900/20" : "bg-muted/50"}`}>
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <IconToolsOff className={`h-5 w-5 ${maintenanceMode ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`} />
              <CardTitle className="text-xl font-semibold">System Maintenance</CardTitle>
            </div>
            {maintenanceMode && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                <IconBellRinging className="h-3 w-3 mr-1" />
                Maintenance Mode Active
              </Badge>
            )}
          </div>
          {maintenanceMode && scheduledDate && (
            <CardDescription className="mt-2 flex items-center text-yellow-700 dark:text-yellow-400">
              <IconClock className="h-4 w-4 mr-1" />
              Scheduled for {format(scheduledDate, "PP")} at {scheduledTime}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
              <div className="space-y-1">
                <h3 className="font-medium leading-none">Maintenance Mode</h3>
                <p className="text-sm text-muted-foreground">
                  When enabled, the system will enter maintenance mode and notify all merchants.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="maintenance-mode" 
                  checked={maintenanceMode}
                  onCheckedChange={toggleMaintenanceMode}
                />
                <Label htmlFor="maintenance-mode">
                  {maintenanceMode ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">Schedule Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maintenance-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="maintenance-date"
                        variant="outline"
                        className="w-full justify-start text-left"
                        disabled={maintenanceMode}
                      >
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenance-time">Time</Label>
                  <Input
                    id="maintenance-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    disabled={maintenanceMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="bg-muted/50 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-xl font-semibold">System Status</CardTitle>
              <CardDescription>Current status of all services</CardDescription>
            </div>
            <Badge 
              variant={
                overallStatus === "operational" 
                  ? "secondary" 
                  : overallStatus === "partial-outage" 
                    ? "default" 
                    : "destructive"
              }
              className="px-3 py-1"
            >
              {overallStatus === "operational" 
                ? "All Systems Operational" 
                : overallStatus === "partial-outage" 
                  ? "Partial System Outage" 
                  : "Major System Outage"}
            </Badge>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-6 py-3">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Status</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-medium">Operational</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 pt-0">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold">{operationalCount}</span>
                        <span className="text-xl text-muted-foreground ml-1">/ {mockServices.length}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <IconCheck className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-muted-foreground">Services running normally</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-medium">Outages</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 pt-0">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold">{downCount}</span>
                        <span className="text-xl text-muted-foreground ml-1">/ {mockServices.length}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <IconX className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-muted-foreground">Services currently down</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Active Incidents */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Active Incidents</h3>
                    <Button 
                      onClick={() => setIncidentDialogOpen(true)}
                      size="sm"
                    >
                      <IconAlertCircle className="h-4 w-4 mr-1" />
                      Report Incident
                    </Button>
                  </div>
                  
                  {incidents.length > 0 ? (
                    <div className="space-y-4">
                      {incidents.map(incident => (
                        <Card key={incident.id} className="border-l-4 border-l-orange-500">
                          <CardHeader className="py-3">
                            <div className="flex flex-wrap justify-between items-start">
                              <div>
                                <CardTitle className="text-base font-medium">{incident.title}</CardTitle>
                                <CardDescription>
                                  Affected: {incident.components.join(", ")}
                                </CardDescription>
                              </div>
                              <Badge
                                variant={
                                  formatIncidentStatus(incident.status).color as 
                                    "default" | "secondary" | "destructive"
                                }
                              >
                                {formatIncidentStatus(incident.status).label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 pb-3">
                            <div className="text-sm">
                              <div className="space-y-3">
                                {incident.updates.slice(0, 2).map(update => (
                                  <div key={update.id} className="flex">
                                    <div className="mr-3 flex-shrink-0">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                                        <IconClock className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        {update.timestamp.toLocaleTimeString()} - {formatIncidentStatus(update.status).label}
                                      </p>
                                      <p>{update.message}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <IconCheck className="h-10 w-10 text-green-500 mb-3" />
                        <p className="text-center font-medium">No active incidents</p>
                        <p className="text-center text-sm text-muted-foreground mt-1">
                          All systems are operating normally
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="detailed" className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Uptime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Response Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Last Checked
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {mockServices.map(service => (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{service.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                service.status === "operational" 
                                  ? "secondary" 
                                  : service.status === "degraded" 
                                    ? "default" 
                                    : "destructive"
                              }
                            >
                              {service.status === "operational" 
                                ? "Operational" 
                                : service.status === "degraded" 
                                  ? "Degraded" 
                                  : "Down"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{service.uptime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {service.status !== "down" ? (
                              <div className="flex items-center">
                                <span className={service.responseTime > 300 ? "text-orange-500" : "text-green-500"}>
                                  {service.responseTime} ms
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {service.lastChecked.toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Maintenance Mode?</DialogTitle>
            <DialogDescription>
              This will put the system in maintenance mode
              {scheduledDate 
                ? ` on ${format(scheduledDate, "PPP")} at ${scheduledTime}`
                : " immediately"
              } and send notifications to all merchants.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 text-sm">
              <IconBellRinging className="h-4 w-4 text-yellow-500" />
              <span>Notification emails will be sent to all merchants</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <IconToolsOff className="h-4 w-4 text-yellow-500" />
              <span>API endpoints will respond with maintenance status</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMaintenanceMode} disabled={isSending}>
              {isSending ? (
                <>
                  <IconSend className="h-4 w-4 mr-2 animate-pulse" />
                  Sending notifications...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Incident Report Dialog */}
      <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report New Incident</DialogTitle>
            <DialogDescription>
              Create a new incident to notify the team and track status.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitIncident)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Payment Gateway Issues" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="components"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Component</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a component" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockServices.map(service => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the primary affected component
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="identified">Identified</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="outage">Outage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Update</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="We are investigating issues with..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIncidentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmittingIncident}
                >
                  {isSubmittingIncident ? (
                    <>
                      <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Incident"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 