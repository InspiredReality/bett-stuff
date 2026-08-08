# CLAUDE.md — Frames App Architecture

## Deployment Topology

| Layer    | Production | Dev / Preview |
|----------|-----------|---------------|
| Frontend | Vercel — deploys from `main` branch | Vercel preview — deploys from `qa` branch |
| Backend  | Railway prod service — deploys from `main` branch | Railway dev service — deploys from `qa` branch |

**Branch workflow:** Create a feature branch → open PR into `qa` → verify on Railway dev + Vercel preview → open PR from `qa` into `main` → production deploys automatically.

Never push directly to `main`. Never skip `qa` for backend changes — DB migrations run on Railway startup and cannot be rolled back easily.

---

## Tech Stack

### Frontend
- **Vue 3** with Composition API and `<script setup>` syntax (no Options API)
- **Pinia** for all client state and API interaction
- **Vue Router** with navigation guards
- **Tailwind CSS** — custom palette: `primary-*` (indigo-based), `dark-*` (neutral dark scale)
- **Axios** via `src/services/api.js` — pre-configured with `Authorization: Bearer <token>` header
- **Three.js** — `FramePreview.vue` for 3D frame rendering
- **SortableJS** — drag-and-drop reordering in `OrgObPanel.vue`

### Backend
- **FastAPI** — all routes prefixed with `/api`
- **SQLAlchemy** (sync) — ORM with PostgreSQL on Railway
- **Pydantic v2** — request body validation via `BaseModel`
- **JWT** — `python-jose`, Bearer token in `Authorization` header
- **Werkzeug** — password hashing
- **Pillow** — image processing / thumbnail generation

---

## Repository Structure

```
frames/
├── frontend/
│   └── src/
│       ├── views/          # Full pages (one per route)
│       ├── components/     # Reusable UI components
│       ├── store/          # Pinia stores (one per domain)
│       ├── services/
│       │   └── api.js      # Axios instance + getUploadUrl helper
│       ├── utils/          # Pure JS helpers (e.g. guestSession.js)
│       └── router/
│           └── index.js    # All routes + navigation guards
└── backend/
    └── app/
        ├── models/         # SQLAlchemy models + __init__.py exports
        ├── routers/        # FastAPI routers (one per domain)
        ├── services/       # Business logic (image processing etc.)
        ├── utils/          # Helpers (uploads, filenames)
        ├── core/
        │   └── settings.py # Environment config (pydantic BaseSettings)
        ├── db.py           # engine, Base, SessionLocal, get_db
        └── main.py         # App factory, CORS, startup migrations, router registration
```

---

## Backend Patterns

### Router Registration (`main.py`)
All routers are imported and registered in `create_app()`:
```python
app.include_router(walls_router,        prefix="/api/walls",        tags=["walls"])
app.include_router(pictures_router,     prefix="/api/pictures",     tags=["pictures"])
app.include_router(realities_router,    prefix="/api/realities",    tags=["realities"])
app.include_router(org_obs_router,      prefix="/api/org-obs",      tags=["org-obs"])
app.include_router(tags_router,         prefix="/api/tags",         tags=["tags"])
app.include_router(admin_router,        prefix="/api/admin",        tags=["admin"])
app.include_router(guest_events_router, prefix="/api/guest-events", tags=["guest-events"])
app.include_router(auth_router,         prefix="/api/auth",         tags=["auth"])
```

### Database Migrations
**No Alembic.** Migrations run in the startup block inside `main.py` using raw SQL with `ALTER TABLE` / `CREATE TABLE`. Each migration is wrapped individually in try/except + rollback so one failure doesn't block others:
```python
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE walls ADD COLUMN new_col TEXT"))
        conn.commit()
    except Exception:
        conn.rollback()
```
Always use `IF NOT EXISTS` in DDL. Add new migrations at the **end** of the startup block. Never modify or remove existing migration statements.

### SQLAlchemy Relationships
Use `lazy='dynamic'` for one-to-many relationships where you need `.count()` or filtered queries:
```python
walls = relationship('Wall', backref='owner', lazy='dynamic', cascade='all, delete-orphan')
```
Call `.count()` not `len()`. Call `.all()` before iterating.

### Auth Dependencies (`routers/auth.py`)
Four FastAPI dependency functions — use the right one per endpoint:
- `get_current_user` — requires valid JWT, raises 401 if missing/invalid
- `get_optional_current_user` — returns `User | None`, never raises
- `get_guest_user(db)` — returns shared `guest@frames.internal` account (creates on first call); call this after `get_optional_current_user` returns `None`
- `get_admin_user` — wraps `get_current_user`, raises 403 if `user.is_admin` is False

### Guest User Pattern
Unauthenticated users share a single backend account (`guest@frames.internal`). This account is excluded from "registered users" counts in the admin but **included** in the admin user list with `is_guest: True`. Guest walls are always created as `is_private=False`. The admin panel labels this user as "Unauth".

### Admin Seeding
Set `ADMIN_EMAILS=user@example.com` in Railway environment variables. On every backend startup, the app queries each email and sets `is_admin=True`. No UI or API endpoint needed to grant admin — env var only.

