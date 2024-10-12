"use client";


//import { currentRole } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const AdminPage = () => {

    const onApiRouteClick=()=>{
        fetch('/api/admin').then((response)=>{
            if(response.ok){
                toast.success("Allowed API route")
            }
            else{
                toast.error("Forbidden API route")
            }
        })
    }

    const onServerActionClick=()=>{
        admin().then((response)=>{
            if(response.error){
                toast.error(response.error)
            }
            else{
                toast.success(response.success)
            }
        })
    }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRole={"ADMIN"}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
