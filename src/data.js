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
    summary: "Led third-party integration strategy, customer data pipeline delivery, ingestion scale improvements, and migration work across the Qualtrics platform.",
    roles: [
      {
        title: "Product Manager",
        start_date: "2022-01-01",
        end_date: "2023-05-31",
      },
      {
        title: "Product Manager Associate (Clarabridge Acquisition)",
        start_date: "2020-11-01",
        end_date: "2021-12-31",
      },
    ],
  },
  {
    id: "exp_coast",
    company: "Coast",
    company_start_date: "2023-05-01",
    company_end_date: "2024-03-31",
    current: false,
    summary: "Expanded the public API, led beta and GA launches, and used SQL-driven analysis to reduce integration-related transaction declines by 53%.",
    roles: [
      {
        title: "Technical Product Manager",
        start_date: "2023-05-01",
        end_date: "2024-03-31",
      },
    ],
  },
  {
    id: "exp_dat",
    company: "DAT Freight & Analytics",
    company_start_date: "2024-04-01",
    company_end_date: null,
    current: true,
    summary: "Owned and evolved TMS integrations across partner onboarding, enterprise pilots, and platform strategy after the Trucker Tools acquisition.",
    roles: [
      {
        title: "Senior Product Manager, Integrations",
        start_date: "2025-05-01",
        end_date: null,
      },
      {
        title: "Product Ops Analyst (Trucker Tools Acquisition)",
        start_date: "2024-04-01",
        end_date: "2025-04-30",
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
    id: "proj_001",
    name: "Empire",
    summary: "Empire is a lightweight web app I built so groups can play the party game Empire on mobile devices.",
    description: "Empire is a lightweight web app built for mobile play, created as an AI-assisted project and deployed on Vercel.",
    tags: ["Web App", "OpenAI Codex", "Vercel", "AI-Assisted Dev"],
    links: {
      live: "https://empire.jonahanderson.me",
      details: "https://www.jonahanderson.me/projects/empire-game",
    },
  },
  {
    id: "proj_002",
    name: "MoonBot",
    summary: "MoonBot is a Python tool that helps review Reddit posts and generate AI-assisted comments, built to farm MOONs with fine-tuning models and real world AI automation.",
    description: "MoonBot is a Python automation project using the Reddit API, SQLite, and AI workflows to review posts and generate comments.",
    tags: ["Python", "Reddit API", "AI", "Fine-Tuning", "SQLite"],
    links: {
      github: "https://github.com/jonahanderson/MoonBot",
      details: "https://www.jonahanderson.me/projects/moon-bot",
    },
  },
  {
    id: "proj_003",
    name: "jonahanderson.eth",
    summary: "A personal experiment using ENS, IPFS, and decentralized hosting to understand how identity and websites can work beyond traditional DNS infrastructure.",
    description: "A decentralized web experiment exploring ENS, IPFS, and alternative approaches to personal identity and hosting.",
    tags: ["ENS", "Ethereum", "IPFS", "Decentralized Web"],
    links: {
      live: "https://web3.bio/jonahanderson.eth",
      details: "https://www.jonahanderson.me/projects/jonahanderson-eth",
    },
  },
  {
    id: "proj_004",
    name: "Building My Personal Website with React",
    summary: "I built my first personal site with React as a hands-on way to learn real frontend architecture, styling, routing, and deployment decisions.",
    description: "A personal frontend learning project built with React, CSS, and EmailJS to understand architecture, styling, routing, and shipping decisions.",
    tags: ["React", "Create React App", "CSS", "EmailJS", "Frontend"],
    links: {
      github: "https://github.com/jonahanderson/jonahanderson-Website",
      details: "https://www.jonahanderson.me/projects/building-my-personal-website-with-react",
    },
  },
  {
    id: "proj_005",
    name: "GreekRho",
    summary: "GreekRho was an early startup-style campus platform project for Greek organizations, focused on centralizing member, communication, and organization workflows.",
    description: "GreekRho was an early startup-style product project focused on helping Greek organizations manage members, communication, and discovery workflows.",
    tags: ["Django", "Startup", "Product Development", "Demos", "Search"],
    links: {
      github: "https://github.com/csyager/greeklink-core",
      details: "https://www.jonahanderson.me/projects/greek-rho",
    },
  },
  {
    id: "proj_006",
    name: "WahooGives",
    summary: "WahooGives is a small data project built to collect and structure donation activity during UVA's WahooGives event so trends and momentum can be analyzed more easily.",
    description: "A Python data project focused on collecting fundraising event activity and structuring it for easier trend and momentum analysis.",
    tags: ["Python", "Data Pipeline", "Analytics", "Fundraising Data"],
    links: {
      github: "https://github.com/jonahanderson/WahooGives",
      details: "https://www.jonahanderson.me/projects/wahoo-gives",
    },
  },
];

const availability = {
  status: "open_to_opportunities",
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
  url: "https://assets.jonahanderson.me/jonah-anderson-resume.pdf",
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
