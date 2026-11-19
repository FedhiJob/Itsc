# ITSC Legacy Website — Brand Analysis

> **Date:** 2026-07-26  
> **Source:** `https://itsc.com.et/` — live WordPress site (archived HTML)  
> **Purpose:** Extract brand identity, design language, and visual DNA to inform the new platform  
> **Method:** Static HTML/CSS analysis of the homepage

---

## 1. Brand Identity

### Core Identity

| Attribute | Value |
|-----------|-------|
| **Organization Name** | ITSC Technology Support |
| **Full Name** | Information Technology and Solutions Center |
| **Tagline** | "Imparting Knowledge Skills and Attitudes" |
| **SEO Description** | "Leading Technology (IT) Training and Certification center in Ethiopia" |
| **Domain** | `itsc.com.et` |
| **Social Presence** | Facebook, Twitter (@techItsc), LinkedIn, YouTube |

### Brand Personality

The legacy site projects a **professional, certification-focused, and authoritative** personality. It positions ITSC as:

- **A training center** — emphasis on courses, certifications, and international vendors
- **A consulting partner** — services include training, consulting, networking, certification, industrial automation
- **An exam center** — Pearson VUE Authorized Test Center
- **An enterprise partner** — client logos include banks, government ministries, UNDP, Coca-Cola

The brand voice is **formal and institutional**, using phrases like "Imparting Knowledge Skills and Attitudes" and "leading Technology (IT) Training and Certification center."

### Tagline & Messaging

The hero carousel uses three rotating messages:
1. "Start Your Cybersecurity Career With ITSC"
2. "Get Security Assessment for your Apps"
3. "Get trained ... Get Certified... Grab the Opportunity!"

These reveal a **cybersecurity-heavy focus** and a **certification-first value proposition**.

---

## 2. Color Palette

### Extracted Colors

| Token | Hex Value | Usage | Source |
|-------|-----------|-------|--------|
| **Gold/Yellow** | `#febd01` | Hero overlay, loader animation, primary accent | `rgba(254, 189, 1, 0.5)` overlay, `#loftloader-wrapper #loader { color: #febd01 }` |
| **Dark Grey** | `var(--itsc-dark-grey)` | Service item text color | CSS variable (exact hex unknown, likely ~`#333333`) |
| **Grey** | `var(--itsc-grey)` | Footer link color, secondary text | CSS variable (likely ~`#666666`) |
| **Background Grey** | `var(--itsc-bg-grey)` | Dropdown menu background | CSS variable (likely ~`#f5f5f5`) |
| **White** | `var(--itsc-white)` | Dropdown hover background, footer | CSS variable |
| **Black** | `#000000` | Loftloader background (85% opacity) | `#loftloader-wrapper .loader-section { background: #000000; opacity: 0.85 }` |
| **Footer Background** | `white` | Footer section | `footer { background: white; }` |

### Color Analysis

**The dominant brand color is GOLD/YELLOW (`#febd01`).** This is the single most distinctive brand element:

- Used as a semi-transparent overlay (`rgba(254, 189, 1, 0.5)`) on all hero background images
- Used as the loader animation color
- Creates a warm, energetic, optimistic feel

**The secondary color is dark grey/charcoal** for body text and headings.

**The tertiary color is white** — the footer, cards, and content areas use white backgrounds.

**Notable absence:** There is no blue in the legacy site's color scheme. The current new project uses blue (`#123a6f`) as its primary color, which is a **complete departure** from the legacy brand.

### Color Application Patterns

| Element | Color Treatment |
|---------|----------------|
| Hero section | Background images with gold (`#febd01`) overlay at 50% opacity |
| Navigation | Dark text on light background |
| Service icons | Font Awesome icons in default dark color |
| Course cards | White background, dark text, no border accent |
| Stats counter | No special background color (default white) |
| Footer | White background with dark text |
| Links | Default blue (`color: var(--itsc-grey)` on hover becomes `var(--itsc-dark-grey)`) |

