"use client"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Button } from "../components/ui/Button"
import { UserTypeStep } from '../components/Onboarding/UserTypeStep'
import { IndividualTypeStep } from '../components/Onboarding/IndividualTypeStep'
import { OrganizationDetailsStep } from '../components/Onboarding/OrganisationDetailStep'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<'individual' | 'organization' | null>(null)
  const [individualType, setIndividualType] = useState<'shipper' | 'carrier' | null>(null)
  const [organizationDetails, setOrganizationDetails] = useState({
    name: '',
    employeeCount: '',
    type: '',
    yearsInBusiness: ''
  })

  const router = useNavigate()

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleGotoDashboard = () => {
    if (userType === 'individual' && individualType) {
      router(`/dashboard/${individualType}`)
    } else if (userType === 'organization') {
      router(`/dashboard/${organizationDetails.type}`)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Profile</h1>
      
      {step === 1 && (
        <UserTypeStep 
          userType={userType} 
          setUserType={setUserType} 
          onNext={handleNext} 
        />
      )}

      {step === 2 && userType === 'individual' && (
        <IndividualTypeStep 
          individualType={individualType} 
          setIndividualType={setIndividualType} 
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 2 && userType === 'organization' && (
        <OrganizationDetailsStep 
          organizationDetails={organizationDetails}
          setOrganizationDetails={setOrganizationDetails}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
          <p className="mb-4">Your profile has been completed successfully.</p>
          <Button 
            onClick={handleGotoDashboard}
            className="bg-[#020B2D] hover:bg-[#091642] text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}
