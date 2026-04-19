const nmEvents = [
  {
    id: "velocity-fest-2026",
    title: "Velocity 2026: NM Annual Cultural Fest",
    organizer: "NMACC Student Council",
    club: "Student Council",
    category: "Fests",
    type: "Festival",
    date: "2026-05-09",
    time: "4:00 PM - 11:30 PM",
    venue: "NM Main Quadrangle",
    mode: "offline",
    price: 499,
    popularity: 98,
    isTrending: true,
    isLive: false,
    image:
      "assets/images/4f7b4ae0986f4a7502e84ba08890af84.jpg",
    heroVideo: "https://assets.mixkit.co/videos/preview/mixkit-crowd-in-a-concert-3-large.mp4",
    about:
      "Velocity is NM College's signature annual celebration of music, movement, fashion, and youth culture. This edition introduces immersive stages, creator zones, and collaborative experiences curated by students for students.",
    registrationsClose: "2026-05-05T23:59:59",
    tickets: [
      { name: "General Access", price: 499, seats: 420 },
      { name: "Priority Lane", price: 899, seats: 160 },
      { name: "Luxe Circle", price: 1499, seats: 65 }
    ],
    agenda: [
      { time: "16:00", title: "Golden Hour Campus Parade" },
      { time: "18:00", title: "Street Beat Championship" },
      { time: "20:15", title: "Headliner Set" },
      { time: "22:00", title: "Neon After-Party" }
    ],
    speakers: [
      {
        name: "Aarna Kapadia",
        role: "Creative Director",
        image:
          "assets/images/643821c3346d3269220af319cbc7a70b.jpg"
      },
      {
        name: "Pranav Menon",
        role: "Festival Host",
        image:
          "assets/images/7229b3b9bee41bf3b83f3fb5bff91bf8.jpg"
      },
      {
        name: "DJ Nova",
        role: "Headline Performer",
        image:
          "assets/images/7927842edee4f607b83d0ec3a0904765.jpg"
      }
    ],
    faq: [
      {
        q: "Is student ID mandatory at entry?",
        a: "Yes, every participant must carry a valid NM student ID and booking confirmation." 
      },
      {
        q: "Can non-NM students attend?",
        a: "External guests are allowed only through limited invite-based passes issued by the organizer." 
      },
      {
        q: "Are food and beverage counters included?",
        a: "Food courts are available on-site and can be purchased separately via digital payments." 
      }
    ],
    rules: [
      "Entry gates close 30 minutes before the final headline set.",
      "Outside food, beverages, and prohibited items are not allowed.",
      "Passes are non-transferable once scanned at venue.",
      "Violation of campus safety code can result in immediate pass cancellation."
    ],
    gallery: [
      "assets/images/79fe219bb15ea2779ab13247e3f150dd.jpg",
      "assets/images/85d922c83af7fd97351b71dda21854d4.jpg",
      "assets/images/863f1459ece4a8ad133f09bebc101559.jpg"
    ],
    reviews: [
      { name: "Rhea M.", rating: 5, text: "Felt like a mini music festival in the middle of campus." },
      { name: "Kush P.", rating: 5, text: "Production quality was insane. Loved the lighting and sound." },
      { name: "Dev S.", rating: 4, text: "Super smooth booking and entry flow this year." }
    ]
  },
  {
    id: "finxcellence-case-wars",
    title: "FinXcellence Case Wars",
    organizer: "NM Finance Forum",
    club: "Finance Forum",
    category: "Competitions",
    type: "Case Competition",
    date: "2026-04-25",
    time: "10:00 AM - 5:30 PM",
    venue: "Seminar Hall B",
    mode: "offline",
    price: 199,
    popularity: 93,
    isTrending: true,
    isLive: false,
    image:
      "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg",
    about:
      "A high-stakes case battle where students solve real market scenarios under time pressure and present strategies to top industry judges.",
    registrationsClose: "2026-04-23T22:00:00",
    tickets: [
      { name: "Participant", price: 199, seats: 110 },
      { name: "Observer", price: 99, seats: 70 }
    ],
    agenda: [
      { time: "10:00", title: "Problem Statement Reveal" },
      { time: "12:00", title: "Mentor Huddle" },
      { time: "14:30", title: "Final Boardroom Presentations" },
      { time: "17:00", title: "Awards & Networking" }
    ],
    speakers: [
      {
        name: "Megha Shah",
        role: "Investment Associate, Axis Capital",
        image:
          "assets/images/87bc90ca9d0bb9f2fc79ae8891fe2e00.jpg"
      },
      {
        name: "Kabir Taneja",
        role: "Vice President, JP Morgan",
        image:
          "assets/images/8c5fe105397a5d73dbfae2653da1a7d6.jpg"
      }
    ],
    faq: [
      { q: "Can first-year students join?", a: "Yes, teams can have members from any academic year." },
      { q: "How many members per team?", a: "Teams can have 2 to 4 participants." }
    ],
    rules: [
      "No internet usage allowed during final strategy round.",
      "Presentations beyond 7 minutes will incur penalties.",
      "Decision of judges is final and binding."
    ],
    gallery: [
      "assets/images/970bc67e4cbfcf6aed1876225951ccf2.jpg",
      "assets/images/9a904ec055cc7d7fbd95443daea2dc01.jpg"
    ],
    reviews: [
      { name: "Aviral N.", rating: 5, text: "Closest thing to a real investment committee simulation." }
    ]
  },
  {
    id: "ai-finance-bootcamp",
    title: "AI for Finance Bootcamp",
    organizer: "DataX NM",
    club: "DataX NM",
    category: "Workshops",
    type: "Workshop",
    date: "2026-04-30",
    time: "2:00 PM - 7:00 PM",
    venue: "Innovation Lab 3",
    mode: "hybrid",
    price: 349,
    popularity: 90,
    isTrending: false,
    isLive: false,
    image:
      "assets/images/1370e36c1add1748beeb92ee1dfc64ce.jpg",
    about:
      "Hands-on workshop focused on practical AI workflows for financial analysis, from data pipelines to model interpretation and storytelling.",
    registrationsClose: "2026-04-29T18:00:00",
    tickets: [
      { name: "Campus Seat", price: 349, seats: 90 },
      { name: "Online Seat", price: 199, seats: 210 }
    ],
    agenda: [
      { time: "14:00", title: "Dataset Sprint & Framing" },
      { time: "15:30", title: "Model Lab" },
      { time: "17:15", title: "Risk Interpretation" },
      { time: "18:20", title: "Portfolio Dashboard Build" }
    ],
    speakers: [
      {
        name: "Sana D'Costa",
        role: "Machine Learning Lead",
        image:
          "assets/images/a3ae8184ed41f08408a6809bdd4c555c.jpg"
      }
    ],
    faq: [
      { q: "Do I need prior coding experience?", a: "Basic Python familiarity is enough for this bootcamp." }
    ],
    rules: [
      "Bring a charged laptop with browser and notebook tools.",
      "Late arrivals after first module cannot join practical rounds."
    ],
    gallery: [
      "assets/images/a8052b514aed67559f8b56235be6d832.jpg"
    ],
    reviews: [
      { name: "Tia R.", rating: 5, text: "Brilliant blend of finance context with modern AI tools." }
    ]
  },
  {
    id: "nm-premier-night-league",
    title: "NM Premier Night League",
    organizer: "NM Sports Collective",
    club: "Sports Collective",
    category: "Sports",
    type: "Tournament",
    date: "2026-05-03",
    time: "6:00 PM - 10:00 PM",
    venue: "College Turf Arena",
    mode: "offline",
    price: 0,
    popularity: 87,
    isTrending: true,
    isLive: false,
    image:
      "assets/images/2678eaf1a162f9e0f05c17574526f2a7.jpg",
    about:
      "Inter-department night football with floodlights, live commentary, and crowd engagement challenges.",
    registrationsClose: "2026-05-01T22:30:00",
    tickets: [
      { name: "Player Registration", price: 0, seats: 80 },
      { name: "Spectator Pass", price: 0, seats: 500 }
    ],
    agenda: [
      { time: "18:00", title: "Opening Fixtures" },
      { time: "19:45", title: "Quarter Finals" },
      { time: "21:10", title: "Final Match" }
    ],
    speakers: [
      {
        name: "Arjun Sood",
        role: "Sports Convenor",
        image:
          "assets/images/a87318b37485c9e886acbd4e57995123.jpg"
      }
    ],
    faq: [
      { q: "Is this event free?", a: "Yes, all registrations are free for NM students." }
    ],
    rules: [
      "Shin guards and valid sports shoes are mandatory for players.",
      "Unsportsmanlike conduct leads to instant disqualification."
    ],
    gallery: [
      "assets/images/ae854b60c43597f5d16ee36deff2f43e.jpg"
    ],
    reviews: [
      { name: "Kirtan B.", rating: 4, text: "Amazing atmosphere and very well managed fixtures." }
    ]
  },
  {
    id: "global-markets-masterclass",
    title: "Global Markets Masterclass",
    organizer: "Economics Association",
    club: "Economics Association",
    category: "Guest Lectures",
    type: "Masterclass",
    date: "2026-05-12",
    time: "11:30 AM - 2:00 PM",
    venue: "Auditorium",
    mode: "offline",
    price: 299,
    popularity: 84,
    isTrending: false,
    isLive: false,
    image:
      "assets/images/285e95a8f50a8c6d47afa30f99e4285c.jpg",
    about:
      "A high-impact session decoding geopolitics, capital flows, and next-gen opportunities for young analysts and founders.",
    registrationsClose: "2026-05-10T20:00:00",
    tickets: [
      { name: "Student Pass", price: 299, seats: 220 },
      { name: "Priority Q&A", price: 549, seats: 40 }
    ],
    agenda: [
      { time: "11:30", title: "Macro Pulse 2026" },
      { time: "12:20", title: "Emerging Market Playbook" },
      { time: "13:10", title: "Live Q&A" }
    ],
    speakers: [
      {
        name: "Nikhil Adani",
        role: "Global Markets Strategist",
        image:
          "assets/images/b5591a9630cb60402b7eb1947a4608bb.jpg"
      }
    ],
    faq: [
      { q: "Will recording be shared?", a: "Recordings are shared with verified ticket holders only." }
    ],
    rules: [
      "Seats are assigned on a first-scan basis.",
      "Questions are shortlisted through the in-app queue."
    ],
    gallery: [
      "assets/images/c0d7398dedee2f06949cf074934dab96.jpg"
    ],
    reviews: [
      { name: "Isha P.", rating: 5, text: "Sharp, current, and super relevant to our coursework." }
    ]
  },
  {
    id: "campus-live-session",
    title: "Campus Live: Acoustic Sundowner",
    organizer: "The Dramatic Society",
    club: "Dramatic Society",
    category: "Cultural Events",
    type: "Live Session",
    date: "2026-04-20",
    time: "5:30 PM - 8:00 PM",
    venue: "Amphitheatre",
    mode: "offline",
    price: 149,
    popularity: 95,
    isTrending: true,
    isLive: true,
    image:
      "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg",
    about:
      "A live acoustic evening with student artists, spoken word sets, and an intimate sunset crowd vibe.",
    registrationsClose: "2026-04-20T17:00:00",
    tickets: [
      { name: "Front Bay", price: 149, seats: 35 },
      { name: "General Floor", price: 99, seats: 120 }
    ],
    agenda: [
      { time: "17:30", title: "Open Mic Prelude" },
      { time: "18:20", title: "Acoustic Showcase" },
      { time: "19:30", title: "Poetry Jam" }
    ],
    speakers: [
      {
        name: "Neel Joshi",
        role: "Lead Artist",
        image:
          "assets/images/c2a5ffd4099b6569d09a7e9e52e629ad.jpg"
      }
    ],
    faq: [
      { q: "Can I register at venue?", a: "Limited on-spot passes may open if inventory remains." }
    ],
    rules: [
      "Event is seated by pass category.",
      "Respect performance etiquette and no flash usage near stage."
    ],
    gallery: [
      "assets/images/c3440e9721d6beed4463eaa8690e93c8.jpg"
    ],
    reviews: [
      { name: "Moksh T.", rating: 5, text: "Most beautiful evening event NM has hosted this year." }
    ]
  },
  {
    id: "networking-founders-cafe",
    title: "Founders Cafe: Networking Night",
    organizer: "E-Cell NM",
    club: "E-Cell NM",
    category: "Networking",
    type: "Networking",
    date: "2026-05-07",
    time: "6:30 PM - 9:00 PM",
    venue: "Biz Commons Lounge",
    mode: "offline",
    price: 249,
    popularity: 88,
    isTrending: false,
    isLive: false,
    image:
      "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg",
    about:
      "Founder-student networking format with rotating table conversations and curated startup matchmaking.",
    registrationsClose: "2026-05-06T22:00:00",
    tickets: [
      { name: "Networking Pass", price: 249, seats: 130 }
    ],
    agenda: [
      { time: "18:30", title: "Founder Introductions" },
      { time: "19:10", title: "Speed Networking Rounds" },
      { time: "20:20", title: "Open Floor & Collab Board" }
    ],
    speakers: [
      {
        name: "Ritika Wagle",
        role: "Startup Mentor",
        image:
          "assets/images/c5bef76946085b739a29cafc975eb0c3.jpg"
      }
    ],
    faq: [
      { q: "What should I prepare?", a: "Bring a one-minute intro and your portfolio or startup idea note." }
    ],
    rules: [
      "Respect time slots during rotating conversations.",
      "Collaboration boards are moderated by E-Cell volunteers."
    ],
    gallery: [
      "assets/images/c983bc230cc5ea898b993790cfb95b4d.jpg"
    ],
    reviews: [
      { name: "Akriti L.", rating: 4, text: "Met two collaborators for my internship startup project." }
    ]
  },
  {
    id: "committee-recruitment-drive",
    title: "Committee Recruitment Drive",
    organizer: "Campus Affairs Council",
    club: "Campus Affairs",
    category: "Committees",
    type: "Recruitment",
    date: "2026-05-02",
    time: "9:30 AM - 3:30 PM",
    venue: "Student Activity Wing",
    mode: "offline",
    price: 0,
    popularity: 80,
    isTrending: false,
    isLive: false,
    image:
      "assets/images/49592495dd5ed7b56deccc37d092881a.jpg",
    about:
      "Official recruitment for student committees across operations, outreach, design, and media verticals.",
    registrationsClose: "2026-04-30T23:00:00",
    tickets: [
      { name: "Applicant Slot", price: 0, seats: 360 }
    ],
    agenda: [
      { time: "09:30", title: "Committee Showcases" },
      { time: "11:30", title: "Profile Fit Interviews" },
      { time: "14:30", title: "Final Selection Desk" }
    ],
    speakers: [
      {
        name: "Hridaan Verma",
        role: "Campus Secretary",
        image:
          "assets/images/e608269024d98c641c6156cec0aab89a.jpg"
      }
    ],
    faq: [
      { q: "Can I apply to multiple committees?", a: "Yes, but final selection will be for one primary committee." }
    ],
    rules: [
      "Resume upload is mandatory before slot confirmation.",
      "Students must attend assigned interview windows."
    ],
    gallery: [
      "assets/images/f458f683c278a8ea9f7becc41acabaca.jpg"
    ],
    reviews: [
      { name: "Priya N.", rating: 4, text: "Very structured process and clear role definitions." }
    ]
  },
  {
    id: "sustainability-hackathon",
    title: "Sustainability Sprint Hackathon",
    organizer: "Enactus NM",
    club: "Enactus NM",
    category: "Competitions",
    type: "Hackathon",
    date: "2026-05-15",
    time: "8:30 AM - 8:30 PM",
    venue: "Innovation Atrium",
    mode: "offline",
    price: 299,
    popularity: 91,
    isTrending: true,
    isLive: false,
    image:
      "assets/images/4f7b4ae0986f4a7502e84ba08890af84.jpg",
    about:
      "One-day innovation challenge where teams prototype sustainability solutions for urban college ecosystems.",
    registrationsClose: "2026-05-12T21:00:00",
    tickets: [
      { name: "Team Pass", price: 299, seats: 200 },
      { name: "Mentor Access", price: 0, seats: 25 }
    ],
    agenda: [
      { time: "08:30", title: "Briefing & Team Formation" },
      { time: "11:00", title: "Build Phase" },
      { time: "16:00", title: "Pitch Rehearsals" },
      { time: "18:30", title: "Demo Showcase" }
    ],
    speakers: [
      {
        name: "Ananya Vora",
        role: "Impact Entrepreneur",
        image:
          "assets/images/f60df5b643f14f72581006955dd306d8.jpg"
      }
    ],
    faq: [
      { q: "Is overnight coding involved?", a: "No, this is an intensive single-day format." }
    ],
    rules: [
      "Teams must consist of 3 to 5 participants.",
      "Prototype originality and impact feasibility are core judging criteria."
    ],
    gallery: [
      "assets/images/fdc75681b658e75869ad5eb26a418904.jpg"
    ],
    reviews: [
      { name: "Naman C.", rating: 5, text: "Best mix of ideation and execution on campus." }
    ]
  }
];

