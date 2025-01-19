import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/Select';

type OrganizationDetails = {
  name: string;
  type: string;
  address: string;
  modes?: string[];
  industry?: string;
};

type OrganizationDetailsStepProps = {
  organizationDetails: OrganizationDetails;
  setOrganizationDetails: (details: OrganizationDetails) => void;
  individualType: 'shipper' | 'carrier';
  onNext: () => void;
  onBack: () => void;
};

export function OrganizationDetailsStep({
  organizationDetails,
  setOrganizationDetails,
  individualType,
  onNext,
  onBack,
}: OrganizationDetailsStepProps) {
  const handleChange = (field: string, value: string | string[]) => {
    setOrganizationDetails({ ...organizationDetails, [field]: value });
  };

  const handleModeToggle = (mode: string) => {
    const currentModes = organizationDetails.modes || [];
    const newModes = currentModes.includes(mode)
      ? currentModes.filter(m => m !== mode)
      : [...currentModes, mode];
    handleChange('modes', newModes);
  };

  const isFormValid = () => {
    const baseFieldsValid = 
      organizationDetails.name &&
      organizationDetails.type &&
      organizationDetails.address;

    if (individualType === 'shipper') {
      return baseFieldsValid && organizationDetails.industry;
    } else {
      return baseFieldsValid && (organizationDetails.modes?.length ?? 0) > 0;
    }
  };

  const transportModes = ['air', 'water', 'railway', 'road'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            id="org_name"
            value={organizationDetails.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your organization name"
          />
        </div>
        <div>
          <Label htmlFor="org_type">Organization Type</Label>
          <Select
            value={organizationDetails.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="small_business">Small business</SelectItem>
              <SelectItem value="large_business">Large business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={organizationDetails.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        {individualType === 'shipper' && (
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={organizationDetails.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              placeholder="Enter your industry"
            />
          </div>
        )}

        {individualType === 'carrier' && (
          <div className="space-y-2">
            <Label>Transport Modes</Label>
            <div className="space-y-2">
            {transportModes.map((mode) => (
              <div key={mode} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={mode}
                  checked={(organizationDetails.modes || []).includes(mode)}
                  onChange={() => handleModeToggle(mode)}
                />
                <Label htmlFor={mode} className="capitalize">
                  {mode}
                </Label>
              </div>

              ))}
            </div>
          </div>
        )}
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
  );
}