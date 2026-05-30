import { createClient } from '../../_supabase/server'
import { revalidatePath } from 'next/cache'

export default async function StudentAssignmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', user?.id)
    .order('created_at', { ascending: false })

  async function updateStatus(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    const status = formData.get('status') as string

    await supabase.from('assignments').update({ status }).eq('id', id)
    revalidatePath('/student/assignments')
  }

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-navy">My Assignments</h1>
        
        <div className="space-y-4">
          {assignments?.map(a => (
            <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-navy">{a.title}</h3>
                <span className="px-3 py-1 text-xs bg-amber/20 text-amber font-bold rounded-full">
                  {a.status}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{a.instructions}</p>
              
              <form action={updateStatus} className="flex gap-2">
                <input type="hidden" name="id" value={a.id} />
                <select name="status" defaultValue={a.status} className="border rounded p-2">
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready for Review">Ready for Review</option>
                </select>
                <button className="bg-navy text-white px-4 py-2 rounded">Update Status</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
