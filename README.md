# Hamdan Raza Portfolio & Admin CMS

A high-performance personal portfolio featuring three distinct personas:
- **Engineer** (`/engineer`): Production full-stack applications, AI engineering, case studies, and architecture.
- **Research** (`/research`): NeuroAI, brain-computer interfaces, neural signal processing, and publications.
- **Off the Clock** (`/life`): Personal stories, photography, hobbies, and favorites.

Backed by a secure **Supabase** CMS and an interactive `/admin` dashboard with single-admin database-level Row Level Security (RLS).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Storage)
- **Security**: PostgreSQL Row Level Security (RLS) with `public.admin_users` and `public.is_admin()` Security Definer function
- **Storage**: Supabase Storage (`portfolio` bucket) with 5MB max file size and image MIME-type limits

---

## 🚀 Getting Started

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials:

```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-public-key>
```

### 2. Install Dependencies & Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the portfolio.

---

## 🔒 Supabase Setup & Migrations Guide

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings** -> **API**, copy your **Project URL** and **anon public** API key into `.env.local`.

### Step 2: Disable Public Sign-ups (Important)
To ensure random visitors cannot sign up against your Supabase project:
1. In the Supabase Dashboard, go to **Authentication** -> **Providers** -> **Email**.
2. Turn OFF **"Enable Signups"** (or in **Authentication** -> **Settings**, uncheck **"Allow new users to sign up"**).
3. Save changes.

### Step 3: Run Database Migrations in SQL Editor
In the Supabase Dashboard, open the **SQL Editor** and run the migration files located in `database/` in sequential order:

1. **`database/001_initial_schema.sql`**:
   - Creates all tables across Site Settings, Engineer, Research, and Off the Clock personas.
   - Enforces singleton constraints (`id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1)`) on `site_settings`, `research_bio`, and `life_bio`.
   - Creates `published` visibility flags and auto-updating `updated_at` triggers.

2. **`database/002_security_and_rls.sql`**:
   - Creates `public.admin_users` table and `public.is_admin()` Security Definer function.
   - Enables Row Level Security (RLS) on all tables.
   - Grants public/anonymous read access exclusively to rows where `published = true` (and project details where parent project is published).
   - Restricts all `INSERT`, `UPDATE`, `DELETE` operations strictly to accounts verified in `admin_users`.

3. **`database/003_storage_buckets.sql`**:
   - Creates the `portfolio` public storage bucket.
   - Sets 5 MB file size limit and restricts MIME types to images (`jpg`, `png`, `webp`, `gif`, `svg`).
   - Configures storage RLS policies (public read, admin-only write/delete).

4. **`database/004_seed_engineer_content.sql`**:
   - Seeds your real production Engineer content (profile settings, 10 tech categories, 60+ tech items, 7 services, 3 experiences, 7 projects, and 4 complete case studies).
   - Leaves Research and Life tables clean and unpopulated so you can enter real content through the admin dashboard.

---

## 👤 Admin Account Creation & Provisioning

### 1. Create your Admin User in Supabase Auth
1. In the Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **"Add User"** -> **"Create User"**.
3. Enter your admin email (e.g. `hamdanraza309@gmail.com`) and a strong password. Click **Create User**.
4. Copy the newly created user's **User UID** (UUID).

### 2. Grant Admin Rights
In the Supabase **SQL Editor**, run:

```sql
INSERT INTO public.admin_users (id, email)
VALUES ('<PASTE_USER_UID_HERE>', 'hamdanraza309@gmail.com');
```

You can now navigate to `http://localhost:3000/admin/login` and log in with your credentials to access the full CMS dashboard!

---

## 🎛️ Admin Dashboard Features

Navigate to `/admin` to access:
- **Site Settings**: Edit your profile, role, contact info, bio paragraphs, and upload a hero cutout portrait.
- **Engineer**: Manage projects, edit full case studies (problem, solution, contributions, metrics, tech stack), update services, experience history, and tech stack items.
- **Research**: Add your research bio, research interests, publication papers, ongoing projects, lab affiliations, and coursework.
- **Off the Clock**: Add your informal bio, hobbies, upload photos to the gallery, add personal projects, and list your favorite books/music.
- **Instant Cache Revalidation**: Any change in the dashboard automatically triggers on-demand cache revalidation (`revalidatePath`) across all public pages.