---

## 3. Typography

### Font Stack

| Font | Type | Usage | Source |
|------|------|-------|--------|
| **Roboto** | Sans-serif (preloaded) | Body text, navigation, UI elements | Preloaded as `Roboto-Regular.ttf` |
| **Merriweather** | Serif (preloaded) | Headings, display text | Preloaded as `Merriweather-Regular.otf` |
| **Font Awesome** | Icon font | All icons (services, contact, social) | `font-awesome.min.css` v4.7.0 |
| **Helvetica/Arial** | Sans-serif fallback | Social media popup forms | `.sfsi_subscribe_Popinner h5 { font-family: Helvetica,Arial,sans-serif }` |

### Typography Patterns

| Context | Treatment |
|---------|-----------|
| Hero heading (h1) | Large, white text on gold-overlay background |
| Section headings (h1) | `text-center`, `margin-top: 2rem` |
| Service names (h3) | `service-name` class, dark grey |
| Card titles (h5) | Bootstrap card-title, bold |
| Body text | `text-align: justify` (applied globally to all `<p>` tags) |
| Stat numbers | Large `<h2>` with `<span class="count">` |
| Stat labels | `<h3 class="stat-text">` |

### Typography Observations

- **Serif + Sans-serif pairing** — Merriweather (serif) for headings + Roboto (sans-serif) for body is a classic, trustworthy combination
- **Justified body text** — `p { text-align: justify }` is applied globally, which is unusual for modern web design
- **No defined type scale** — heading sizes appear to use Bootstrap defaults
- **Responsive heading** — one media query adjusts hero h1 to 42px on mobile

---

## 4. Layout System

### Framework

The legacy site uses **Bootstrap 4** as its layout framework:
- Grid classes: `row`, `col-md-*`, `col-lg-*`, `col-*`
- Component classes: `navbar`, `navbar-expand-xl`, `card`, `card-body`, `card-title`, `card-text`
- Utility classes: `d-flex`, `align-items-center`, `justify-content-center`, `text-center`, `p-2`, `m-0`

### Layout Patterns

| Section | Layout | Columns |
|---------|--------|---------|
| Header contact bar | Flexbox row | 3 contact items + social icons |
| Navigation | Bootstrap navbar | Full-width with dropdown mega-menu |
| Hero | Full-width carousel | Single column with `col-md-5` content |
| Services | Grid | 4 columns at `lg`, 2 at `md` |
| Mission/Vision | 2-column | Text left, image right |
| Partners | Flexbox grid | Variable columns with `col-md-4 col-lg-3` |
| Top Courses | 3-column grid | `col-lg-4 col-md-6` |
| Stats | 3-column | `col-md-4` |
| Clients | Carousel | Single items in a slider |
| Footer | 3-column | `col-md-4` |

### Container Strategy

The site does **not** use a consistent container wrapper. Sections use:
- `.row` directly (sometimes without `.container`)
- Inline styles for padding (e.g., `style="padding:2rem;"` on partners section)
- No max-width constraint on most sections

---

## 5. Navigation Structure

### Top Header Bar

A **contact information bar** sits above the main navigation with:
- Location (Bole Road, Mega Building, 902)
- Email (info@itsc.com.et)
- Phone (+251-115-507150)
- Social media icons (Facebook, Twitter, LinkedIn)

### Main Navigation

The primary nav is a **Bootstrap navbar with multi-level dropdowns**:

