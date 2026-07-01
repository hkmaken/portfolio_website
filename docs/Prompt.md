# Title
Portfolio Website for a professional graphics designer with drop-in content management - all frontend.

# Description
You are an expert senior frontend engineer, UI/UX designer, and software architect.
Your task is to design and implement a modern, lightweight portfolio website for a graphic designer.
The project should emphasize maintainability, ease of updating content, high performance, excellent SEO, and responsive design.

# Overall Goals

Build a portfolio website that:

- showcases the designer's work
- allows visitors to learn about the designer
- allows potential clients to contact the designer
- requires little to no maintenance
- can be deployed as a completely static website
- makes adding or updating projects extremely simple without modifying application code
The project should be production quality.

# Technology Stack

Use modern frontend technologies only.

Preferred stack:

* React
* Next.js (latest stable App Router)
* TypeScript
* TailwindCSS
* shadcn/ui components
* Framer Motion (for tasteful animations)
* Lucide icons

The application should be static-exportable whenever possible.

Do NOT introduce a backend unless absolutely necessary.

# Primary Requirement

The website owner should never have to edit application code to add new portfolio items.
Instead, new work should automatically appear by simply:

Option A (preferred)

Dropping a folder into a predefined directory.

Example:

```
content/

    project-1/
        project.json
        cover.jpg
        image1.jpg
        image2.jpg

    project-2/
        project.json
        cover.png
        artwork.webp
```
The application should automatically discover every project folder.

OR

Option B

Markdown/MDX files with frontmatter.

Example:
```
content/
    branding-project.md
    logo-design.md
    ux-case-study.md
```
Claude should compare both approaches and recommend the better one for non-technical users.

# Project Metadata

Each project should contain metadata such as

* title
* subtitle
* category
* client (optional)
* year
* services
* description
* tools used
* thumbnail
* gallery images
* featured flag
* order
* tags

Example
```
Title:
Modern Coffee Branding

Category:
Brand Identity

Services:
Logo Design
Packaging
Typography

Year:
2025

Tags:
Branding
Illustration
Packaging

Featured:
true
```
# Automatic Content Discovery

The application should automatically:

* scan the content directory
* load every project
* sort projects
* generate pages
* generate image galleries

without manual registration.

Adding

`content/new-client/`

should automatically create

`/portfolio/new-client`

without changing code.

# Homepage

The homepage should contain:

* Hero section
* Large introduction
* Professional portrait placeholder
* Short biography
* Call-to-action button
* Featured projects
* Services overview
* Testimonials placeholder
* Client logos placeholder
* Contact CTA
* Footer

# Portfolio

Portfolio page containing

Filtering

* Branding
* Illustration
* Print
* UI
* UX
* Web
* Motion
* Other

Sorting

* Newest
* Oldest
* Alphabetical
* Search by title or tags.

Project cards should include

* cover image
* title
* category
* short description
* hover animations

# Individual Project Page

Each project page should include

* Hero image
* Project overview
* Problem statement
* Design process
* Solution
* Gallery
* Fullscreen lightbox
* Tools used
* Deliverables
* Related projects
* Next / Previous navigation

# About Page

Should include

* Biography
* Experience
* Skills
* Software proficiency
* Education
* Values
* Design philosophy
* Professional portrait
* Download CV button

# Contact Page

* Should include
* Contact information
* Email
* Phone (optional)
* Location
* Social links
* Contact form
* Google Maps placeholder
* Business availability
* Response time

# Contact Form

Since there is no backend, compare and recommend the best approach among:

* Formspree
* Netlify Forms
* EmailJS
* Basin
* Getform

Explain pros and cons.
Implement the recommended solution.
Include validation.
Spam protection.
Success message.
Error handling.

# Image Handling

Images should be automatically optimized.

Support

* jpg
* jpeg
* png
* webp
* avif

Generate responsive images.
Lazy loading.
Blur placeholders.
Lightbox.

# SEO

Implement

* Metadata
* OpenGraph
* Twitter cards
* JSON-LD
* Sitemap
* robots.txt
* Canonical URLs
* Semantic HTML
* Accessible headings

# Accessibility

* WCAG compliance
* Keyboard navigation
* Proper contrast
* Alt text
* Focus indicators
* Screen reader support

# Performance

Aim for

* 100 Lighthouse Performance
* 100 Accessibility
* 100 SEO
* 100 Best Practices

Optimize

* fonts
* images
* code splitting
* static rendering
* tree shaking
* minimal JavaScript

# Responsive Design

Support

* Desktop
* Laptop
* Tablet
* Mobile
* Landscape
* Portrait

# Animations

Subtle only.

Examples

* Fade
* Slide
* Scale
* Stagger
* Hover effects

No excessive animations.
Respect prefers-reduced-motion.

# Theme

Implement

* Light mode
* Dark mode
* System preference
* Persist user preference.

# Components

Organize into reusable components.

Examples

* Navbar
* Footer
* Hero
* Portfolio Grid
* Project Card
* Gallery
* Lightbox
* Tag
* Badge
* Button
* Contact Form
* Theme Toggle
* Search
* Filter
* Pagination (optional)

# File Structure

Use a scalable architecture.

Example
```
app/
components/
content/
lib/
hooks/
styles/
public/
types/
utils/
```
Explain the reasoning behind the structure.

# Styling

Create a modern aesthetic suitable for a professional graphic designer.

Characteristics

* Minimal
* Elegant
* Lots of whitespace
* Large typography
* Grid-based
* Subtle animations
* High-quality visual hierarchy

Do not use generic template aesthetics.

# Configuration

All configurable values should live in one location.

Examples

* Designer name
* Biography
* Email
* Phone
* Social links
* Skills
* Services
* Navigation
* Footer
* SEO
* Analytics IDs

This should allow customization without editing components.

# Deployment

Recommend deployment on

* Vercel
* GitHub Pages
* Cloudflare Pages
* Netlify

Compare advantages and disadvantages.

Choose the best option.

# Documentation

Produce comprehensive documentation including

* Installation
* Development
* Building
* Deployment
* Adding projects
* Replacing images
* Updating profile
* Changing colors
* Changing typography
* Changing navigation
* Adding social links
* Updating SEO

# Nice-to-Have Features

If they improve the project without unnecessary complexity, include:

* Masonry portfolio layout
* Animated page transitions
* Image preloading
* Scroll progress indicator
* "Back to top" button
* Scroll-triggered reveal animations
* Project tag filtering
* Related projects algorithm
* Copy email button
* Social sharing
* Print-friendly CV page
* Favicon generation
* PWA support (optional)

# Deliverables

Produce:

1. Complete architecture overview.
2. Technology justification.
3. Folder structure.
4. Data model.
5. Content loading strategy.
6. UI component hierarchy.
7. Routing strategy.
8. SEO strategy.
9. Accessibility strategy.
10. Deployment guide.
11. Documentation.
12. Production-ready implementation.

The implementation should follow clean architecture principles, be fully typed with TypeScript, use modern React best practices, and be easy to maintain for someone with little to no programming experience. The primary design objective is that new portfolio projects can be added simply by creating a new content folder (or content file, if that approach is recommended), with the website automatically discovering and displaying them without any code changes.