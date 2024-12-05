const fs = require('fs').promises;
const path = require('path');

const files = [
  {
    path: 'app/page.tsx',
    content: `
import CampSignup from './camp-signup/page'

export default function Home() {
  return <CampSignup />
}
`
  },
  {
    path: 'app/camp-signup/page.tsx',
    content: `
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

export default function CampSignup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    personalInfo: {},
    medicalInfo: {},
    activities: [],
    emergencyContact: {},
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
            {currentStep === 4 && <Review formData={formData} onSubmit={handleSubmit} onBack={handleBack} />}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
`
  },
  {
    path: 'app/camp-signup/progress-indicator.tsx',
    content: `
import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  completedSteps: number[]
  onStepClick: (step: number) => void
}

export function ProgressIndicator({ steps, currentStep, completedSteps, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <motion.button
            className={\`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer \${
              index <= currentStep ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gray-200'
            } \${completedSteps.includes(index) || index <= Math.max(...completedSteps, 0) ? 'hover:opacity-80' : 'cursor-not-allowed'}\`}
            initial={false}
            animate={{
              scale: index === currentStep ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
            onClick={() => onStepClick(index)}
            disabled={!completedSteps.includes(index) && index > Math.max(...completedSteps, 0)}
          >
            <span className="text-white text-sm font-bold">{index + 1}</span>
          </motion.button>
          <span className="text-xs mt-2">{step}</span>
        </div>
      ))}
    </div>
  )
}
`
  },
  {
    path: 'app/camp-signup/steps/personal-info.tsx',
    content: `
'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format } from "date-fns"
import { CalendarIcon, Camera, Upload } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface PersonalInfoProps {
  onNext: (data: object) => void
  data: any
}

export function PersonalInfo({ onNext, data }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    dateOfBirth: data.dateOfBirth || '',
    gender: data.gender || '',
    badgePicture: data.badgePicture || null,
  })
  const [webcamActive, setWebcamActive] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, badgePicture: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setWebcamActive(true)
      }
    } catch (err) {
      console.error("Error accessing the webcam", err)
    }
  }, [])

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setWebcamActive(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setFormData({ ...formData, badgePicture: imageDataUrl })
      stopWebcam()
      setDialogOpen(false)
    }
  }, [formData, stopWebcam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ personalInfo: formData })
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.dateOfBirth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
              onSelect={(date) => setFormData({ ...formData, dateOfBirth: date ? date.toISOString().split('T')[0] : '' })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select name="gender" onValueChange={(value) => setFormData({ ...formData, gender: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="preferNotToSay">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Badge Picture</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="badge-picture-upload"
          />
          <Label
            htmlFor="badge-picture-upload"
            className="cursor-pointer flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Picture
          </Label>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => {
                setDialogOpen(true)
                startWebcam()
              }}>
                <Camera className="w-4 h-4 mr-2" />
                Use Webcam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Take a Picture</DialogTitle>
                <DialogDescription>
                  Use your webcam to take a picture for your badge.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center">
                <video 
                  ref={videoRef} 
                  className="mb-4 w-full max-w-sm rounded-lg border border-gray-200" 
                  autoPlay 
                  playsInline
                />
                <div className="flex items-center gap-2">
                  <Button onClick={capturePhoto} disabled={!webcamActive}>
                    Capture Photo
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={stopWebcam}>
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {formData.badgePicture && (
          <div className="mt-4 flex items-start">
            <img 
              src={formData.badgePicture} 
              alt="Badge" 
              className="w-32 h-32 object-cover rounded-lg border border-gray-200" 
            />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white">
        Next
      </Button>
    </motion.form>
  )
}
`
  },
  {
    path: 'app/camp-signup/steps/medical-info.tsx',
    content: `
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface MedicalInfoProps {
  onNext: (data: object) => void
  onBack: () => void
  data: any
}

export function MedicalInfo({ onNext, onBack, data }: MedicalInfoProps) {
  const [formData, setFormData] = useState({
    allergies: data.allergies || '',
    medications: data.medications || '',
    dietaryRestrictions: data.dietaryRestrictions || '',
    hasInsurance: data.hasInsurance || false,
    insuranceProvider: data.insuranceProvider || '',
    policyNumber: data.policyNumber || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, hasInsurance: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ medicalInfo: formData })
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Medical Information</h2>
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          placeholder="List any allergies"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medications">Medications</Label>
        <Textarea
          id="medications"
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          placeholder="List any medications"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
        <Input
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          placeholder="Any dietary restrictions"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasInsurance"
          checked={formData.hasInsurance}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="hasInsurance">Do you have health insurance?</Label>
      </div>
      {formData.hasInsurance && (
        <>
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input
              id="policyNumber"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
          Next
        </Button>
      </div>
    </motion.form>
  )
}
`
  },
  {
    path: 'app/camp-signup/steps/activities.tsx',
    content: `
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface ActivitiesProps {
  onNext: (data: object) => void
  onBack: () => void
  data: string[]
}

const activities = [
  'Hiking',
  'Swimming',
  'Canoeing',
  'Archery',
  'Rock Climbing',
  'Arts and Crafts',
  'Nature Studies',
  'Campfire Cooking',
  'Team Building Games',
  'Stargazing',
]

export function Activities({ onNext, onBack, data }: ActivitiesProps) {
  const [selectedActivities, setSelectedActivities] = useState<string[]>(data || [])

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ activities: selectedActivities })
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Choose Your Activities</h2>
      <div className="grid grid-cols-2 gap-4">
        {activities.map((activity) => (
          <div key={activity} className="flex items-center space-x-2">
            <Checkbox
              id={activity}
              checked={selectedActivities.includes(activity)}
              onCheckedChange={() => handleActivityToggle(activity)}
            />
            <Label htmlFor={activity}>{activity}</Label>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
          Next
        </Button>
      </div>
    </motion.form>
  )
}
`
  },
  {
    path: 'app/camp-signup/steps/emergency-contact.tsx',
    content: `
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


interface EmergencyContactProps {
  onNext: (data: object) => void
  onBack: () => void
  data: any
}

export function EmergencyContact({ onNext, onBack, data }: EmergencyContactProps) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    relationship: data.relationship || '',
    phone: data.phone || '',
    alternatePhone: data.alternatePhone || '',
    email: data.email || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ emergencyContact: formData })
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Emergency Contact Information</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="relationship">Relationship</Label>
        <Input
          id="relationship"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
        <Input
          id="alternatePhone"
          name="alternatePhone"
          type="tel"
          value={formData.alternatePhone}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
          Next
        </Button>
      </div>
    </motion.form>
  )
}
`
  },
  {
    path: 'app/camp-signup/steps/review.tsx',
    content: `
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"

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
          <img src={formData.badgePicture} alt="Badge" className="w-32 h-32 object-cover rounded-md" />
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
`
  },
  {
    path: 'app/api/send-confirmation/route.ts',
    content: `
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { personalInfo, badgeImage } = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'Camp Adventure <noreply@campadventure.com>',
      to: [personalInfo.email],
      subject: 'Camp Adventure Registration Confirmation',
      html: \`
        <h1>Welcome to Camp Adventure, \${personalInfo.firstName}!</h1>
        <p>Your registration has been received. We're excited to see you at the camp!</p>
        <p>Your badge image is attached to this email.</p>
      \`,
      attachments: [
        {
          filename: 'badge.jpg',
          content: badgeImage.split(',')[1],
        },
      ],
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 })
  }
}
`
  },
];

async function createFile(filePath, content) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content.trim());
    console.log(`Created file: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file ${filePath}:`, error);
  }
}

async function generateProject() {
  for (const file of files) {
    await createFile(file.path, file.content);
  }
  console.log('Project generation complete!');
}

generateProject();

