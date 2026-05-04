/* ==========================================================================
   Nazrani Heritage — Single Source of Truth (DATA)
   ==========================================================================
   Every piece of human-readable copy and every catalogue entity lives here.
   No HTML file should contain product strings, marketing copy, or brand text.
   No CSS file should contain brand-specific values.

   Structure:
     DATA.brand        — name, tagline, registered details
     DATA.nav          — top nav and footer column links
     DATA.announcement — strip above the header
     DATA.footer       — social, legal, payments
     DATA.copy.ui      — short reusable strings (button labels, toasts, etc.)
     DATA.copy.pages   — per-page copy keyed by page id
     DATA.config       — shipping rules, payment methods, sort modes
     DATA.products     — catalogue
     DATA.categories   — taxonomy
     DATA.standard     — sourcing standard rules
     DATA.provenance   — origins / partners
     DATA.journal      — article teasers
     DATA.articles     — full article bodies, keyed by slug

   This file is intentionally framework-free and editable by non-engineers.
   ========================================================================== */

(function (global) {
  'use strict';

  const DATA = {
    /* ------------------------------------------------------------------ */
    /*  BRAND                                                              */
    /* ------------------------------------------------------------------ */
    brand: {
      name: 'Nazrani',
      qualifier: 'Heritage',
      tagline: 'Heritage · Est. Kottayam',
      taglineShort: 'Smart. Honest. Ethical.',
      established: 'Kottayam',
      legalName: 'Nazrani Heritage Pvt. Ltd.',
      copyright: '© 2026 Nazrani Heritage Pvt. Ltd.',
      address: 'Kottayam · Kerala · India',
      paymentsLine: 'UPI · Visa · MasterCard · Net Banking',
      contact: {
        care: 'care@nazrani.in',
        press: 'press@nazrani.in',
        phone: '+91 481 0000 000',
        fssai: '11060 0001 ·····',
        gst: '32ABCDE·····'
      },
      social: {
        instagram: '#',
        twitter: '#',
        whatsapp: '#'
      },
      ogImage: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=80'
    },

    /* ------------------------------------------------------------------ */
    /*  ANNOUNCEMENT STRIP                                                 */
    /* ------------------------------------------------------------------ */
    announcement: [
      { tone: 'soft',  text: 'Wayanad · Idukki · Marayoor' },
      { tone: 'firm',  text: 'Free shipping on orders above ₹1,499' },
      { tone: 'soft',  text: 'Established · Kottayam' }
    ],

    /* ------------------------------------------------------------------ */
    /*  TOP NAVIGATION                                                     */
    /* ------------------------------------------------------------------ */
    nav: [
      { id: 'shop',     label: 'Shop',         href: 'shop.html' },
      { id: 'about',    label: 'About',        href: 'about.html' },
      { id: 'standard', label: 'The Standard', href: 'standard.html' },
      { id: 'origins',  label: 'Origins',      href: 'origins.html' },
      { id: 'journal',  label: 'Journal',      href: 'journal.html' }
    ],

    /* ------------------------------------------------------------------ */
    /*  FOOTER                                                             */
    /* ------------------------------------------------------------------ */
    footer: {
      tagline: 'Smart. Honest. Ethical. A modern continuation of a centuries-old merchant tradition from the Malabar coast.',
      columns: [
        {
          title: 'Shop',
          links: [
            { label: 'Spices',       href: 'shop.html?cat=Spices' },
            { label: 'Staples',      href: 'shop.html?cat=Staples' },
            { label: 'Ayurveda',     href: 'shop.html?cat=Ayurveda' },
            { label: 'Health Foods', href: 'shop.html?cat=Health%20Foods' }
          ]
        },
        {
          title: 'Company',
          links: [
            { label: 'About',           href: 'about.html' },
            { label: 'Origins',         href: 'origins.html' },
            { label: 'The Standard',    href: 'standard.html' },
            { label: 'Journal',         href: 'journal.html' },
            { label: 'Contact',         href: 'contact.html' }
          ]
        },
        {
          title: 'Help',
          links: [
            { label: 'Track order', href: 'contact.html' },
            { label: 'Returns',     href: 'contact.html' },
            { label: 'Shipping',    href: 'contact.html' },
            { label: 'Get in touch', href: 'contact.html' }
          ]
        },
        {
          title: 'Legal',
          links: [
            { label: 'FSSAI Lic.',     href: 'contact.html' },
            { label: 'GST · 32ABCDE',  href: 'contact.html' },
            { label: 'Terms',          href: 'contact.html' },
            { label: 'Privacy',        href: 'contact.html' }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    /*  REUSABLE UI COPY                                                   */
    /* ------------------------------------------------------------------ */
    copy: {
      ui: {
        addToCart:        'Add to cart →',
        added:            '✓ Added',
        viewCart:         '✓ Added — view cart',
        readMore:         'Read more →',
        backToHome:       'Back to home',
        backToShop:       'Back to the catalogue',
        backToJournal:    'Back to the journal',
        searchPlaceholder: 'Search products, origins, categories...',
        searchEmpty:      'No matches in catalogue',
        cartEmpty: {
          icon:   '☰',
          title:  'Your cart is empty',
          body:   'Begin with a single jar — pepper, jaggery, or honey from a named place.',
          cta:    'Browse the catalogue →'
        },
        cartShippingFree: 'Free shipping unlocked.',
        cartShippingBelow: function (delta) { return 'Add ' + delta + ' more for free shipping.'; },
        cartDispatch: 'Dispatched within 48 hours from Kottayam.',
        toast: {
          addedSuffix:  ' added to cart',
          removed:      'Removed from cart',
          subscribed:   'Subscribed to the harvest letter'
        },
        announcement: 'Letter of Appointment'
      },

      /* ------------------------------------------------------------------ */
      /*  PER-PAGE COPY                                                      */
      /*  Each page imports its own block via DATA.copy.pages[id].           */
      /* ------------------------------------------------------------------ */
      pages: {
        home: {
          meta: {
            title:       'Nazrani Heritage — Smart. Honest. Ethical.',
            description: 'Premium, single-origin Kerala produce. Pepper from Wayanad, cardamom from Idukki, jaggery from Marayoor. Audited against the Nazrani Sourcing Standard.'
          },
          hero: {
            eyebrow:     'The Family Table Standard',
            titleA:      'What we sell,',
            titleB:      'we serve',
            titleC:      ' at our own table.',
            lede:        'Premium, single-origin produce from the hills of Kerala — pepper from Wayanad, cardamom from Idukki, jaggery from Marayoor. Every product audited against the Nazrani Sourcing Standard before it earns the name.',
            ctaPrimary:  { label: 'Shop the catalogue →', href: 'shop.html' },
            ctaGhost:    { label: 'Read the Standard',    href: 'standard.html' },
            trust: [
              { n: 'No.01', l: 'Single, named\norigin per SKU' },
              { n: 'No.02', l: 'No synthetic\npesticides, ever' },
              { n: 'No.03', l: 'Fair prices paid\ndirect to growers' }
            ],
            card: {
              image:   'assets/images/family-lunch.png',
              alt:     'A multi-generational family — grandparents, parents, children, and a dog — at Sunday lunch',
              tag:     'The family table',
              lotLine: 'SUNDAY · 12:30 PM',
              meta:    'FEATURED · 04 / MAY',
              feat:    'Sunday lunch, Kottayam'
            },
            rep: {
              eyebrow: 'Since 52 AD',
              quote:   'A merchant name carried <span class="serif-i">across centuries</span> for honest weights and fair description.'
            }
          },
          story: {
            eyebrow:   'Part I · The Name',
            titleA:    'The meaning of ',
            titleB:    'Nazrani.',
            timeline:  '52 AD ────────── PRESENT',
            tags: [
              { tone: 'green', label: 'Malabar Coast' },
              { tone: 'green', label: 'Merchant Class' },
              { tone: 'gold',  label: 'Honest Weights' }
            ],
            lede:      'For centuries, Nazranis were recognised as a distinct merchant class by overseas traders — Jewish, Arab, and later European — drawn to their reputation for <span class="serif-i">intelligence, honesty, and professional integrity.</span>',
            paragraphs: [
              'Within the social fabric of pre-modern Kerala, they often acted as trusted intermediaries between communities that did not otherwise trade directly with one another — bridges across language, faith, and geography. Goods that passed through Nazrani hands were considered sound, fairly weighed, and honestly described.',
              'The world has changed since. The value at the heart of that reputation has not.'
            ],
            cta: { label: 'Read the full heritage →', href: 'article.html?slug=name-worth-keeping' }
          },
          categories: {
            eyebrow: 'The Catalogue',
            titleA:  'Four categories. ',
            titleB:  'One standard.',
            cta:     { label: 'View all 14 products →', href: 'shop.html' }
          },
          explore: {
            eyebrow: 'Explore',
            titleA:  'Where to ',
            titleB:  'go next.',
            tiles: [
              { name: 'Products',     desc: 'Single-origin spices, staples, Ayurveda, and health foods — fourteen in all.', cta: 'Shop the catalogue', href: 'shop.html' },
              { name: 'About',        desc: 'A merchant name carried since 52 AD, and what it asks of us today.',           cta: 'Read our story',     href: 'about.html' },
              { name: 'The Standard', desc: 'Five public checks every product clears before it earns the Nazrani name.',    cta: 'Read the Standard',  href: 'standard.html' },
              { name: 'Journal',      desc: 'Field notes, audit decisions, and the occasional recipe from the harvest.',     cta: 'Read the journal',   href: 'journal.html' }
            ]
          },
          featured: {
            eyebrow: 'Featured · Spring 26',
            titleA:  'From the ',
            titleB:  'harvest desk.',
            filters: ['All', 'Spices', 'Staples', 'Ayurveda', 'Health Foods']
          },
          standard: {
            eyebrow: 'Part III · The Standard',
            titleA:  'The Nazrani ',
            titleB:  'Sourcing Standard.',
            body:    'Every product that bears our name must clear five checks before it is listed. The standard is reviewed annually and published openly so customers can hold us to it.',
            cta:     { label: 'Read the full Standard', href: 'standard.html' }
          },
          founder: {
            eyebrow:  'Part II · A Note from the Founder',
            quote:    'When my family hands me a jar of pepper, a packet of tea, or a spoon of chyawanprash, the question is never <span class="em-i">"is this a good deal?"</span> — it is, <span class="accent">"is this fit for the people I love most?"</span>',
            avatar:   'assets/images/founder-rony.jpg',
            avatarAlt: 'Rony Zachariah, Founder of Nazrani Heritage',
            name:     'Rony Zachariah',
            role:     'Founder · Nazrani Heritage'
          },
          provenance: {
            eyebrow: 'Provenance',
            titleA:  'Every parcel begins at a ',
            titleB:  'named place.',
            lede:    'Geographic traceability reaches the village or estate level — never just the state. Our founding sourcing partner is <em>Vanamoolika</em>, a Wayanad cooperative; new partners are onboarded only against the Standard.',
            stamp:   'Provenance map · 06 origins',
            compass: { n: 'N', s: 'S · Kerala' }
          },
          journal: {
            eyebrow: 'The Journal',
            titleA:  'Letters from the ',
            titleB:  'harvest.',
            cta:     { label: 'All letters →', href: 'journal.html' }
          },
          promise: {
            eyebrow: 'The Promise',
            titleA:  'Quiet letters, four times a year. ',
            titleB:  'Field notes, harvest dates, and the occasional recipe.',
            placeholder: 'your@email.in',
            cta:    'Subscribe →',
            fineprint: 'No spam. Unsubscribe in one click.'
          }
        },

        about: {
          meta: {
            title:       'About · Nazrani Heritage',
            description: 'A merchant name carried across centuries from the Malabar coast — and what it asks of us today.'
          },
          crumbs: 'About',
          titleA: 'A name carried ',
          titleB: 'across centuries.',
          lede:   'Nazrani is a merchant tradition from the Malabar coast — recognised for centuries by overseas traders for honest weights, fair description, and trusted intermediation. Nazrani Heritage is its modern continuation as a single-origin produce house.',
          next: {
            eyebrow: 'Continue',
            titleA:  'Where to ',
            titleB:  'go from here.',
            tiles: [
              { name: 'The Standard', desc: 'The five checks every product clears before it earns the name.',  cta: 'Read the Standard', href: 'standard.html' },
              { name: 'Origins',      desc: 'The villages and estates where each lot begins.',                  cta: 'See the map',       href: 'origins.html' },
              { name: 'Products',     desc: 'Fourteen single-origin items across four categories.',             cta: 'Shop the catalogue', href: 'shop.html' }
            ]
          }
        },

        shop: {
          meta: {
            title:       'Shop · Nazrani Heritage',
            description: 'The Nazrani Heritage catalogue — single-origin Kerala produce. Filter by category, sort by price, search by origin.'
          },
          crumbs: 'The Catalogue',
          titleA: 'The ',
          titleB: 'catalogue.',
          lede:   'Fourteen products across four categories. Every SKU has a single, named origin and a published lot number.',
          sidebar: {
            categoriesHeader: 'Categories',
            allLabel:         'All produce',
            sourcingHeader:   'Sourcing',
            sourcing: [
              { label: 'GI tagged',     ct: 'verified' },
              { label: 'India Organic', ct: 'npop' },
              { label: 'PGS-India',     ct: 'audited' }
            ]
          },
          empty: 'No matches in this category'
        },

        cart: {
          meta:   { title: 'Cart · Nazrani Heritage', description: 'Review the items in your cart.' },
          crumbs: 'Your cart',
          titleA: 'Your ',
          titleB: 'cart.',
          summaryTitle: 'Order summary',
          checkoutLabel: 'Proceed to checkout →',
          dispatchNote: 'Dispatched within 48 hours from Kottayam.'
        },

        login: {
          meta:       { title: 'Sign in · Nazrani Heritage', description: 'Sign in or continue as a guest.' },
          crumbs:     'Sign in',
          titleA:     'Sign in or ',
          titleB:     'continue as guest.',
          subtitle:   'Sign in to track your orders and save your details for next time.',
          googleCta:  'Continue with Google',
          facebookCta:'Continue with Facebook',
          divider:    'or',
          guestCta:   'Continue as guest',
          guestNote:  'No account needed — you can create one after checkout.',
          bannerIn:   'Signed in as',
          bannerGuest:'Continuing as guest · ',
          bannerSwitch: 'Sign in instead'
        },

        checkout: {
          meta:   { title: 'Checkout · Nazrani Heritage', description: 'Complete your order.' },
          crumbs: 'Checkout',
          title:  'Checkout',
          sections: {
            contact: '01 · Contact',
            address: '02 · Shipping address',
            payment: '03 · Payment'
          },
          submitLabel: 'Place order →',
          summaryTitle: 'Your order',
          dispatch: 'Dispatched within 48 hours from Kottayam.',
          delivery: 'Delivered in 4–7 business days.',
          errors: {
            missing: 'Please complete the highlighted fields before continuing.'
          }
        },

        confirm: {
          meta:   { title: 'Order confirmed · Nazrani Heritage', description: 'Thank you for your order.' },
          thanksTemplate: 'Thank you, {name}.',
          intro: 'Your order is confirmed. A copy of this receipt has been sent to {email}. We dispatch within 48 hours.',
          shipmentHeading: 'Shipment',
          awbLabel: 'Airway Bill No.',
          trackingHeading: 'Track your shipment',
          trackingBody: 'Live status, delivery scans, and proof-of-delivery on the IndiaShipments tracking portal.',
          trackingCta: 'Track on indiashipments.com →',
          trackingUrl: 'https://www.indiashipments.com',
          carrierLabel: 'Carrier',
          carrierName: 'India Post · EMS',
          notFoundTitle: 'Order not found',
          notFoundBody:  "We couldn't find an order with that reference"
        },

        product: {
          meta:   { title: 'Product · Nazrani Heritage', description: 'Single-origin Kerala produce.' },
          notFoundTitle: 'Product not found',
          notFoundBody:  'The lot number you followed may have moved on.',
          ctaTemplate:   'Add {weight} to cart →',
          addedTemplate: '✓ Added ({qty}) — view cart',
          storyHeading:  'The story',
          specHeading:   'Specifications',
          relatedEyebrow: 'From the same category',
          relatedTitle:   'You may also enjoy'
        },

        journal: {
          meta:   { title: 'Journal · Nazrani Heritage', description: 'Field notes, audit decisions, and the occasional recipe from the people behind the produce.' },
          crumbs: 'The Journal',
          titleA: 'Letters from the ',
          titleB: 'harvest.',
          lede:   'Field notes, audit decisions, and the occasional recipe. Quiet writing from the people growing, processing, and weighing what we sell.'
        },

        article: {
          meta:   { title: 'Article · Nazrani Heritage', description: 'A letter from the harvest.' },
          notFoundTitle: 'Article not found',
          notFoundBody:  'This letter may have been moved or unpublished.',
          authorTemplate: 'Written by {author} · {date}',
          backLabel:      '← All letters'
        },

        standard: {
          meta:   { title: 'The Sourcing Standard · Nazrani Heritage', description: 'Five rules. Reviewed annually. Published openly.' },
          crumbs: 'The Standard',
          titleA: 'The Nazrani Sourcing ',
          titleB: 'Standard.',
          lede:   'Five checks. Reviewed annually. Published openly so customers can hold us to it. Every product in the catalogue must clear all five before it is listed under our name.',
          aside: {
            eyebrow: 'Five rules. One promise.',
            titleA:  'Held against the ',
            titleB:  'family table.',
            body:    'We do not pretend to invent these rules. They are simply the discipline that underwrites the merchant tradition we descend from — written down so we and our suppliers can be held to them in plain sight.',
            cta:     { label: 'Request the audit ledger (PDF)', href: 'contact.html' }
          },
          founder: {
            eyebrow: 'The Family Table Test',
            quote:   'A passing audit is necessary but not sufficient. The final question is private and unwritten: <span class="serif-i">would the founder and his family eat this, this week?</span> If the answer is anything but yes, the lot does not ship.'
          },
          promise: {
            eyebrow: 'Audits, openly',
            titleA:  'We publish every audit, including the failures. ',
            titleB:  'Read the most recent letter on the subject.',
            cta:     { label: 'Why we publish failures →', href: 'article.html?slug=publishing-failed-audits' }
          }
        },

        origins: {
          meta:   { title: 'Origins · Nazrani Heritage', description: 'Every parcel begins at a named place. Six origins, six partners, traced to the village or estate level.' },
          crumbs: 'Origins',
          titleA: 'Every parcel begins at a ',
          titleB: 'named place.',
          lede:   'Six origins, six partners, traced to the village or estate level. Hover the map to see what each origin contributes.',
          partners: {
            eyebrow: 'Sourcing Partners',
            titleA:  'Held to the ',
            titleB:  'same standard.',
            lede:    'Geographic traceability reaches the village or estate level — never just the state. Our founding sourcing partner is <em>Vanamoolika</em>, a Wayanad cooperative; new partners are onboarded only against the Sourcing Standard.'
          },
          onboarding: {
            eyebrow: 'How a partner is onboarded',
            title:   'A four-step process before a single jar carries our name.',
            steps: [
              { n: 'N° 01', t: 'Field visit · provenance verified', d: 'A Nazrani team member visits the source — estate, cooperative, or village — and meets the people doing the work. Geographic claims are confirmed in person.' },
              { n: 'N° 02', t: 'Standard audit · five checks',     d: 'Cultivation practice, processing handling, ethics, FSSAI compliance, and a blind tasting against control samples. Anything failing any one of the five is rejected.' },
              { n: 'N° 03', t: 'Pilot lot · small batch',          d: 'A small pilot lot is shipped, tasted, and held under storage conditions for 30 days. Customer feedback is collected. The pilot must clear before a supply agreement is signed.' },
              { n: 'N° 04', t: 'Annual review · published',        d: 'Each partner is re-audited annually. Findings are published openly. A failed lot is not hidden — it is named, with the corrective action and the next clean lot recorded.' }
            ]
          }
        },

        contact: {
          meta:   { title: 'Contact · Nazrani Heritage', description: 'Questions about a lot, a partner, or an audit? A person reads every message.' },
          crumbs: 'Contact',
          titleA: 'Get in ',
          titleB: 'touch.',
          lede:   'Questions about a lot, a partner, or an audit? Suggestions, complaints, or recipe requests? Write to us — a person reads every message.',
          formTitle: 'Send a note',
          fields: {
            name:    'Your name',
            email:   'Email',
            subject: 'Subject',
            message: 'Message',
            chooseTopic: 'Choose a topic...',
            topics: [
              'About a product or lot',
              'Order or shipping',
              'Returns & quality',
              'Press & partnerships',
              'Sourcing partners',
              'Something else'
            ]
          },
          submit: 'Send message →',
          errors: {
            missing: 'Please complete all fields before sending.'
          },
          thanks: {
            title:    'Thank you',
            subtitle: 'Your note is in our inbox.',
            bodyTpl:  'Reference {ref}. We will write back within two working days.'
          },
          asideTitle: 'Reach us',
          asideAddress: 'Nazrani Heritage Pvt. Ltd.<br/>Kottayam, Kerala · India',
          asideNote: 'We answer all messages within two working days.<br/>Dispatch and warehouse hours: Mon–Sat, 9:00–18:00 IST.'
        },

        notfound: {
          meta:   { title: 'Not Found · Nazrani Heritage', description: 'This jar is not on the shelf.' },
          code:   '404',
          title:  'This jar is not on the shelf.',
          body:   'The page you were looking for has either moved on, been delisted, or never existed.',
          ctas: [
            { label: 'Back to home',         href: 'index.html', kind: 'primary' },
            { label: 'Browse the catalogue', href: 'shop.html',  kind: 'ghost' }
          ]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    /*  CONFIG                                                             */
    /* ------------------------------------------------------------------ */
    config: {
      currency: 'INR',
      currencySymbol: '₹',
      // Shipping = base-by-weight × zone-multiplier; subtotal ≥ freeAbove → free.
      // All slab values live here. HTML must not duplicate or override these numbers.
      shipping: {
        freeAbove: 1499,            // INR — subtotal threshold for free shipping
        defaultZoneId: 'tn',        // assumed zone before the customer enters a pincode
        weightSlabs: [
          { maxGrams:  500,     rate:  49 },
          { maxGrams: 1000,     rate:  89 },
          { maxGrams: 2000,     rate: 129 },
          { maxGrams: 5000,     rate: 199 },
          { maxGrams: Infinity, rate: 299 }
        ],
        zones: [
          // pincodePrefixes = first 2 digits of destination PIN. First match wins.
          { id: 'tn',     label: 'Tamil Nadu (intra-state)',             multiplier: 1.0, pincodePrefixes: ['60','61','62','63','64'] },
          { id: 'south',  label: 'South India (KL · KA · AP · TS · PY)', multiplier: 1.2, pincodePrefixes: ['52','53','56','57','58','67','68','69'] },
          { id: 'ne_jk',  label: 'NE / J&K / A&N',                       multiplier: 1.8, pincodePrefixes: ['18','19','78','79','74','75','76','77'] },
          { id: 'rest',   label: 'Rest of India',                        multiplier: 1.5, pincodePrefixes: [] }
        ],
        lastResortZoneId: 'rest'
      },
      payment: {
        methods: [
          { id: 'upi',         name: 'UPI',                   sub: 'Recommended · Instant confirmation' },
          { id: 'card',        name: 'Credit / Debit Card',   sub: 'Visa · MasterCard · RuPay' },
          { id: 'netbanking',  name: 'Net Banking',           sub: 'All major Indian banks' },
          { id: 'cod',         name: 'Cash on Delivery',      sub: '+ ₹30 handling · serviceable pincodes only' }
        ],
        default: 'upi'
      },
      sortModes: [
        { id: 'default',     label: 'Sort: Featured' },
        { id: 'price-asc',   label: 'Price · Low to High' },
        { id: 'price-desc',  label: 'Price · High to Low' },
        { id: 'name',        label: 'Name · A to Z' }
      ],
      cartLimit: 20,          // max qty per line
      orderIdPrefix: 'NZR-',
      contactRefPrefix: 'NZR-CX-',
      dispatchInDays: 2,

      // Pincode prefix lookup (3-digit → city, state).
      // Falls back to 2-digit prefix for state-only fill.
      pincodeLookup: {
        // Kerala
        '686': { city: 'Kottayam',          state: 'Kerala' },
        '680': { city: 'Thrissur',           state: 'Kerala' },
        '681': { city: 'Thrissur',           state: 'Kerala' },
        '682': { city: 'Ernakulam',          state: 'Kerala' },
        '683': { city: 'Ernakulam',          state: 'Kerala' },
        '684': { city: 'Ernakulam',          state: 'Kerala' },
        '685': { city: 'Idukki',             state: 'Kerala' },
        '687': { city: 'Wayanad',            state: 'Kerala' },
        '688': { city: 'Alappuzha',          state: 'Kerala' },
        '689': { city: 'Pathanamthitta',     state: 'Kerala' },
        '690': { city: 'Kollam',             state: 'Kerala' },
        '691': { city: 'Kollam',             state: 'Kerala' },
        '692': { city: 'Kollam',             state: 'Kerala' },
        '694': { city: 'Thiruvananthapuram', state: 'Kerala' },
        '695': { city: 'Thiruvananthapuram', state: 'Kerala' },
        '670': { city: 'Kannur',             state: 'Kerala' },
        '671': { city: 'Kannur',             state: 'Kerala' },
        '672': { city: 'Kannur',             state: 'Kerala' },
        '673': { city: 'Kozhikode',          state: 'Kerala' },
        '674': { city: 'Kozhikode',          state: 'Kerala' },
        '675': { city: 'Malappuram',         state: 'Kerala' },
        '676': { city: 'Malappuram',         state: 'Kerala' },
        '677': { city: 'Malappuram',         state: 'Kerala' },
        '678': { city: 'Palakkad',           state: 'Kerala' },
        '679': { city: 'Palakkad',           state: 'Kerala' },
        // Tamil Nadu
        '600': { city: 'Chennai',            state: 'Tamil Nadu' },
        '601': { city: 'Chennai',            state: 'Tamil Nadu' },
        '602': { city: 'Chennai',            state: 'Tamil Nadu' },
        '603': { city: 'Chennai',            state: 'Tamil Nadu' },
        '641': { city: 'Coimbatore',         state: 'Tamil Nadu' },
        '642': { city: 'Coimbatore',         state: 'Tamil Nadu' },
        '620': { city: 'Tiruchirappalli',    state: 'Tamil Nadu' },
        '625': { city: 'Madurai',            state: 'Tamil Nadu' },
        '626': { city: 'Madurai',            state: 'Tamil Nadu' },
        // Karnataka
        '560': { city: 'Bengaluru',          state: 'Karnataka' },
        '561': { city: 'Bengaluru',          state: 'Karnataka' },
        '562': { city: 'Bengaluru',          state: 'Karnataka' },
        '575': { city: 'Mangaluru',          state: 'Karnataka' },
        '576': { city: 'Mangaluru',          state: 'Karnataka' },
        // Maharashtra
        '400': { city: 'Mumbai',             state: 'Maharashtra' },
        '401': { city: 'Mumbai',             state: 'Maharashtra' },
        '411': { city: 'Pune',               state: 'Maharashtra' },
        '412': { city: 'Pune',               state: 'Maharashtra' },
        // Delhi
        '110': { city: 'New Delhi',          state: 'Delhi' },
        '111': { city: 'New Delhi',          state: 'Delhi' },
        // Telangana / AP
        '500': { city: 'Hyderabad',          state: 'Telangana' },
        '501': { city: 'Hyderabad',          state: 'Telangana' },
        '530': { city: 'Visakhapatnam',      state: 'Andhra Pradesh' },
        // West Bengal
        '700': { city: 'Kolkata',            state: 'West Bengal' },
        '701': { city: 'Kolkata',            state: 'West Bengal' },
        // Gujarat
        '380': { city: 'Ahmedabad',          state: 'Gujarat' },
        '395': { city: 'Surat',              state: 'Gujarat' },
        // Rajasthan
        '302': { city: 'Jaipur',             state: 'Rajasthan' },
        // Uttar Pradesh
        '226': { city: 'Lucknow',            state: 'Uttar Pradesh' },
        '201': { city: 'Noida',              state: 'Uttar Pradesh' },
        // Madhya Pradesh
        '462': { city: 'Bhopal',             state: 'Madhya Pradesh' },
        '452': { city: 'Indore',             state: 'Madhya Pradesh' }
      },

      // 2-digit prefix → state (fallback when city is unknown)
      pincodeStateMap: {
        '11': 'Delhi',            '12': 'Haryana',          '13': 'Haryana',
        '14': 'Punjab',           '15': 'Punjab',           '16': 'Punjab',
        '17': 'Himachal Pradesh', '18': 'Jammu & Kashmir',  '19': 'Jammu & Kashmir',
        '20': 'Uttar Pradesh',    '21': 'Uttar Pradesh',    '22': 'Uttar Pradesh',
        '23': 'Uttar Pradesh',    '24': 'Uttar Pradesh',    '25': 'Uttar Pradesh',
        '26': 'Uttar Pradesh',    '27': 'Uttar Pradesh',    '28': 'Uttar Pradesh',
        '30': 'Rajasthan',        '31': 'Rajasthan',        '32': 'Rajasthan',
        '33': 'Rajasthan',        '34': 'Rajasthan',
        '36': 'Gujarat',          '37': 'Gujarat',          '38': 'Gujarat',        '39': 'Gujarat',
        '40': 'Maharashtra',      '41': 'Maharashtra',      '42': 'Maharashtra',
        '43': 'Maharashtra',      '44': 'Maharashtra',
        '45': 'Madhya Pradesh',   '46': 'Madhya Pradesh',   '47': 'Madhya Pradesh',
        '48': 'Madhya Pradesh',   '49': 'Chhattisgarh',
        '50': 'Telangana',        '51': 'Andhra Pradesh',   '52': 'Andhra Pradesh',
        '53': 'Andhra Pradesh',
        '56': 'Karnataka',        '57': 'Karnataka',        '58': 'Karnataka',      '59': 'Karnataka',
        '60': 'Tamil Nadu',       '61': 'Tamil Nadu',       '62': 'Tamil Nadu',
        '63': 'Tamil Nadu',       '64': 'Tamil Nadu',
        '67': 'Kerala',           '68': 'Kerala',           '69': 'Kerala',
        '70': 'West Bengal',      '71': 'West Bengal',      '72': 'West Bengal',
        '73': 'West Bengal',      '74': 'West Bengal',
        '75': 'Odisha',           '76': 'Odisha',           '77': 'Odisha',
        '78': 'Assam',            '79': 'Assam',
        '80': 'Bihar',            '81': 'Bihar',            '82': 'Jharkhand',
        '83': 'Jharkhand',        '84': 'Bihar',            '85': 'Bihar'
      }
    },

    /* ------------------------------------------------------------------ */
    /*  CATALOGUE                                                          */
    /* ------------------------------------------------------------------ */
    products: [
      { id: 'p01', name: 'Tellicherry Black Pepper', subtitle: 'Whole, sun-dried',
        origin: 'Wayanad', lot: 'WYD-PPR-26-04', price: 480, weight: '250g', weightGrams: 250,
        gi: true, organic: 'PGS-India', category: 'Spices', label: 'pepper, hand-graded',
        image: 'assets/images/p01-pepper.jpg',
        stock: 84, harvested: 'March 2026',
        story: 'Hand-picked from smallholder vines in the misty Wayanad highlands at 800–900 m. Sun-cured on bamboo mats for nine days, then graded by hand into the Tellicherry Garbled Special Extra Bold (TGSEB) standard. The fruit is fuller, the volatile oil higher, the heat warmer than commodity-grade pepper.',
        notes: ['Bold, citrus-forward heat with woody depth', 'Crack into stews, daals, and fresh-ground over eggs', 'Single estate — no blending across origins'],
        spec: { 'Bulk Density': '560–580 g/L', 'Volatile Oil': '≥ 3.5%', 'Moisture': '≤ 11%', 'Foreign Matter': '≤ 0.2%' } },
      { id: 'p02', name: 'Idukki Green Cardamom', subtitle: 'Bold pods, AGEB',
        origin: 'Idukki', lot: 'IDK-CRD-26-02', price: 720, weight: '100g', weightGrams: 100,
        gi: true, organic: 'India Organic', category: 'Spices', label: 'cardamom pods',
        image: 'assets/images/p02-cardamom.jpg',
        stock: 52, harvested: 'February 2026',
        story: 'From a 7-acre estate in Vandanmedu, Idukki, sitting in the Western Ghats cloud-belt. Pods are picked just before splitting, dried slowly in steam-fired curing rooms, and graded to AGEB (Alleppey Green Extra Bold) — 8mm and above, deep emerald, intact stems.',
        notes: ['Floral, eucalypt, sweet-warm finish', 'Crack pods just before use to preserve volatiles', 'GI-tagged — Idukki origin verified'],
        spec: { 'Pod Size': '≥ 8 mm', 'Volatile Oil': '≥ 6.5%', 'Moisture': '≤ 11%', 'Empty Pods': '≤ 1%' } },
      { id: 'p03', name: 'Wayanad Turmeric Powder', subtitle: 'Stone-ground, high-curcumin',
        origin: 'Wayanad', lot: 'WYD-TUR-26-01', price: 260, weight: '200g', weightGrams: 200,
        gi: false, organic: 'India Organic', category: 'Spices', label: 'turmeric powder',
        image: 'assets/images/p03-turmeric.jpg',
        stock: 180, harvested: 'February 2026',
        story: 'Pratibha-variety rhizomes grown on smallholder plots in eastern Wayanad. Boiled briefly to set the colour, sun-dried for ten days, then stone-ground at low temperature to preserve the volatile oils. Deep ochre, faintly resinous, with a curcumin content well above commodity grade.',
        notes: ['Earthy, warm, lightly bitter', 'Use in dals, pickles, and warm milk', 'Stone-ground in small batches — no machine heat'],
        spec: { 'Curcumin': '≥ 4.0%', 'Moisture': '≤ 8%', 'Ash': '≤ 7%', 'Foreign Matter': '≤ 0.5%' } },
      { id: 'p04', name: 'Gandhakasala Rice', subtitle: 'Wayanad GI · aromatic',
        origin: 'Wayanad', lot: 'WYD-GND-26-01', price: 420, weight: '1kg', weightGrams: 1000,
        gi: true, organic: 'PGS-India', category: 'Staples', label: 'aromatic short-grain rice',
        image: 'assets/images/p04-gandhakasala-rice.jpg',
        stock: 240, harvested: 'January 2026',
        story: 'An indigenous short-grain aromatic rice from the Wayanad plateau, GI-tagged in 2010. Grown by tribal cultivators in Mananthavady block on rain-fed paddies. Releases a distinctive sandalwood-jasmine fragrance when cooked — traditionally served at weddings and temple feasts.',
        notes: ['Cooks in 18 minutes, 1:2 water', 'Pairs with light curries and ghee', 'GI-protected variety — Wayanad origin verified'],
        spec: { 'Variety': 'Gandhakasala (GI)', 'Grain': 'Short, aromatic', 'Cooking Time': '18 minutes', 'Origin': 'Mananthavady, Wayanad' } },
      { id: 'p05', name: 'Jeerakasala Rice', subtitle: 'Wayanad GI · biriyani rice',
        origin: 'Wayanad', lot: 'WYD-JKS-26-01', price: 380, weight: '1kg', weightGrams: 1000,
        gi: true, organic: 'PGS-India', category: 'Staples', label: 'aromatic biriyani rice',
        image: 'assets/images/p05-jeerakasala-rice.jpg',
        stock: 210, harvested: 'January 2026',
        story: 'The cumin-shaped grain that gives the rice its name (jeerakam = cumin). A second GI-tagged Wayanad aromatic, slimmer and slightly less floral than Gandhakasala. The traditional rice for Malabar biriyani — tender, separate, perfumed.',
        notes: ['Rinse twice; soak 20 minutes for biriyani', 'Cook 1:1.5 water by absorption', 'GI-protected — Wayanad cultivation only'],
        spec: { 'Variety': 'Jeerakasala (GI)', 'Grain': 'Slim, short-medium', 'Cooking Time': '15 minutes', 'Origin': 'Wayanad plateau' } },
      { id: 'p06', name: 'Palakkad Red Rice', subtitle: 'Heirloom, parboiled',
        origin: 'Palakkad', lot: 'PLK-RED-26-02', price: 240, weight: '1kg', weightGrams: 1000,
        gi: true, organic: 'PGS-India', category: 'Staples', label: 'red matta rice',
        image: 'assets/images/p06-red-rice.jpg',
        stock: 410, harvested: 'January 2026',
        story: 'An indigenous medium-grain rice from Palakkad, parboiled in the husk to retain the rust-red bran. Higher fibre, lower glycaemic load, and a faintly nutty taste. Pairs traditionally with Kerala fish curry, kanji, or puttu.',
        notes: ['Soak 30 minutes; 1:2.5 water; 25 minutes', 'Rinses cleaner if soaked twice', 'Single-village sourcing — Pollachi Block'],
        spec: { 'Variety': 'Matta (Rosematta)', 'Type': 'Parboiled, medium-grain', 'Bran Retention': 'Full red bran', 'Fibre': '2.8 g / 100g' } },
      { id: 'p07', name: 'Jackfruit Powder', subtitle: 'Raw, low-GI flour',
        origin: 'Wayanad', lot: 'WYD-JKF-26-01', price: 420, weight: '200g', weightGrams: 200,
        gi: false, organic: 'India Organic', category: 'Health Foods', label: 'green jackfruit flour',
        image: 'assets/images/p07-jackfruit-powder.jpg',
        stock: 95, harvested: 'March 2026',
        story: 'Made from raw, unripe jackfruit harvested in March from village trees across Wayanad. Steamed gently to set the colour, sliced thin, sun-dried for four days, then milled fine. A low-glycaemic substitute for refined flour — ideal for diabetic-friendly rotis, idlis, and porridge.',
        notes: ['Replace up to 30% of atta in roti dough', 'Cooks down softer than wheat — add water slowly', 'Low GI — clinically tested at ≤ 35'],
        spec: { 'Glycaemic Index': '≤ 35', 'Fibre': '7.2 g / 100g', 'Moisture': '≤ 8%', 'Origin': 'Village trees, Wayanad' } },
      { id: 'p08', name: 'Curcuma Capsules', subtitle: 'High-curcumin extract',
        origin: 'Wayanad', lot: 'WYD-CUR-26-01', price: 540, weight: '60 caps', weightGrams: 100,
        gi: false, organic: 'India Organic', category: 'Ayurveda', label: 'curcuma longa extract',
        image: 'assets/images/p08-curcuma.jpg',
        stock: 64, harvested: 'February 2026',
        story: 'A standardised extract from the same Pratibha-variety turmeric we mill for the kitchen, but processed for daily Ayurvedic use. Cold-extracted to retain the curcuminoid complex (not just curcumin), then encapsulated in vegetarian shells. No fillers, no synthetic anti-caking agents.',
        notes: ['One capsule with food, twice daily', '500 mg extract per capsule, 95% curcuminoids', 'Pairs with black pepper for absorption'],
        spec: { 'Curcuminoids': '≥ 95%', 'Extract per cap': '500 mg', 'Shell': 'Vegetarian (HPMC)', 'Excipients': 'None' } },
      { id: 'p09', name: 'Cinnamon Quills', subtitle: 'True cinnamon, hand-rolled',
        origin: 'Idukki', lot: 'IDK-CIN-26-01', price: 320, weight: '100g', weightGrams: 100,
        gi: false, organic: 'India Organic', category: 'Spices', label: 'cinnamomum verum',
        image: 'assets/images/p09-cinnamon.jpg',
        stock: 130, harvested: 'February 2026',
        story: 'True Ceylon-style cinnamon (Cinnamomum verum) — not the cassia commonly sold as cinnamon — grown on a small estate in Idukki. The bark is harvested young, peeled by hand, and rolled into the characteristic paper-thin quills as it dries. Sweeter, lighter, lower in coumarin than cassia.',
        notes: ['Snap into milk, payasam, or chai', 'Grates more easily than cassia bark', 'Verum, not cassia — verified by lab'],
        spec: { 'Species': 'Cinnamomum verum', 'Coumarin': '≤ 50 mg/kg', 'Moisture': '≤ 12%', 'Quill Form': 'Hand-rolled, 8–10 cm' } },
      { id: 'p10', name: 'Arrowroot Powder', subtitle: 'Pure starch, gluten-free',
        origin: 'Kerala', lot: 'KER-ARR-26-01', price: 280, weight: '250g', weightGrams: 250,
        gi: false, organic: 'India Organic', category: 'Health Foods', label: 'maranta arundinacea',
        image: 'assets/images/p10-arrowroot.jpg',
        stock: 170, harvested: 'January 2026',
        story: 'Traditional Kerala koova powder, extracted from Maranta arundinacea rhizomes harvested in coastal smallholdings. Washed, grated, and settled by gravity over four days — never bleached, never enzyme-treated. Soothing for the gut, cooling in summer kanji, and a clean gluten-free thickener.',
        notes: ['Whisk 1 tsp into cool water before adding to hot dishes', 'Traditional summer kanji for children', 'Settles food without changing flavour'],
        spec: { 'Starch': '≥ 92%', 'Moisture': '≤ 12%', 'Sulphur': 'Nil', 'Gluten': 'Free' } },
      { id: 'p11', name: 'Whole Fennel Seed', subtitle: 'Sweet, large-seeded',
        origin: 'Coimbatore', lot: 'CBE-FEN-26-01', price: 220, weight: '200g', weightGrams: 200,
        gi: false, organic: 'PGS-India', category: 'Spices', label: 'foeniculum vulgare',
        image: 'assets/images/p11-fennel.jpg',
        stock: 140, harvested: 'December 2025',
        story: 'Large-seeded, sweet variety fennel grown on the Coimbatore-Pollachi belt, where the dry climate concentrates the anethole that gives fennel its perfume. Sun-dried whole, sieved by hand to remove fines and stalk fragments, never gas-fumigated.',
        notes: ['Chew after meals as a digestive', 'Bloom in oil before tempering dals', 'Sweet variety — not the bitter wild type'],
        spec: { 'Anethole': '≥ 2.5%', 'Moisture': '≤ 9%', 'Foreign Matter': '≤ 1%', 'Variety': 'Sweet, large-seeded' } },
      { id: 'p12', name: 'Classical Chyavanaprasam', subtitle: '48 herbs, slow-cooked',
        origin: 'Wayanad', lot: 'WYD-CYP-26-01', price: 890, weight: '500g', weightGrams: 500,
        gi: false, organic: 'India Organic', category: 'Ayurveda', label: 'amla & herb conserve',
        image: 'assets/images/p12-chyavanaprasam.jpg',
        stock: 38, harvested: 'March 2026',
        story: 'Prepared at the Vanamoolika cooperative in Wayanad to a classical Ashtanga Hridayam recipe — 48 herbs including bilva, dashamoola, and pippali, slow-cooked with wild amla, cow ghee, and forest honey. Each batch is recorded in a hand-written kashayam log.',
        notes: ['One teaspoon, mornings, with warm milk or water', 'Cooked over a single seven-hour shift in copper', 'Honey added off-heat, never boiled'],
        spec: { 'Amla Content': '≥ 60% by weight', 'Total Herbs': '48', 'Sugar': 'Jaggery only', 'Preservative': 'None' } },
      { id: 'p13', name: 'Nendran Banana Powder', subtitle: 'Raw banana flour',
        origin: 'Kerala', lot: 'KER-BAN-26-01', price: 320, weight: '250g', weightGrams: 250,
        gi: false, organic: 'India Organic', category: 'Health Foods', label: 'raw nendran flour',
        image: 'assets/images/p13-banana-powder.jpg',
        stock: 110, harvested: 'February 2026',
        story: 'Made from raw, unripe Nendran bananas — the variety prized in Kerala for chips, baby food, and Ayurvedic preparations. Peeled, sliced, sun-dried on raised beds, and milled fine. Resistant starch, gentle on the gut, and the traditional first solid food for infants in Kerala households.',
        notes: ['Mix 1 tbsp into warm milk or water for kids', 'Replaces 20–30% of refined flour in baking', 'Resistant starch — supports gut health'],
        spec: { 'Variety': 'Nendran (raw)', 'Resistant Starch': '≥ 18%', 'Moisture': '≤ 9%', 'Origin': 'Kerala smallholdings' } },
      { id: 'p14', name: 'Kashmiri Chilly Powder', subtitle: 'Deep red, mild heat',
        origin: 'Kashmir Valley', lot: 'KSH-CHL-26-01', price: 360, weight: '200g', weightGrams: 200,
        gi: true, organic: 'India Organic', category: 'Spices', label: 'low-heat chilli powder',
        image: 'assets/images/p14-kashmiri-chilly.jpg',
        stock: 150, harvested: 'November 2025',
        story: 'Our one cross-regional SKU. Sourced from a smallholder cooperative in the Pulwama district of Kashmir, where the cool, dry autumns produce a chilli that is famous for colour rather than heat. Sun-dried whole, hand-stemmed, and stone-ground without additives. The deep crimson Kashmiri kitchens prize.',
        notes: ['Use generously — heat is mild, colour intense', 'Bloom in oil to release the carotenoids', 'No added colour, no rice-bran filler'],
        spec: { 'Capsaicin': 'Low (1,000–1,500 SHU)', 'Colour (ASTA)': '≥ 80', 'Moisture': '≤ 10%', 'Adulterants': 'Nil' } }
    ],

    categories: [
      { slug: 'spices',       name: 'Spices',       count:  6, label: 'pepper · cardamom · turmeric · cinnamon · fennel · chilly' },
      { slug: 'staples',      name: 'Staples',      count:  3, label: 'Gandhakasala · Jeerakasala · red rice' },
      { slug: 'ayurveda',     name: 'Ayurveda',     count:  2, label: 'curcuma · chyavanaprasam' },
      { slug: 'health-foods', name: 'Health Foods', count:  3, label: 'jackfruit · arrowroot · banana powder' }
    ],

    standard: [
      { n: '01', t: 'Origin & Provenance',
        d: 'A single, named, verifiable point of origin — village or estate level. GI tagged where applicable.',
        long: 'Every SKU lists a verifiable origin at the village or estate level. We refuse blends across origins, even where it would lower cost. Geographical Indication (GI) tags are honoured strictly — we will not list a product as Tellicherry Pepper or Marayoor Jaggery unless every gram in the lot has come from the protected region.' },
      { n: '02', t: 'Cultivation Practice',
        d: 'No synthetic pesticides, herbicides, or chemical fertilisers. Soil and water records reviewed.',
        long: 'Audited every harvest. We accept three certifications — India Organic (NPOP), PGS-India, and our own audit visit when a smallholder cannot afford certification but otherwise meets the standard. Soil tests are reviewed annually; water source upstream of agricultural runoff is required.' },
      { n: '03', t: 'Processing & Handling',
        d: 'No artificial colours, preservatives, or undisclosed additives. FSSAI-registered facilities only.',
        long: 'Every facility we work with is FSSAI-registered and inspected. We publish a list of permitted process aids on our website; anything outside that list is grounds for delisting. Cold-chain integrity is maintained for honey, ghee, and chyawanprash.' },
      { n: '04', t: 'Ethical Conduct',
        d: 'Documented fair purchase prices. No child or bonded labour. Tribal cooperatives prioritised.',
        long: 'Purchase prices are documented and benchmarked against the previous-month mandi rate; we pay at or above. Tribal cooperatives — Kurichiya, Paniya, Adiya — are prioritised for forest products. A surprise audit of one supplier per quarter is conducted by an external auditor.' },
      { n: '05', t: 'The Family Table Test',
        d: 'Would the founder serve this on his own table, without hesitation? If not, the product is delisted.',
        long: 'The final, unwritten rule. Every batch is tasted blind by the founder and two senior team members against a control sample from the previous lot. Drift in flavour, texture, or aroma triggers re-evaluation. A failed test ends the lot — even when commercial pressure says otherwise.' }
    ],

    provenance: [
      { name: 'Wayanad',    what: 'Pepper, chyawanprash, wild honey', x: 22, y: 38, partner: 'Vanamoolika Cooperative', altitude: '800–950 m' },
      { name: 'Idukki',     what: 'Green cardamom, cloves',           x: 32, y: 62, partner: 'Vandanmedu Estate Group',  altitude: '1,100–1,300 m' },
      { name: 'Marayoor',   what: 'Unrefined cane jaggery',           x: 28, y: 50, partner: 'Marayoor Cane Society',   altitude: '1,000 m' },
      { name: 'Palakkad',   what: 'Red Matta heirloom rice',          x: 44, y: 35, partner: 'Pollachi Block Farmers',  altitude: '150 m' },
      { name: 'Coonoor',    what: 'High-grown orthodox tea',          x: 52, y: 48, partner: 'Single Estate, Coonoor',  altitude: '1,800 m' },
      { name: 'Kottayam',   what: 'Founding HQ & dispatch',           x: 60, y: 30, partner: 'Nazrani Heritage HQ',     altitude: '3 m' }
    ],

    journal: [
      { slug: 'morning-at-vanamoolika', tag: 'Field Notes',  date: '02 May', title: 'A morning at the Vanamoolika cooperative',         read: '6 min', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80', excerpt: 'Six in the morning, the kashayam pots are already on. We sit on the courtyard floor, and Suma chechi tells us why this batch of chyawanprash will be honest.' },
      { slug: 'publishing-failed-audits', tag: 'The Standard', date: '21 Apr', title: 'Why we publish every audit, even the failures',   read: '4 min', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80', excerpt: "A failed audit isn't a marketing problem — it's a feature. Here is the case for openness, even when it costs us a quarter's revenue." },
      { slug: 'name-worth-keeping',     tag: 'Heritage',     date: '03 Apr', title: 'St. Thomas, the Malabar coast, and a name worth keeping', read: '8 min', image: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&w=1200&q=80', excerpt: 'How a 2,000-year-old merchant identity became a quiet pact between buyer and seller — and why we still think it matters.' }
    ],

    articles: {
      'morning-at-vanamoolika': {
        slug: 'morning-at-vanamoolika', tag: 'Field Notes', date: '02 May 2026',
        title: 'A morning at the Vanamoolika cooperative',
        subtitle: 'Six in the morning, the kashayam pots are already on.',
        read: '6 min', author: 'Rony Zachariah',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80',
        body: [
          'Six in the morning, the kashayam pots are already on. The Vanamoolika courtyard smells of damp earth, wood-smoke, and the bittersweet steam of bilva and dashamoola simmering down. Suma chechi — head of preparations for twenty-three years — sets down a small steel tumbler and gestures for us to sit.',
          'The first thing she will not show me is the clock. "Some things finish when they finish," she says. The second is the recipe — fifty-eight pages, hand-written, kept in a cloth-bound ledger her teacher gave her. The third is the honey, which is not added today. The chyawanprash will be poured into clean glass jars at sundown, and the honey, two days later, when the conserve has cooled to skin temperature. Boiling honey, she explains, kills the work the bees have done.',
          'I have come here twice a year for four years. Every visit, the cooperative looks slightly older — more rust on the iron pans, more chips on the courtyard tile. And every visit, the chyawanprash tastes the same. It should not surprise me by now, but it always does.',
          'Around seven, the herb sorters arrive. Twelve women — three of them in their seventies — sit on woven mats with shallow brass trays. They pick stalks from leaves, sort by colour, and discard whatever is not exactly right. There is a rejection pile. It is large.',
          'Vanamoolika does not run on volume. They run on the assumption that the next jar must be at least as good as the last one. That is the only standard they have ever recognised. When we approached them in 2023 about an ongoing supply agreement, Suma chechi listened to my proposal, asked four questions about minimum order quantities, and then asked the only one that mattered: "You will not push us to make more than we can make properly?"',
          'I said no. She said come back in two weeks. We came back in two weeks.',
          'By eleven the sun is high and the conserve is glassy. The cooks transfer the pots off the wood-fire onto the cooling rack. Somebody puts on the radio. A child runs through with a kite. The day is, in some sense, ordinary. In another sense, it is precisely the kind of day I wish more of our customers could see — the one in which a 2,000-year-old recipe is held together not by certificates, but by the conscience of twelve women on woven mats and the woman who will not let them rush.'
        ]
      },
      'publishing-failed-audits': {
        slug: 'publishing-failed-audits', tag: 'The Standard', date: '21 Apr 2026',
        title: 'Why we publish every audit, even the failures',
        subtitle: "A failed audit isn't a marketing problem — it's a feature.",
        read: '4 min', author: 'Rony Zachariah',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1600&q=80',
        body: [
          'In Q2 last year, a routine surprise audit of one of our cardamom partners turned up a moisture reading of 14% — three points above our internal ceiling. The lot was already packed for dispatch. We delisted it. The supplier was unhappy. So was our P&L.',
          'We could have moved that lot. Most retailers would have. The numbers were within FSSAI norms; it would have shipped, and nobody outside our quality team would have known. But the Nazrani Sourcing Standard is not the FSSAI standard, and the gap between them is the entire point of what we are building.',
          "So we published the audit. We named the lot, the partner, the reading, the action taken. The supplier, to his enormous credit, asked us to also publish his explanation — an unseasonal pre-monsoon shower had soaked an outdoor curing run. We did. The next month's lot, dried in our cost, came in at 10.2%. We re-listed.",
          'Two principles are at work here. The first is that an audit you can hide is not an audit; it is theatre. The second is that suppliers are not adversaries — they are partners with their own pressures. Publishing an honest failure publicly tells our customers what we will not do, and tells our suppliers that we will not stab them in the back over a bad week.',
          'We have published nine failures in the last two years. We have published thirty-one passes. The standard remains the standard.'
        ]
      },
      'name-worth-keeping': {
        slug: 'name-worth-keeping', tag: 'Heritage', date: '03 Apr 2026',
        title: 'St. Thomas, the Malabar coast, and a name worth keeping',
        subtitle: 'How a 2,000-year-old merchant identity became a quiet pact between buyer and seller.',
        read: '8 min', author: 'Rony Zachariah',
        image: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&w=1600&q=80',
        body: [
          'The word Nazrani comes from the Aramaic Naṣrāyā — followers of the Nazarene — and it travelled to the Malabar coast with the Apostle Thomas in 52 AD, or so the tradition holds. What it became, in Kerala over the centuries, was not principally a religious identity. It became a trading one.',
          "Pre-modern Kerala's economy ran on long-distance trade. Spices moved north to the Mughal courts and west to the Levant. Pepper alone — black gold — funded fleets, wars, and the expansion of the Portuguese and the Dutch. The Malabar coast was, for two thousand years, one of the most cosmopolitan strips of land on earth.",
          'Within that economy, the Nazranis occupied an unusual position. They were Christians in a Hindu-majority society with substantial Jewish and Muslim trading communities; they spoke Malayalam but were literate in Syriac; they had European connections but were unmistakably Indian. They could move between groups that did not always trade directly with one another.',
          'What earned them their reputation, though, was a peculiar discipline around weights and descriptions. A Nazrani merchant, by repeated witness in Jewish, Arab, and Portuguese correspondence, would not sell short weight, would not adulterate, and would not — and this is the point that gets lost in the romanticism — undersell a customer who could be tricked. Goods passing through Nazrani hands were considered, by all sides, sound.',
          'The reputation was not metaphysical. It was a slow accumulation of repeated, small, mundane decisions: this jar is honestly weighed, this lot is what the label says, this price is what we agreed. Over generations, those decisions hardened into an identity.',
          'We are not pretending to inherit that identity by writing a website about it. Identities like that are not inherited; they are earned, lot by lot. But the name is a useful discipline. Every time we ship a product under it, we are answering a question that the Nazrani merchants of 1452 were also answering: would this be sound, by the lights of the people who came before us?',
          'It is, in the end, the only question that has ever mattered in this business.'
        ]
      }
    }
  };

  global.DATA = DATA;
})(window);
