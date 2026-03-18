import { Suspense } from "react"
import MembersContent from "@/app/members/components/members-content"

export default function MembersPage() {
  return (
    <Suspense fallback={null}>
      <MembersContent />
    </Suspense>
  )
}
