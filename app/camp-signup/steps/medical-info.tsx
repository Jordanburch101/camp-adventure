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