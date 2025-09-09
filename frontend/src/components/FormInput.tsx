import { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" {...props} />
    </div>
  )
}


