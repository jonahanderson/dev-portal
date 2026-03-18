const candidateProfile = {
  id: "cand_001",
  name: "Jonah Anderson",
  title: "Senior Product Manager, Integrations",
  location: "Brooklyn, New York",
  summary: "Technical product leader focused on APIs, integrations, and partner platforms",
  years_experience: 5,
  domains: ["APIs", "Integrations", "Logistics", "B2B SaaS"],
};

const experience = [
  {
    id: "exp_qualtrics",
    company: "Qualtrics",
    company_start_date: "2020-11-01",
    company_end_date: "2023-05-31",
    current: false,
    summary: "Qualtrics is an experience management software company, and in this role I owned roadmap and strategy for third-party integrations.",
    roles: [
      {
        title: "Product Manager",
        start_date: "2022-01-01",
        end_date: "2023-05-31",
        accomplishments: [
          "Led product strategy and roadmap for third-party API integrations, expanding partner connectivity and platform capability.",
          "Scaled ingestion infrastructure supporting 10% growth in record processing volume within six months.",
          "Drove customer migration to AWS, improving scalability while reducing operational and infrastructure costs.",
        ],
      },
      {
        title: "Product Manager Associate (Clarabridge Acquisition)",
        start_date: "2020-11-01",
        end_date: "2021-12-31",
        accomplishments: [
          "Collaborated with engineers, marketing, services, and sales teams to deliver custom data pipeline integrations to customers.",
          "Eliminated legacy data pipeline dependencies through a deprecation plan, reducing operations and service spend.",
        ],
      },
    ],
  },
  {
    id: "exp_coast",
    company: "Coast",
    company_start_date: "2023-05-01",
    company_end_date: "2024-03-31",
    current: false,
    summary: "Coast is a technology company with API-driven financial and fleet-related products, and in this role I launched API capabilities, improved integration performance through data analysis, and delivered telematics and accounting integrations",
    roles: [
      {
        title: "Technical Product Manager",
        start_date: "2023-05-01",
        end_date: "2024-03-31",
        accomplishments: [
          "Orchestrated beta and GA launches and expanded the public API with new endpoints, driving partner adoption and opening new acquisition channels.",
          "Applied SQL-driven analysis to identify failure patterns in integration transactions, reducing decline rates by 53% within six months.",
          "Led the delivery of the complex accounting integration, mastering accounting concepts and software, which facilitated the entry into an additional product area.",
        ],
      },
    ],
  },
  {
    id: "exp_dat",
    company: "DAT Freight & Analytics",
    company_start_date: "2024-04-01",
    company_end_date: null,
    current: true,
    summary: "DAT Freight & Analytics is a freight technology company, and in this role I led strategy and execution for TMS and API integrations, improving onboarding, partner visibility, and migration planning to protect and grow enterprise revenue.",
    roles: [
      {
        title: "Senior Product Manager, Integrations",
        start_date: "2025-05-01",
        end_date: null,
        accomplishments: [
          "Owned product strategy for DAT's integration ecosystem connecting major transportation platforms, supporting millions in recurring revenue and the majority of broker, shipper, and carrier workflow automation across the network.",
          "Managed DAT's developer portal experience, surfacing new APIs and integration capabilities to partners and customers while improving discoverability, documentation, and onboarding for external developers.",
          "Led the strategy for deprecating legacy SOAP APIs and migrating partners to REST, designing backward-compatible adapters to protect $6M+ in MRR while preventing disruption to enterprise TMS integrations.",
          "Introduced partner attribution within API headers, enabling monitoring of integration performance by TMS partner and unlocking data-driven reliability reporting.",
          "Authored the standard playbook for new TMS integrations including PRDs, workflow specifications, and validation frameworks adopted across partner onboarding.",
        ],
      },
      {
        title: "Product Ops Analyst (Trucker Tools Acquisition)",
        start_date: "2024-04-01",
        end_date: "2025-04-30",
        accomplishments: [
          "Owned lifecycle of TMS integrations across tracking, posting, offers, and bids, acting as technical liaison for partners and enterprise brokers.",
          "Expanded the partner ecosystem by driving a 30% increase in active TMS integrations across the network.",
          "Enabled enterprise deals through integration-led pilots and technical presale support, influencing $25K+ in new monthly recurring revenue.",
          "Defined and formalized the sales engineer motion for large deals, drafting Statements of Work, integration scopes, and pilot success criteria.",
        ],
      },
    ],
  },
];

