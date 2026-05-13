import { format, parseISO } from 'date-fns'

export default function PracticeHistoryTable({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-navy/60 font-medium">
        No practice logs yet. Hit the kitchen!
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy/5 border-b border-navy/10 text-navy/70 text-sm font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">S.A.U.C.E. Stage</th>
              <th className="px-6 py-4">Focus</th>
              <th className="px-6 py-4 text-center">Feel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {logs.slice(0, 10).map((log) => (
              <tr key={log.id} className="hover:bg-navy/[0.02] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                  {format(parseISO(log.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber font-bold">
                  {log.duration_minutes} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-navy/10 text-navy">
                    {log.sauce_stage ? log.sauce_stage.split(' ')[0] : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-navy/80 max-w-xs truncate">
                  {log.what_practiced}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
                    ${log.feel_rating >= 4 ? 'bg-green-100 text-green-700' : 
                      log.feel_rating === 3 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {log.feel_rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
