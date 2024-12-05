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