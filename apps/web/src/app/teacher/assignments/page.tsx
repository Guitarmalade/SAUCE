import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function TeacherAssignmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: students } = await supabase
    .from('users')
    .select('id, name')
    .eq('role', 'STUDENT')

  const { data: assignments } = await supabase
    .from('assignments')
    .select(`*, student:users!student_id(name)`)
    .eq('teacher_id', user?.id)
    .order('created_at', { ascending: false })

  async function createAssignment(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const student_id = formData.get('student_id') as string
    const title = formData.get('title') as string
    const instructions = formData.get('instructions') as string

    await supabase.from('assignments').insert({
      teacher_id: user.id,
      student_id,
      title,
      instructions,
      status: 'Not Started'
    })

    revalidatePath('/teacher/assignments')
  }

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-navy">Manage Assignments</h1>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
          <form action={createAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select name="student_id" required className="w-full border rounded p-2">
                {students?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instructions</label>
              <textarea name="instructions" required className="w-full border rounded p-2" rows={3}></textarea>
            </div>
            <button className="bg-navy text-white px-4 py-2 rounded">Assign</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Recent Assignments</h2>
          <div className="space-y-4">
            {assignments?.map(a => (
              <div key={a.id} className="p-4 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{a.title}</h3>
                    <p className="text-sm text-gray-600">Assigned to: {(a.student as any)?.name}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-amber/20 text-amber font-bold rounded-full">
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
