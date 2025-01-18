"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from submitting if validation fails
    const form = e.target as HTMLFormElement;
    
    // Check if the form is valid
    if (form.checkValidity()) {
      // If valid, proceed with form submission logic (e.g., navigating to the next page)
      console.log("Form is valid, submitting...");
      navigate('/pages/onboarding') // Navigate to the onboarding page if the form is valid
    } else {
      console.log("Please fill all required fields.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
            <p className="text-sm text-muted-foreground">
              Make your booking experience excellent
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">FIRST NAME</Label>
                <Input id="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">LAST NAME</Label>
                <Input id="lastName" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">EMAIL</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">COUNTRY</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">PHONE NUMBER</Label>
              <div className="flex space-x-2">
                <Select defaultValue="+91" required>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+91">+91</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone" type="tel" className="flex-1" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">PASSWORD</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* "Who you are" dropdown */}
            <div className="space-y-2">
              <Label htmlFor="role">WHO YOU ARE</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipper">Shipper</SelectItem>
                  <SelectItem value="carrier">Carrier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
              .
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          
          <div className="space-y-2 text-center text-sm">
            <div>
              Back to{" "}
              <Link to="/pages/signin" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
            <div>
              Are you interested in{" "}
              <Link to="/vendor-account" className="text-blue-600 hover:text-blue-500">
                Vendor account
              </Link>
              ?
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