```
Home
Certifications & Courses (dropdown)
  ├── LPI
  ├── (ISC)²
  │   └── Security Professionals
  │       ├── CISSP
  │       └── CCSP
  ├── Android ATC
  │   └── Mobile App Development
  │       ├── Flutter
  │       ├── Android Development
  │       ├── Android Security
  │       ├── UI/UX Design
  │       └── Java Fundamentals
  ├── Cisco
  │   ├── Routing & Switching → CCNA
  │   └── CCNP Enterprise → ENCOR, ENARSI
  ├── CompTIA
  │   ├── Core → A+, Network+, Security+
  │   ├── Cybersecurity → CySA+, PenTest+, CASP+
  │   └── Infrastructure → Linux+, Server+, Cloud+
  ├── EC Council
  │   ├── Certifications → CEH, CND, CHFI, ECSA, CSA, CISO, CPENT
  │   └── Platforms → CodeRed, OhPhish, iWeek
  ├── Huawei
  ├── Microsoft
  │   ├── Windows Server 2019
  │   ├── Azure
  │   ├── Exchange Server
  │   ├── SQL Server
  │   ├── System Center
  │   ├── Windows Server 2012
  │   ├── Windows Server 2016
  │   ├── Skype for Business
  │   └── SharePoint 2016
  ├── Oracle
  │   ├── Database Administration
  │   └── Java SE
  ├── RedHat
  │   └── System Administration
  ├── VMware → vSphere
  ├── ISACA → CISA, CISM, CGEIT, CRISC
  ├── CheckPoint → CCSA, CCSE
  └── PLC → Siemens PLC
Services (dropdown)
  ├── Training
  ├── Consulting
  ├── Networking
  ├── Certification
  └── Industrial Automation
Blog
Schedule
About
Contact Us
[Search icon]
```

### Navigation Observations

- **Extremely deep navigation** — up to 4 levels of nesting (Vendor → Topic → Course)
- **Vendor-first organization** — courses are organized by certification vendor, not by skill domain
- **Search is present** — Ivory Search plugin with AJAX autocomplete
- **No mobile hamburger menu** — uses Bootstrap's `navbar-toggler` with `data-toggle="collapse"`

---

## 6. Homepage Structure

The homepage is organized as a **vertical scroll** with distinct sections:

### Section Order

1. **Pre-header** — Contact info bar (location, email, phone, social)
2. **Navigation** — Mega-menu with vendor dropdowns
3. **Hero Carousel** — 3 slides with background images + gold overlay + headline
4. **Latest Announcement Carousel** — 2 slides (CEHv12, Linux Exam Vouchers)
5. **Services Grid** — 4 service cards (Training, Consulting, Networking, Certification)
6. **Mission & Vision** — Text + illustration image
7. **International Partners** — Logo grid (LPI, PECB, Cisco, Huawei, Android ATC, CompTIA, Microsoft, Inductive Automation, EC Council, Pearson VUE)
8. **Top Courses** — 3 course cards (Security+, Windows Server 2012, VMware vSphere)
9. **Stats Counter** — 3 stats (100+ Courses, 150+ Clients, 30+ Trainers)
10. **Clients Carousel** — Logo slider (NIB, UNDP, CBE, IA, DRMC, MoND, MInT, Coca Cola, Awash Bank, MoF)
11. **Footer** — 3 columns (Important Links, Logo + Contact + Social, Subscribe form)

### Content Hierarchy

```
1. Contact Info (utility)
2. Navigation (primary)
3. Hero (value proposition)
4. Announcements (timely promotions)
5. Services (what we offer)
6. Mission/Vision (who we are)
7. Partners (credibility)
8. Top Courses (product highlights)
9. Stats (social proof)
10. Clients (social proof)
11. Footer (links, contact, subscribe)
```

---

## 7. Component Inventory

### Reusable Components

