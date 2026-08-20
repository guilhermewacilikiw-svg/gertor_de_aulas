-- Migration: 20260815000007_contents_url.sql
-- Description: Adds a URL column to contents table to store external links for videos/materials

ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS url TEXT;
