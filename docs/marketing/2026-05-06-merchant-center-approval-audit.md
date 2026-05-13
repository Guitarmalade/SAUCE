# Merchant Center Approval Audit

Date: May 6, 2026
Site reviewed: `https://www.guitarmalade.com`
Focus: getting product pages approved in Google Merchant Center, especially `Guitarmalde Cookbook Vol. 1`

## What was verified

- The live product landing pages on `guitarmalade.com` are Webflow pages that mostly contain a Gumroad embed and very little crawlable product content.
- The cookbook product on Gumroad is explicitly an `ebook` / PDF digital download.
- Other lesson products checked are digital downloads on Gumroad.
- The sticker product checked is a physical product on Gumroad.

## Main blockers

### 1. The live product landing pages look generic to Google

The raw HTML for these pages is extremely thin:

- `https://www.guitarmalade.com/lessons/guitarmalde-cookbook-vol-1`
- `https://www.guitarmalade.com/lessons/blues-dad-bbq`
- `https://www.guitarmalade.com/lessons/guitarmalade-top-5-licks`
- `https://www.guitarmalade.com/merch/guitarmalade-sticker`

What is missing from the actual page HTML:

- visible product description
- visible price block with clear currency
- visible availability / fulfillment language
- visible buy or add-to-cart button in the page content
- product-specific policy / refund language
- structured page copy that matches a normal product detail page

Right now the page is basically a shell around a Gumroad embed. That is the kind of setup Google commonly treats as a generic or dysfunctional landing page.

### 2. The cookbook has a likely policy block for Shopping ads

The cookbook Gumroad page identifies the item as:

- `native_type: "ebook"`
- format: `Instant digital download (PDF)`

That matters because Google Merchant Center policy does not allow digital books / eBooks in Shopping ads.

Practical meaning:

- If the Merchant Center issue for the cookbook says `Digital books can't be featured in ads`, this product will not be approved for Shopping ads as-is.
- In that case, the fix is not better SEO copy. The fix is to remove or exclude the cookbook from Shopping ads.

### 3. The rest of the lesson products still have approval risk

Other products checked:

- `Blues Dad BBQ` is `native_type: "digital"`
- `Guitarmalade Top 5 LICKS` is `native_type: "digital"`
- `Guitarmalade Sticker` is `native_type: "physical"`

So the cookbook has the clearest policy problem, but the larger site issue affects multiple products:

- the landing pages on `guitarmalade.com` are too thin
- Google sees almost none of the real product detail that exists on Gumroad

### 4. Trust / business information is still light

The contact page is better than nothing, but still thin for Merchant Center trust review:

- visible email: `chris@guitarmalade.com`
- social links
- contact form

Still missing or not clearly surfaced on the site:

- physical mailing or business address
- visible business phone number, if available
- dedicated privacy policy page
- dedicated terms page
- dedicated refund / return policy page
- dedicated shipping policy page for physical products

## What to change first

### Priority 1: Check the exact cookbook disapproval reason

In Merchant Center, open the cookbook product and confirm the exact issue text.

If the issue is about digital books / eBooks:

- remove the cookbook from Shopping ads
- do not spend time trying to make that one item ad-approved
- focus instead on physical products and non-blocked digital products

If the issue is not the eBook policy:

- continue with the landing page fixes below

### Priority 2: Rebuild the Webflow product template so the product details exist in the page HTML

Do not rely on the Gumroad embed as the main product page content.

Each product page on `guitarmalade.com` should visibly include:

- product name
- product image
- short summary
- longer description
- price in USD
- fulfillment type
- availability
- buy button
- support email
- refund policy summary

Recommended wording blocks for digital products:

- `Instant digital download`
- `Works on phone, tablet, or desktop`
- `Delivered immediately after purchase`
- `No refunds on digital products`
- `Questions? Email chris@guitarmalade.com`

Recommended wording blocks for physical products:

- shipping timing
- return / refund terms
- stock / availability language

Important: put this content directly into the Webflow CMS template or static page content so it exists before JavaScript runs.

### Priority 3: Add policy pages

At minimum create and link these pages:

- `/privacy-policy`
- `/terms`
- `/refund-policy`
- `/shipping-policy`

Suggested split:

- digital lessons: refund policy explains no refunds on digital products
- physical merch: shipping + return policy explains timing, costs, and return window

### Priority 4: Strengthen contact / business identity

Update footer and contact page to clearly show:

- `Guitarmalade LLC`
- support email
- mailing or business address
- phone number if available

Also make sure the Merchant Center account business details match the website exactly.

### Priority 5: Fix weak SEO metadata on product pages

Examples found:

- some product pages only expose the product title
- `https://www.guitarmalade.com/merch/guitarmalade-sticker` currently has a generic page title: `Guitarmalade`

Each product page should have:

- unique title tag
- unique meta description
- matching OG title / description

## Recommended approval order

### 1. Physical products first

Try to get these cleaned up and approved before spending more time on the cookbook:

- sticker
- shirts / hoodies / merch

Reason:

- physical goods are the cleanest fit for Merchant Center
- they avoid the cookbook eBook policy problem

### 2. Digital lesson products next

Products like:

- `Blues Dad BBQ`
- `Top 5 LICKS`

may still be possible, but only after the landing pages are rebuilt into real product pages.

### 3. Cookbook last

If the cookbook is being treated as a digital book / eBook for Shopping ads, stop trying to force approval there.

Use it instead for:

- organic search
- normal web SEO
- YouTube / social traffic
- email
- branded search

## Clean handoff summary

The biggest problem is not that Google cannot find the products. The biggest problem is that the product landing pages on `guitarmalade.com` are too empty, and the cookbook itself is probably blocked from Shopping ads by policy because it is an eBook / PDF.

The fastest path is:

1. confirm the cookbook's exact Merchant Center issue text
2. remove the cookbook from Shopping ads if the issue is the digital book policy
3. rebuild the Webflow product pages so they contain real product content in the HTML
4. add policy pages and stronger business info
5. request review again