| Component | Implementation | Notes |
|-----------|---------------|-------|
| **Hero Slide** | `.landing-content` with inline background + gradient overlay | 3 slides in carousel |
| **Service Card** | `.service-item` with icon, h3, p | 4 items in grid |
| **Course Card** | Bootstrap `.card` with `.card-body`, `.card-title`, `.card-text`, `.button` | 3 items |
| **Partner Logo** | `img` inside `col` with flexbox centering | 10 partners |
| **Client Logo** | `img` inside carousel slide | 10 clients |
| **Stat Item** | `.stat-item` with h2 (number) + h3 (label) | 3 items |
| **Contact Info Item** | Flex row with icon column + text column | Reused in header and footer |
| **Social Icon List** | `ul.nav.social` with Font Awesome icons | Reused in header and footer |
| **Announcement Card** | `.featured-course` with image + title | 2 items in carousel |
| **Navigation Dropdown** | Bootstrap `.dropdown-menu` with nested sub-menus | Multi-level |

### Third-Party Components

| Component | Plugin/Library | Purpose |
|-----------|---------------|---------|
| **LoftLoader** | `loftloader` | Page load animation (black screen + gold wave) |
| **Slick Carousel** | `slick` (inferred from font preload) | Hero, announcement, client carousels |
| **Font Awesome** | v4.7.0 | All icons |
| **Ultimate Social Media Icons** | `sfsi` | Social sharing |
| **Ivory Search** | `add-search-to-menu` | AJAX search |
| **Beautiful Taxonomy Filters** | `beautiful-taxonomy-filters` | Course filtering |
| **Optimole** | Image optimization CDN | Lazy loading, image compression |
| **Formidable Forms** | `formidable` | Forms (likely contact) |
| **Yoast SEO** | `yoast-seo` | SEO metadata |
| **Google Analytics** | UA-153606911-2 | Analytics |
| **Mailchimp** | Embedded form | Email subscription |

---

## 8. Design Patterns

### 1. Gold Overlay on Hero Images

The most distinctive visual pattern: background images are covered with a `rgba(254, 189, 1, 0.5)` gold overlay, creating a warm, unified look across different photography.

### 2. Card-Based Content Display

Services, courses, and announcements all use bordered card patterns with consistent spacing.

### 3. Logo Grids / Carousels

Partners and clients are displayed as logo grids/carousels — a trust-building pattern common in B2B/service websites.

### 4. Stats Counter

Large numbers with "+" suffix and descriptive labels — social proof pattern.

### 5. Contact Info Bar

Persistent contact information at the very top of every page — common for service businesses.

### 6. Vendor-Certification Taxonomy

Content is organized primarily by certification vendor (Microsoft, Cisco, CompTIA, etc.), not by skill or topic area.

### 7. Justified Text

All paragraph text is justified (`text-align: justify`), giving a formal, newspaper-like appearance.

### 8. Page Loader

A full-screen black overlay with a gold wave animation that appears on page load — creates a dramatic entrance.

---

## 9. Visual Strengths

