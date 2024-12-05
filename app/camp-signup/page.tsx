'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PersonalInfo } from './steps/personal-info'
import { MedicalInfo } from './steps/medical-info'
import { Activities } from './steps/activities'
import { EmergencyContact } from './steps/emergency-contact'
import { Review } from './steps/review'
import { ProgressIndicator } from './progress-indicator'
import { Card, CardContent } from '@/components/ui/card'

const steps = ['Personal Info', 'Medical Info', 'Activities', 'Emergency Contact', 'Review']

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  badgePicture: string;
}

interface MedicalInfo {
  allergies: string;
  medications: string;
  dietaryRestrictions: string;
  hasInsurance: boolean;
  insuranceProvider?: string;
  policyNumber?: string;
}

interface FormData {
  personalInfo: PersonalInfo;
  medicalInfo: MedicalInfo;
  activities: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
}

export default function CampSignup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      badgePicture: '',
    },
    medicalInfo: {
      allergies: '',
      medications: '',
      dietaryRestrictions: '',
      hasInsurance: false,
    },
    activities: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
  })
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleNext = (data: object) => {
    const updatedFormData = { ...formData, [Object.keys(data)[0]]: Object.values(data)[0] }
    setFormData(updatedFormData)
    setCurrentStep((prev) => {
      const nextStep = Math.min(prev + 1, steps.length - 1)
      if (!completedSteps.includes(prev)) {
        setCompletedSteps([...completedSteps, prev])
      }
      return nextStep
    })
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step <= Math.max(...completedSteps, 0)) {
      setCurrentStep(step)
    }
  }

  const handleSubmit = (data: object) => {
    const finalData = { ...formData, ...data }
    console.log('Form submitted:', finalData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
          Camp Adventure Sign Up
        </h1>
        <ProgressIndicator 
          steps={steps} 
          currentStep={currentStep} 
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
        <Card className="mt-8">
          <CardContent className="p-8">
            {currentStep === 0 && <PersonalInfo onNext={handleNext} data={formData.personalInfo} />}
            {currentStep === 1 && <MedicalInfo onNext={handleNext} onBack={handleBack} data={formData.medicalInfo} />}
            {currentStep === 2 && <Activities onNext={handleNext} onBack={handleBack} data={formData.activities} />}
            {currentStep === 3 && <EmergencyContact onNext={handleNext} onBack={handleBack} data={formData.emergencyContact} />}
            {currentStep === 4 && <Review formData={{...formData, badgePicture: formData.personalInfo.badgePicture}} onSubmit={handleSubmit} onBack={handleBack} />}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

