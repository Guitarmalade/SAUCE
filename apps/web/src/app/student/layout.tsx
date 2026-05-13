import { Topbar } from '@/components/Topbar'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="page relative z-10">
      <Topbar />
      {children}
    </div>
  )
}