### File Uploads
Uploaded files are stored under `settings.UPLOAD_FOLDER` (e.g. `uploads/`), sub-divided by type (`walls/`, `realities/`, `pictures/`). The frontend fetches them via `/uploads/<path>` (served as static files). Use `make_safe_filename` from `app/utils/uploads.py` to generate unique filenames. Never store absolute paths in the DB — store relative paths like `walls/user1_a1b2c3_photo.jpg`.

### `to_dict()` Convention
Every model has a `to_dict()` method that returns a plain `dict` for JSON serialisation. Nested relationships are **opt-in** via `include_children=True` / `include_placements=True` flags to avoid N+1 queries.

### GuestEvent Model
`GuestEvent` is standalone (no FK to User). The Python attribute is named `event_metadata` but maps to a DB column named `metadata` (avoids SQLAlchemy's reserved `metadata` attribute on all Declarative models):
```python
event_metadata = Column("metadata", JSON, nullable=True)
```

---

## Frontend Patterns

### Pinia Stores
One store per domain in `src/store/`. Stores own all API calls — components never import `api` directly (exception: admin page bulk operations). Each store exposes reactive state and async functions using the composition style:

```js
export const useWallsStore = defineStore('walls', () => {
  const walls = ref([])
  async function fetchWalls() { ... }
  return { walls, fetchWalls, ... }
})
```

### API Service (`src/services/api.js`)
```js
import axios from 'axios'
const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
export default api
export const getUploadUrl = (path) => path ? `/uploads/${path}` : null
```
Always use `getUploadUrl()` to build image `src` attributes — never construct `/uploads/` paths manually.

### Vue Router Guards
```js
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})
```
Route meta flags: `requiresAuth: true` (redirects to login), `guest: true` (redirects authenticated users away from login/register pages).

### Auth Store Hydration
`App.vue` calls `authStore.fetchUser()` in `onMounted` when a token is present. This hydrates `authStore.user` (including `is_admin`) after page refresh, so ownership checks and admin nav links work correctly on hard reload.

### Guest Session Tracking (`src/utils/guestSession.js`)
For unauthenticated users only. Generates a UUID stored in `localStorage` as `frames_guest_session_id`. Call `logGuestEvent(isAuthenticated, action, metadata)` after successful actions — it no-ops for authenticated users and silently swallows errors so it never breaks the main flow.

Tracked actions: `wall_created`, `frame_created`, `frame_added_to_wall`, `frame_rearranged`, `layout_saved`.

### Component Conventions
- **Views** (`src/views/`) — one file per route, own their page-level state and modals
- **Components** (`src/components/`) — reusable, receive data via props, emit events upward
- No comments unless the WHY is non-obvious
- Use `@click.stop` to prevent event bubbling on nested interactive elements
- Lock body scroll when a modal is open: `document.body.style.overflow = open ? 'hidden' : ''`; restore in `onUnmounted`

### Tailwind Colour Conventions
- `bg-dark-400 / bg-dark-300 / bg-dark-200 / bg-dark-100` — page background scale (darkest to lightest)
- `text-primary-400 / bg-primary-600` — accent (indigo/blue)
- `text-gray-400 / text-gray-500` — muted text
- `text-red-400 / bg-red-600` — destructive actions
- `text-yellow-400` — admin badge

---

## Domain Model Overview

```
User
 ├── Wall (many)          ← image, frame_placements (JSON), scene_config (JSON)
 ├── Picture (many)       ← image, original_image_path
 │    └── PictureFrame    ← dimensions, styling (frame_color, frame_thickness_inches)
 ├── Reality (many)       ← image, width_m, length_m, tags (M:M)
 │    └── OrgOb (tree)    ← self-referential parent_id, order_index, children cascade
 └── Tag (many)           ← name, color (#hex), linked to realities via reality_tags

GuestEvent (standalone)  ← session_id (UUID str), action, event_metadata (JSON), created_at
```

---

## Environment Variables

### Backend (Railway)
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key |
| `UPLOAD_FOLDER` | Absolute path for file uploads |
| `ADMIN_EMAILS` | Comma-separated emails to grant `is_admin=True` on startup |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) |

### Frontend (Vercel)
| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend API base URL (set per Vercel environment) |

---

## Adding a New Feature — Checklist

1. **Backend model**: add to `app/models/`, register in `__init__.py`
2. **Migration**: add `CREATE TABLE IF NOT EXISTS` or `ALTER TABLE` to the startup block in `main.py` (end of the block, wrapped in try/except)
3. **Router**: create `app/routers/<domain>.py`, register in `main.py`
4. **Frontend store**: create `src/store/<domain>.js` (Pinia, composition style)
5. **View**: create `src/views/<Page>.vue` using `<script setup>`
6. **Route**: add to `src/router/index.js` with correct `meta` flags
7. **Nav link**: add to `NavBar.vue` if user-facing
8. **Deploy path**: push to feature branch → PR to `qa` → verify on Railway dev → PR to `main`
