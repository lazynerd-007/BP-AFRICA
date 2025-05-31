"use client";

import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  IconSearch, 
  IconBuildingStore, 
  IconTransfer, 
  IconUsers, 
  IconBuildingBank,
  IconFileAnalytics,
  IconReportMoney,
  IconDeviceMobile,
  IconDatabase,
  IconServer,
  IconUserCircle,
  IconBell,
  IconInfoCircle,
  IconPlayerPlay,
  IconArrowRight
} from "@tabler/icons-react";

// Define tutorial type
interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  videoUrl: string;
  difficulty: string;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tutorials based on search query
  const filterTutorials = (tutorials: Tutorial[]) => {
    if (!searchQuery.trim()) return tutorials;
    
    return tutorials.filter(tutorial => 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Tutorial data for each section
  const gettingStartedTutorials = [
    {
      id: "gs-1",
      title: "Dashboard Overview",
      description: "Learn about the main dashboard features and navigation",
      icon: IconInfoCircle,
      videoUrl: "#",
      difficulty: "Beginner"
    },
    {
      id: "gs-2",
      title: "Admin Account Setup",
      description: "How to set up your admin account and security preferences",
      icon: IconUserCircle,
      videoUrl: "#",
      difficulty: "Beginner"
    },
    {
      id: "gs-3",
      title: "Navigating the Interface",
      description: "Tips for efficiently navigating the admin interface",
      icon: IconArrowRight,
      videoUrl: "#",
      difficulty: "Beginner"
    }
  ];
  
  const merchantManagementTutorials = [
    {
      id: "mm-1",
      title: "Adding a New Merchant",
      description: "Step-by-step guide to add a new merchant to the platform",
      icon: IconBuildingStore,
      videoUrl: "#",
      difficulty: "Intermediate"
    },
    {
      id: "mm-2",
      title: "Merchant Verification Process",
      description: "How to verify merchant documents and approve accounts",
      icon: IconInfoCircle,
      videoUrl: "#",
      difficulty: "Advanced"
    },
    {
      id: "mm-3",
      title: "Managing Merchant Permissions",
      description: "Configure access levels and permissions for merchant accounts",
      icon: IconUsers,
      videoUrl: "#",
      difficulty: "Advanced"
    },
    {
      id: "mm-4",
      title: "Suspending or Deactivating Merchants",
      description: "Procedures for suspending or deactivating merchant accounts",
      icon: IconBuildingStore,
      videoUrl: "#",
      difficulty: "Intermediate"
    }
  ];
  
  const financialManagementTutorials = [
    {
      id: "fm-1",
      title: "Transaction Monitoring",
      description: "How to monitor and manage transactions through the platform",
      icon: IconTransfer,
      videoUrl: "#",
      difficulty: "Intermediate"
    },
    {
      id: "fm-2",
      title: "Setting Up Commission Structures",
      description: "Configure commission rates for different transaction types",
      icon: IconReportMoney,
      videoUrl: "#",
      difficulty: "Advanced"
    },
    {
      id: "fm-3",
      title: "Financial Reporting",
      description: "Generating and interpreting financial reports",
      icon: IconFileAnalytics,
      videoUrl: "#",
      difficulty: "Advanced"
    },
    {
      id: "fm-4",
      title: "Partner Bank Management",
      description: "How to add and manage partner banks in the system",
      icon: IconBuildingBank,
      videoUrl: "#",
      difficulty: "Intermediate"
    }
  ];
  
  const deviceManagementTutorials = [
    {
      id: "dm-1",
      title: "Adding New Terminals",
      description: "How to add new POS terminals to the system",
      icon: IconDeviceMobile,
      videoUrl: "#",
      difficulty: "Intermediate"
    },
    {
      id: "dm-2",
      title: "Allocating Terminals to Merchants",
      description: "Process for assigning terminals to merchant accounts",
      icon: IconBuildingStore,
      videoUrl: "#",
      difficulty: "Intermediate"
    },
    {
      id: "dm-3",
      title: "Terminal APK Updates",
      description: "How to push software updates to terminal devices",
      icon: IconDeviceMobile,
      videoUrl: "#",
      difficulty: "Advanced"
    },
    {
      id: "dm-4",
      title: "Troubleshooting Terminal Issues",
      description: "Common terminal problems and their solutions",
      icon: IconInfoCircle,
      videoUrl: "#",
      difficulty: "Advanced"
    }
  ];
  
  const systemManagementTutorials = [
    {
      id: "sm-1",
      title: "System Logs Analysis",
      description: "How to analyze system logs for troubleshooting",
      icon: IconDatabase,
      videoUrl: "#",
      difficulty: "Advanced"
    },
    {
      id: "sm-2",
      title: "Monitoring System Status",
      description: "Monitoring system health and performance",
      icon: IconServer,
      videoUrl: "#",
      difficulty: "Intermediate"
    },
    {
      id: "sm-3",
      title: "User Management",
      description: "Managing admin and staff user accounts",
      icon: IconUsers,
      videoUrl: "#",
      difficulty: "Intermediate"
    },
    {
      id: "sm-4",
      title: "Notification Settings",
      description: "Configuring system notification preferences",
      icon: IconBell,
      videoUrl: "#",
      difficulty: "Beginner"
    }
  ];
  
  const faqItems = [
    {
      question: "How do I reset my admin password?",
      answer: "To reset your admin password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your registered email address to create a new password."
    },
    {
      question: "Can I export transaction data to Excel?",
      answer: "Yes, on the Transactions page, you can use the 'Export' button at the top right of the transactions table to download the data in Excel format."
    },
    {
      question: "How do I approve a merchant's OVA request?",
      answer: "Navigate to the OVA section, then select the 'Approval Requests' tab. Find the merchant's request, review their details, and click the 'Approve' button if everything is in order."
    },
    {
      question: "What should I do if a terminal is reported as lost?",
      answer: "Immediately go to Terminal Device Management, locate the terminal, and deactivate it. You should also report this in the System Logs for record-keeping."
    },
    {
      question: "How can I generate a monthly revenue report?",
      answer: "Go to Financial Reports, select the 'Revenue Reports' tab, then use the date filter to select the month you need data for. Click 'Generate Report' to create the report."
    },
    {
      question: "How do I add a new admin user to the system?",
      answer: "Navigate to User Management, click 'Add User', select the 'Admin' role, and fill in the required details. The new admin will receive an email with login instructions."
    }
  ];
  
  // Render a list of tutorial cards
  const renderTutorialCards = (tutorials: Tutorial[]) => {
    const filteredTutorials = filterTutorials(tutorials);
    
    if (filteredTutorials.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tutorials found matching your search criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutorials.map((tutorial) => (
          <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 p-2 rounded-md">
                  <tutorial.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant={
                  tutorial.difficulty === "Beginner" ? "outline" : 
                  tutorial.difficulty === "Intermediate" ? "secondary" : "default"
                }>
                  {tutorial.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">{tutorial.title}</CardTitle>
              <CardDescription>{tutorial.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href={tutorial.videoUrl}>
                  <IconPlayerPlay className="mr-2 h-4 w-4" />
                  Watch Tutorial
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Help Center</h2>
        <p className="text-muted-foreground">
          Access support resources and get assistance
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tutorials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery("")}>
          Clear
        </Button>
      </div>
      
      {searchQuery ? (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Search Results</h3>
          {renderTutorialCards([
            ...gettingStartedTutorials,
            ...merchantManagementTutorials,
            ...financialManagementTutorials,
            ...deviceManagementTutorials,
            ...systemManagementTutorials
          ])}
        </div>
      ) : (
        <Tabs defaultValue="getting-started" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="merchant-management">Merchant Management</TabsTrigger>
            <TabsTrigger value="financial-management">Financial Management</TabsTrigger>
            <TabsTrigger value="device-management">Device Management</TabsTrigger>
            <TabsTrigger value="system-management">System Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Alert>
                <IconInfoCircle className="h-4 w-4" />
                <AlertDescription>
                  New to BluPay? Start with these basic tutorials to understand the platform.
                </AlertDescription>
              </Alert>
            </div>
            {renderTutorialCards(gettingStartedTutorials)}
          </TabsContent>
          
          <TabsContent value="merchant-management" className="space-y-4">
            {renderTutorialCards(merchantManagementTutorials)}
          </TabsContent>
          
          <TabsContent value="financial-management" className="space-y-4">
            {renderTutorialCards(financialManagementTutorials)}
          </TabsContent>
          
          <TabsContent value="device-management" className="space-y-4">
            {renderTutorialCards(deviceManagementTutorials)}
          </TabsContent>
          
          <TabsContent value="system-management" className="space-y-4">
            {renderTutorialCards(systemManagementTutorials)}
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-12">
        <h3 className="text-xl font-bold tracking-tight mb-4">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="bg-muted p-6 rounded-lg mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Need more help?</h3>
            <p className="text-muted-foreground">
              Contact our support team for personalized assistance
            </p>
          </div>
          <Button>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
} 