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