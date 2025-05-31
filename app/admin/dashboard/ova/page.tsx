"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconWallet,
  IconChecks,
  IconSend,
} from "@tabler/icons-react";
import { ViewOVA } from "./view-ova";
import { RequestOVA } from "./request-ova";
import { ApprovalOVA } from "./approval-ova";

export default function OVAPage() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Online Virtual Account (OVA)</h2>
        <p className="text-muted-foreground">
          Manage your collection and payout virtual accounts
        </p>
      </div>
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">
            <IconWallet className="mr-2 h-4 w-4" />
            View OVA
          </TabsTrigger>
          <TabsTrigger value="request">
            <IconSend className="mr-2 h-4 w-4" />
            Request Transfer
          </TabsTrigger>
          <TabsTrigger value="approval">
            <IconChecks className="mr-2 h-4 w-4" />
            Approval
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <ViewOVA />
        </TabsContent>
        
        <TabsContent value="request">
          <RequestOVA />
        </TabsContent>
        
        <TabsContent value="approval">
          <ApprovalOVA />
        </TabsContent>
      </Tabs>
    </div>
  );
} 