import { z } from "zod"
import { ReactNode } from "react"

// Base field configuration
export interface BaseFieldConfig {
  name: string
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

// Field types
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'hidden'
  | 'custom'

// Option for select/radio fields
export interface FieldOption {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
}

// Field configuration with type-specific options
export interface FieldConfig extends BaseFieldConfig {
  type: FieldType
  defaultValue?: any
  validation?: z.ZodSchema
  
  // For select/radio/checkbox
  options?: FieldOption[]
  multiple?: boolean
  
  // For number inputs
  min?: number
  max?: number
  step?: number
  
  // For text inputs
  minLength?: number
  maxLength?: number
  pattern?: string
  
  // For file inputs
  accept?: string
  maxSize?: number
  
  // For custom fields
  component?: React.ComponentType<any>
  componentProps?: Record<string, any>
  
  // Conditional rendering
  condition?: (values: Record<string, any>) => boolean
  
  // Field dependencies
  dependsOn?: string[]
  
  // Formatting
  format?: (value: any) => string
  parse?: (value: string) => any
}

// Form section configuration
export interface FormSection {
  id: string
  title?: string
  description?: string
  fields: FieldConfig[]
  collapsible?: boolean
  defaultExpanded?: boolean
  condition?: (values: Record<string, any>) => boolean
  className?: string
}

// Form step for multi-step forms
export interface FormStep {
  id: string
  title: string
  description?: string
  sections: FormSection[]
  validation?: z.ZodSchema
  condition?: (values: Record<string, any>) => boolean
  optional?: boolean
}

// Form configuration
export interface FormConfig {
  id: string
  title?: string
  description?: string
  schema: z.ZodSchema
  steps?: FormStep[]
  sections?: FormSection[]
  layout?: 'single' | 'two-column' | 'three-column' | 'grid'
  submitText?: string
  cancelText?: string
  resetText?: string
  showProgress?: boolean
  showFieldErrors?: boolean
  showSummaryErrors?: boolean
  autoSave?: boolean
  autoSaveDelay?: number
  className?: string
}

// Form state
export interface FormState {
  values: Record<string, any>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValidating: boolean
  isDirty: boolean
  isValid: boolean
  currentStep?: number
  completedSteps?: number[]
}

// Form actions
export interface FormActions {
  setValue: (name: string, value: any) => void
  setValues: (values: Record<string, any>) => void
  setError: (name: string, error: string | string[]) => void
  setErrors: (errors: Record<string, string[]>) => void
  clearError: (name: string) => void
  clearErrors: () => void
  setTouched: (name: string, touched?: boolean) => void
  setTouchedFields: (fields: Record<string, boolean>) => void
  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  reset: () => void
  submit: () => Promise<void>
  
  // Multi-step form actions
  nextStep?: () => void
  previousStep?: () => void
  goToStep?: (step: number) => void
}

// Form event handlers
export interface FormEventHandlers {
  onSubmit?: (values: Record<string, any>) => Promise<void> | void
  onCancel?: () => void
  onReset?: () => void
  onChange?: (values: Record<string, any>) => void
  onFieldChange?: (name: string, value: any) => void
  onValidationError?: (errors: Record<string, string[]>) => void
  onStepChange?: (step: number) => void
}

// Form context type
export interface FormContextType {
  config: FormConfig
  state: FormState
  actions: FormActions
  handlers: FormEventHandlers
}

// Form field props
export interface FormFieldProps {
  config: FieldConfig
  value: any
  error?: string[]
  touched?: boolean
  onChange: (value: any) => void
  onBlur: () => void
  disabled?: boolean
}

// Form validation result
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean
  delay: number
  key: string
  onSave?: (values: Record<string, any>) => Promise<void>
  onRestore?: () => Promise<Record<string, any>>
} 