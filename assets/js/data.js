// NM District v2.0 - Production-Grade Data Layer
window.NMData = {
  events: [
    {
      id: "velocity-fest-2026",
      slug: "velocity-fest-2026",
      title: "Velocity 2026: NM Annual Cultural Fest",
      category: "Cultural",
      subcategory: "Festival",
      description: "Velocity is NM College's signature annual celebration of music, movement, fashion, and youth culture. This edition introduces immersive stages, creator zones, and collaborative experiences curated by students for students. Experience three days of non-stop entertainment with headlining artists, student performances, food festivals, and cultural showcases that define the NM spirit.",
      date: "2026-05-09T16:00:00+05:30",
      time: { start: "16:00", end: "23:30" },
      venue: "NM Main Quadrangle",
      format: "offline",
      hostedBy: "NMACC Student Council",
      image: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg",
      gallery: [
        "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg",
        "assets/images/1370e36c1add1748beeb92ee1dfc64ce.jpg",
        "assets/images/2678eaf1a162f9e0f05c17574526f2a7.jpg"
      ],
      tiers: [
        { name: "General Access", price: 499, seats: 420, seatsLeft: 89, perks: ["Entry to all stages", "Food court access", "Basic amenities"] },
        { name: "Priority Lane", price: 899, seats: 160, seatsLeft: 23, perks: ["Fast-track entry", "Premium seating", "Complimentary drinks", "Meet & greet"] },
        { name: "Luxe Circle", price: 1499, seats: 65, seatsLeft: 8, perks: ["VIP lounge access", "Backstage tour", "Artist meet & greet", "Gourmet dining", "Exclusive merchandise"] }
      ],
      agenda: [
        { time: "16:00", title: "Golden Hour Campus Parade", description: "Grand opening parade through campus" },
        { time: "18:00", title: "Street Beat Championship", description: "Dance competition finals" },
        { time: "20:15", title: "Headliner Set", description: "Main artist performance" },
        { time: "22:00", title: "Neon After-Party", description: "DJ sets and celebration" }
      ],
      rules: [
        "Valid NM College ID mandatory for entry",
        "Registration closes 2 hours before event start",
        "No outside food or beverages allowed",
        "Professional photography/videography permitted in designated zones only"
      ],
      tags: ["festival", "music", "cultural", "flagship"],
      interested: 2401,
      featured: true
    },
    {
      id: "finxcellence-case-wars-2026",
      slug: "finxcellence-case-wars-2026",
      title: "FinXcellence Case Wars 2026",
      category: "Competition",
      subcategory: "Case Competition",
      description: "A high-stakes case battle where students solve real market scenarios under time pressure and present strategies to top industry judges from leading investment banks and consulting firms. This annual competition attracts the brightest minds from across Mumbai's business schools.",
      date: "2026-04-25T10:00:00+05:30",
      time: { start: "10:00", end: "17:30" },
      venue: "Seminar Hall B",
      format: "offline",
      hostedBy: "NM Finance Forum",
      image: "assets/images/285e95a8f50a8c6d47afa30f99e4285c.jpg",
      gallery: [
        "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg",
        "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg"
      ],
      tiers: [
        { name: "Participant", price: 199, seats: 110, seatsLeft: 34, perks: ["Case materials", "Lunch", "Certificate"] },
        { name: "Observer", price: 99, seats: 70, seatsLeft: 45, perks: ["Audience access", "Networking"] }
      ],
      agenda: [
        { time: "10:00", title: "Problem Statement Reveal", description: "Case distribution and briefing" },
        { time: "12:00", title: "Mentor Huddle", description: "Guidance from industry mentors" },
        { time: "14:30", title: "Final Boardroom Presentations", description: "Team presentations to judges" },
        { time: "17:00", title: "Awards & Networking", description: "Results and networking session" }
      ],
      rules: [
        "Teams of 2-4 participants",
        "No internet usage during final round",
        "7-minute presentation limit",
        "Business formal attire required"
      ],
      tags: ["finance", "competition", "case-study", "investment"],
      interested: 892,
      featured: true
    },
    {
      id: "ai-finance-bootcamp-2026",
      slug: "ai-finance-bootcamp-2026",
      title: "AI for Finance Bootcamp",
      category: "Workshop",
      subcategory: "Technology",
      description: "Hands-on workshop focused on practical AI workflows for financial analysis, from data pipelines to model interpretation and storytelling. Learn how leading financial institutions use machine learning for risk assessment, portfolio optimization, and algorithmic trading.",
      date: "2026-04-30T14:00:00+05:30",
      time: { start: "14:00", end: "19:00" },
      venue: "Innovation Lab 3",
      format: "hybrid",
      hostedBy: "DataX NM",
      image: "assets/images/49592495dd5ed7b56deccc37d092881a.jpg",
      gallery: [
        "assets/images/4f7b4ae0986f4a7502e84ba08890af84.jpg",
        "assets/images/643821c3346d3269220af319cbc7a70b.jpg"
      ],
      tiers: [
        { name: "Campus Seat", price: 349, seats: 90, seatsLeft: 12, perks: ["In-person access", "Hands-on labs", "Certificate"] },
        { name: "Online Seat", price: 199, seats: 210, seatsLeft: 67, perks: ["Live stream access", "Digital materials", "Recording access"] }
      ],
      agenda: [
        { time: "14:00", title: "Dataset Sprint & Framing", description: "Data preprocessing and feature engineering" },
        { time: "15:30", title: "Model Lab", description: "Building predictive models" },
        { time: "17:15", title: "Risk Interpretation", description: "Model validation and risk assessment" },
        { time: "18:20", title: "Portfolio Dashboard Build", description: "Creating interactive dashboards" }
      ],
      rules: [
        "Basic Python knowledge required",
        "Laptop with Chrome browser mandatory",
        "All materials provided digitally",
        "Certificate upon completion"
      ],
      tags: ["ai", "finance", "workshop", "technology"],
      interested: 567,
      featured: false
    },
    {
      id: "nm-premier-night-league-2026",
      slug: "nm-premier-night-league-2026",
      title: "NM Premier Night League",
      category: "Sports",
      subcategory: "Football",
      description: "Inter-department night football championship with floodlights, live commentary, and crowd engagement challenges. Experience the electrifying atmosphere as departments compete for the coveted NM Premier League trophy in this annual tradition.",
      date: "2026-05-03T18:00:00+05:30",
      time: { start: "18:00", end: "22:00" },
      venue: "College Turf Arena",
      format: "offline",
      hostedBy: "NM Sports Collective",
      image: "assets/images/7229b3b9bee41bf3b83f3fb5bff91bf8.jpg",
      gallery: [
        "assets/images/7927842edee4f607b83d0ec3a0904765.jpg",
        "assets/images/79fe219bb15ea2779ab13247e3f150dd.jpg"
      ],
      tiers: [
        { name: "Player Registration", price: 0, seats: 80, seatsLeft: 23, perks: ["Tournament participation", "Team jersey", "Medical coverage"] },
        { name: "Spectator Pass", price: 0, seats: 500, seatsLeft: 167, perks: ["Entry to all matches", "Food court access"] }
      ],
      agenda: [
        { time: "18:00", title: "Opening Fixtures", description: "First round matches" },
        { time: "19:45", title: "Quarter Finals", description: "Knockout stage" },
        { time: "21:10", title: "Final Match", description: "Championship game and awards" }
      ],
      rules: [
        "Valid NM ID required for players",
        "Sports shoes and shin guards mandatory",
        "Teams must register 2 hours before kickoff",
        "Fair play policy strictly enforced"
      ],
      tags: ["sports", "football", "tournament", "free"],
      interested: 1203,
      featured: true
    },
    {
      id: "global-markets-masterclass-2026",
      slug: "global-markets-masterclass-2026",
      title: "Global Markets Masterclass",
      category: "Guest Lecture",
      subcategory: "Finance",
      description: "A high-impact session decoding geopolitics, capital flows, and next-gen opportunities for young analysts and founders. Features insights from global markets strategist with 15+ years of experience across emerging and developed markets.",
      date: "2026-05-12T11:30:00+05:30",
      time: { start: "11:30", end: "14:00" },
      venue: "Main Auditorium",
      format: "offline",
      hostedBy: "Economics Association",
      image: "assets/images/85d922c83af7fd97351b71dda21854d4.jpg",
      gallery: [
        "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg",
        "assets/images/863f1459ece4a8ad133f09bebc101559.jpg"
      ],
      tiers: [
        { name: "Student Pass", price: 299, seats: 220, seatsLeft: 78, perks: ["Lecture access", "Q&A session", "Certificate"] },
        { name: "Priority Q&A", price: 549, seats: 40, seatsLeft: 9, perks: ["Front row seating", "Extended Q&A access", "Networking lunch"] }
      ],
      agenda: [
        { time: "11:30", title: "Macro Pulse 2026", description: "Current global economic landscape" },
        { time: "12:20", title: "Emerging Market Playbook", description: "Investment strategies and opportunities" },
        { time: "13:10", title: "Live Q&A", description: "Interactive session with speaker" }
      ],
      rules: [
        "Seating on first-come, first-served basis",
        "No recording without prior permission",
        "Professional attire recommended",
        "Questions submitted via mobile app"
      ],
      tags: ["finance", "economics", "guest-lecture", "global-markets"],
      interested: 445,
      featured: false
    },
    {
      id: "campus-live-acoustic-sundowner-2026",
      slug: "campus-live-acoustic-sundowner-2026",
      title: "Campus Live: Acoustic Sundowner",
      category: "Cultural",
      subcategory: "Music",
      description: "A live acoustic evening with student artists, spoken word sets, and an intimate sunset crowd vibe. Experience the raw talent of NM's music community in this monthly series that showcases emerging artists and creates magical evenings under the stars.",
      date: "2026-04-20T17:30:00+05:30",
      time: { start: "17:30", end: "20:00" },
      venue: "Amphitheatre",
      format: "offline",
      hostedBy: "The Dramatic Society",
      image: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg",
      gallery: [
        "assets/images/87bc90ca9d0bb9f2fc79ae8891fe2e00.jpg",
        "assets/images/8c5fe105397a5d73dbfae2653da1a7d6.jpg"
      ],
      tiers: [
        { name: "Front Bay", price: 149, seats: 35, seatsLeft: 8, perks: ["Premium seating", "Artist meet & greet"] },
        { name: "General Floor", price: 99, seats: 120, seatsLeft: 34, perks: ["General admission", "Open mic access"] }
      ],
      agenda: [
        { time: "17:30", title: "Open Mic Prelude", description: "Student performances and warm-up" },
        { time: "18:20", title: "Acoustic Showcase", description: "Featured artist performances" },
        { time: "19:30", title: "Poetry Jam", description: "Spoken word and poetry session" }
      ],
      rules: [
        "Seating by pass category only",
        "No flash photography near stage",
        "Respect performance etiquette",
        "Limited on-spot registration available"
      ],
      tags: ["music", "acoustic", "live", "cultural"],
      interested: 892,
      featured: true
    },
    {
      id: "founders-cafe-networking-2026",
      slug: "founders-cafe-networking-2026",
      title: "Founders Cafe: Networking Night",
      category: "Networking",
      subcategory: "Entrepreneurship",
      description: "Founder-student networking format with rotating table conversations and curated startup matchmaking. Connect with successful entrepreneurs, venture capitalists, and fellow students building the next generation of startups.",
      date: "2026-05-07T18:30:00+05:30",
      time: { start: "18:30", end: "21:00" },
      venue: "Biz Commons Lounge",
      format: "offline",
      hostedBy: "E-Cell NM",
      image: "assets/images/970bc67e4cbfcf6aed1876225951ccf2.jpg",
      gallery: [
        "assets/images/9a904ec055cc7d7fbd95443daea2dc01.jpg",
        "assets/images/a3ae8184ed41f08408a6809bdd4c555c.jpg"
      ],
      tiers: [
        { name: "Networking Pass", price: 249, seats: 130, seatsLeft: 41, perks: ["Entry to all sessions", "Startup directory access", "Coffee & snacks"] }
      ],
      agenda: [
        { time: "18:30", title: "Founder Introductions", description: "Startup pitches and introductions" },
        { time: "19:10", title: "Speed Networking Rounds", description: "Rotating table conversations" },
        { time: "20:20", title: "Open Floor & Collab Board", description: "Open networking and collaboration opportunities" }
      ],
      rules: [
        "Business casual attire required",
        "Bring business cards/digital profile",
        "Respect time slots during rotations",
        "Collaboration board moderated by E-Cell"
      ],
      tags: ["networking", "entrepreneurship", "startups", "founders"],
      interested: 623,
      featured: false
    },
    {
      id: "committee-recruitment-drive-2026",
      slug: "committee-recruitment-drive-2026",
      title: "Committee Recruitment Drive",
      category: "Career",
      subcategory: "Leadership",
      description: "Official recruitment for student committees across operations, outreach, design, and media verticals. Find your perfect fit among 15+ committees and build your leadership skills while contributing to campus life.",
      date: "2026-05-02T09:30:00+05:30",
      time: { start: "09:30", end: "15:30" },
      venue: "Student Activity Wing",
      format: "offline",
      hostedBy: "Campus Affairs Council",
      image: "assets/images/a8052b514aed67559f8b56235be6d832.jpg",
      gallery: [
        "assets/images/863f1459ece4a8ad133f09bebc101559.jpg",
        "assets/images/a87318b37485c9e886acbd4e57995123.jpg"
      ],
      tiers: [
        { name: "Applicant Slot", price: 0, seats: 360, seatsLeft: 127, perks: ["Interview slot", "Resume review", "Career guidance"] }
      ],
      agenda: [
        { time: "09:30", title: "Committee Showcases", description: "Presentations by all committees" },
        { time: "11:30", title: "Profile Fit Interviews", description: "One-on-one interviews" },
        { time: "14:30", title: "Final Selection Desk", description: "Results and onboarding" }
      ],
      rules: [
        "Resume upload mandatory",
        "Attend assigned interview slots",
        "Professional attire required",
        "Can apply to maximum 3 committees"
      ],
      tags: ["career", "leadership", "committee", "free"],
      interested: 892,
      featured: false
    },
    {
      id: "sustainability-hackathon-2026",
      slug: "sustainability-hackathon-2026",
      title: "Sustainability Sprint Hackathon",
      category: "Competition",
      subcategory: "Hackathon",
      description: "One-day innovation challenge where teams prototype sustainability solutions for urban college ecosystems. Address real-world environmental challenges and compete for prizes and implementation opportunities.",
      date: "2026-05-15T08:30:00+05:30",
      time: { start: "08:30", end: "20:30" },
      venue: "Innovation Atrium",
      format: "offline",
      hostedBy: "Enactus NM",
      image: "assets/images/ae854b60c43597f5d16ee36deff2f43e.jpg",
      gallery: [
        "assets/images/b5591a9630cb60402b7eb1947a4608bb.jpg",
        "assets/images/c0d7398dedee2f06949cf074934dab96.jpg"
      ],
      tiers: [
        { name: "Team Pass", price: 299, seats: 200, seatsLeft: 67, perks: ["Hackathon access", "Mentorship", "Meals", "Certificate"] },
        { name: "Mentor Access", price: 0, seats: 25, seatsLeft: 8, perks: ["Mentor role", "Judge access", "VIP access"] }
      ],
      agenda: [
        { time: "08:30", title: "Briefing & Team Formation", description: "Problem statements and team building" },
        { time: "11:00", title: "Build Phase", description: "Development and prototyping" },
        { time: "16:00", title: "Pitch Rehearsals", description: "Practice and refinement" },
        { time: "18:30", title: "Demo Showcase", description: "Final presentations and awards" }
      ],
      rules: [
        "Teams of 3-5 participants",
        "Original solutions required",
        "Prototype demonstration mandatory",
        "IP rights remain with teams"
      ],
      tags: ["hackathon", "sustainability", "innovation", "competition"],
      interested: 445,
      featured: true
    },
    {
      id: "photography-workshop-2026",
      slug: "photography-workshop-2026",
      title: "Street Photography Masterclass",
      category: "Workshop",
      subcategory: "Creative Arts",
      description: "Learn the art of street photography from award-winning photographers. Master composition, lighting, and storytelling techniques while exploring Mumbai's vibrant streets during this hands-on workshop.",
      date: "2026-04-28T09:00:00+05:30",
      time: { start: "09:00", end: "17:00" },
      venue: "Media Lab + Outdoor",
      format: "hybrid",
      hostedBy: "Photography Club",
      image: "assets/images/c2a5ffd4099b6569d09a7e9e52e629ad.jpg",
      gallery: [
        "assets/images/c3440e9721d6beed4463eaa8690e93c8.jpg",
        "assets/images/c5bef76946085b739a29cafc975eb0c3.jpg"
      ],
      tiers: [
        { name: "Participant", price: 399, seats: 45, seatsLeft: 12, perks: ["Workshop access", "Photography walk", "Portfolio review", "Certificate"] }
      ],
      agenda: [
        { time: "09:00", title: "Theory & Composition", description: "Fundamentals of street photography" },
        { time: "11:00", title: "Street Walk", description: "Guided photography session" },
        { time: "14:00", title: "Editing & Post-Processing", description: "Digital workflow techniques" },
        { time: "16:00", title: "Portfolio Review", description: "Individual feedback sessions" }
      ],
      rules: [
        "DSLR or mirrorless camera recommended",
        "Comfortable walking shoes mandatory",
        "Weather appropriate clothing",
        "Basic photography knowledge helpful"
      ],
      tags: ["photography", "workshop", "creative", "arts"],
      interested: 234,
      featured: false
    },
    {
      id: "debate-championship-2026",
      slug: "debate-championship-2026",
      title: "NM Debate Championship 2026",
      category: "Competition",
      subcategory: "Debate",
      description: "The annual debate championship featuring the best debaters from across Mumbai colleges. This year's topic focuses on technology ethics and its impact on society, with participants arguing both sides of complex contemporary issues.",
      date: "2026-04-22T13:00:00+05:30",
      time: { start: "13:00", end: "18:00" },
      venue: "Conference Hall A",
      format: "offline",
      hostedBy: "Debate Society",
      image: "assets/images/c983bc230cc5ea898b993790cfb95b4d.jpg",
      gallery: [
        "assets/images/e608269024d98c641c6156cec0aab89a.jpg",
        "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg"
      ],
      tiers: [
        { name: "Participant", price: 149, seats: 64, seatsLeft: 19, perks: ["Competition entry", "Certificate", "Lunch"] },
        { name: "Audience", price: 49, seats: 150, seatsLeft: 67, perks: ["Entry to all rounds", "Voting rights"] }
      ],
      agenda: [
        { time: "13:00", title: "Preliminary Rounds", description: "Group stage debates" },
        { time: "15:30", title: "Semi-Finals", description: "Knockout stage debates" },
        { time: "17:00", title: "Grand Finale", description: "Championship debate and awards" }
      ],
      rules: [
        "Teams of 2 participants",
        "Formal business attire",
        "5 minutes speaking time per round",
        "No electronic devices during debate"
      ],
      tags: ["debate", "competition", "public-speaking", "technology"],
      interested: 345,
      featured: false
    }
  ],

  clubs: [
    {
      id: "ecell-nm",
      name: "E-Cell NM",
      category: "Entrepreneurship",
      description: "NM's entrepreneurship nucleus connecting student founders, mentors, and investor networks. We organize startup weekends, pitch competitions, and founder meetups to foster the entrepreneurial spirit on campus.",
      logo: "assets/images/f458f683c278a8ea9f7becc41acabaca.jpg",
      banner: "assets/images/f60df5b643f14f72581006955dd306d8.jpg",
      members: 5400,
      founded: "2018",
      leadership: [
        { name: "Siddhant Rao", role: "President", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Nyra Shah", role: "Operations Lead", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Ahaan Jain", role: "Partnerships Lead", avatar: "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/ecellnm",
        linkedin: "https://linkedin.com/company/e-cell-nm",
        website: "https://ecellnm.in"
      },
      gallery: [
        "assets/images/1370e36c1add1748beeb92ee1dfc64ce.jpg",
        "assets/images/970bc67e4cbfcf6aed1876225951ccf2.jpg",
        "assets/images/a3ae8184ed41f08408a6809bdd4c555c.jpg"
      ],
      events: ["founders-cafe-networking-2026", "committee-recruitment-drive-2026"]
    },
    {
      id: "finance-forum",
      name: "Finance Forum",
      category: "Finance",
      description: "The flagship club for market simulations, investment leagues, and industry-focused finance cohorts. We bridge academic knowledge with real-world financial markets through workshops, competitions, and networking events.",
      logo: "assets/images/2678eaf1a162f9e0f05c17574526f2a7.jpg",
      banner: "assets/images/285e95a8f50a8c6d47afa30f99e4285c.jpg",
      members: 4900,
      founded: "2017",
      leadership: [
        { name: "Tara Mehta", role: "President", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" },
        { name: "Vivaan Shah", role: "Research Lead", avatar: "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg" },
        { name: "S. Kamat", role: "Quant Lead", avatar: "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmfinanceforum",
        linkedin: "https://linkedin.com/company/finance-forum-nm",
        website: "https://nmfinance.club"
      },
      gallery: [
        "assets/images/49592495dd5ed7b56deccc37d092881a.jpg",
        "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg",
        "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg"
      ],
      events: ["finxcellence-case-wars-2026", "global-markets-masterclass-2026"]
    },
    {
      id: "dramatic-society",
      name: "Dramatic Society",
      category: "Cultural",
      description: "From theatre to music nights and spoken-word circuits, this club powers NM's creative stage culture. We produce plays, organize open mic nights, and host cultural festivals that showcase student talent.",
      logo: "assets/images/49592495dd5ed7b56deccc37d092881a.jpg",
      banner: "assets/images/4f7b4ae0986f4a7502e84ba08890af84.jpg",
      members: 6200,
      founded: "2016",
      leadership: [
        { name: "Zoya Patil", role: "President", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Karan D'Souza", role: "Curation Lead", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Juhi Rao", role: "Production Head", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmdramatics",
        linkedin: "https://linkedin.com/company/nm-dramatic-society",
        website: "https://nmdrama.live"
      },
      gallery: [
        "assets/images/87bc90ca9d0bb9f2fc79ae8891fe2e00.jpg",
        "assets/images/643821c3346d3269220af319cbc7a70b.jpg",
        "assets/images/8c5fe105397a5d73dbfae2653da1a7d6.jpg"
      ],
      events: ["campus-live-acoustic-sundowner-2026"]
    },
    {
      id: "sports-collective",
      name: "Sports Collective",
      category: "Sports",
      description: "Driving inter-collegiate sports culture with leagues, wellness challenges, and athletic showcases. We organize tournaments, fitness programs, and sports events that promote healthy competition and teamwork.",
      logo: "assets/images/7229b3b9bee41bf3b83f3fb5bff91bf8.jpg",
      banner: "assets/images/7927842edee4f607b83d0ec3a0904765.jpg",
      members: 3700,
      founded: "2015",
      leadership: [
        { name: "Arjun Sood", role: "Captain", avatar: "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg" },
        { name: "Ishaan Vyas", role: "Coordinator", avatar: "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg" },
        { name: "Pia Dandekar", role: "Media", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmsports",
        linkedin: "https://linkedin.com/company/nm-sports-collective",
        website: "https://nmsports.club"
      },
      gallery: [
        "assets/images/7927842edee4f607b83d0ec3a0904765.jpg",
        "assets/images/79fe219bb15ea2779ab13247e3f150dd.jpg",
        "assets/images/79fe219bb15ea2779ab13247e3f150dd.jpg"
      ],
      events: ["nm-premier-night-league-2026"]
    },
    {
      id: "enactus-nm",
      name: "Enactus NM",
      category: "Social Impact",
      description: "Student-led social entrepreneurship community building practical solutions for sustainable growth. We work on real-world projects that address social and environmental challenges while developing business skills.",
      logo: "assets/images/85d922c83af7fd97351b71dda21854d4.jpg",
      banner: "assets/images/863f1459ece4a8ad133f09bebc101559.jpg",
      members: 4100,
      founded: "2019",
      leadership: [
        { name: "Krisha Shah", role: "President", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" },
        { name: "Neil Parekh", role: "Projects Lead", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Reya Gokhale", role: "Outreach", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/enactusnm",
        linkedin: "https://linkedin.com/company/enactus-nm",
        website: "https://enactusnm.org"
      },
      gallery: [
        "assets/images/ae854b60c43597f5d16ee36deff2f43e.jpg",
        "assets/images/c0d7398dedee2f06949cf074934dab96.jpg",
        "assets/images/b5591a9630cb60402b7eb1947a4608bb.jpg"
      ],
      events: ["sustainability-hackathon-2026"]
    },
    {
      id: "datax-nm",
      name: "DataX NM",
      category: "Technology",
      description: "Community for analytics builders, model thinkers, and students shaping tech-first business futures. We host hackathons, workshops on AI/ML, and tech talks from industry leaders.",
      logo: "assets/images/87bc90ca9d0bb9f2fc79ae8891fe2e00.jpg",
      banner: "assets/images/8c5fe105397a5d73dbfae2653da1a7d6.jpg",
      members: 3300,
      founded: "2020",
      leadership: [
        { name: "Mihir Desai", role: "President", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Sana D'Costa", role: "ML Lead", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Yashvi Mody", role: "Workshops", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/dataxnm",
        linkedin: "https://linkedin.com/company/datax-nm",
        website: "https://dataxnm.ai"
      },
      gallery: [
        "assets/images/49592495dd5ed7b56deccc37d092881a.jpg",
        "assets/images/9a904ec055cc7d7fbd95443daea2dc01.jpg",
        "assets/images/4f7b4ae0986f4a7502e84ba08890af84.jpg"
      ],
      events: ["ai-finance-bootcamp-2026"]
    },
    {
      id: "debate-society",
      name: "Debate Society",
      category: "Academic",
      description: "Fostering critical thinking and public speaking skills through competitive debates and discussions. We organize inter-college tournaments, workshops on argumentation, and weekly debate sessions.",
      logo: "assets/images/970bc67e4cbfcf6aed1876225951ccf2.jpg",
      banner: "assets/images/9a904ec055cc7d7fbd95443daea2dc01.jpg",
      members: 2800,
      founded: "2014",
      leadership: [
        { name: "Rohan Mehta", role: "President", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Ananya Singh", role: "Debate Captain", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Kabir Nair", role: "Research Head", avatar: "assets/images/0a2e1d19caa2992ccb170c2abdbbd6b1.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmdebates",
        linkedin: "https://linkedin.com/company/nm-debate-society",
        website: "https://nmdebates.club"
      },
      gallery: [
        "assets/images/c983bc230cc5ea898b993790cfb95b4d.jpg",
        "assets/images/e608269024d98c641c6156cec0aab89a.jpg",
        "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg"
      ],
      events: ["debate-championship-2026"]
    },
    {
      id: "photography-club",
      name: "Photography Club",
      category: "Creative Arts",
      description: "Capturing campus life and beyond through the lens. We organize photography walks, workshops, exhibitions, and photo competitions that help students develop their visual storytelling skills.",
      logo: "assets/images/a3ae8184ed41f08408a6809bdd4c555c.jpg",
      banner: "assets/images/a8052b514aed67559f8b56235be6d832.jpg",
      members: 2100,
      founded: "2017",
      leadership: [
        { name: "Aisha Khan", role: "President", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Rohit Patel", role: "Technical Lead", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Meera Joshi", role: "Creative Director", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmphotography",
        linkedin: "https://linkedin.com/company/nm-photography-club",
        website: "https://nmphoto.club"
      },
      gallery: [
        "assets/images/c2a5ffd4099b6569d09a7e9e52e629ad.jpg",
        "assets/images/c3440e9721d6beed4463eaa8690e93c8.jpg",
        "assets/images/c5bef76946085b739a29cafc975eb0c3.jpg"
      ],
      events: ["photography-workshop-2026"]
    },
    {
      id: "literature-society",
      name: "Literature Society",
      category: "Creative Arts",
      description: "Celebrating the written word through poetry slams, creative writing workshops, book clubs, and literary discussions. We provide a platform for writers, poets, and literature enthusiasts to express themselves.",
      logo: "assets/images/a87318b37485c9e886acbd4e57995123.jpg",
      banner: "assets/images/ae854b60c43597f5d16ee36deff2f43e.jpg",
      members: 1900,
      founded: "2016",
      leadership: [
        { name: "Priya Sharma", role: "President", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Vikram Malhotra", role: "Poetry Lead", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Fatima Ali", role: "Workshops Coordinator", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmliterature",
        linkedin: "https://linkedin.com/company/nm-literature-society",
        website: "https://nmliterature.club"
      },
      gallery: [
        "assets/images/b5591a9630cb60402b7eb1947a4608bb.jpg",
        "assets/images/385a26a34f594dbaa1d6890e70664f81.jpg",
        "assets/images/c983bc230cc5ea898b993790cfb95b4d.jpg"
      ],
      events: []
    },
    {
      id: "dance-club",
      name: "Dance Club",
      category: "Cultural",
      description: "Expressing through movement and rhythm. We teach various dance forms, organize flash mobs, participate in competitions, and host annual dance showcases that celebrate diverse dance styles.",
      logo: "assets/images/c0d7398dedee2f06949cf074934dab96.jpg",
      banner: "assets/images/c2a5ffd4099b6569d09a7e9e52e629ad.jpg",
      members: 3500,
      founded: "2015",
      leadership: [
        { name: "Neha Reddy", role: "President", avatar: "assets/images/020b0ad05767be5e64f4b446f03f428d.jpg" },
        { name: "Arjun Singh", role: "Choreography Lead", avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg" },
        { name: "Sara Khan", role: "Performance Coordinator", avatar: "assets/images/3321ae1b9b6cd7db540d6d49211068f7.jpg" }
      ],
      socialLinks: {
        instagram: "https://instagram.com/nmdance",
        linkedin: "https://linkedin.com/company/nm-dance-club",
        website: "https://nmdance.club"
      },
      gallery: [
        "assets/images/643821c3346d3269220af319cbc7a70b.jpg",
        "assets/images/8c5fe105397a5d73dbfae2653da1a7d6.jpg",
        "assets/images/87bc90ca9d0bb9f2fc79ae8891fe2e00.jpg"
      ],
      events: []
    }
  ],

  speakers: [
    {
      id: "nikhil-adani",
      name: "Nikhil Adani",
      role: "Global Markets Strategist",
      company: "Goldman Sachs",
      avatar: "assets/images/c3440e9721d6beed4463eaa8690e93c8.jpg",
      bio: "15+ years of experience in emerging markets and global macro strategy. Author of 'The New Silk Road: Navigating Global Capital Flows'."
    },
    {
      id: "megha-shah",
      name: "Megha Shah",
      role: "Investment Associate",
      company: "Axis Capital",
      avatar: "assets/images/c5bef76946085b739a29cafc975eb0c3.jpg",
      bio: "Specializes in technology investments and growth equity. Led investments in 12+ startups with 3x average returns."
    },
    {
      id: "kabir-taneja",
      name: "Kabir Taneja",
      role: "Vice President",
      company: "JP Morgan",
      avatar: "assets/images/c983bc230cc5ea898b993790cfb95b4d.jpg",
      bio: "Expert in derivatives and risk management. Regular speaker at financial conferences and academic institutions."
    },
    {
      id: "sana-dcosta",
      name: "Sana D'Costa",
      role: "Machine Learning Lead",
      company: "Microsoft",
      avatar: "assets/images/e608269024d98c641c6156cec0aab89a.jpg",
      bio: "AI researcher with 8+ years in machine learning applications for finance. Published author in top ML conferences."
    },
    {
      id: "ananya-vora",
      name: "Ananya Vora",
      role: "Impact Entrepreneur",
      company: "GreenTech Ventures",
      avatar: "assets/images/c5bef76946085b739a29cafc975eb0c3.jpg",
      bio: "Founded 3 social impact startups focusing on sustainable urban solutions. TEDx speaker and sustainability advocate."
    },
    {
      id: "arjun-sood",
      name: "Arjun Sood",
      role: "Sports Convenor",
      company: "NM College",
      avatar: "assets/images/f458f683c278a8ea9f7becc41acabaca.jpg",
      bio: "Former state-level football player, now organizing inter-collegiate sports events and promoting campus athletics."
    },
    {
      id: "neel-joshi",
      name: "Neel Joshi",
      role: "Lead Artist",
      company: "Independent",
      avatar: "assets/images/f458f683c278a8ea9f7becc41acabaca.jpg",
      bio: "Indie musician and composer with 2M+ streams on digital platforms. Regular performer at college cultural events."
    },
    {
      id: "ritika-wagle",
      name: "Ritika Wagle",
      role: "Startup Mentor",
      company: "Venture Catalysts",
      avatar: "assets/images/e608269024d98c641c6156cec0aab89a.jpg",
      bio: "Mentored 50+ early-stage startups across fintech, edtech, and healthtech. Angel investor with 20+ portfolio companies."
    }
  ],

  student: {
    name: "Aarav Kulkarni",
    rollNo: "NM2024BMS045",
    email: "aarav.kulkarni@nmcollege.in",
    department: "BMS",
    year: "SY",
    avatar: "assets/images/f60df5b643f14f72581006955dd306d8.jpg",
    nmPoints: 1250,
    bookings: [
      {
        id: "booking-001",
        eventId: "velocity-fest-2026",
        tier: "Priority Lane",
        quantity: 1,
        amount: 899,
        status: "confirmed",
        bookingDate: "2026-04-15T14:30:00+05:30",
        qrCode: "NM-VF2026-PR-899-001"
      },
      {
        id: "booking-002", 
        eventId: "ai-finance-bootcamp-2026",
        tier: "Campus Seat",
        quantity: 1,
        amount: 349,
        status: "confirmed",
        bookingDate: "2026-04-10T11:20:00+05:30",
        qrCode: "NM-AI2026-CS-349-002"
      }
    ],
    savedEvents: ["finxcellence-case-wars-2026", "sustainability-hackathon-2026", "global-markets-masterclass-2026"]
  },

  organizer: {
    name: "Priya Nair",
    clubId: "ecell-nm",
    role: "Events Coordinator",
    avatar: "assets/images/fdc75681b658e75869ad5eb26a418904.jpg",
    managedEvents: ["founders-cafe-networking-2026", "committee-recruitment-drive-2026"]
  }
};
