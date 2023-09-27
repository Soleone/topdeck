import { Lock, Mail, UserPlus2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function UserInputs() {
  return (
    <>
      <div>
        <Label className="flex items-center mb-1">
          <Mail size={16} color="grey" className="mr-1" />
          Email
        </Label>
        <Input type="email" name="email"></Input>
      </div>

      <div className="mt-4">
        <Label className="flex items-center mb-1">
          <Lock size={16} color="grey" className="mr-1" />
          Password
        </Label>
        <Input type="password" name="password"></Input>
      </div>
    </>
  )
}