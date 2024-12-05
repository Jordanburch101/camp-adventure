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
    email: data.email || '',
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
        const result = reader.result as string
        setFormData(prev => ({ ...prev, badgePicture: result }))
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
      setFormData(prev => ({ ...prev, badgePicture: imageDataUrl }))
      stopWebcam()
      setDialogOpen(false)
    }
  }, [stopWebcam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ personalInfo: { ...formData, email: formData.email || '', badgePicture: formData.badgePicture } })
  }
  // test
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
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

