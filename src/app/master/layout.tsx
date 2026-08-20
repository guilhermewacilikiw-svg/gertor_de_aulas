import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Users, Building, Settings, LogOut, Shield } from 'lucide-react'

export default async function MasterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifica se é SUPER_ADMIN
  const { data: publicUser } = await supabase
    .from('users')
    .select('id, name')
    .eq('auth_user_id', user.id)
    .single()

  if (publicUser) {
    const { data: membershipData } = await supabase
      .from('school_memberships')
      .select('role')
      .eq('user_id', publicUser.id)
      .eq('role', 'SUPER_ADMIN')
      .limit(1)
      .single()

    if (!membershipData) {
      redirect('/') // Acesso negado
    }
  } else {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      {/* Navbar Superior (Dark Mode Premium) */}
      <nav className="border-b border-purple-900/30 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  SaaS Master
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link href="/master/dashboard" className="border-purple-500 text-purple-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Visão Global
                </Link>
                <Link href="#" className="border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Building className="w-4 h-4 mr-2" />
                  Escolas
                </Link>
                <Link href="#" className="border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Usuários
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Olá, <span className="text-purple-400 font-semibold">{publicUser.name}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button type="submit" className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10">
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
