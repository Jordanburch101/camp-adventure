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
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
              index <= currentStep ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gray-200'
            } ${completedSteps.includes(index) || index <= Math.max(...completedSteps, 0) ? 'hover:opacity-80' : 'cursor-not-allowed'}`}
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