const nmClubs = [
  {
    id: "ecell-nm",
    name: "E-Cell NM",
    tagline: "Where ideas become ventures",
    description:
      "NM's entrepreneurship nucleus connecting student founders, mentors, and investor networks.",
    followers: 5400,
    eventCount: 34,
    logo: "EC",
    coverImage:
      "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg",
    socials: { instagram: "@ecellnm", linkedin: "E-Cell NM", website: "ecellnm.in" },
    team: ["President: Siddhant Rao", "Operations Lead: Nyra Shah", "Partnerships Lead: Ahaan Jain"]
  },
  {
    id: "finance-forum",
    name: "Finance Forum",
    tagline: "Capital, markets, strategy",
    description:
      "The flagship club for market simulations, investment leagues, and industry-focused finance cohorts.",
    followers: 4900,
    eventCount: 29,
    logo: "FF",
    coverImage:
      "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg",
    socials: { instagram: "@nmfinanceforum", linkedin: "Finance Forum NM", website: "nmfinance.club" },
    team: ["President: Tara Mehta", "Research Lead: Vivaan Shah", "Quant Lead: S. Kamat"]
  },
  {
    id: "dramatic-society",
    name: "Dramatic Society",
    tagline: "Performance in every form",
    description:
      "From theatre to music nights and spoken-word circuits, this club powers NM's creative stage culture.",
    followers: 6200,
    eventCount: 41,
    logo: "DS",
    coverImage:
      "assets/images/1370e36c1add1748beeb92ee1dfc64ce.jpg",
    socials: { instagram: "@nmdramatics", linkedin: "NM Dramatic Society", website: "nmdrama.live" },
    team: ["President: Zoya Patil", "Curation Lead: Karan D'Souza", "Production Head: Juhi Rao"]
  },
  {
    id: "sports-collective",
    name: "Sports Collective",
    tagline: "Campus fitness and competition",
    description:
      "Driving inter-collegiate sports culture with leagues, wellness challenges, and athletic showcases.",
    followers: 3700,
    eventCount: 21,
    logo: "SC",
    coverImage:
      "assets/images/2678eaf1a162f9e0f05c17574526f2a7.jpg",
    socials: { instagram: "@nmsports", linkedin: "NM Sports Collective", website: "nmsports.club" },
    team: ["Captain: Arjun Sood", "Coordinator: Ishaan Vyas", "Media: Pia Dandekar"]
  },
  {
    id: "enactus-nm",
    name: "Enactus NM",
    tagline: "Impact through action",
    description:
      "Student-led social entrepreneurship community building practical solutions for sustainable growth.",
    followers: 4100,
    eventCount: 24,
    logo: "EN",
    coverImage:
      "assets/images/285e95a8f50a8c6d47afa30f99e4285c.jpg",
    socials: { instagram: "@enactusnm", linkedin: "Enactus NM", website: "enactusnm.org" },
    team: ["President: Krisha Shah", "Projects Lead: Neil Parekh", "Outreach: Reya Gokhale"]
  },
  {
    id: "datax-nm",
    name: "DataX NM",
    tagline: "Data, AI, and decision intelligence",
    description:
      "Community for analytics builders, model thinkers, and students shaping tech-first business futures.",
    followers: 3300,
    eventCount: 19,
    logo: "DX",
    coverImage:
      "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg",
    socials: { instagram: "@dataxnm", linkedin: "DataX NM", website: "dataxnm.ai" },
    team: ["President: Mihir Desai", "ML Lead: Sana D'Costa", "Workshops: Yashvi Mody"]
  }
];

