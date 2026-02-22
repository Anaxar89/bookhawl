# 🦉 BookHawl

App per gestire la tua lista di libri da leggere.

## Stack
- **Vanilla JS** (ES Modules) + **Vite** (bundler/dev server)
- **Supabase** (PostgreSQL + Auth + Storage)
- **CSS puro** con variabili custom (nessun framework)

## Struttura
```
bookhawl/
├── .env                        # Credenziali Supabase (non committare!)
├── .env.example                # Template per il team
├── package.json
├── vite.config.js
└── src/
    ├── assets/
    │   └── logo.png
    ├── components/
    │   ├── Stars.js            # Background stelle animato
    │   └── Toast.js            # Notifiche toast
    ├── lib/
    │   ├── supabase.js         # Client Supabase singleton
    │   ├── auth.js             # Tutte le funzioni auth
    │   └── validation.js       # Validazione form
    ├── pages/
    │   ├── auth.html           # Pagina login/registrazione ← entry point
    │   ├── auth-callback.html  # Redirect OAuth
    │   └── app.html            # App principale (placeholder)
    ├── scripts/
    │   ├── auth.js             # Controller pagina auth
    │   └── auth-callback.js    # Gestione callback OAuth
    └── styles/
        ├── global.css          # Variabili CSS + reset
        └── auth.css            # Stili pagina auth
```

## Setup locale

```bash
# 1. Installa dipendenze
npm install

# 2. Copia il file env
cp .env.example .env
# → Compila con le tue credenziali Supabase

# 3. Avvia il dev server
npm run dev
# → Apre http://localhost:3000/src/pages/auth.html
```

## Supabase — configurazione necessaria

### 1. Abilita Google OAuth
Dashboard Supabase → **Authentication → Providers → Google**
- Inserisci Client ID e Secret da Google Cloud Console
- Aggiungi URL callback: `https://svcaeuyyovvkkkivplde.supabase.co/auth/v1/callback`

### 2. Abilita Apple OAuth
Dashboard Supabase → **Authentication → Providers → Apple**
- Richiede Apple Developer Account
- Configura Services ID, Key ID, Team ID

### 3. URL di redirect autorizzati
Dashboard Supabase → **Authentication → URL Configuration**
```
# Sviluppo
http://localhost:3000/src/pages/auth-callback.html

# Produzione (aggiungere quando si fa deploy)
https://tuodominio.com/src/pages/auth-callback.html
```

### 4. SQL — tabella profili (opzionale ma consigliato)
```sql
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Crea profilo automaticamente ad ogni signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Build per produzione

```bash
npm run build
# Output nella cartella /dist
```
