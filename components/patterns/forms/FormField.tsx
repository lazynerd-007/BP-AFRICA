"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconCalendar, IconEye, IconEyeOff, IconX } from "@tabler/icons-react"
import { format } from "date-fns"
import { FormFieldProps } from "./types"

export function FormField({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  
  const hasError = error && error.length > 0 && touched
  const fieldId = `field-${config.name}`

  // Handle multi-select
  const handleMultiSelectChange = (selectedValue: string) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValues = currentValues.includes(selectedValue)
      ? currentValues.filter(v => v !== selectedValue)
      : [...currentValues, selectedValue]
    onChange(newValues)
  }

  // Render field based on type
  const renderField = () => {
    switch (config.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
      case 'search':
        return (
          <Input
            id={fieldId}
            type={config.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            disabled={disabled || config.disabled}
            readOnly={config.readOnly}
            className={cn(hasError && "border-destructive")}
          />
        )

      case 'password':
        return (
          <div className="relative">
            <Input
              id={fieldId}
              type={showPassword ? 'text' : 'password'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={config.placeholder}
              disabled={disabled || config.disabled}
              className={cn(hasError && "border-destructive", "pr-10")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
            </Button>
          </div>
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            disabled={disabled || config.disabled}
            className={cn(hasError && "border-destructive")}
          />
        )

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={cn(hasError && "border-destructive")}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={value || false}
              onCheckedChange={onChange}
              disabled={disabled || config.disabled}
            />
            <Label htmlFor={fieldId}>{config.label}</Label>
          </div>
        )

      default:
        return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} />
    }
  }

  const showLabel = !['checkbox', 'switch', 'hidden'].includes(config.type)

  return (
    <div className={cn("space-y-2", config.className)}>
      {showLabel && (
        <Label htmlFor={fieldId} className={cn(hasError && "text-destructive")}>
          {config.label}
          {config.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      {renderField()}
      
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      
      {hasError && (
        <div className="text-sm text-destructive">
          {error.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </div>
      )}
    </div>
  )
} 