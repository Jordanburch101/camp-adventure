'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from "@/hooks/use-toast"

interface ReviewProps {
  formData: {
    personalInfo: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      email: string;
    };
    medicalInfo: {
      allergies: string;
      medications: string;
      dietaryRestrictions: string;
      hasInsurance: boolean;
      insuranceProvider?: string;
      policyNumber?: string;
    };
    activities: string[];
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      alternatePhone?: string;
      email: string;
    };
    badgePicture: string;
  }
  onSubmit: (data: object) => void
  onBack: () => void
}

export function Review({ formData, onSubmit, onBack }: ReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: formData.personalInfo,
          badgeImage: formData.badgePicture,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Registration Successful",
          description: "Check your email for confirmation details.",
        })
        setIsSubmitted(true)
        onSubmit(formData)
      } else {
        throw new Error(result.error || 'Failed to send confirmation email')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Registration Error",
        description: "There was a problem submitting your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">Registration Complete!</h2>
        <p className="text-gray-600">
          Thank you for registering for our camp. We've sent a confirmation email with additional details.
        </p>
        <svg
          className="mx-auto w-24 h-24 from-green-400 to-teal-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="url(#gradient)"
          strokeWidth={2}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" /> {/* green-400 */}
              <stop offset="100%" stopColor="#14b8a6" /> {/* teal-500 */}
            </linearGradient>
          </defs>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Review Your Information</h2>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <p>Name: {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
          <p>Date of Birth: {new Date(formData.personalInfo.dateOfBirth).toLocaleDateString()}</p>
          <p>Gender: {formData.personalInfo.gender}</p>
          <p>Email: {formData.personalInfo.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Medical Information</h3>
          <p>Allergies: {formData.medicalInfo.allergies || 'None'}</p>
          <p>Medications: {formData.medicalInfo.medications || 'None'}</p>
          <p>Dietary Restrictions: {formData.medicalInfo.dietaryRestrictions || 'None'}</p>
          <p>Insurance: {formData.medicalInfo.hasInsurance ? 'Yes' : 'No'}</p>
          {formData.medicalInfo.hasInsurance && (
            <>
              <p>Insurance Provider: {formData.medicalInfo.insuranceProvider}</p>
              <p>Policy Number: {formData.medicalInfo.policyNumber}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Activities</h3>
          <ul className="list-disc list-inside">
            {formData.activities.map((activity: string) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
          <p>Name: {formData.emergencyContact.name}</p>
          <p>Relationship: {formData.emergencyContact.relationship}</p>
          <p>Phone: {formData.emergencyContact.phone}</p>
          <p>Alternate Phone: {formData.emergencyContact.alternatePhone || 'N/A'}</p>
          <p>Email: {formData.emergencyContact.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Badge Picture</h3>
          {formData.badgePicture ? (
            <img src={formData.badgePicture} alt="Badge" className="w-32 h-32 object-cover rounded-md" />
          ) : (
            <p>No badge picture uploaded</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-green-400 to-teal-500 text-white" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.form>
  )
}

