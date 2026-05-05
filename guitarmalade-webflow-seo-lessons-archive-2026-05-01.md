# Guitarmalade Webflow SEO And Lessons Archive

Generated: 2026-05-01
Workspace: `/Users/chrisschreiner/sauce`
Site: `guitarmalade.com`

## Purpose

This file captures the key work completed in this Codex/Webflow session so the work can be resumed after closing the window.

Sensitive credentials used during the session are intentionally omitted from this archive.

## High-Level Outcomes

- Updated live Webflow content and SEO across core pages.
- Replaced placeholder review/testimonial content with real review-based content.
- Created new high-intent SEO landing pages.
- Reworked the lessons page into horizontal product rows with descriptions.
- Widened the lessons rows across large screens.
- Fixed the mobile title fit for `Guitarmalde Cookbook Vol. 1`.
- Reordered lessons so `Blues Dad BBQ` sits under `Cookbook` and above `Top 5 LICKS`.

## Pages Created

- `https://www.guitarmalade.com/private-guitar-lessons`
- `https://www.guitarmalade.com/group-guitar-lessons`
- `https://www.guitarmalade.com/about-chris-schreiner`

## Core SEO / Content Changes

- Updated SEO titles and meta descriptions on:
  - Home
  - Lessons
  - Contact
  - Guitarmalade LIVE
- Replaced placeholder testimonials and dummy copy.
- Turned sitemap generation back on.
- Verified `https://www.guitarmalade.com/sitemap.xml` returned successfully after update.

## Homepage Testimonial Changes

- Replaced the old image-based testimonial presentation with Google review content.
- Restored the section heading to `Testimonials`.
- Built a right-to-left scrolling marquee treatment on the homepage.

## Lessons Page Layout Changes

The lessons page was reworked so each product displays as a horizontal card instead of a multi-card row layout.

### Product Descriptions Added

- `Guitarmalde Cookbook Vol. 1`
- `Blues Dad BBQ`
- `Blues Pentatonic Roadmap`
- `Mixolydian Jam Recipe`
- `Guitarmalade Top 5 LICKS`

### Layout Behavior

- Desktop: single-column list of wide horizontal cards.
- Mobile: stacked cards.
- Large screens: widened container and card proportions so rows stretch farther across the page.

## Mobile Cookbook Fix

On mobile, `Guitarmalde Cookbook Vol. 1` was adjusted to stay on one line by:

- applying a smaller mobile-only title size
- tightening card side padding slightly
- forcing the title not to wrap on phone widths

Verified at roughly `390px` width.

## Lessons Product Reorder

Final verified top-of-list order:

1. `Guitarmalde Cookbook Vol. 1`
2. `Blues Dad BBQ`
3. `Guitarmalade Top 5 LICKS`
4. `Mixolydian Jam Recipe`
5. `CAGED Conversion Therapy`

## Live URLs Touched

- `https://www.guitarmalade.com/`
- `https://www.guitarmalade.com/lessons`
- `https://www.guitarmalade.com/contact`
- `https://www.guitarmalade.com/guitarmalade-live`
- `https://www.guitarmalade.com/private-guitar-lessons`
- `https://www.guitarmalade.com/group-guitar-lessons`
- `https://www.guitarmalade.com/about-chris-schreiner`

## Implementation Notes

- Several lessons-page changes were implemented through Webflow page custom code in page `head` and `postBody`.
- Publishing required authenticated Webflow designer session access.
- Some publish operations were done by mirroring the authenticated Webflow publish request shape used by the designer.

## Good Next Steps

- Update product copy across lesson items.
- Continue migrating strong Blogspot content onto `guitarmalade.com`.
- Add structured data/schema to the strongest lesson and about pages.
- Review remaining lesson product order and copy consistency.

## Pending / Not Completed

- The question about getting this terminal workflow onto iPhone was not completed in this session.

## Archive Files

- Markdown: `guitarmalade-webflow-seo-lessons-archive-2026-05-01.md`
- Zip: `guitarmalade-webflow-seo-lessons-archive-2026-05-01.zip`
