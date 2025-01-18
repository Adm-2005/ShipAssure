import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select"

type OrganizationDetailsStepProps = {
  organizationDetails: {
    name: string
    employeeCount: string
    type: string
    yearsInBusiness: string
  }
  setOrganizationDetails: (details: {
    name: string
    employeeCount: string
    type: string
    yearsInBusiness: string
  }) => void
  onNext: () => void
  onBack: () => void
}

export function OrganizationDetailsStep({
  organizationDetails,
  setOrganizationDetails,
  onNext,
  onBack
}: OrganizationDetailsStepProps) {
  const handleChange = (field: string, value: string) => {
    setOrganizationDetails({ ...organizationDetails, [field]: value })
  }

  const isFormValid = () => {
    return (
      organizationDetails.name &&
      organizationDetails.employeeCount &&
      organizationDetails.type &&
      organizationDetails.yearsInBusiness
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            id="org-name"
            value={organizationDetails.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your organization name"
          />
        </div>
        <div>
          <Label htmlFor="employee-count">Number of Employees</Label>
          <Input
            id="employee-count"
            value={organizationDetails.employeeCount}
            onChange={(e) => handleChange('employeeCount', e.target.value)}
            placeholder="Enter the number of employees"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="org-type">Organization Type</Label>
          <Select
            value={organizationDetails.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shipper">Small business</SelectItem>
              <SelectItem value="carrier">Large business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="years-in-business">Years in Business</Label>
          <Input
            id="years-in-business"
            value={organizationDetails.yearsInBusiness}
            onChange={(e) => handleChange('yearsInBusiness', e.target.value)}
            placeholder="Enter years in business"
            type="number"
          />
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <Button onClick={onBack} variant="outline" className="w-full">
          Back
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} className="w-full">
          Next
        </Button>
      </div>
    </div>
  )
}

