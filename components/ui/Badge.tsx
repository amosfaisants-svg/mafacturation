import { cn } from "@/lib/utils"

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'paid' | 'sent' | 'draft' | 'overdue';
}

export function Badge({ className, variant = 'draft', ...props }: BadgeProps) {
  const variants = {
    paid: "bg-green-100 text-green-700 border-green-200",
    sent: "bg-orange-100 text-orange-700 border-orange-200",
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    overdue: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
