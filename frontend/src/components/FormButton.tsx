import { ButtonHTMLAttributes } from 'react'

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export default function FormButton({ loading, loadingText, children, ...props }: FormButtonProps) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (loadingText || 'กำลังดำเนินการ...') : children}
    </button>
  )
}


