import { createClient } from '@/lib/supabase/client';
import { SchoolBranding } from '@/types/database';

export const DEFAULT_BRANDING: SchoolBranding = {
  id: 'default',
  school_id: '11111111-1111-1111-1111-111111111111',
  app_name: 'Wackoda Experience',
  primary_color: '#4F46E5',
  secondary_color: '#06B6D4',
  background_color: '#0F172A',
  font_family: 'Inter'
};

/**
 * Resolves dynamic school branding parameters based on tenant ID or hostname.
 */
export async function getSchoolBranding(schoolId?: string, domain?: string): Promise<SchoolBranding> {
  if (!schoolId && !domain) return DEFAULT_BRANDING;

  const supabase = createClient();
  let query = supabase.from('school_branding').select('*');

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  } else if (domain) {
    query = query.eq('custom_domain', domain);
  }

  const { data } = await query.maybeSingle();

  return data || DEFAULT_BRANDING;
}

/**
 * Converts dynamic branding colors into inline CSS variable strings for White-Label rendering.
 */
export function getBrandingCssVariables(branding: SchoolBranding): Record<string, string> {
  return {
    '--brand-primary': branding.primary_color || DEFAULT_BRANDING.primary_color!,
    '--brand-secondary': branding.secondary_color || DEFAULT_BRANDING.secondary_color!,
    '--brand-bg': branding.background_color || DEFAULT_BRANDING.background_color!,
    '--brand-font': branding.font_family || DEFAULT_BRANDING.font_family!
  };
}