1. **Strong brand color** — The gold (#febd01) is distinctive, memorable, and unique in the Ethiopian training market. It creates warmth and optimism.

2. **Serif + Sans-serif pairing** — Merriweather (headings) + Roboto (body) is a classic, trustworthy combination appropriate for an educational institution.

3. **Hero imagery with overlay** — The gold gradient overlay on background images creates visual unity across different photos and ensures text readability.

4. **Comprehensive course catalog** — The mega-menu navigation effectively communicates the breadth of offerings (14 vendors, hundreds of courses).

5. **Social proof sections** — Partner logos, client logos, and stats counter build credibility effectively.

6. **Contact information prominence** — Phone, email, and location are always visible in the top bar — good for conversion.

7. **Page loader animation** — Creates a polished, professional first impression (though potentially detrimental to UX).

8. **SEO foundation** — Yoast SEO, Open Graph tags, Twitter cards, schema.org structured data, XML sitemap — all well-implemented.

---

## 10. UX Weaknesses

1. **Extremely deep navigation** — 4 levels of dropdown menus make course discovery difficult. Users must navigate Vendor → Category → Subcategory → Course.

2. **No search results page visible** — Search exists but the results experience is unclear from the HTML.

3. **Justified text** — `text-align: justify` creates uneven word spacing and readability issues, especially on narrow screens.

4. **No consistent container** — Sections lack a unified max-width container, causing inconsistent horizontal alignment.

5. **Outdated Bootstrap 4** — The site uses Bootstrap 4 with jQuery-dependent components (dropdowns, carousels, navbar toggler).

6. **No mobile-optimized navigation** — The mega-menu with 14+ vendor categories is extremely difficult to navigate on mobile.

7. **Page loader** — The LoftLoader adds ~1-7 seconds of black screen before content appears, hurting perceived performance.

8. **No clear calls-to-action** — The hero section has headlines but no buttons (no "Enroll Now" or "View Courses" CTA).

9. **Content density** — The homepage is extremely long with 11 distinct sections, potentially overwhelming visitors.

10. **No accessibility features** — No skip-to-content, limited ARIA attributes, no focus management for dropdown menus.

11. **Outdated icon library** — Font Awesome 4.7.0 (released 2017) is used instead of a modern alternative.

12. **Plugin bloat** — 10+ WordPress plugins add significant JavaScript overhead and potential security surface.

---

## 11. Brand Elements That Must Be Preserved

| Element | Priority | Rationale |
|---------|----------|-----------|
| **Gold/Yellow (#febd01) as primary accent** | **Critical** | This is the single most distinctive brand element. The current new project uses blue (#123a6f) which has no connection to the legacy brand. |
| **Tagline "Imparting Knowledge Skills and Attitudes"** | High | Core brand messaging that appears in the page title |
| **Logo** | High | The existing logo should be used or modernized, not replaced |
| **Contact info (phone, email, address)** | High | Business-critical: +251-115-507150, info@itsc.com.et, Bole Road Mega Building 902 |
| **Social media accounts** | High | Facebook, Twitter (@techItsc), LinkedIn, YouTube |
| **Vendor/certification taxonomy** | High | The course organization by vendor (Microsoft, Cisco, CompTIA, etc.) is core to how ITSC presents its offerings |
| **Service categories** | Medium | Training, Consulting, Networking, Certification, Industrial Automation |
| **Partner logos** | Medium | LPI, PECB, Cisco, Huawei, Android ATC, CompTIA, Microsoft, Inductive Automation, EC Council, Pearson VUE |
| **Client logos** | Medium | NIB, UNDP, CBE, IA, DRMC, MoND, MInT, Coca Cola, Awash Bank, MoF — key trust signals |
| **Stats (100+ Courses, 150+ Clients, 30+ Trainers)** | Medium | Social proof metrics |
| **Mission & Vision statement** | Medium | "Provide ICT training with strong practical focus... contribute to internationally accredited ICT professionals" |
| **Domain (itsc.com.et)** | High | Existing SEO equity and brand recognition |
| **Google Analytics UA-153606911-2** | Medium | Preserve analytics continuity |

---

## 12. Outdated Design Elements That Should NOT Be Preserved

| Element | Reason for Removal |
|---------|-------------------|
| **Bootstrap 4 + jQuery** | Outdated framework; the new project uses Tailwind CSS v4 + React |
| **Font Awesome 4.7.0** | Outdated; the new project uses Lucide React (modern, tree-shakeable) |
| **Justified text alignment** | Hurts readability, especially on responsive layouts |
| **Page loader (LoftLoader)** | Hurts perceived performance; modern best practice is instant content |
| **Multi-level dropdown mega-menu** | Poor mobile UX; the new project should use a flatter navigation structure |
| **Plugin-dependent carousels** | Slick carousel adds unnecessary JavaScript; modern CSS can handle carousels |
| **WordPress-specific plugins** | The new project is a custom Next.js + Express stack |
| **Inline styles** | The legacy site uses extensive inline `style` attributes; the new project uses Tailwind utilities |
| **No container/max-width** | Inconsistent layout; the new project has a proper Container component |
| **Overly long homepage** | 11 sections is excessive; the new project should prioritize and consolidate |
| **Black page loader (#000000)** | Creates a negative first impression; contradicts the warm gold brand |
| **Yoast SEO plugin dependency** | The new project handles SEO natively through Next.js Metadata API |
| **Optimole image CDN** | The new project can use Next.js Image optimization instead |
| **Social media popup scripts** | Ultimate Social Media Icons adds bloat; social links in footer are sufficient |
| **Mailchimp embedded form** | Should be replaced with the new platform's own subscription system |

---

## 13. Brand Color Reconciliation

### Legacy vs. New Project Color Comparison

| Role | Legacy Color | New Project Color | Assessment |
|------|-------------|-------------------|------------|
| **Primary** | Gold `#febd01` | Blue `#123a6f` | **Complete mismatch.** The new project's blue has no connection to the legacy brand. |
| **Secondary** | Dark grey (~`#333`) | Indigo `#3f3cbb` | Mismatch. |
| **Background** | White `#ffffff` | `#f8fafc` (blue-tinted) | Minor difference. |
| **Accent** | Gold `#febd01` | Orange `#f97316` | The new project's orange is closer to the legacy gold than blue is, but still different. |

### Recommendation

The gold/yellow (`#febd01`) is the **most recognizable brand asset** of the legacy ITSC website. The new project's blue-primary color scheme represents a complete brand departure. **Strongly consider adopting gold as the primary or secondary accent color** in the new design to maintain brand continuity.

---

## 14. Logo Analysis

From the schema.org structured data:
- **Logo URL:** `https://itsc.com.et/itsccomet___/wp-content/uploads/2020/04/itsc_new_logo.png`
- **Dimensions:** 3170 × 1214 pixels (wide aspect ratio ~2.6:1)
- **Favicon:** `https://itsc.com.et/itsccomet___/wp-content/uploads/2020/04/favicon.ico`

The logo is a wide horizontal format, suitable for header placement. The favicon is the same logo in .ico format.

---

## 15. Content Strategy Insights

### What the Legacy Site Prioritizes

1. **Certifications over skills** — Content is organized by vendor certification, not by what you'll learn
2. **International credibility** — Partner logos, Pearson VUE authorization, international vendor affiliations
3. **Enterprise clients** — Government ministries, banks, UNDP — positions ITSC as a serious institutional partner
4. **Breadth of offerings** — 14 vendors, 100+ courses communicated through mega-menu

### What the Legacy Site Underplays

1. **Individual students** — The site speaks more to organizations than to individual learners
2. **Pricing** — No pricing information visible on the homepage
3. **Course schedules/dates** — A "Schedule" link exists but no visible calendar
4. **Online learning** — No mention of remote/virtual training options
5. **Modern tech skills** — AI, cloud, data science are not prominently featured (the new project's focus areas)

---

## 16. Summary for Design Direction

### The ITSC Brand DNA

```
Warm (gold) + Authoritative (serif) + Certified (vendor logos) + Institutional (government clients)
```

### Key Brand Touchpoints

1. **Gold (#febd01)** — The single most important visual identifier
2. **Serif + Sans-serif typography** — Merriweather + Roboto pairing
3. **Logo** — Wide horizontal format with ITSC acronym
4. **Tagline** — "Imparting Knowledge Skills and Attitudes"
5. **Vendor ecosystem** — 14 international certification partners
6. **Enterprise credibility** — Government and bank client logos

### Critical Gap in the New Project

The new project's current color scheme (blue primary `#123a6f`, indigo secondary `#3f3cbb`) **bears no resemblance to the legacy brand**. If brand continuity is important, the new project should:

1. Adopt gold (`#febd01` or a modernized variant) as the primary or secondary color
2. Consider a serif font for headings (Merriweather or similar) to maintain the authoritative tone
3. Preserve the logo and tagline
4. Maintain the vendor-partner ecosystem as a key content pillar
5. Keep the enterprise-focused messaging and client proof points