-- ============================================================================
-- Migration: 004_seed_engineer_content.sql
-- Description: Seeds real production Engineer content from lib/data.ts
-- Note: Research and Life tables are intentionally NOT seeded with dummy data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Site Settings (Profile & About)
-- ----------------------------------------------------------------------------

INSERT INTO public.site_settings (
  id,
  name,
  initials,
  role,
  tagline,
  intro,
  location,
  analytics,
  availability,
  email,
  resume_url,
  portrait_url,
  socials,
  about_paragraphs
)
VALUES (
  1,
  'Hamdan Raza',
  'HR',
  'Full-Stack AI Engineer',
  'I build full-stack web apps, ship clean code.',
  'Full-stack AI Engineer based on Earth. I build high-performance MERN applications that handle massive traffic and whisper sweet code to AI features to keep them smart, compliant, and safely inside production environments.',
  'Ring Road, Peshawar, KPK, Pakistan',
  'VISITOR COUNT: YOU + A FEW WEB CRAWLERS',
  'Available for work',
  'hamdanraza309@gmail.com',
  'https://drive.google.com/file/d/178klwYn9oFh-ZX7VxGoy0om0ZRGFGXjX/view?usp=sharing',
  '/assets/hamdan_cutout.png',
  '{
    "github": "https://github.com/HamdanRaza309",
    "linkedin": "https://www.linkedin.com/in/hamdanraza/",
    "facebook": "https://www.facebook.com/Remeo.hamdan?mibextid=ZbWKwL",
    "instagram": "https://www.instagram.com/khan_arman309"
  }'::jsonb,
  ARRAY[
    'I''m a Full-Stack AI Engineer with a focus on the MERN stack. I started by building small JavaScript projects (games, utilities, clocks) and grew into shipping production-grade React apps and Node.js APIs.',
    'Currently I work on full-stack web applications integrated with AI features and tools — combining clean frontend interfaces with reliable backend services.',
    'My approach: write code that''s simple to read, easy to ship, and built to scale. I use AI tools to move faster, not to skip the thinking.',
    'Research Interest: I''m passionate about NeuroAI, Brain-Computer Interfaces (BCIs), and Neural Engineering. My interests include neural signal processing, computational neuroscience, neuroprosthetics, and the application of machine learning to decode brain activity and develop intelligent human–machine interfaces.'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  initials = EXCLUDED.initials,
  role = EXCLUDED.role,
  tagline = EXCLUDED.tagline,
  intro = EXCLUDED.intro,
  location = EXCLUDED.location,
  analytics = EXCLUDED.analytics,
  availability = EXCLUDED.availability,
  email = EXCLUDED.email,
  resume_url = EXCLUDED.resume_url,
  portrait_url = EXCLUDED.portrait_url,
  socials = EXCLUDED.socials,
  about_paragraphs = EXCLUDED.about_paragraphs;

-- ----------------------------------------------------------------------------
-- 2. Services
-- ----------------------------------------------------------------------------

INSERT INTO public.services (title, description, sort_order, published)
VALUES
  (
    'AI-Powered SaaS Development',
    'Building scalable AI-powered SaaS platforms with modern frontend, backend, authentication, and cloud infrastructure.',
    1,
    true
  ),
  (
    'Full-Stack Web Development',
    'Developing production-ready full-stack applications using React, Next.js, Node.js, PostgreSQL, and modern backend architectures.',
    2,
    true
  ),
  (
    'RAG & AI System Development',
    'Creating RAG pipelines, semantic search systems, vector database integrations, and LLM-powered applications using LangChain and OpenAI APIs.',
    3,
    true
  ),
  (
    'Backend & API Engineering',
    'Designing scalable backend systems, REST APIs, authentication flows, RBAC systems, and microservice-based architectures.',
    4,
    true
  ),
  (
    'Authentication & Enterprise Integration',
    'Implementing secure authentication systems including JWT, OAuth, SAML 2.0, Microsoft Entra ID, and Single Sign-On (SSO).',
    5,
    true
  ),
  (
    'AI Automation Systems',
    'Building AI-driven automation workflows for content generation, voice synthesis, classification systems, and operational efficiency.',
    6,
    true
  ),
  (
    'Cloud, Deployment & DevOps',
    'Deploying and managing applications using Docker, CI/CD workflows, Vercel, Supabase, Redis, and production cloud environments.',
    7,
    true
  );

-- ----------------------------------------------------------------------------
-- 3. Experience
-- ----------------------------------------------------------------------------

INSERT INTO public.experience (company, type, range, title, location, intro, highlights, sort_order, published)
VALUES
  (
    'Metasense Technologies',
    'Full Stack AI Engineer',
    '07/2024 – Present',
    'Full Stack AI Engineer',
    'Peshawar, PK',
    'Building AI-powered SaaS platforms, RAG systems, scalable backend infrastructure, and enterprise-grade authentication systems for production applications.',
    ARRAY[
      'Built scalable Node.js + PostgreSQL backend systems handling thousands of daily operations',
      'Developed AI-powered RAG applications using LangChain, Pinecone, Redis, and vector databases',
      'Implemented enterprise authentication using Microsoft Entra ID, SAML 2.0, and SSO',
      'Designed secure RBAC and tenant-isolated multi-tenant architectures',
      'Built AI-driven content automation systems using OpenAI APIs and voice synthesis',
      'Improved semantic search performance by 42% through embedding optimization',
      'Developed bulk email and referral systems supporting 10k+ users',
      'Built scalable REST APIs, authentication systems, feeds, and engagement tracking systems',
      'Implemented modular service-based backend architecture for maintainability and scalability'
    ]::text[],
    1,
    true
  ),
  (
    'Freelance / Independent',
    'AI & Full-Stack Developer',
    '04/2024 – 06/2024',
    'Full-Stack AI Developer',
    'Remote',
    'Building AI-powered full-stack applications, automation systems, and production-ready SaaS products for international clients and personal projects.',
    ARRAY[
      'Developed AI code review systems using Gemini and OpenAI APIs',
      'Built automated content generation and short-video AI workflows',
      'Integrated LLMs, semantic search, and AI voice systems into real-world applications',
      'Designed and deployed modern MERN-stack applications with secure authentication'
    ]::text[],
    2,
    true
  ),
  (
    'CodeAlpha',
    'Internship',
    '01/2024 – 03/2024',
    'Full-Stack Web Development Intern',
    'Remote',
    'Worked on real-time backend systems and full-stack web applications using event-driven architectures.',
    ARRAY[
      'Built real-time chat applications using WebSockets',
      'Implemented bidirectional communication systems for live messaging',
      'Worked with REST APIs, backend logic, and scalable application flows',
      'Collaborated using Git and modern development workflows'
    ]::text[],
    3,
    true
  );

-- ----------------------------------------------------------------------------
-- 4. Tech Stack Categories & Items
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Category 1
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Frontend Development', 1, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'React.js', 1, true),
    (cat_id, 'Next.js', 2, true),
    (cat_id, 'TypeScript', 3, true),
    (cat_id, 'JavaScript', 4, true),
    (cat_id, 'Redux', 5, true),
    (cat_id, 'Context API', 6, true),
    (cat_id, 'HTML', 7, true),
    (cat_id, 'CSS', 8, true),
    (cat_id, 'Tailwind CSS', 9, true),
    (cat_id, 'Bootstrap', 10, true),
    (cat_id, 'SASS', 11, true),
    (cat_id, 'Shopify Polaris', 12, true);

  -- Category 2
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Backend & API Development', 2, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'Node.js', 1, true),
    (cat_id, 'Express.js', 2, true),
    (cat_id, 'Nest.js', 3, true),
    (cat_id, 'FastAPI', 4, true),
    (cat_id, 'Python', 5, true),
    (cat_id, 'REST APIs', 6, true),
    (cat_id, 'GraphQL', 7, true),
    (cat_id, 'WebSockets', 8, true),
    (cat_id, 'Microservices Architecture', 9, true),
    (cat_id, 'Event-Driven Architecture', 10, true);

  -- Category 3
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Authentication & Security', 3, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'JWT Authentication', 1, true),
    (cat_id, 'OAuth 2.0', 2, true),
    (cat_id, 'SAML 2.0', 3, true),
    (cat_id, 'Microsoft Entra ID', 4, true);

  -- Category 4
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Databases & Data Infrastructure', 4, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'PostgreSQL', 1, true),
    (cat_id, 'MongoDB', 2, true),
    (cat_id, 'Mongoose', 3, true),
    (cat_id, 'Redis', 4, true),
    (cat_id, 'Supabase', 5, true),
    (cat_id, 'Pinecone', 6, true),
    (cat_id, 'ChromaDB', 7, true),
    (cat_id, 'Vector Databases', 8, true);

  -- Category 5
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('AI Engineering & LLM Applications', 5, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'OpenAI APIs', 1, true),
    (cat_id, 'LangChain', 2, true),
    (cat_id, 'LlamaIndex', 3, true),
    (cat_id, 'RAG Systems', 4, true),
    (cat_id, 'Generative AI', 5, true),
    (cat_id, 'Voice AI', 6, true),
    (cat_id, 'Semantic Search', 7, true),
    (cat_id, 'Embedding Optimization', 8, true),
    (cat_id, 'AI Automation', 9, true);

  -- Category 6
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Cloud, DevOps & Developer Tools', 6, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'Docker', 1, true),
    (cat_id, 'Git', 2, true),
    (cat_id, 'GitHub', 3, true),
    (cat_id, 'CI/CD', 4, true),
    (cat_id, 'Postman', 5, true),
    (cat_id, 'Vercel', 6, true),
    (cat_id, 'VS Code', 7, true);

  -- Category 7
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Automation & Workflow Orchestration', 7, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'n8n', 1, true),
    (cat_id, 'Webhooks', 2, true);

  -- Category 8
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Shopify Development', 8, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'Shopify Embedded Apps', 1, true),
    (cat_id, 'Shopify APIs', 2, true),
    (cat_id, 'Shopify Polaris', 3, true);

  -- Category 9
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Programming Languages', 9, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'JavaScript', 1, true),
    (cat_id, 'TypeScript', 2, true),
    (cat_id, 'Python', 3, true),
    (cat_id, 'Java', 4, true),
    (cat_id, 'C++', 5, true),
    (cat_id, 'Solidity', 6, true);

  -- Category 10
  INSERT INTO public.tech_stack_categories (category, sort_order, published)
  VALUES ('Blockchain Development', 10, true) RETURNING id INTO cat_id;
  INSERT INTO public.tech_stack_items (category_id, name, sort_order, published) VALUES
    (cat_id, 'Solidity', 1, true),
    (cat_id, 'MetaMask', 2, true);
END $$;

-- ----------------------------------------------------------------------------
-- 5. Projects & Detailed Case Studies
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  p1_id UUID;
  p2_id UUID;
  p3_id UUID;
  p4_id UUID;
BEGIN
  -- 1. Look Atlas
  INSERT INTO public.projects (
    title, slug, category, description, tech, live_url, github_url, featured, thumbnail_url, sort_order, published
  )
  VALUES (
    'Look Atlas',
    'look-atlas',
    'AI Commerce Infrastructure',
    'Architected and shipped a production AI content engine for ecommerce that orchestrates product and model ingestion, shot planning, image/video generation, and paid-download delivery through Fastify APIs + BullMQ workers, backed by Supabase Auth/Postgres/RLS/Storage, Stripe-driven subscription and credit-ledger automation with idempotent webhook handling, abuse-resistant trial controls, calibration pipelines, and multi-provider generation flows across Gemini, OpenAI, and Veo with deployment split across Railway/Render/Vercel and an embedded Shopify app surface.',
    ARRAY['TypeScript', 'Node.js', 'Fastify', 'BullMQ', 'Redis', 'Supabase (Postgres, Auth, RLS, Storage)', 'Stripe', 'OpenAI', 'Google Gemini', 'Google Veo', 'React', 'Vite', 'Next.js', 'Shopify App Bridge + React Router', 'Tailwind CSS', 'Railway', 'Render', 'Vercel', 'Docker']::text[],
    'https://lookatlas.com',
    NULL,
    true,
    '/assets/lookatlas/user_dashboard.png',
    1,
    true
  ) RETURNING id INTO p1_id;

  INSERT INTO public.project_details (
    project_id, category_long, problem, solution, contributions, features, metrics, tech_stack, gallery
  )
  VALUES (
    p1_id,
    'AI Commerce Infrastructure',
    'eCommerce brands struggle to produce high-end product photography on diverse models and in varying settings. Traditional studios are slow and expensive, while simple AI image generators lack control, ingestion calibration, and consistency.',
    'Developed a production-grade AI content generation engine. By orchestrating product and model ingestion calibration with multi-provider APIs (Veo, Gemini, OpenAI), the system delivers high-quality assets through isolated task workers, integrated with Shopify and Stripe.',
    ARRAY[
      'Architected the distributed task orchestration pipeline with Fastify, BullMQ, and Redis for heavy background media generation.',
      'Built multi-provider generation endpoints integrating Google Gemini, OpenAI, and Google Veo pipelines.',
      'Implemented Stripe subscription tiers, usage credit ledgers, and idempotent webhook handlers with transaction safety.',
      'Engineered data persistence, secure asset storage, and schema definitions with Supabase (PostgreSQL, Auth, RLS).',
      'Designed and deployed the embedded Shopify app surface using App Bridge, React Router, and Tailwind CSS.'
    ]::text[],
    '[
      {"title": "Multi-Provider Generative AI", "description": "Orchestrates API calls across OpenAI, Gemini, and Veo to leverage the best models for image, text, and video creation.", "icon": "Sparkles"},
      {"title": "Distributed Queue Architecture", "description": "Utilizes Fastify + BullMQ + Redis to isolate heavy media rendering and calibration jobs, maintaining API responsiveness.", "icon": "Cpu"},
      {"title": "Shopify App Integration", "description": "Seamlessly embeds into Shopify admin dashboards using App Bridge, providing store owners with native controls.", "icon": "Layers"},
      {"title": "Subscription & Ledger System", "description": "Implements secure Stripe checkout, automated credit resets, and real-time usage auditing.", "icon": "Compass"}
    ]'::jsonb,
    '[
      {"value": "99.9%", "label": "Pipeline Uptime"},
      {"value": "3+", "label": "GenAI Providers"},
      {"value": "100%", "label": "Webhook Idempotency"}
    ]'::jsonb,
    '{
      "frontend": ["React.js", "Vite", "Tailwind CSS", "Shopify App Bridge", "React Router"],
      "backend": ["Node.js", "Fastify", "BullMQ", "Redis"],
      "database": ["Supabase PostgreSQL", "RLS Policies", "Supabase Storage"],
      "cloud": ["Railway", "Render", "Vercel", "Docker"]
    }'::jsonb,
    '[
      {"src": "/assets/lookatlas/user_dashboard.png", "alt": "User Dashboard", "caption": "Personalized dashboard for managing reviews, analytics, and account settings."},
      {"src": "/assets/lookatlas/what_they_say_about_us.png", "alt": "What They Say About Us", "caption": "Customer testimonials section showcasing user feedback and success stories."},
      {"src": "/assets/lookatlas/shoot_creation.png", "alt": "Shoot Creation", "caption": "Shoot creation and management dashboard for managing and scheduling shoots."}
    ]'::jsonb
  );

  -- 2. Climate Tracker Initiative
  INSERT INTO public.projects (
    title, slug, category, description, tech, live_url, github_url, featured, thumbnail_url, sort_order, published
  )
  VALUES (
    'Climate Tracker Initiative',
    'climate-tracker-initiative',
    'Full-Stack · AI · SaaS',
    'Engineered an AI-powered ESG data platform utilizing autonomous web agents and LLM extraction pipelines to ingest, structure, and audit corporate sustainability metrics from multi-page PDFs, integrated with enterprise Entra ID SSO.',
    ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Redis', 'Bull', 'OpenAI', 'LangChain', 'Puppeteer', 'Vite', 'Tailwind CSS']::text[],
    'https://cleartraced.com/',
    NULL,
    true,
    '/assets/climatetrackerinitiative/esg_audit_ledger.png',
    2,
    true
  ) RETURNING id INTO p2_id;

  INSERT INTO public.project_details (
    project_id, category_long, problem, solution, contributions, features, metrics, tech_stack, gallery
  )
  VALUES (
    p2_id,
    'Full-Stack · AI · SaaS',
    'Corporations and financial institutions spend hundreds of hours manually reviewing, extracting, and auditing ESG sustainability metrics from long, messy, unstructured PDF disclosure reports.',
    'Engineered an AI-powered ESG data platform. It leverages autonomous web agents, custom Puppeteer scripts, and LLM-powered RAG pipelines to automatically ingest, parse, structure, and verify corporate environmental compliance data.',
    ARRAY[
      'Built autonomous document parsing and LLM metadata extraction pipelines using LangChain and OpenAI APIs.',
      'Created highly stable Puppeteer scripts to scrape and extract clean text from multi-page corporate PDFs.',
      'Designed a robust queuing mechanism with Redis and Bull to scale heavy ingestion and processing tasks.',
      'Integrated enterprise-grade Single Sign-On (SSO) authentication using Microsoft Entra ID (Azure AD) and SAML 2.0.',
      'Developed a modern, responsive audit dashboard in React + Vite with Tailwind CSS for manual metric verification.'
    ]::text[],
    '[
      {"title": "Autonomous Document Extraction", "description": "Parses complex tables and narrative text in corporate disclosures, turning messy documents into audit-ready JSON data.", "icon": "Sparkles"},
      {"title": "Enterprise Entra ID SSO", "description": "Secures user access with Single Sign-On, supporting Microsoft Entra ID and corporate authentication policies.", "icon": "Layers"},
      {"title": "Ingestion Queue System", "description": "Background queue architecture using Bull and Redis keeps the application responsive during heavy ingestion loads.", "icon": "Cpu"},
      {"title": "ESG Audit Ledger", "description": "Provides visual audit trails highlighting exactly where in the source PDF each metric was extracted from.", "icon": "Compass"}
    ]'::jsonb,
    '[
      {"value": "42%", "label": "Ingestion Speedup"},
      {"value": "10k+", "label": "Multi-page PDFs Parsed"},
      {"value": "100%", "label": "Traceable Data Points"}
    ]'::jsonb,
    '{
      "frontend": ["React.js", "TypeScript", "Vite", "Tailwind CSS"],
      "backend": ["Node.js", "Express.js", "LangChain", "Puppeteer"],
      "database": ["PostgreSQL", "Supabase", "Redis", "Bull"],
      "cloud": ["Vercel"]
    }'::jsonb,
    '[
      {"src": "/assets/climatetrackerinitiative/how_we_verify.png", "alt": "How We Verify", "caption": "Source-linked data verification interface showing exact page and paragraph references for every extracted metric."},
      {"src": "/assets/climatetrackerinitiative/esg_audit_ledger.png", "alt": "ESG Audit Ledger", "caption": "Structured audit dashboard displaying compliance metrics with full traceability back to source documents."},
      {"src": "/assets/climatetrackerinitiative/how_flawless_accuracy_is_reached.png", "alt": "Accuracy Pipeline", "caption": "AI-assisted extraction pipeline with human-in-the-loop validation for high-fidelity ESG data."}
    ]'::jsonb
  );

  -- 3. ShelfBell
  INSERT INTO public.projects (
    title, slug, category, description, tech, live_url, github_url, featured, thumbnail_url, sort_order, published
  )
  VALUES (
    'ShelfBell',
    'shelfbell',
    'Full-Stack · SaaS · Shopify',
    'Engineered a production-ready Shopify back-in-stock notification platform that helps ecommerce merchants capture demand for sold-out product variants and automatically notify shoppers when inventory returns. Built with a multi-tenant Node.js backend, Shopify webhooks, BullMQ + Redis background workers, Supabase PostgreSQL, secure JWT/HMAC authentication, transactional email delivery, and an embedded Shopify admin experience.',
    ARRAY['TypeScript', 'React', 'React Router', 'Node.js', 'Express.js', 'Shopify App Bridge', 'Shopify APIs', 'Shopify Webhooks', 'BullMQ', 'Redis', 'Supabase PostgreSQL', 'Supabase Auth', 'SendGrid', 'JWT', 'HMAC', 'Tailwind CSS', 'Docker', 'Vercel', 'Railway', 'Cloudflare']::text[],
    'https://shelfbell.com',
    NULL,
    true,
    '/assets/shelfbell/merchant_dashboard.png',
    3,
    true
  ) RETURNING id INTO p3_id;

  INSERT INTO public.project_details (
    project_id, category_long, problem, solution, contributions, features, metrics, tech_stack, gallery
  )
  VALUES (
    p3_id,
    'Full-Stack · SaaS · Shopify',
    'eCommerce stores lose potential sales when products go out of stock, while shoppers have no reliable way to know when their specific product variant becomes available again. Merchants need a simple, automated way to capture this demand and reconnect with shoppers without complex notification workflows.',
    'Engineered a production-ready Shopify back-in-stock notification platform that captures shopper interest at the exact product-variant level and automatically sends restock notifications when inventory becomes available. The system combines Shopify webhooks, Redis-backed BullMQ workers, Supabase PostgreSQL, secure authentication, transactional email delivery, and an embedded Shopify admin experience.',
    ARRAY[
      'Architected the multi-tenant backend using Node.js, Express.js, Supabase PostgreSQL, and tenant-aware data access for isolated Shopify stores.',
      'Built the distributed inventory and notification processing pipeline using BullMQ and Redis for asynchronous jobs, retries, and background processing.',
      'Integrated Shopify Admin APIs and inventory webhooks to detect product and variant availability changes and trigger notification workflows.',
      'Implemented exact variant-level subscription handling so shoppers are associated with the specific product variant they requested.',
      'Implemented secure authentication using Shopify App Bridge session tokens, internal JWT authentication, and HMAC verification for Shopify webhooks.',
      'Built the embedded Shopify admin experience using React, React Router, Shopify App Bridge, and Polaris.',
      'Developed the storefront Theme App Extension that allows shoppers to subscribe to back-in-stock alerts directly from sold-out products.',
      'Implemented transactional email delivery with reusable templates, unsubscribe handling, suppression logic, retry processing, and provider-based email infrastructure.',
      'Engineered merchant lifecycle flows covering Shopify installation, uninstallation, reinstallation, subscriber state, and store isolation.'
    ]::text[],
    '[
      {"title": "Variant-Level Restock Alerts", "description": "Tracks shopper subscriptions against the exact product variant so customers are notified specifically when the item they requested becomes available.", "icon": "Bell"},
      {"title": "Event-Driven Inventory Processing", "description": "Uses Shopify inventory webhooks to trigger asynchronous availability processing without blocking the main application API.", "icon": "Zap"},
      {"title": "Distributed Queue Architecture", "description": "Utilizes BullMQ + Redis to isolate inventory processing, notification dispatch, retries, and reconciliation workloads from synchronous API requests.", "icon": "Cpu"},
      {"title": "Shopify-Native Integration", "description": "Embeds directly into Shopify Admin through App Bridge while providing a storefront notification experience through a Theme App Extension.", "icon": "Layers"}
    ]'::jsonb,
    '[
      {"value": "Variant", "label": "Level Restock Tracking"},
      {"value": "Idempotent", "label": "Webhook Processing"},
      {"value": "Multi-Tenant", "label": "Store Isolation"}
    ]'::jsonb,
    '{
      "frontend": ["React.js", "TypeScript", "React Router", "Shopify App Bridge", "Shopify Polaris", "Tailwind CSS"],
      "backend": ["Node.js", "Express.js", "BullMQ", "Redis", "JWT", "Shopify Admin API", "Shopify Webhooks"],
      "database": ["Supabase PostgreSQL", "Supabase Auth", "Row-Level Security"],
      "cloud": ["Railway", "Vercel", "Cloudflare", "Docker"]
    }'::jsonb,
    '[
      {"src": "/assets/shelfbell/merchant_dashboard.png", "alt": "ShelfBell Merchant Dashboard", "caption": "Embedded Shopify admin dashboard for managing ShelfBell configuration, subscribers, and notification settings."},
      {"src": "/assets/shelfbell/back_in_stock_widget.png", "alt": "Back-in-Stock Widget", "caption": "Storefront notification widget allowing shoppers to subscribe to sold-out product variants."},
      {"src": "/assets/shelfbell/subscriber_management.png", "alt": "Subscriber Management", "caption": "Subscriber management interface for monitoring shopper restock requests and notification states."}
    ]'::jsonb
  );

  -- 4. Inhalo
  INSERT INTO public.projects (
    title, slug, category, description, tech, live_url, github_url, featured, thumbnail_url, sort_order, published
  )
  VALUES (
    'Inhalo: Distributed AI Short-Form Content Engine',
    'inhalo',
    'Full-Stack & AI Infrastructure',
    'Architected and shipped a distributed, queue-based content automation system that dynamically generates short-form video assets, slideshows, and interactive breathing challenges. Built an agent-centric Python FastAPI service utilizing Gemini, Claude, and ElevenLabs TTS to generate scripts, layout configurations, and voiceovers, integrated with an Express and BullMQ worker queue to isolate and scale heavy FFmpeg/MoviePy video rendering jobs. Engineered a real-time progress-tracking dashboard with React, Supabase, and Redis, enabling seamless pipeline orchestration and template management.',
    ARRAY['React', 'TailwindCSS', 'Node.js', 'Express', 'FastAPI', 'BullMQ', 'Redis', 'Supabase', 'Gemini API', 'ElevenLabs', 'FFmpeg', 'MoviePy']::text[],
    'https://content-automation-puce.vercel.app/',
    NULL,
    true,
    NULL,
    4,
    true
  ) RETURNING id INTO p4_id;

  INSERT INTO public.project_details (
    project_id, category_long, problem, solution, contributions, features, metrics, tech_stack, gallery
  )
  VALUES (
    p4_id,
    'Full-Stack & AI Infrastructure',
    'Content creators spend significant resources scriptwriting, voiceacting, and manually editing short-form videos. Rendering video assets locally is slow and scales poorly under concurrent request loads.',
    'Designed a distributed, queue-based content automation engine. Users configure layouts and generate scripts via a React dashboard, which drives a FastAPI media rendering service leveraging Gemini, Claude, ElevenLabs, and MoviePy/FFmpeg.',
    ARRAY[
      'Architected the distributed media rendering microservices using Express, BullMQ, and Redis to isolate rendering resource load.',
      'Built a FastAPI background worker leveraging MoviePy and FFmpeg to compose high-definition video assets programmatically.',
      'Integrated Gemini and Claude APIs to generate dynamic, contextual scripts, prompts, and layout configs.',
      'Connected ElevenLabs TTS API to synthesize lifelike voiceovers synced precisely with the video timeline.',
      'Created a real-time progress-tracking dashboard with React, Tailwind CSS, Supabase, and Redis WebSockets.'
    ]::text[],
    '[
      {"title": "Programmatic Video Composing", "description": "Composes scripts, audio voiceovers, subtitles, and backgrounds into short-form videos using MoviePy and FFmpeg.", "icon": "Sparkles"},
      {"title": "AI Scripting & TTS Synthesis", "description": "Generates high-retention video hooks and narrations via Gemini/Claude and ElevenLabs speech synthesis.", "icon": "Layers"},
      {"title": "Resource Isolation", "description": "Decouples heavy media processing from API endpoints using BullMQ background workers for horizontal scaling.", "icon": "Cpu"},
      {"title": "Real-time Processing Tracker", "description": "Employs WebSockets and Supabase listeners to display granular processing steps to the user in real-time.", "icon": "Compass"}
    ]'::jsonb,
    '[
      {"value": "100%", "label": "Automated Generation"},
      {"value": "Sync", "label": "Timeline Audio Sync"},
      {"value": "Isolated", "label": "Render queue isolation"}
    ]'::jsonb,
    '{
      "frontend": ["React.js", "Tailwind CSS", "WebSockets"],
      "backend": ["FastAPI", "Python", "Node.js", "Express.js", "BullMQ"],
      "database": ["Supabase", "Redis"],
      "cloud": ["MoviePy", "FFmpeg", "Vercel"]
    }'::jsonb,
    '[]'::jsonb
  );

  -- Additional Archive Builds
  INSERT INTO public.projects (title, slug, category, description, tech, live_url, github_url, featured, sort_order, published)
  VALUES
    (
      'Cozy Craze',
      NULL,
      'Full-Stack · E-commerce',
      'An e-commerce platform with product listings, shopping cart, and secure checkout — a complete solution for online shopping.',
      ARRAY['React', 'Node.js', 'Express', 'MongoDB']::text[],
      'https://cozy-craze-frontend.vercel.app/',
      'https://github.com/HamdanRaza309/cozy-craze',
      false,
      5,
      true
    ),
    (
      'LogBook — Cloud Storage',
      NULL,
      'Full-Stack · SaaS',
      'A cloud-based note-taking app that lets users securely store and manage notes with authentication and cloud storage.',
      ARRAY['React', 'Node.js', 'MongoDB', 'JWT']::text[],
      NULL,
      'https://github.com/HamdanRaza309/logbook.git',
      false,
      6,
      true
    ),
    (
      'IronEdge Fitness Gym',
      NULL,
      'Frontend · API',
      'A comprehensive gym management app with membership management, class schedules, and user profiles.',
      ARRAY['React', 'REST API', 'Tailwind']::text[],
      NULL,
      'https://github.com/HamdanRaza309/IronEdge-FitnessGym-UsingAPI.git',
      false,
      7,
      true
    ),
    (
      'Code Reviewer',
      NULL,
      'AI · Tooling',
      'An AI-powered code reviewer that analyzes code snippets and returns structured suggestions.',
      ARRAY['React', 'OpenAI', 'Node.js']::text[],
      'https://code-reviewer-black.vercel.app/',
      NULL,
      false,
      8,
      true
    );
END $$;