const experienceNewestFirst = [...experience].sort((a, b) => {
  const firstDate = a.roles[0]?.start_date ?? a.company_start_date;
  const secondDate = b.roles[0]?.start_date ?? b.company_start_date;

  return secondDate.localeCompare(firstDate);
});

const projects = [
  {
    id: "proj_007",
    name: "Jonah's Resume Developer Portal",
    summary: "A small full-stack project that turns my resume into a developer-facing API product with live endpoints, OpenAPI schemas, and polished docs.",
    tags: ["REST API", "Render", "Mintlify", "OpenAPI", "EmailJS"],
    links: {
      live: "https://developer.jonahanderson.me/",
      details: "https://www.jonahanderson.me/projects/jonahs-resume-developer-portal",
    },
  },
  {
    id: "proj_006",
    name: "Empire",
    summary: "Empire is a lightweight web app I built so groups can play the party game Empire on mobile devices.",
    tags: ["Web App", "OpenAI Codex", "Vercel", "AI-Assisted Dev"],
    links: {
      live: "https://empire.jonahanderson.me",
      details: "https://www.jonahanderson.me/projects/empire-game",
    },
  },
  {
    id: "proj_005",
    name: "MoonBot",
    summary: "MoonBot is a Python tool that helps review Reddit posts and generate AI-assisted comments, built to farm MOONs with fine-tuning models and real world AI automation.",
    tags: ["Python", "Reddit API", "AI", "Fine-Tuning", "SQLite"],
    links: {
      github: "https://github.com/jonahanderson/MoonBot",
      details: "https://www.jonahanderson.me/projects/moon-bot",
    },
  },
  {
    id: "proj_004",
    name: "jonahanderson.eth",
    summary: "A personal experiment using ENS, IPFS, and decentralized hosting to understand how identity and websites can work beyond traditional DNS infrastructure.",
    tags: ["ENS", "Ethereum", "IPFS", "Decentralized Web"],
    links: {
      live: "https://web3.bio/jonahanderson.eth",
      details: "https://www.jonahanderson.me/projects/jonahanderson-eth",
    },
  },
  {
    id: "proj_003",
    name: "Building My Personal Website with React",
    summary: "I built my first personal site with React as a hands-on way to learn real frontend architecture, styling, routing, and deployment decisions.",
    tags: ["React", "Create React App", "CSS", "EmailJS", "Frontend"],
    links: {
      github: "https://github.com/jonahanderson/jonahanderson-Website",
      details: "https://www.jonahanderson.me/projects/building-my-personal-website-with-react",
    },
  },
  {
    id: "proj_002",
    name: "GreekRho",
    summary: "GreekRho was an early startup-style campus platform project for Greek organizations, focused on centralizing member, communication, and organization workflows.",
    tags: ["Django", "Startup", "Product Development", "Demos", "Search"],
    links: {
      github: "https://github.com/csyager/greeklink-core",
      details: "https://www.jonahanderson.me/projects/greek-rho",
    },
  },
  {
    id: "proj_001",
    name: "WahooGives",
    summary: "WahooGives is a small data project built to collect and structure donation activity during UVA's WahooGives event so trends and momentum can be analyzed more easily.",
    tags: ["Python", "Data Pipeline", "Analytics", "Fundraising Data"],
    links: {
      github: "https://github.com/jonahanderson/WahooGives",
      details: "https://www.jonahanderson.me/projects/wahoo-gives",
    },
  },
];

const availability = {
  status: "open to opportunities",
};

const resume = {
  name: "Jonah Anderson",
  title: "Senior Product Manager, Integrations",
  experience: experienceNewestFirst.map((company) => ({
    company: company.company,
    company_start_date: company.company_start_date,
    company_end_date: company.company_end_date,
    current: company.current,
    roles: company.roles,
  })),
  skills: [
    "REST APIs",
    "SOAP APIs",
    "Webhooks",
    "SQL",
    "AWS",
    "Postman",
    "Figma",
    "Product Management",
  ],
};

const resumePdf = {
  url: "https://www.jonahanderson.me/Jonah-Anderson-Resume.pdf",
};

module.exports = {
  availability,
  candidateProfile,
  experience,
  experienceNewestFirst,
  projects,
  resume,
  resumePdf,
};
