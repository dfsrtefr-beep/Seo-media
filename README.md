# seo-media

Полноценный SEO-ориентированный информационный портал на **Next.js 14 + TypeScript + PostgreSQL + Prisma**.

Публикация статей, новостей и экспертных материалов с сильной технической SEO-основой.

## Стек

- **Next.js 14** (App Router, SSR/ISR)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL + Prisma** (ORM)
- **NextAuth.js** (авторизация администратора)
- **Zod** (валидация)
- **react-markdown** (рендер Markdown-контента)
- **sharp** (оптимизация изображений)

## Возможности

### Публичная часть
- Главная страница с последними статьями и разделами
- Страница отдельной статьи (Markdown, оглавление, похожие материалы)
- Список статей с пагинацией
- Страницы категорий, тегов и авторов
- Поиск по сайту
- Страницы «О проекте», «Контакты», «Политика конфиденциальности», «Пользовательское соглашение»

### CMS / Админ-панель (`/admin`)
- Создание, редактирование, удаление статей
- Черновики, запланированные публикации, архив
- Markdown-редактор контента
- Управление категориями, тегами, авторами
- Редиректы 301/302
- Настройки сайта

### SEO
- Чистые SEO-friendly URL (slug)
- Автоматическая генерация `sitemap.xml`
- `robots.txt`
- Canonical URL
- Микроразметка Schema.org: Article, BreadcrumbList, Organization, Person
- Open Graph и Twitter Cards
- Страница 404, редиректы 301
- **SEO-блок для каждой статьи** с чек-листом:
  - Длина SEO Title и Meta Description (с счётчиками)
  - Основной ключевой запрос и его наличие в тексте
  - Наличие изображений и Alt-текстов
  - Категория, автор, noindex
- E-E-A-T: страницы авторов с биографиями, даты публикации/обновления

### Интеграции
- Google Analytics 4 (через `NEXT_PUBLIC_GA4_MEASUREMENT_ID`)
- Google Tag Manager (через `NEXT_PUBLIC_GTM_CONTAINER_ID`)
- Google Search Console — подтверждение через консоль (подключение вручную)

## Запуск

### Требования
- Node.js 20+
- PostgreSQL

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

Обязательно задайте `DATABASE_URL` и `NEXTAUTH_SECRET` (длинная случайная строка).

Сгенерировать секрет можно командой:

```bash
openssl rand -base64 32
```

### 3. Миграция базы данных

```bash
npx prisma migrate dev
```

### 4. Создание первого администратора

```bash
npx prisma db seed
```

Логин и пароль берутся из `ADMIN_EMAIL` и `ADMIN_PASSWORD` (по умолчанию `admin@seo-media.com` / `changeme123`).

### 5. Запуск

```bash
npm run dev
```

Откройте http://localhost:3000

## Доступ к админ-панели

1. Перейдите на http://localhost:3000/login
2. Введите email и пароль администратора
3. Админ-панель доступна на http://localhost:3000/admin

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск production-сборки |
| `npm run lint` | Линтинг |
| `npm run db:migrate` | Применить миграции |
| `npm run db:deploy` | Применить миграции (production) |
| `npm run db:seed` | Заполнить БД (первый админ) |
| `npm run db:studio` | Prisma Studio |

## Запланированные публикации

Статьи со статусом `SCHEDULED` публикуются автоматически при наступлении `scheduledAt`.

Для этого настройте cron, вызывающий endpoint:

```
GET /api/cron/publish
```

Пример (crontab, каждые 5 минут):

```
*/5 * * * * curl -s http://localhost:3000/api/cron/publish
```

## Структура проекта

```
src/
├── app/                    # App Router
│   ├── (public)/           # Главная, статьи, категории, теги, авторы, поиск
│   ├── admin/              # Админ-панель (защищена)
│   ├── login/              # Страница входа
│   ├── api/                # API-роуты (auth, cron)
│   ├── sitemap.xml/        # Генерация sitemap
│   └── robots.txt/         # robots.txt
├── components/             # UI-компоненты
├── lib/                    # Prisma, auth, schema, утилиты
└── types/                  # Расширения типов
prisma/
├── schema.prisma           # Модели БД
└── seed.ts                 # Начальные данные
```

## Деплой

Проект готов к деплою на Vercel или любой Node.js-хостинг с PostgreSQL.

1. Задайте переменные окружения на хостинге (см. `.env.example`)
2. `npm run build`
3. `npm run db:deploy` для применения миграций
4. Запустите cron для `/api/cron/publish`

## Безопасность

- Пароли хешируются через bcrypt
- Админ-панель защищена авторизацией (JWT-сессии)
- Валидация всех входных данных через Zod
- Защита от SQL-инъекций (Prisma ORM)
- Защита от XSS (react-markdown без raw HTML по умолчанию)
