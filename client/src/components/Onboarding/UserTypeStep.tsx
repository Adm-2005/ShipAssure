import { Button } from "../../components/ui/Button"

type UserTypeStepProps = {
  userType: 'individual' | 'organization' | null
  setUserType: (type: 'individual' | 'organization') => void
  onNext: () => void
}

export function UserTypeStep({ userType, setUserType, onNext }: UserTypeStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Are you an individual or an organization?</h2>
      <div className="flex space-x-4">
        <Button
          onClick={() => setUserType('individual')}
          variant={userType === 'individual' ? 'default' : 'outline'}
          className="w-full"
        >
          Individual
        </Button>
        <Button
          onClick={() => setUserType('organization')}
          variant={userType === 'organization' ? 'default' : 'outline'}
          className="w-full"
        >
          Organization
        </Button>
      </div>
      <Button onClick={onNext} disabled={!userType} className="w-full mt-4">
        Next
      </Button>
    </div>
  )
}

