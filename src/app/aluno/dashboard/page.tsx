import { Calendar, Play, CheckCircle2, Award, ArrowRight, Video, FileText, Dumbbell, Compass } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LessonVideoPlayer } from '@/components/student/LessonVideoPlayer';
import { cn } from '@/lib/utils';

export default async function AlunoDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id, name')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const studentName = publicUser.name.split(' ')[0];
  const { data: studentRecord } = await supabase
    .from('students')
    .select('id, school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!studentRecord) redirect('/login');

  const studentId = studentRecord.id;
  const schoolId = studentRecord.school_id;

  // 1. Fetch Next Lesson
  const { data: nextLesson } = await supabase
    .from('lessons')
    .select(`
      id, scheduled_start, topic, status,
      classes (name, courses(name)),
      teachers (users(name))
    `)
    .eq('school_id', schoolId)
    .gte('scheduled_start', new Date().toISOString())
    .order('scheduled_start', { ascending: true })
    .limit(1)
    .maybeSingle();

  // 2. Fetch Last Completed Lesson + Record + Video
  const { data: lastLesson } = await supabase
    .from('lessons')
    .select(`
      id, scheduled_start, topic, completed_at,
      classes (name, courses(name)),
      teachers (users(name)),
      lesson_records (summary, practice_instructions),
      videos (id, title, storage_path, duration)
    `)
    .eq('school_id', schoolId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. Progress stats
  const { count: completedLessonsCount } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'completed');

  // 4. Fetch Latest Assessment
  const { data: lastAssessment } = await supabase
    .from('student_assessments')
    .select(`
      id, evaluated_at, scores, global_score,
      assessments (category_name),
      teachers (users (name))
    `)
    .eq('student_id', studentId)
    .order('evaluated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select(`
      class_id,
      courses (
        name,
        course_modules (id, title, description, order_index)
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  // Fetch extra materials for this student
  const classId = enrollment?.class_id;
  const targetIds = [studentId, schoolId];
  if (classId) targetIds.push(classId);

  const { data: extraMaterialsData } = await supabase
    .from('content_targets')
    .select('contents(id, title, url, type)')
    .in('target_id', targetIds)
    .order('created_at', { ascending: false })
    .limit(4);

  const extraMaterials = (extraMaterialsData?.map(t => Array.isArray(t.contents) ? t.contents[0] : t.contents).filter(Boolean) || []) as any[];

  const formattedNextDate = nextLesson?.scheduled_start
    ? new Date(nextLesson.scheduled_start).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : '--/--';

  const nextCourseName = (nextLesson?.classes as any)?.courses?.name || 'Sem aula agendada';
  const nextTeacherName = (nextLesson?.classes as any)?.teachers?.users?.name || (nextLesson?.teachers as any)?.users?.name || '-';

  const lastRecord = (lastLesson?.lesson_records as any)?.[0] || null;

  // Process Video Data
  let videoUrl: string | undefined = undefined;
  let videoTitle = lastLesson?.topic || (lastLesson?.classes as any)?.name || 'Sem aula gravada';
  let videoProgress = 0;

  if (lastLesson && lastLesson.videos && lastLesson.videos.length > 0) {
    const video = lastLesson.videos[0];
    videoTitle = video.title || videoTitle;
    videoProgress = 100; // Assuming watched if completed
    
    if (video.storage_path) {
      if (video.storage_path.startsWith('http')) {
        videoUrl = video.storage_path;
      } else {
        // Mock public URL for presentation if no real bucket
        videoUrl = `https://supabase.com/storage/v1/object/public/lesson_videos/${video.storage_path}`;
      }
    }
  }

  // Prep Assessment Data
  const globalScore = lastAssessment?.global_score || 0;
  const strokeDasharray = `${globalScore} 100`;

  // Prep Trilha Data
  let modules = [];
  let courseName = "Nenhum curso ativo";
  if (enrollment && enrollment.courses) {
    const course = enrollment.courses as any;
    courseName = course.name;
    const rawModules = course.course_modules || [];
    modules = rawModules.sort((a: any, b: any) => a.order_index - b.order_index).map((m: any, idx: number) => ({
      id: m.id,
      title: m.title || `Módulo ${idx + 1}`,
      progress: idx === 0 ? 70 : (idx === 1 ? 20 : 0) // Visual representation for the mockup vibe
    }));
  }

  // Se não tem curso, preenche com dummy para o UI não ficar quebrado
  if (modules.length === 0) {
    modules = [
      { id: '1', title: 'Módulo 1 - Introdução', progress: 70 },
      { id: '2', title: 'Módulo 2 - Prática', progress: 20 },
    ];
  }

  const progressPercentage = modules.length > 0 ? 35 : 0;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#0a0a0f] min-h-screen text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight drop-shadow-md">
            Dashboard
          </h1>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search for..." 
            className="pl-10 pr-4 py-2 bg-[#12121A] border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#7D7AE8]/50 w-64 transition-all"
          />
        </div>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CURRENT COURSE / LATEST RECORDING */}
        <div className="lg:col-span-5 bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 group shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-[#7D7AE8] font-black uppercase tracking-widest mb-1">Última Aula Gravada</p>
              <h2 className="text-xl font-bold text-white truncate max-w-xs">{videoTitle}</h2>
            </div>
          </div>

          <LessonVideoPlayer 
            videoUrl={videoUrl}
            title={videoTitle}
            progress={videoProgress}
          />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-medium">Progresso do Curso</span>
              <span className="text-white font-bold">{progressPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#C0E87A] to-[#7D7AE8] relative"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* RECOMMENDED FOR YOU */}
        <div className="lg:col-span-7 bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Recommended for You</h2>
            <button className="text-white/40 hover:text-white transition-colors">
              <span className="sr-only">More</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">...</div>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {extraMaterials.length === 0 ? (
                <div className="col-span-2 text-center text-gray-400 py-12">
                  Nenhum material complementar no momento.
                </div>
            ) : (
                extraMaterials.map((mat: any, idx: number) => (
                  <Link href={mat.url || '#'} target="_blank" key={mat.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col h-[260px] group relative overflow-hidden">
                    <div className="w-full flex-1 rounded-xl bg-gradient-to-br from-[#7D7AE8]/20 to-[#A27AE8]/10 mb-4 relative flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-[#7D7AE8]/30 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-5 blur-[2px] font-black">
                        {idx + 1}
                      </div>
                      <button className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-[#7D7AE8]/50 transition-all shadow-lg">
                        <Play className="w-5 h-5 text-white ml-1 fill-white" />
                      </button>
                    </div>
                    
                    <h3 className="text-base font-bold text-white truncate mb-auto">{mat.title}</h3>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40 font-medium uppercase tracking-widest">{mat.type === 'video' ? 'Vídeo' : 'Link Externo'}</span>
                      </div>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 pb-12">
        
        {/* UPCOMING ASSIGNMENTS */}
        <div className="lg:col-span-5 md:col-span-1 bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Upcoming Assignments</h2>
            <button className="text-white/40 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">...</div>
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-[#7D7AE8]/20 flex items-center justify-center text-[#7D7AE8] shrink-0 border border-[#7D7AE8]/30 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">Exercício: Prática Diária</h4>
                <p className="text-xs text-white/40 mt-0.5">{formattedNextDate}</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E5E87A] shrink-0 bg-[#E5E87A]/10 px-2 py-1 rounded-md">Now</span>
            </div>

            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-[#C0E87A]/20 flex items-center justify-center text-[#C0E87A] shrink-0 border border-[#C0E87A]/30 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">Gravação: {nextCourseName}</h4>
                <p className="text-xs text-white/40 mt-0.5">Next lesson</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C0E87A] shrink-0 bg-[#C0E87A]/10 px-2 py-1 rounded-md">New</span>
            </div>

            {lastRecord?.practice_instructions && (
               <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-[#A27AE8]/20 flex items-center justify-center text-[#A27AE8] shrink-0 border border-[#A27AE8]/30 group-hover:scale-105 transition-transform">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">Treino Específico</h4>
                  <p className="text-xs text-white/40 truncate mt-0.5">{lastRecord.practice_instructions}</p>
                </div>
              </div>
            )}
          </div>

          <button className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#7D7AE8] to-[#A27AE8] text-white font-black text-sm shadow-[0_0_20px_rgba(125,122,232,0.4)] hover:shadow-[0_0_30px_rgba(125,122,232,0.6)] hover:scale-[1.02] transition-all">
            Show all
          </button>
        </div>

        {/* MY PROGRESS (DOUGHNUT CHART) */}
        <div className="lg:col-span-4 md:col-span-1 bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">My Progress</h2>
            <button className="text-white/40 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">...</div>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-[0_0_15px_rgba(125,122,232,0.3)]">
                {/* Background Ring */}
                <path
                  className="text-white/5"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress Ring */}
                <path
                  className="text-[#7D7AE8] transition-all duration-1000 ease-out"
                  strokeDasharray={strokeDasharray}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="url(#gradient)"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C0E87A" />
                    <stop offset="100%" stopColor="#7D7AE8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{globalScore}%</span>
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">completed</span>
              </div>
            </div>

            <div className="w-full flex justify-between mt-8 px-6">
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C0E87A] shadow-[0_0_8px_rgba(192,232,122,0.8)]"></div>
                  <span className="text-white font-bold">{globalScore}%</span>
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">complete</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7D7AE8] shadow-[0_0_8px_rgba(125,122,232,0.8)]"></div>
                  <span className="text-white font-bold">{100 - globalScore}%</span>
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">overview</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:scale-110 transition-all">
                <span className="text-2xl font-light mb-1">+</span>
              </button>
              <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:scale-110 transition-all">
                <Compass className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RECENT MENTORS */}
        <div className="lg:col-span-3 md:col-span-1 bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Recent Mentors</h2>
          </div>

          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-4 group cursor-pointer">
              <span className="text-xs font-bold text-white/20 w-4 group-hover:text-white/60 transition-colors">1</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7D7AE8] to-[#A27AE8] flex items-center justify-center text-white font-black text-lg border border-white/10 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                {nextTeacherName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{nextTeacherName}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E5E87A] mt-0.5">Current Instructor</p>
              </div>
            </div>

            {lastLesson && (
              <div className="flex items-center gap-4 group cursor-pointer">
                <span className="text-xs font-bold text-white/20 w-4 group-hover:text-white/60 transition-colors">2</span>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C0E87A] to-[#E5E87A] flex items-center justify-center text-black font-black text-lg border border-white/10 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  {((lastLesson.teachers as any)?.users?.name || 'M').charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{(lastLesson.teachers as any)?.users?.name || 'Mentor'}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-0.5">Past Instructor</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity group cursor-pointer">
              <span className="text-xs font-bold text-white/20 w-4 group-hover:text-white/60 transition-colors">3</span>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-black text-lg shrink-0 border border-white/5 group-hover:bg-white/20 transition-all">
                S
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">Support Team</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-0.5">Always available</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