const nmTestimonials = [
  {
    name: "Aarav Kulkarni",
    program: "B.Com, SY",
    quote: "Feels like premium lifestyle apps, but built for our campus pulse. Discovery is insanely smooth."
  },
  {
    name: "Manya Jain",
    program: "BMS, TY",
    quote: "Booked a fest pass in less than a minute and the ticket card looked unreal."
  },
  {
    name: "Shaan Deshmukh",
    program: "B.Com, FY",
    quote: "The event filters finally make it easy to see what is relevant to me."
  },
  {
    name: "Rudra Patil",
    program: "BMM, TY",
    quote: "Club pages and visuals are elite. It really feels exclusive to NM."
  }
];

const nmCategories = [
  { name: "Fests", icon: "✦", desc: "High-energy flagship celebrations" },
  { name: "Competitions", icon: "⚡", desc: "Case battles and challenge formats" },
  { name: "Workshops", icon: "⌁", desc: "Hands-on learning labs" },
  { name: "Sports", icon: "◉", desc: "Leagues, tournaments, and fitness" },
  { name: "Cultural Events", icon: "♫", desc: "Music, theatre, and performance" },
  { name: "Guest Lectures", icon: "◌", desc: "Industry leaders on campus" },
  { name: "Networking", icon: "↗", desc: "Founders, peers, and mentors" },
  { name: "Committees", icon: "▣", desc: "Campus leadership opportunities" }
];

const nmStats = {
  totalEvents: 312,
  totalStudents: 14820,
  activeClubs: 58,
  registrations: 25740
};

const formatCurrency = (price) => {
  if (!price) {
    return "Free";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
};

window.NM_DATA = {
  events: nmEvents,
  clubs: nmClubs,
  testimonials: nmTestimonials,
  categories: nmCategories,
  stats: nmStats,
  formatCurrency
};
