import { createClient } from '@/lib/supabase/server'
import { Building2, Users, Activity, Wallet, Search, CheckCircle, XCircle } from 'lucide-react'

export default async function MasterDashboard() {
  const supabase = await createClient()

  // Fetch data using the RPC functions we created
  const { data: schoolsData, error: schoolsError } = await supabase.rpc('saas_get_all_schools')
  const { data: usersData, error: usersError } = await supabase.rpc('saas_get_all_users')

  const schools = schoolsData || []
  const users = usersData || []

  // Metrics
  const totalSchools = schools.length
  const totalUsers = users.length
  const activeSchools = schools.filter((s: any) => s.status === 'active').length
  const mrrPlaceholder = 'R$ ' + (activeSchools * 299).toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Global</h1>
        <p className="text-gray-400 mt-1">Visão geral do ecossistema SaaS Wakoda.</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Escolas Cadastradas" value={totalSchools.toString()} icon={<Building2 />} color="from-blue-500 to-cyan-500" />
        <MetricCard title="Escolas Ativas" value={activeSchools.toString()} icon={<Activity />} color="from-emerald-500 to-teal-500" />
        <MetricCard title="Total de Usuários" value={totalUsers.toString()} icon={<Users />} color="from-purple-500 to-indigo-500" />
        <MetricCard title="MRR Estimado" value={mrrPlaceholder} icon={<Wallet />} color="from-amber-500 to-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tabela de Escolas */}
        <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#111] to-[#151515]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Escolas Recentes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-[#0a0a0a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escola</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membros</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {schools.slice(0, 5).map((school: any) => (
                  <tr key={school.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">{school.name}</div>
                      <div className="text-xs text-gray-500">{new Date(school.created_at).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {school.total_students} alunos / {school.total_teachers} profs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        school.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {school.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {school.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#111] to-[#151515]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Usuários Recentes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-[#0a0a0a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.slice(0, 5).map((user: any, idx: number) => (
                  <tr key={user.id + idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.school_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500`}>
        <div className={`w-24 h-24 bg-gradient-to-br ${color} rounded-full blur-2xl`}></div>
      </div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-medium text-sm">{title}</span>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-black tracking-tight text-white">{value}</div>
      </div>
    </div>
  )
}
