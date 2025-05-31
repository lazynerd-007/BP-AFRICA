"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconUsers,
  IconCreditCard,
  IconInfoCircle,
  IconMessageCircle,
  IconExternalLink
} from "@tabler/icons-react";

export default function ParentMerchantPage() {
  // Mock parent merchant data
  const parentMerchant = {
    id: "MERCHANT-001",
    businessName: "BluWave Limited",
    registrationNumber: "RC-2019-5678",
    businessType: "Financial Technology",
    status: "Active",
    dateEstablished: "2019-03-15",
    address: {
      street: "123 Independence Avenue",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      postalCode: "GA-123-4567"
    },
    contact: {
      email: "support@bluwave.com",
      phone: "+233 30 123 4567",
      supportHours: "Monday - Friday, 8:00 AM - 6:00 PM",
      emergencyContact: "+233 24 999 8888"
    },
    businessMetrics: {
      totalSubmerchants: 45,
      yearsInBusiness: 5,
      supportedRegions: ["Greater Accra", "Ashanti", "Central", "Western"]
    },
    services: [
      "Payment Processing",
      "Terminal Management", 
      "Transaction Monitoring",
      "Compliance Support",
      "24/7 Technical Support"
    ]
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support ticket or chat
    alert("Support request initiated. You will be contacted shortly.");
  };

  const handleRequestTerminal = () => {
    // In a real app, this would open a terminal request form
    alert("Terminal request submitted to your parent merchant.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Parent Merchant</h1>
        <p className="text-muted-foreground">
          Information about your parent merchant and available support services
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Your parent merchant manages your account settings, terminal assignments, and provides technical support. Contact them for any service requests or issues.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              <CardTitle>Business Information</CardTitle>
            </div>
            <CardDescription>Details about your parent merchant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <p className="text-lg font-semibold">{parentMerchant.businessName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Merchant ID</label>
                <p className="font-mono text-sm">{parentMerchant.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                <p className="font-mono text-sm">{parentMerchant.registrationNumber}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                <p>{parentMerchant.businessType}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {parentMerchant.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Established</label>
                <div className="flex items-center gap-2 mt-1">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(parentMerchant.dateEstablished).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconMessageCircle className="h-5 w-5" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <CardDescription>How to reach your parent merchant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span>{parentMerchant.contact.email}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span>{parentMerchant.contact.phone}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                <div className="flex items-center gap-2 mt-1">
                  <IconPhone className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">{parentMerchant.contact.emergencyContact}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Support Hours</label>
                <p className="text-sm">{parentMerchant.contact.supportHours}</p>
              </div>
              
              <div className="pt-2">
                <Button onClick={handleContactSupport} className="w-full">
                  <IconMessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              <CardTitle>Business Address</CardTitle>
            </div>
            <CardDescription>Physical location of your parent merchant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>{parentMerchant.address.street}</p>
              <p>{parentMerchant.address.city}, {parentMerchant.address.region}</p>
              <p>{parentMerchant.address.country}</p>
              <p className="font-mono text-sm text-muted-foreground">{parentMerchant.address.postalCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Services & Support */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              <CardTitle>Services Provided</CardTitle>
            </div>
            <CardDescription>Services and support offered by your parent merchant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {parentMerchant.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={handleRequestTerminal} className="w-full">
                <IconExternalLink className="h-4 w-4 mr-2" />
                Request New Terminal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>Key metrics about your parent merchant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IconUsers className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{parentMerchant.businessMetrics.totalSubmerchants}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Submerchants</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IconCalendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{parentMerchant.businessMetrics.yearsInBusiness}+</span>
              </div>
              <p className="text-sm text-muted-foreground">Years in Business</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IconMapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{parentMerchant.businessMetrics.supportedRegions.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Supported Regions</p>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="text-sm font-medium text-muted-foreground">Supported Regions:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {parentMerchant.businessMetrics.supportedRegions.map((region, index) => (
                <Badge key={index} variant="secondary">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 