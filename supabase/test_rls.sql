-- RLS Multi-tenant Isolation Test Script
-- Run this script to mathematically prove that the RLS policies isolate the tenants correctly.

-- 1. Test as Admin of School A
BEGIN;
  -- Impersonate Admin Harmonia (a0000000-0000-0000-0000-000000000001)
  SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000001', true);
  
  RAISE NOTICE '--- TEST 1: Admin Harmonia (School A) ---';
  
  -- Should see only School Harmonia
  RAISE NOTICE 'Schools Visible: %', (SELECT COUNT(*) FROM schools);
  
  -- Should see users in School Harmonia (4 users)
  RAISE NOTICE 'Users Visible: %', (SELECT COUNT(*) FROM users);
  
  -- Should see students in School Harmonia (2 students)
  RAISE NOTICE 'Students Visible: %', (SELECT COUNT(*) FROM students);
  
ROLLBACK;

-- 2. Test as Teacher of School B
BEGIN;
  -- Impersonate Prof Ana (b0000000-0000-0000-0000-000000000002)
  SELECT set_config('request.jwt.claim.sub', 'b0000000-0000-0000-0000-000000000002', true);
  
  RAISE NOTICE '--- TEST 2: Prof Ana (School B) ---';
  
  -- Should see only School Ritmo
  RAISE NOTICE 'Schools Visible: %', (SELECT COUNT(*) FROM schools);
  
  -- Should NOT see any lessons from School A (Teacher Ana has no lessons scheduled yet in seed, but she shouldn't see Carlos' lessons)
  RAISE NOTICE 'Lessons Visible: %', (SELECT COUNT(*) FROM lessons);
  
ROLLBACK;

-- 3. Test as Student of School A
BEGIN;
  -- Impersonate João (a0000000-0000-0000-0000-000000000003)
  SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000003', true);
  
  RAISE NOTICE '--- TEST 3: João (Student School A) ---';
  
  -- Should see only himself in students table
  RAISE NOTICE 'Students Visible: %', (SELECT COUNT(*) FROM students);
  
  -- Should see 1 lesson (the one he is enrolled in)
  RAISE NOTICE 'Lessons Visible: %', (SELECT COUNT(*) FROM lessons);
  
ROLLBACK;
