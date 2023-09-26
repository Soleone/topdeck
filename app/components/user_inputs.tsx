import { Lock, Mail, UserPlus2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function UserInputs({ errors }: { errors?: Record<string, string> }) {
  return (
    <>
      <div>
        <Label className="flex items-center mb-1">
          <Mail size={16} color="grey" className="mr-1" />
          Email
          {errors?.email ? <Badge variant="destructive" className="ml-1 text-xs">{errors?.email}</Badge> : null}
        </Label>
        <Input type="email" name="email" placeholder="user@email.com"></Input>
      </div>

      <div className="mt-4">
        <Label className="flex items-center mb-1">
          <Lock size={16} color="grey" className="mr-1" />
          Password
          {errors?.password ? <Badge variant="destructive" className="ml-1 text-xs">{errors?.password}</Badge> : null}
        </Label>
        <Input type="password" name="password"></Input>
      </div>
    </>
  )
}