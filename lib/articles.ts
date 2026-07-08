export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  readMinutes: number;
  intro: string;
  sections: ArticleSection[];
  takeaway: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "when-should-a-contractor-use-funding",
    title: "When Should a Contractor Use Funding?",
    description:
      "A one-question framework for deciding whether outside capital will grow your trades business - or just add a payment.",
    readMinutes: 4,
    intro:
      "Most funding advice starts with what you can get. That's backwards. The only question that matters is what the money will do once you have it. Here's the framework we use to review every file - you can run it on your own business in five minutes.",
    sections: [
      {
        heading: "The one-question test",
        paragraphs: [
          "Is there work you're not doing right now because you don't have the capacity to do it? Not work you hope to win - work that's already calling you, filling your inbox, or sitting on your books with a start date you keep pushing.",
          "If the answer is yes, funding has a job: buy the machine, the truck, the crew, or the lead flow that lets you say yes to that work. The new revenue services the cost, and the capacity stays after the payments end.",
          "If the answer is no, funding has no job - and money without a job doesn't sit still. It leaks into payroll gaps, old debt, and 'while we're at it' spending. Then the payment shows up every month whether the work did or not.",
        ],
      },
      {
        heading: "Three signals it's time",
        paragraphs: [
          "In the files we review, three patterns show up again and again in businesses that use capital well:",
        ],
        bullets: [
          "You're turning down jobs, or booking them weeks further out than your customers want to wait.",
          "You can name the exact thing you'd buy - a specific machine, a second truck, two more crew members - and roughly what it earns per month.",
          "Your bank statements already show steady revenue. The money makes a working business bigger; it doesn't make a broken one work.",
        ],
      },
      {
        heading: "When waiting is the right call",
        paragraphs: [
          "If you're under about six months in business, still figuring out your offer, or your pipeline depends on hope rather than history, taking on a payment usually makes things harder - not easier. That's not a judgment; it's sequencing. Revenue first, then capacity, then capital to multiply it.",
          "The honest move for a business in that position is to fix the demand side: referrals, reviews, follow-up on old quotes, and pricing. Capital can't create demand. It can only serve it.",
        ],
      },
    ],
    takeaway:
      "Funding is a commitment to growth - which means it only makes sense when the growth is already knocking. If you can name the work you'd take and the thing you'd buy to take it, that's a conversation worth having.",
  },
  {
    slug: "equipment-financing-vs-working-capital",
    title: "Equipment Financing vs. Working Capital",
    description:
      "Two different tools for two different bottlenecks. Mixing them up starves the one that's actually holding you back.",
    readMinutes: 4,
    intro:
      "Owners often ask for 'funding' as one thing. But capital comes in two working shapes - money that buys capability and money that buys timing - and they solve different problems. Pointing the wrong one at your bottleneck is how businesses end up with payments and no progress.",
    sections: [
      {
        heading: "Money that buys capability",
        paragraphs: [
          "Equipment-style spending - machines, trucks, trailers, major tools - buys the ability to do work you currently can't. A second truck isn't just a truck; it's a second route running every day. A lift or excavator isn't a purchase; it's a category of job you can now bid.",
          "The defining feature: the asset outlasts the cost. While you're paying it off, it's earning. After payoff, everything it touches is margin. That's why capability purchases are the strongest use of funding we see - the math is visible up front.",
        ],
      },
      {
        heading: "Money that buys timing",
        paragraphs: [
          "Working capital solves a different problem: the gap between doing the work and getting paid for it. Materials you buy in March for a job that pays in May. Deposits on supplies for a booked season. Payroll for a new crew in the weeks before their jobs start billing.",
          "Used this way, working capital isn't debt in the scary sense - it's a bridge across a gap you can already see the other side of. The key phrase is 'booked work.' Working capital against booked work is timing. Working capital against hoped-for work is a loan against a guess.",
        ],
      },
      {
        heading: "How to tell which one you need",
        paragraphs: [
          "Ask what actually stops the next job from happening:",
        ],
        bullets: [
          "\"I can't take the job at all\" - that's a capability problem. Look at equipment, vehicles, or hiring.",
          "\"I can take it, but cash gets tight before it pays\" - that's a timing problem. That's working capital.",
          "\"I don't have enough jobs\" - that's neither. That's a demand problem, and no funding product fixes it.",
        ],
      },
    ],
    takeaway:
      "Name your bottleneck before you name a dollar amount. When the money maps to the real constraint, the purchase pays for itself in work. When it doesn't, it's just a payment.",
  },
  {
    slug: "why-funding-without-demand-is-dangerous",
    title: "Why Funding Without Demand Is Dangerous",
    description:
      "Capital amplifies whatever is already true about your business. Here's what that means before you take money.",
    readMinutes: 5,
    intro:
      "This is the article we wish every owner read before applying anywhere - including with us. Funding is an amplifier. Point it at a business with real demand and capped capacity, and it multiplies output. Point it at a business without demand, and it multiplies the problem.",
    sections: [
      {
        heading: "The payment doesn't care how your month went",
        paragraphs: [
          "Every funding product - ours, a bank's, anyone's - has one thing in common: the cost shows up on schedule, whether the new revenue did or not.",
          "When funding buys capacity for work that already exists, the work covers the cost. When it buys capacity for work you hoped would show up, you now have two problems: the demand you didn't have before, and a payment you didn't have before.",
        ],
      },
      {
        heading: "The stacking trap",
        paragraphs: [
          "Here's the pattern that buries good people. A business takes an advance to cover a slow stretch. The slow stretch doesn't end, so the payment makes cash tighter. Tighter cash makes the next advance feel necessary. Each round is easier to justify and harder to escape - because none of the money ever bought anything that earns.",
          "This is why we ask what the money is for, and why 'covering payroll' or 'paying down another advance' stops a file with us. It's not gatekeeping. Refinancing chaos with more chaos has a known ending, and we're not interested in funding it.",
        ],
      },
      {
        heading: "What real demand looks like on paper",
        paragraphs: [
          "Demand isn't a feeling - it shows up in the numbers you already have:",
        ],
        bullets: [
          "Deposits and progress payments landing in your bank statements month after month",
          "A booking calendar that's full further out than you'd like",
          "Quotes you lost specifically because you couldn't start soon enough",
          "Ad spend or referral sources with a track record - cost per job you can state from memory",
        ],
      },
      {
        heading: "If the demand isn't there yet",
        paragraphs: [
          "Then the honest answer is: don't take funding - from us or anyone. Spend the next quarter on the unglamorous demand work: follow up every old quote, ask every happy customer for a referral and a review, tighten your pricing, and get your close rate up.",
          "Businesses that do that work come back with statements that make funding decisions easy. That's the order of operations: demand, then capacity, then capital.",
        ],
      },
    ],
    takeaway:
      "Capital multiplies what's true. Make sure what's true about your business is worth multiplying - and if it is, that's exactly the file we want to see.",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
