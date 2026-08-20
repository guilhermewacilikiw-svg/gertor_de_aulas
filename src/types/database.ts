export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'MANAGER' | 'TEACHER' | 'STUDENT' | 'GUARDIAN' | 'STAFF';
export type LessonStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type AttendanceStatus = 'present' | 'absent' | 'justified' | 'late';
export type ContentType = 'video' | 'audio' | 'pdf' | 'image' | 'document' | 'link';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type VideoStatus = 'pending' | 'processing' | 'ready' | 'failed';
export type VideoVisibility = 'private' | 'students' | 'class' | 'course' | 'school';
export type LeadStatus = 'new' | 'contacted' | 'trial_scheduled' | 'trial_completed' | 'enrolled' | 'lost';

export interface School {
  id: string;
  name: string;
  legal_name?: string;
  document?: string;
  email?: string;
  phone?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolBranding {
  id: string;
  school_id: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  font_family?: string;
  app_name?: string;
  custom_domain?: string;
}

export interface UserProfile {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  status: string;
}

export interface Student {
  id: string;
  school_id: string;
  user_id: string;
  student_code?: string;
  name: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  status: string;
  joined_at: string;
}

export interface Teacher {
  id: string;
  school_id: string;
  user_id: string;
  specialty?: string;
  bio?: string;
  status: string;
  name?: string; // Joined from users
}

export interface Course {
  id: string;
  school_id: string;
  name: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  cover_image?: string;
  status: string;
}

export interface ClassItem {
  id: string;
  school_id: string;
  course_id: string;
  teacher_id: string;
  unit_id?: string;
  name: string;
  level?: string;
  capacity?: number;
  status: string;
}

export interface Lesson {
  id: string;
  school_id: string;
  class_id: string;
  teacher_id: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  status: LessonStatus;
  topic?: string;
  notes?: string;
  completed_at?: string;
  class_name?: string;
  teacher_name?: string;
}

export interface LessonRecord {
  id: string;
  school_id: string;
  lesson_id: string;
  teacher_id: string;
  summary?: string;
  topics?: string[];
  teacher_notes?: string;
  practice_instructions?: string;
  created_at: string;
}

export interface VideoItem {
  id: string;
  school_id: string;
  lesson_id?: string;
  content_id?: string;
  title: string;
  storage_path: string;
  thumbnail_path?: string;
  duration?: number;
  size?: number;
  processing_status: VideoStatus;
  visibility: VideoVisibility;
}

export interface NotificationItem {
  id: string;
  school_id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  school_id: string;
  name: string;
  email?: string;
  phone?: string;
  course_interest?: string;
  source?: string;
  status: LeadStatus;
  created_at: string;
}
