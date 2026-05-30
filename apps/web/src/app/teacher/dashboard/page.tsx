import { createClient } from '../../../lib/supabase/server'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'

export default async function TeacherDashboard() {
  const supabase = await createClient()

  // Fetch all students
  const { data: students } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'STUDENT')

  // Fetch recent practice logs
  const { data: logs } = await supabase
    .from('practice_logs')
    .select('*')
    .order('date', { ascending: false })

  // Calculate some basic stats for each student
  const roster = students?.map(student => {
    const studentLogs = logs?.filter(l => l.student_id === student.id) || []
    const lastLog = studentLogs[0]
    
    // Check inactivity (if > 5 days since last log)
    const inactiveDays = lastLog ? Math.floor((new Date().getTime() - new Date(lastLog.date).getTime()) / (1000 * 3600 * 24)) : 999
    
    return {
      ...student,
      lastPractice: lastLog ? lastLog.date : 'Never',
      inactiveWarning: inactiveDays > 5
    }
  })

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Teacher Dashboard</h1>
          <form action={logout}>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-navy hover:bg-gray-50 transition-colors">
              Sign out
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-navy mb-4">Student Roster</h2>
            <div className="space-y-4">
              {roster?.map(student => (
                <div key={student.id} className={`p-4 border rounded flex justify-between items-center ${student.inactiveWarning ? 'border-red-200 bg-red-50' : ''}`}>
                  <div>
                    <h3 className="font-bold text-navy">{student.name}</h3>
                    <p className="text-sm text-gray-500">Last Practice: {student.lastPractice}</p>
                  </div>
                  {student.inactiveWarning && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">Inactive &gt; 5 days</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-min">
            <h2 className="text-xl font-semibold text-navy mb-4">Quick Actions</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/teacher/assignments" className="block w-full text-left px-4 py-2 bg-amber/10 text-amber font-medium rounded-md hover:bg-amber/20 transition-colors">
                  Manage Assignments
                </Link>
              </li>
              <li>
                <Link href={"/teacher/curriculum" as any} className="block w-full text-left px-4 py-2 bg-navy/5 text-navy font-medium rounded-md hover:bg-navy/10 transition-colors">
                  Edit Curriculum
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
