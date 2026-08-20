import { createClient } from '@/lib/supabase/server';
import { PerformanceDashboard, PerformanceData } from '@/components/student/PerformanceDashboard';

export default async function AlunoDesempenhoPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const { data: studentRecord } = await supabase
    .from('students')
    .select('id, school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!studentRecord) redirect('/login');

  const studentId = studentRecord.id;
  const schoolId = studentRecord.school_id;

  // 1. Fetch Attendance
  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('status, created_at, lessons(topic)')
    .eq('student_id', studentId);

  let totalPresent = 0;
  let totalAbsent = 0;
  
  attendanceData?.forEach(a => {
    if (a.status === 'present') totalPresent++;
    if (a.status === 'absent' || a.status === 'justified') totalAbsent++;
  });

  const totalAttendance = totalPresent + totalAbsent;
  const attendanceRate = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0;

  // 2. Fetch Digital Progress (Videos vs PDFs/Exercises)
  const { data: progressData } = await supabase
    .from('student_progress')
    .select('status, created_at, contents(title, type)')
    .eq('student_id', studentId);

  let completedContents = 0; // video, link
  let completedExercises = 0; // pdf, document

  progressData?.filter(p => p.status === 'completed').forEach(p => {
    const type = (p.contents as any)?.type;
    if (type === 'pdf' || type === 'document') {
      completedExercises++;
    } else {
      completedContents++;
    }
  });
  
  const totalContents = completedContents > 0 ? completedContents : 0; // Strictly what was delivered
  const totalExercises = completedExercises > 0 ? completedExercises : 0;

  // 3. Build Recent Activities Feed
  const recentActivities: PerformanceData['recentActivities'] = [];

  attendanceData?.forEach(a => {
    recentActivities.push({
      id: `att-${Math.random()}`,
      date: new Date(a.created_at),
      type: 'attendance',
      title: (a.lessons as any)?.topic || 'Aula ao vivo',
      status: a.status
    });
  });

  progressData?.filter(p => p.status === 'completed').forEach(p => {
    const type = (p.contents as any)?.type;
    const isExercise = type === 'pdf' || type === 'document';

    recentActivities.push({
      id: `prog-${Math.random()}`,
      date: new Date(p.created_at),
      type: isExercise ? 'exercise' : 'content',
      title: (p.contents as any)?.title || 'Material Digital',
      status: 'completed'
    });
  });

  // Sort by date desc
  recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
  const latestActivities = recentActivities.slice(0, 10);

  // 4. Distribution & Evolution Data based ONLY on real DB inputs
  const distributionData = [
    { name: 'Aulas Presenciais', value: totalPresent, color: '#2dd4bf' },
    { name: 'Materiais/Vídeos', value: completedContents, color: '#818cf8' },
    { name: 'Exercícios', value: completedExercises, color: '#22d3ee' }
  ].filter(d => d.value > 0);

  // Map activities by month to build real evolution chart
  const evolutionMap: Record<string, { aulas: number; materiais: number }> = {};
  recentActivities.forEach(act => {
    const month = act.date.toLocaleDateString('pt-BR', { month: 'short' });
    if (!evolutionMap[month]) evolutionMap[month] = { aulas: 0, materiais: 0 };
    
    if (act.type === 'attendance' && act.status === 'present') evolutionMap[month].aulas++;
    if (act.type === 'content' || act.type === 'exercise') evolutionMap[month].materiais++;
  });

  const evolutionData = Object.entries(evolutionMap).map(([month, stats]) => ({
    month,
    aulas: stats.aulas,
    materiais: stats.materiais
  })).reverse();

  const data: PerformanceData = {
    attendanceRate,
    totalPresent,
    totalAbsent,
    completedContents,
    totalContents,
    completedExercises,
    totalExercises,
    recentActivities: latestActivities,
    distributionData,
    evolutionData
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Análise de Engajamento</h1>
        <p className="text-sm text-gray-400 mt-1">Acompanhe sua frequência, participação e materiais complementares concluídos.</p>
      </div>

      <PerformanceDashboard data={data} />
    </div>
  );
}
