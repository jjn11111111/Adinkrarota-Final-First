// Comprehensive ADINKRAROTA Guidebook Data
// Based on the official guidebook explanations

export interface SuitIntro {
  suit: string;
  element: string;
  energy: string;
  keywords: string[];
  zodiacSigns: {
    sign: string;
    modality: string;
  }[];
  description: string;
}

export interface CardGuidebookEntry {
  id: string;
  name: string;
  adinkraSymbol: string;
  adinkraMeaning: string;
  fullDescription: string;
  lightAspect: string;
  shadowAspect: string;
  inReadings: string;
}

export const suitIntros: SuitIntro[] = [
  {
    suit: "wands",
    element: "Fire",
    energy: "Masculine",
    keywords: ["Inspiration", "Masculine", "Creativity", "Epiphany", "Catalyst", "Unapologetic", "Original", "Egoic", "Individual", "Singular", "Intensity", "Extroverted", "Active"],
    zodiacSigns: [
      { sign: "Aries", modality: "Cardinal" },
      { sign: "Leo", modality: "Fixed" },
      { sign: "Sagittarius", modality: "Mutable" }
    ],
    description: "The Wands suit embodies the fire element's transformative energy—passionate, creative, and driven by inspiration. These cards speak to our will, ambition, and the spark that ignites action."
  },
  {
    suit: "cups",
    element: "Water",
    energy: "Feminine",
    keywords: ["Emotion", "Intuition", "Relationships", "Compassion", "Dreams", "Receptive", "Flowing", "Nurturing", "Healing", "Psychic", "Introverted", "Passive"],
    zodiacSigns: [
      { sign: "Cancer", modality: "Cardinal" },
      { sign: "Scorpio", modality: "Fixed" },
      { sign: "Pisces", modality: "Mutable" }
    ],
    description: "The Cups suit flows with water's emotional depth—intuitive, compassionate, and connected to the heart. These cards explore our relationships, feelings, and the depths of our inner world."
  },
  {
    suit: "swords",
    element: "Air",
    energy: "Masculine",
    keywords: ["Intellect", "Truth", "Communication", "Conflict", "Clarity", "Decision", "Logic", "Analysis", "Justice", "Power", "Discernment"],
    zodiacSigns: [
      { sign: "Gemini", modality: "Cardinal" },
      { sign: "Libra", modality: "Fixed" },
      { sign: "Aquarius", modality: "Mutable" }
    ],
    description: "The Swords suit cuts through with air's mental clarity—intellectual, decisive, and truth-seeking. These cards address our thoughts, conflicts, and the power of the mind."
  },
  {
    suit: "pentacles",
    element: "Earth",
    energy: "Feminine",
    keywords: ["Physicality", "Feminine", "Tangible", "Sensory", "Matter", "Below", "Incarnation", "Value", "Abundance", "Blessings", "Possessions", "Polarity", "Comparison", "Material Wealth", "Spiritual Riches"],
    zodiacSigns: [
      { sign: "Capricorn", modality: "Cardinal" },
      { sign: "Taurus", modality: "Fixed" },
      { sign: "Virgo", modality: "Mutable" }
    ],
    description: "The Pentacles suit grounds us in earth's material realm—physical, tangible, and connected to our incarnate experience. These cards address our resources, sensory experience, material wealth, and spiritual riches found in the physical world."
  }
];

export const guidebookEntries: CardGuidebookEntry[] = [
  // ============ WANDS SUIT ============
  {
    id: "ace-wands",
    name: "Ace of Wands",
    adinkraSymbol: "Sunsum",
    adinkraMeaning: "The soul, spirituality and spiritual purity",
    fullDescription: "In the radiant dawn of the Ace of Wands-Sunsum, passion ignites the soul's desire, offering a spark of creativity and the initial surge of enthusiasm that marks the beginning of all ventures. Sunsum, representing the spirit and inner self, illuminates the fine line between passion, driving us toward fulfillment, and obsession, which can consume and mislead. This card invites you to harness your inner fire, guiding it with the wisdom of Sunsum to fuel your dreams without letting the flames turn into an all-consuming blaze. It's a call to action, urging balance as you embark on new journeys with a spirited heart and a clear mind.",
    lightAspect: "Passion, creativity, new beginnings, spiritual fire",
    shadowAspect: "Obsession, burnout, misdirected energy",
    inReadings: "This card signifies a burst of creative energy and the beginning of a passionate new venture."
  },
  {
    id: "two-wands",
    name: "2 of Wands",
    adinkraSymbol: "Nyame Akruma",
    adinkraMeaning: "God's axe, symbolizing God's strength and authority",
    fullDescription: "The 2 of Wands-Nyame Akruma presents a choice between command of one's path and the temptation to abdicate responsibility. Nyame Akruma, symbolizing God's strength and authority, empowers you to seize control and shape your destiny with deliberate intent. Standing at the threshold of the future, this card challenges you to take decisive action and embrace your power to choose, reminding you that leadership of one's journey requires courage and vision. Will you assert your will and direct your course, or will you relinquish your power to the winds of fate? The choice is yours, as is the responsibility for the journey ahead.",
    lightAspect: "Command, planning, personal power, future vision",
    shadowAspect: "Abdication, fear of responsibility, indecision",
    inReadings: "A moment of decision about your path forward—assert your authority over your own destiny."
  },
  {
    id: "three-wands",
    name: "3 of Wands",
    adinkraSymbol: "Okuafo Pa",
    adinkraMeaning: "The good farmer, hard work and entrepreneurship",
    fullDescription: "The 3 of Wands-Okuafo Pa navigates the dynamics between expansion and retrenchment, symbolizing a pivotal moment of foresight and planning. Okuafo Pa, celebrating the hardworking and successful farmer, reflects the rewards of diligence and the readiness to act on long-term visions. This card encourages you to look beyond the horizon, to expand your reach with anticipation of future harvests. Yet, it also advises caution, reminding you that strategic retreats and conservation of resources can be necessary for sustainable growth. Balancing expansion with retrenchment, it calls for wise stewardship of your ventures, ensuring that your ambitions are matched by practical preparation and adaptability.",
    lightAspect: "Expansion, foresight, enterprise, opportunity",
    shadowAspect: "Retrenchment, overextension, poor planning",
    inReadings: "Your ventures are ready to expand—look to the horizon with confidence while maintaining practical foundations."
  },
  {
    id: "four-wands",
    name: "4 of Wands",
    adinkraSymbol: "Me Ware Wo",
    adinkraMeaning: "I shall marry you, commitment and perseverance",
    fullDescription: "The 4 of Wands-Me Ware Wo celebrates the joy of culmination, marking a moment of achievement and communal happiness. Me Ware Wo, symbolizing the commitment and unity found in marriage, represents genuine connection and achievements that are the fruit of sincere effort and collaboration. This card warns against the allure of counterfeit successes—those that appear fulfilling but lack true substance and emotional depth. It encourages you to cherish the real milestones and shared victories that weave the fabric of lasting bonds and genuine satisfaction. In recognizing and celebrating true accomplishments, we find the heart of meaningful celebration and community.",
    lightAspect: "Culmination, celebration, community, genuine achievement",
    shadowAspect: "Counterfeit success, hollow victories, superficial bonds",
    inReadings: "A time of celebration and achievement—honor the genuine connections and milestones in your life."
  },
  {
    id: "five-wands",
    name: "5 of Wands",
    adinkraSymbol: "Pa Gya",
    adinkraMeaning: "Strike fire, warfare and alertness",
    fullDescription: "The 5 of Wands-Pa Gya delves into the heart of conflict, where competition and challenges ignite the fires of growth and self-discovery. Pa Gya, symbolizing the war horn and the strength to fight adversity, reflects the necessity of facing conflicts to forge strength and resilience. This card captures the essence of struggle, urging you to confront and navigate disputes with courage and integrity. However, it also hints at the wisdom of ceasefire—recognizing when to lay down arms and seek peace, understanding that not all battles are worth the toll they take. Balancing the heat of conflict with the cooling balm of ceasefire teaches the valuable lesson of choosing battles wisely, for in resolution and restraint lies the path to true growth.",
    lightAspect: "Healthy competition, growth through challenge, resilience",
    shadowAspect: "Unnecessary conflict, exhaustion, refusal to compromise",
    inReadings: "Challenges and competition arise—engage with courage but know when peace serves you better than battle."
  },
  {
    id: "six-wands",
    name: "6 of Wands",
    adinkraSymbol: "Kwatakye Atiko",
    adinkraMeaning: "The back of Kwatakye's head, bravery and valor",
    fullDescription: "The 6 of Wands-Kwatakye Atiko rides the fine line between triumph and being the runner-up, embodying the moment of success and recognition after a challenge. Kwatakye Atiko, representing bravery and valor, underscores the card's message of victory achieved through courage and perseverance. This card celebrates the glory of coming first, of being acknowledged for your efforts and achievements. Yet, it also subtly reminds you that the distinction between success and almost success can be narrow. Embrace your victories with humility, knowing that every competition offers lessons in bravery and the continuous pursuit of excellence. In the balance of success and being the runner-up lies the true spirit of valor and advancement.",
    lightAspect: "Triumph, recognition, victory, public acclaim",
    shadowAspect: "Runner-up, near-miss, hollow victory, arrogance",
    inReadings: "Victory and recognition are at hand—celebrate your achievements while remaining humble."
  },
  {
    id: "seven-wands",
    name: "7 of Wands",
    adinkraSymbol: "Mframadan",
    adinkraMeaning: "Wind-resistant house, fortitude and resilience",
    fullDescription: "The 7 of Wands-Mframadan stands at the crossroads of defense and allowance, embodying the resolve to stand one's ground while also acknowledging the strength in choosing battles wisely. Mframadan, denoting the strength and resilience of a fortress, highlights the card's emphasis on defensiveness and the courage to protect one's stance. This card urges you to defend your position with conviction against opposition, embodying the fortitude and determination symbolized by Mframadan. Yet, it also suggests the wisdom in allowing certain challenges to pass unmet when they do not serve your higher purpose. This duality sometimes lies in strategic flexibility and the discernment to know when to hold fast and when to let go.",
    lightAspect: "Defense, standing your ground, courage, resilience",
    shadowAspect: "Overwhelmed, defensive to a fault, rigidity",
    inReadings: "Hold your position with courage, but discern which battles truly require your energy."
  },
  {
    id: "eight-wands",
    name: "8 of Wands",
    adinkraSymbol: "Akoben",
    adinkraMeaning: "War horn, vigilance and wariness",
    fullDescription: "The 8 of Wands-Akoben captures the essence of swift action versus the necessity of delay, symbolizing a period of rapid movement and the urgent call to action. Akoben, representing the war horn that summons courage and readiness, perfectly aligns with the card's theme of quickness, propelling forward with speed and purpose. This card signals a time when actions and decisions unfold rapidly, encouraging you to seize the momentum. However, it also cautions against haste, reminding you that some situations benefit from patience and thoughtful consideration. Balancing the need for quickness with the wisdom to pause when needed ensures that your actions are both timely and effective, navigating the delicate interplay between speed and delay for optimal outcomes.",
    lightAspect: "Swift action, momentum, rapid progress, urgency",
    shadowAspect: "Haste, delays, missed timing, impatience",
    inReadings: "Events accelerate rapidly—act decisively while remaining mindful of timing."
  },
  {
    id: "nine-wands",
    name: "9 of Wands",
    adinkraSymbol: "Aya",
    adinkraMeaning: "Fern, endurance and resourcefulness",
    fullDescription: "The 9 of Wands-Aya stands testament to the resilience of the wounded warrior, embracing the strength found in perseverance through adversity. Aya, symbolizing endurance and independence, reflects the card's message of standing firm despite being battle-weary. This card acknowledges the trials and scars of past struggles, urging you to summon your inner strength and prepare for the final push towards victory. It speaks to the need to realign your defenses and strategies, recognizing that true strength often comes from overcoming challenges. Balancing the determination of the wounded warrior with the wisdom to realign and adapt, the 9 of Wands-Aya encourages you to face the greatest challenges with resilience.",
    lightAspect: "Resilience, perseverance, courage, near completion",
    shadowAspect: "Wounded warrior, exhaustion, paranoia, stubbornness",
    inReadings: "You've been through much—gather your remaining strength for the final push to victory."
  },
  {
    id: "ten-wands",
    name: "10 of Wands",
    adinkraSymbol: "Ani Bere",
    adinkraMeaning: "Seriousness, diligence and commitment",
    fullDescription: "The 10 of Wands-Ani Bere confronts the fine line between being incapacitated by burdens and the choice to succumb to their weight. Ani Bere, symbolizing patience and endurance, mirrors the card's theme of facing overwhelming responsibilities with fortitude. This card captures the moment of feeling overburdened, challenging you to assess your limits and prioritize your well-being. It urges you to recognize when the load you carry hinders your progress, inviting a reassessment of commitments. Balancing the brink of incapacitation with the decision to succumb or lighten your load, the 10 of Wands-Ani Bere encourages finding strength in vulnerability and the wisdom to seek support, reminding you that endurance also lies in knowing when to let go.",
    lightAspect: "Responsibility, hard work, completion of cycle",
    shadowAspect: "Incapacitated, overburdened, martyrdom, burnout",
    inReadings: "The weight of responsibilities peaks—assess what truly needs carrying and what can be released."
  },
  {
    id: "boy-wands",
    name: "Boy of Wands",
    adinkraSymbol: "Pempamsie",
    adinkraMeaning: "Sew in readiness, preparedness and steadfastness",
    fullDescription: "The Boy of Wands-Pempamsie captures the essence of boundless vitality and the challenge of directionlessness. Pempamsie, symbolizing steadfastness and readiness to face life's battles, enhances the card's theme of dynamic energy and the courage to pursue one's passions. This card encourages you to ride the waves of your enthusiasm with the vitality of the knight, pushing forward with zeal. Yet, it warns against the perils of directionlessness, urging you to find your path, to channel your boundless energy into purposeful action, reminding you that true progress requires not just strength and courage but also a clear direction and resolve.",
    lightAspect: "Vitality, enthusiasm, adventure, fearless pursuit",
    shadowAspect: "Directionless, reckless, scattered energy",
    inReadings: "Channel your boundless energy with purpose—enthusiasm needs direction to achieve results."
  },
  {
    id: "girl-wands",
    name: "Girl of Wands",
    adinkraSymbol: "Dame-Dame",
    adinkraMeaning: "Checkered pattern, intelligence and ingenuity",
    fullDescription: "The Girl of Wands-Dame-Dame embodies the vibrant energy of youth, marked by a charming enthusiasm and a capricious nature. Dame-Dame, symbolizing intelligence and ingenuity, reflects the card's spirit of adventure and curiosity. This card invites you to explore with an open heart and a keen mind, embracing new ideas with the charm and eagerness of the Page. However, it also cautions against the whims of capriciousness, reminding you to ground your enthusiasm with purpose. The Page of Wands-Dame-Dame encourages you to channel your spontaneity into constructive exploration, balancing the allure of new ventures with thoughtful consideration, ensuring that your journey is both enchanting and enlightening.",
    lightAspect: "Charming, curious, adventurous, creative spark",
    shadowAspect: "Capricious, unreliable, scattered interests",
    inReadings: "A spark of inspiration arrives—explore with enthusiasm while grounding your ideas in purpose."
  },
  {
    id: "woman-wands",
    name: "Woman of Wands",
    adinkraSymbol: "Nyansapo",
    adinkraMeaning: "Wisdom knot, wisdom, ingenuity and patience",
    fullDescription: "The Woman of Wands-Nyansapo embodies the essence of being quintessentially vibrant and charismatic, while also navigating the fine line where such qualities might verge into toxicity. Nyansapo, which symbolizes wisdom and a deep understanding, enhances the Queen's characteristics of dynamism and leadership. This card represents a person who radiates confidence, creativity, and an infectious enthusiasm, often becoming a central figure in any activity due to her compelling nature. However, the inclusion of Nyansapo also underscores the necessity of using wisdom to temper these powerful attributes, cautioning against the potential for her intensity to become overpowering or toxic. The Queen of Wands-Nyansapo encourages you to embrace and channel your natural charisma and leadership in ways that uplift others, utilizing wisdom to ensure that your influence remains positive and nurturing, rather than overwhelming or destructive.",
    lightAspect: "Charismatic, confident, inspiring leader, warmth",
    shadowAspect: "Toxic intensity, overbearing, manipulative charm",
    inReadings: "Embrace your natural magnetism and leadership while using wisdom to uplift rather than overwhelm."
  },
  {
    id: "man-wands",
    name: "Man of Wands",
    adinkraSymbol: "Nea Ope Se Obedi Hene",
    adinkraMeaning: "He who wants to be king, ambition and leadership",
    fullDescription: "The Man of Wands-Nea Ope Se Obedi Hene captures the dual nature of achieving superlative success while being mindful not to suffocate others with overpowering leadership. Nea Ope Se Obedi Hene, meaning 'he who wants to be king,' symbolizes the ambition and authority necessary for leadership, aligning perfectly with the King's vibrant and commanding presence. This card represents a leader who excels in driving initiatives and inspiring others, embodying the pinnacle of achievement and influence. However, the title also serves as a reminder of the responsibilities that come with power, urging the King to govern his domain with foresight and compassion, ensuring that his drive for success does not stifle or dominate those he leads. The King of Wands-Nea Ope Se Obedi Hene encourages a leadership style that is both ambitious and considerate, allowing room for others to grow and thrive under his guidance without being overwhelmed or constrained by his powerful persona.",
    lightAspect: "Superlative leadership, visionary, inspiring, ambitious",
    shadowAspect: "Suffocating control, ego-driven, tyrannical",
    inReadings: "Lead with vision and ambition while creating space for others to flourish alongside you."
  },

  // ============ CUPS SUIT ============
  {
    id: "ace-cups",
    name: "Ace of Cups",
    adinkraSymbol: "Mpatapo",
    adinkraMeaning: "Knot of reconciliation, peacemaking and unity",
    fullDescription: "The Ace of Cups is a card that represents new beginnings in emotional or spiritual realms, overflowing with love, joy, and compassion. It symbolizes the potential for deep emotional connections, emotional renewal, and the start of a journey that fills the heart with pure, unconditional love. Mpatapo symbolizes reconciliation, peacemaking, and the knot that binds people together after conflict. It represents the ideals of harmony, unity, and collective peace, emphasizing the importance of coming together amidst our differing differences. The Ace of Cups-Mpatapo encourages you to open your heart to new emotional experiences and to foster unity and reconciliation in your relationships. By nurturing your own emotional health and striving for collective harmony, you create a foundation for lasting peace and joy, both within yourself and in your community. This combination underscores the interconnectedness of self-care and the collective good, highlighting the transformative power of love and unity.",
    lightAspect: "New love, emotional renewal, compassion, spiritual connection",
    shadowAspect: "Blocked emotions, emptiness, emotional unavailability",
    inReadings: "A new emotional or spiritual beginning opens—embrace love and reconciliation."
  },
  {
    id: "two-cups",
    name: "2 of Cups",
    adinkraSymbol: "Akoka Sun",
    adinkraMeaning: "The hen treads on her chicks but does not kill them",
    fullDescription: "The 2 of Cups-Akoka Sun beautifully captures the dynamics of attraction and the challenges of repulsion within relationships. Akoka Sun, symbolizing the heart and the nature of love's endurance, underscores the essence of emotional exchange and the delicate balance they require. This card represents the potential for deep, mutual affection, encouraging the union of hearts with shared understanding and empathy. However, it also cautions against the forces that can repel and divide, reminding you that even the strongest bonds require maintenance and mutual respect to thrive. The 2 of Cups-Akoka Sun invites you to embrace the complexities of relationships, striving for harmony while navigating the inevitable resilience and the journey towards a more authentic self.",
    lightAspect: "Attraction, partnership, mutual respect, union",
    shadowAspect: "Repulsion, discord, imbalanced relationships",
    inReadings: "A meaningful connection forms—nurture it with mutual respect and understanding."
  },
  {
    id: "three-cups",
    name: "3 of Cups",
    adinkraSymbol: "Dono",
    adinkraMeaning: "The drum, celebration and communal gathering",
    fullDescription: "The 3 of Cups-Dono encapsulates the jubilant spirit of celebration alongside the potential excesses of bacchanal. Dono, symbolizing the drum and the heartbeat of communal gatherings, vibrates with the rhythm of joy and shared happiness. This card celebrates the beauty of friendship, successful collaborations, and social enjoyment, highlighting moments where hearts align in festive harmony. Yet, it also warns against overindulgence, where the revelry can lead to discord and loss of focus. The 3 of Cups-Dono encourages moderation within merriment, urging you to partake in the communal spirit of joy while maintaining a balance that keeps the true essence of celebration—connection and mutual upliftment—at the forefront.",
    lightAspect: "Celebration, friendship, community, joyful gatherings",
    shadowAspect: "Excess, overindulgence, gossip, superficial connections",
    inReadings: "Celebrate with your community while maintaining balance and genuine connection."
  },
  {
    id: "four-cups",
    name: "4 of Cups",
    adinkraSymbol: "Menso Wo Kenten",
    adinkraMeaning: "I carry your basket, traditionally signifying support and service",
    fullDescription: "The 4 of Cups-Menso Wo Kenten captures the subtle dance between complacency and narcissism. Menso Wo Kenten, translating to 'I carry your basket,' traditionally signifies support and service to others, offering a counterbalance to the self-centered attitudes depicted in this card. The 4 of Cups typically shows a figure disinterested or disillusioned with the cups presented, symbolizing complacency and a lack of appreciation for what is already possessed. However, this card also warns against slipping into narcissism, where self-absorption can further disconnect one from both the joy and the responsibilities of life. The 4 of Cups-Menso Wo Kenten encourages you to re-engage with your environment and the people in it, reminding you of the value in service and the fulfillment that can come from supporting and interacting with others, countering the isolating effects of complacency and narcissism.",
    lightAspect: "Contemplation, reassessment, meditation, seeking meaning",
    shadowAspect: "Complacency, narcissism, apathy, missed opportunities",
    inReadings: "Step out of self-absorption and re-engage with the opportunities around you."
  },
  {
    id: "five-cups",
    name: "5 of Cups",
    adinkraSymbol: "Mmere Dane",
    adinkraMeaning: "Time changes, the dynamics of life",
    fullDescription: "The 5 of Cups-Mmere Dane weaves the themes of regret and self-pity with the passage of time and change. Mmere Dane, symbolizing time and its transformative power, offers perspective on the nature of loss and the emotional trials that often follow. This card reflects moments of mourning and disappointment, where one might dwell on what has been lost, succumbing to feelings of regret and self-pity. However, it also encourages embracing the flow of time as a healer, reminding you that current sorrows will shift and lessen as new experiences and opportunities emerge. The 5 of Cups-Mmere Dane invites you to look beyond immediate grief, urging you to find resilience in the face of setbacks and to prepare for the renewal that time inevitably brings.",
    lightAspect: "Processing grief, learning from loss, emotional healing",
    shadowAspect: "Regret, self-pity, dwelling on the past, despair",
    inReadings: "Allow time to heal your grief while remaining open to the new opportunities ahead."
  },
  {
    id: "six-cups",
    name: "6 of Cups",
    adinkraSymbol: "Yebehyia Bio",
    adinkraMeaning: "We shall meet again, hope and reunion",
    fullDescription: "The 6 of Cups-Yebehyia Bio captures the essence of soulful nostalgia alongside the shadow of past conflicts or adversities. Yebehyia Bio, symbolizing 'We shall meet again,' embraces the warmth of fond memories and the reconnection with past relationships that shaped us. This card invites you to reflect on past joys and lessons learned from old encounters, embracing the comfort and wisdom that such reflections bring. However, it also cautions about the potential for unresolved issues or nemeses from the past to resurface, challenging you to confront or reconcile lingering conflicts. The 6 of Cups-Yebehyia Bio encourages embracing the positive aspects while being prepared to face and resolve any unfinished business, fostering growth and deeper understanding.",
    lightAspect: "Nostalgia, fond memories, reunion, innocence",
    shadowAspect: "Living in the past, unresolved conflicts, naivety",
    inReadings: "Cherish meaningful memories while resolving any unfinished business from the past."
  },
  {
    id: "seven-cups",
    name: "7 of Cups",
    adinkraSymbol: "Tuo Ne Akofena",
    adinkraMeaning: "Gun and state sword, legitimate authority",
    fullDescription: "The 7 of Cups is traditionally a card of options, dreams, and sometimes illusions. It presents a multitude of paths and possibilities, each cup holding different symbols that can represent hopes, fears, temptations, and fantasies. This card challenges you to discern what is real and beneficial from what is merely an illusion or distraction. Tuo Ne Akofena symbolizes the dual aspects of power and authority, often associated with the weight of responsibility and the potential for conflict. This symbol underscores the importance of making choices with awareness of their power and the possible conflicts or challenges they may bring. Understand that your choices carry significant weight. Be mindful of the responsibility that comes with making decisions; like wielding weapons, decisions should be made with awareness and respect for their potential impact. Strive for clarity and avoid being swayed by illusions or superficial attractions. Focus on what truly matters and what will lead to the best outcomes. The 7 of Cups-Tuo Ne Akofena encourages you to approach your options with a balanced mind, recognizing the potential power and consequence of each choice.",
    lightAspect: "Options, imagination, dreams, possibilities",
    shadowAspect: "Illusion, fantasy, wishful thinking, confusion",
    inReadings: "Many options present themselves—use discernment to separate reality from illusion."
  },
  {
    id: "eight-cups",
    name: "8 of Cups",
    adinkraSymbol: "Wawa Aba",
    adinkraMeaning: "Seed of the wawa tree, hardiness and perseverance",
    fullDescription: "The 8 of Cups-Wawa Aba addresses the themes of departure and abandonment with the strength and resilience symbolized by the Wawa Aba, which represents the seed of the wawa tree known for its hardness and toughness. This card signifies a necessary journey of leaving behind what no longer serves you, highlighting the courage it takes to walk away from familiar yet unfulfilling situations. While the act of departure can feel like abandonment, it is often a step towards personal growth and self-discovery. The 8 of Cups-Wawa Aba encourages you to embrace the strength required for such transitions, trusting in your resilience and the journey towards a more authentic self.",
    lightAspect: "Departure, seeking deeper meaning, spiritual journey",
    shadowAspect: "Abandonment, running away, fear of change",
    inReadings: "It's time to leave behind what no longer serves your growth—trust the journey ahead."
  },
  {
    id: "nine-cups",
    name: "9 of Cups",
    adinkraSymbol: "Kintinkantan",
    adinkraMeaning: "Puffed up extravagance, arrogance",
    fullDescription: "The 9 of Cups-Kintinkantan captures the balance between being reputable and the temptation to descend into vanity. Kintinkantan, symbolizing puffery or exaggerated pride, highlights the contrast between genuine self-achievement and the allure of vanity. This card reflects a moment of achievement and contentment, where desires are met, and emotional fulfillment is abundant. However, it warns against the pitfalls of becoming too boastful or indulging in the external validation that can detract from true happiness. The 9 of Cups-Kintinkantan invites you to enjoy your successes with humility, maintaining dignity while celebrating your achievements, thus preserving the reputation of being gracious rather than falling into the trappings of vanity.",
    lightAspect: "Contentment, satisfaction, wishes fulfilled, emotional security",
    shadowAspect: "Vanity, complacency, smugness, superficial happiness",
    inReadings: "Enjoy your accomplishments with gratitude while avoiding the trap of vanity."
  },
  {
    id: "ten-cups",
    name: "10 of Cups",
    adinkraSymbol: "Bese Saka",
    adinkraMeaning: "Bunch of cola nuts, affluence and abundance",
    fullDescription: "The 10 of Cups-Bese Saka artfully blends themes of prosperity with the risks of indulgence. Bese Saka, symbolizing affluence and abundance, particularly through the trade of kola nuts, reflects the card's portrayal of emotional and material riches. This card symbolizes the pinnacle of happiness in relationships, marking a period of great prosperity in personal connections and domestic bliss. However, it also cautions against the dangers of overindulgence, where too much of a good thing can lead to complacency or neglect of deeper emotional needs. The 10 of Cups-Bese Saka encourages you to cherish and nurture the wealth of your relationships while maintaining balance and appreciating the true value of emotional bonds without excess.",
    lightAspect: "Prosperity, emotional fulfillment, harmonious family, joy",
    shadowAspect: "Indulgence, complacency, taking blessings for granted",
    inReadings: "Emotional abundance surrounds you—cherish these blessings while maintaining balance."
  },
  {
    id: "boy-cups",
    name: "Boy of Cups",
    adinkraSymbol: "Agyinduwura",
    adinkraMeaning: "Agyin the herald's drum, faithfulness",
    fullDescription: "The Boy of Cups is a card that embraces romanticism, idealism, and the pursuit of emotional and creative fulfillment. This card often represents a person who is deeply devoted to their passions and guided by their heart, embarking on quests for love, art, or spiritual enlightenment. Agyinduwura symbolizes reliability, trustworthiness, and the interpretation of being responsible and dependable. It reflects the value of integrity and the trust placed in someone who is considered steadfast and accountable. The Knight of Cups-Agyinduwura encourages you to follow your heart and pursue your dreams with dedication and passion, while also maintaining a foundation of reliability and responsibility. This combination underscores the importance of integrity in your emotional and creative journeys, ensuring that your devotion leads to meaningful and respected experiences.",
    lightAspect: "Romanticism, idealism, following your heart, devotion",
    shadowAspect: "Unrealistic expectations, moodiness, escapism",
    inReadings: "Follow your heart with integrity—let your devotion guide meaningful pursuits."
  },
  {
    id: "girl-cups",
    name: "Girl of Cups",
    adinkraSymbol: "Fafanto",
    adinkraMeaning: "Butterfly, tenderness and gentleness",
    fullDescription: "The Girl of Cups-Fafanto delicately explores the dual aspects of being a confidant and the risk of engaging in gossip. Fafanto, symbolizing the butterfly, reflects the transformational and sometimes fleetingly nature of messages and communication. This card often depicts a young or less experienced individual, representing an openness to emotional experiences and the capacity to empathize deeply, making him a natural confidant. However, the butterfly's symbolism also cautions against the lightness with which words can be spread, leading to gossip if not handled with care. The Page of Cups-Fafanto encourages you to cherish the trust placed in you as a confidant, using your empathy and emotional insight to support others without turning to the gossip that can easily flutter away and cause unintended harm.",
    lightAspect: "Confidant, intuitive, creative inspiration, emotional openness",
    shadowAspect: "Gossip, emotional immaturity, naivety",
    inReadings: "Honor the trust placed in you—use your emotional sensitivity to support, not spread gossip."
  },
  {
    id: "woman-cups",
    name: "Woman of Cups",
    adinkraSymbol: "Osram Ne Nsoromma",
    adinkraMeaning: "The moon and star, love and faithfulness",
    fullDescription: "The Woman of Cups-Osram Ne Nsoromma delicately balances the nurturing essence of a matriarch with the darker undertones of an 'evil stepmother.' Osram Ne Nsoromma, symbolizing the moon and star, reflects the deep emotional and intuitive nature of the Queen, who is often seen as a compassionate, caring figure with a strong connection to her family and community, much like a matriarch. However, this card also explores the complexities of such a role, where overprotection or manipulation can mirror traits associated with the archetype of the evil stepmother, using emotional intelligence for less benevolent purposes. The Queen of Cups-Osram Ne Nsoromma invites you to embrace the depth of your emotional wisdom and nurturing abilities, guiding you to use these powers to heal and support others genuinely. It urges a balance between caring and controlling, highlighting the importance of fostering independence and well-being in loved ones without succumbing to the temptations of manipulating or smothering them with affection. This portrayal encourages maintaining a nurturing spirit that supports without overshadowing, ensuring that your emotional influence remains a source of comfort and growth rather than constraint.",
    lightAspect: "Nurturing matriarch, emotional wisdom, intuitive healer",
    shadowAspect: "Overprotection, manipulation, emotional control",
    inReadings: "Use your emotional wisdom to nurture without controlling—support independence in others."
  },
  {
    id: "man-cups",
    name: "Man of Cups",
    adinkraSymbol: "Kete Pa",
    adinkraMeaning: "Good bed, good marriage and marital fidelity",
    fullDescription: "The Man of Cups-Kete Pa masterfully balances the dignified role of a patriarch with the potential deception of a charlatan. Kete Pa, symbolizing excellence and the highest standards, reflects the King's ability to govern his emotions and offer wise, compassionate guidance. This combination underscores the King's role as a caring leader, providing emotional support and stability to those around him. In the tarot, the King of Cups is known for his emotional intelligence, calm demeanor, and ability to navigate complex emotional landscapes with grace. However, this card also warns against the potential misuse of such abilities. The presence of Kete Pa suggests the importance of maintaining integrity and excellence in leadership, avoiding the pitfalls of manipulation or deceit, which could turn a respected patriarch into a charlatan. The King of Cups-Kete Pa encourages you to lead with both genuine compassion and wisdom, ensuring that your actions and decisions uphold the highest standards of integrity. It serves as a reminder that true leadership is grounded in authenticity and emotional truth, steering clear of the temptations to use one's emotional insight for personal gain or manipulation. This card urges a commitment to excellence in all interactions, fostering trust and respect within your community or family.",
    lightAspect: "Patriarch, emotional mastery, wise counselor, integrity",
    shadowAspect: "Charlatan, emotional manipulation, deception",
    inReadings: "Lead with emotional wisdom and integrity—avoid the temptation to manipulate."
  },

  // ============ MAJOR ARCANA (from guidebook) ============
  {
    id: "magician",
    name: "The Magician",
    adinkraSymbol: "Ananse Ntentan",
    adinkraMeaning: "Spider's web, wisdom, creativity, and the complexities of life",
    fullDescription: "Harnessing the cunning and creativity of Ananse the Spider, the Magician-Ananse Ntentan card embodies the essence of transformation and resourcefulness. Ananse Ntentan, symbolizing wisdom, creativity, and the complexities of life, mirrors the Magician's power to manifest reality from the intangible. With the infinite possibilities of the universe at his fingertips, the Magician stands in a space where potential meets the prowess to weave the web of fate. This card calls you to recognize your ability to utilize your skills, tools, and resources to achieve your desired outcomes, urging a mindful balance between action and adaptability. As Ananse weaves his web with purpose and precision, so are you encouraged to align your intentions with your actions, creating your destiny with the wisdom and ingenuity of the spider. In a reading, the Magician-Ananse Ntentan signifies a moment to harness your creativity, adaptability, and the power within to masterfully shape your journey, reminding you that your potential is as vast as the web of Ananse.",
    lightAspect: "Manifestation, resourcefulness, power, inspired action",
    shadowAspect: "Manipulation, poor planning, untapped talents",
    inReadings: "This card signifies a moment to harness your creativity and power to shape your destiny with wisdom and intention."
  },
  {
    id: "high-priestess",
    name: "The High Priestess",
    adinkraSymbol: "Hye Wonhye",
    adinkraMeaning: "That which cannot be burnt, imperishability and endurance",
    fullDescription: "Veiled in the serene light of the moon, the High Priestess-Hye Wonhye card is a beacon of inner resilience and indomitable spirit. Hye Wonhye, symbolizing endurance and the ability to overcome adversity without succumbing to despair, deeply resonates with the High Priestess's essence of intuition, mystery, and understanding beyond the visible realm. This card invites you into a sanctuary of introspection, where the quiet strength of the soul's flame burns without wavering, untouched by the external storms. It speaks to the power of inner knowledge and the resilience required to navigate life's trials with grace and wisdom. The High Priestess-Hye Wonhye serves as a guardian of the sacred space within, where all answers lie and where your inner light, once kindled, will never extinguish. In a reading, this card urges you to listen to the silent whispers of your intuition and to trust in your ability to endure and transcend, embodying the eternal flame of Hye Wonhye — a reminder that the spirit's light endures all shadows.",
    lightAspect: "Intuition, mystery, inner knowledge, the subconscious",
    shadowAspect: "Secrets, disconnection from intuition, withdrawal",
    inReadings: "This card urges you to trust your intuition and inner wisdom, knowing your spirit's light endures all challenges."
  },
  {
    id: "empress",
    name: "The Empress",
    adinkraSymbol: "Asase Ye Duru",
    adinkraMeaning: "The Earth has weight, the importance of the Earth and providence",
    fullDescription: "Embraced by the bountiful arms of nature, the Empress-Asase Ye Duru card flourishes under the principle of nurturing abundance and the sacredness of life. Asase Ye Duru, representing the earth's might and fertility, merges seamlessly with the Empress's symbolism of motherhood, creation, and sensual pleasure. This card embodies the essence of the Earth Mother, inviting you to ground yourself in the richness of the natural world, to sow your intentions with love, and to nurture them to fruition. The Empress-Asase Ye Duru is a testament to the endless cycle of growth, death, and rebirth, encouraging you to embrace the creative force within and around you, to honor the physical senses as gateways to spiritual enlightenment, and to acknowledge the divine feminine power as a source of strength and renewal. In readings, this card calls you to connect with the earth's wisdom, to cultivate beauty and harmony in your surroundings, and to trust in the natural flow of life, recognizing yourself as a vital part of the great tapestry of existence, where every act of care and creation is an homage to Asase Ye Duru's enduring vitality.",
    lightAspect: "Abundance, nurturing, fertility, nature, sensuality",
    shadowAspect: "Creative block, dependence, smothering",
    inReadings: "This card calls you to connect with nature's wisdom and embrace the creative, nurturing force within you."
  },
  {
    id: "emperor",
    name: "The Emperor",
    adinkraSymbol: "Ohen Adwae",
    adinkraMeaning: "King's throne, leadership and charisma",
    fullDescription: "Commanding the landscape before him, the Emperor-Ohen Adwae stands as a figure of authority, discipline, and unwavering leadership. Ohen Adwae, symbolizing leadership and charisma, aligns with the Emperor's embodiment of order, structure, and paternal guidance. This card heralds a period of establishing control over one's environment through wisdom, strategic planning, and the charismatic ability to lead and inspire others. Like the Ohen Adwae, which represents the potency and respect accorded to a leader, the Emperor-Ohen Adwae invites you to assert your authority with confidence and to harness your innate leadership qualities to bring about stability and order. It emphasizes the importance of a balanced approach to leadership, one that is grounded in strength but tempered with understanding and compassion. In a reading, the Emperor-Ohen Adwae signifies a call to embrace your power, to structure your realm with purpose and foresight, and to lead by example, ensuring that your influence is both empowering and benevolent.",
    lightAspect: "Authority, structure, leadership, stability, protection",
    shadowAspect: "Domination, rigidity, lack of empathy",
    inReadings: "This card signifies a call to embrace your power and lead with wisdom, structure, and compassion."
  },
  {
    id: "hierophant",
    name: "The Hierophant",
    adinkraSymbol: "Mpuannun",
    adinkraMeaning: "Four tufts of hair, priestly office, loyalty, adroitness",
    fullDescription: "Seated at the crossroads of ancient wisdom and communal faith, the Hierophant-Mpuaanum embodies the bridge between the divine and the earthly, guiding souls towards enlightenment through shared rituals and teachings. Mpuaanum, representing priestly office, loyalty, and adroitness, mirrors the Hierophant's role as a spiritual mediator, offering a pathway to understanding through the wisdom of the collective. This card invites you to explore the depths of your beliefs and to find solace and strength in the traditions and rituals that bind your community together. It speaks to the power of unity in diversity, encouraging an embrace of the multiple strands of wisdom that weave the fabric of spiritual understanding. The Hierophant-Mpuaanum serves as a guardian of sacred knowledge, urging you to delve into the rituals and symbols that have shaped your spiritual journey, to question and learn, and to find your place within the broader tapestry of belief. In a reading, this card suggests a period of learning or adherence to traditional values and approaches, highlighting the importance of guidance, mentorship, and the wisdom passed down through generations, as encapsulated by the enduring legacy of Mpuaanum.",
    lightAspect: "Tradition, spiritual wisdom, conformity, education, mentorship",
    shadowAspect: "Dogma, restriction, challenging the status quo",
    inReadings: "This card suggests a period of spiritual learning and connection to traditional wisdom and community guidance."
  },
  {
    id: "lovers",
    name: "The Lovers",
    adinkraSymbol: "Odo Nnyew Fie Kwan",
    adinkraMeaning: "Love never loses its way home",
    fullDescription: "In the sacred dance of union, The Lovers-Odo Nnyew Fie Kwan card blossoms with the promise of deep emotional connections, the choices that define us, and the paths that lead to the heart's true home. Odo Nnyew Fie Kwan, symbolizing the power of love to find its way, complements The Lovers' theme of relationships, harmony, and moral decisions. This card encapsulates the journey of love — not just in romantic partnerships but in all forms of human connection that challenge us to grow and evolve. It urges you to follow the compass of your heart, reminding you that love's true essence has the power to transcend obstacles and guide you home, no matter the distance or challenges faced. The Lovers-Odo Nnyew Fie Kwan invites an exploration of your values and the choices before you, encouraging a balance between desire and duty, individuality and union. In readings, this card signals a moment of significant emotional choices, the potential for harmonious relationships, and the universal quest to find a place where love's light never fades — embodying the unerring direction of Odo Nnyew Fie Kwan, leading you to where you truly belong.",
    lightAspect: "Love, harmony, relationships, values, choices",
    shadowAspect: "Disharmony, imbalance, misaligned values",
    inReadings: "This card signals a moment of significant emotional choices and the potential for deep, harmonious connections."
  },
  {
    id: "hermit",
    name: "The Hermit",
    adinkraSymbol: "Owo Foro Adobe",
    adinkraMeaning: "Snake climbing the palm tree, perseverance and prudence",
    fullDescription: "Shrouded in the quietude of self-discovery, The Hermit-Owo Foro Adobe stands as a beacon of introspection and inner wisdom. Owo Foro Adobe, symbolizing patience and the search for deeper knowledge, complements The Hermit's quest for understanding and enlightenment. This card invites you into the solitude of your inner sanctum, encouraging a pause in the relentless pursuit of external achievements to turn your gaze inward. It speaks to the journey of the soul, navigating through the shadows of the self to uncover truths that lie hidden beneath the surface. The Hermit-Owo Foro Adobe embodies the wisdom that comes from solitude, the patience required for profound reflection, and the courage to confront one's own depths. It urges you to embrace the stillness, to listen to the whisper of your inner voice, and to find solace in solitude as you weave the threads of wisdom gathered along the path of self-discovery. In readings, this card symbolizes a period of introspection, spiritual seeking, and the invaluable insights that emerge from embracing the journey within, echoing the resilience and perseverance symbolized by Owo Foro Adobe in facing the challenges of self-exploration.",
    lightAspect: "Introspection, soul-searching, inner guidance, solitude",
    shadowAspect: "Isolation, loneliness, withdrawal",
    inReadings: "This card symbolizes a period of introspection and spiritual seeking, urging you to embrace inner wisdom."
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    adinkraSymbol: "Mmusuyidee",
    adinkraMeaning: "Good fortune, sanctity",
    fullDescription: "Embodying the essence of life's fluctuating fortunes and the unwavering spirit of optimism that propels us forward, Mmusuyidee, symbolizing good fortune and sanctity, harmonizes with the Wheel of Fortune's theme of cyclical change, reminding us that each turn of the wheel brings a new phase of opportunities and challenges. This card embodies the perpetual motion of the universe and the constant interplay between fate and free will. It teaches that while the wheel turns according to its own rhythm, our actions and attitudes can influence the direction and quality of our journey. The Wheel of Fortune-Mmusuyidee invites you to embrace change with hope and to recognize the sanctity in the cycles of life, encouraging an outlook that sees beyond the momentary ups and downs to the bigger picture of growth and renewal. In readings, this card suggests a turning point, offering a moment to reflect on the transient nature of circumstances and the power of a positive mindset to attract serendipity, echoing the promise of Mmusuyidee for renewal and blessed transformations.",
    lightAspect: "Change, cycles, fate, turning point, luck",
    shadowAspect: "Bad luck, resistance to change, broken cycles",
    inReadings: "This card suggests a turning point and reminds you to embrace change with hope and optimism."
  },
  {
    id: "justice",
    name: "Justice",
    adinkraSymbol: "Sepow",
    adinkraMeaning: "Justice, the execution of judicial matters",
    fullDescription: "Enshrined in the clarity of truth and the unwavering scales of justice, the Justice-Sepow card stands as a testament to the pursuit of fairness, accountability, and the resolution of moral dilemmas. Sepow, symbolizing justice and the execution of judicial matters, echoes the Justice card's themes of karmic balance, ethical decision-making, and the consequences of our actions. This card invites you to weigh your choices with careful consideration, to seek honesty in your dealings, and to stand firm in the face of injustice. It embodies the principle that true justice combines wisdom with compassion, reminding us that each decision we make contributes to the fabric of our collective destiny. The Justice-Sepow encourages a reflection on the laws of cause and effect, the importance of integrity in establishing harmony, and the courage it takes to uphold what is right. In readings, this card signifies a time of judgment or decision-making that requires a clear understanding of both the facts and the ethical implications, urging you to act with fairness and to trust in the just nature of the universe, as represented by the symbol Sepow — a guardian of equity and moral righteousness.",
    lightAspect: "Fairness, truth, cause and effect, clarity",
    shadowAspect: "Unfairness, lack of accountability, dishonesty",
    inReadings: "This card signifies a time of judgment and decision-making, urging you to act with fairness and integrity."
  },
  {
    id: "hanged-man",
    name: "The Hanged Man",
    adinkraSymbol: "Sankofa",
    adinkraMeaning: "Go back and get it, learning from the past",
    fullDescription: "Suspended in a moment of serene surrender, The Hanged Man-Sankofa card embodies the profound truths discovered in the spaces between action and stillness. Sankofa, symbolizing the importance of learning from the past to improve the future, intertwines with The Hanged Man's message of letting go, pausing to reflect, and seeing the world from a new perspective. This card invites you on a journey of introspection, urging you to explore the depths of your experiences and to draw wisdom from lessons already learned. It speaks to the power of revisiting our roots, understanding our past, and using those insights to inform our path forward. The Hanged Man-Sankofa teaches that sometimes, progress requires us to pause, to reconsider our direction, and to embrace the wisdom that comes only from looking back with an open heart and mind. In readings, this card suggests a period of voluntary pause, a time to reflect on what has been in order to better navigate what will be, emphasizing the transformative power of embracing our history with the intent of crafting a more insightful and enlightened future.",
    lightAspect: "Surrender, new perspective, letting go, pause",
    shadowAspect: "Stalling, resistance, indecision",
    inReadings: "This card suggests a period of pause and reflection, drawing wisdom from the past to navigate the future."
  },
  {
    id: "death",
    name: "Death",
    adinkraSymbol: "Owuo Atwedee",
    adinkraMeaning: "The ladder of death, mortality and transition",
    fullDescription: "Shrouded in the inevitability of change, the Death-Owuo Atwedee card unveils the stark beauty of endings and the promise of new beginnings. Owuo Atwedee, symbolizing the ladder to the afterlife, echoes the Death card's themes of transition, closure, and metamorphosis. This card is a harbinger of the inevitable transformations that come with life's cycles, reminding us that with every ending, there is a new dawn on the horizon. It encourages you to release the old, to embrace the uncertainty of change, and to trust in the renewal that follows decay. The Death-Owuo Atwedee stands as a testament to the resilience of the spirit, urging you to view transformations not as endings but as passages to new phases of growth and understanding. In readings, this card suggests a period of significant change, a time to let go of what no longer serves you, and to prepare for the rebirth that awaits. It is a reminder that the journey through the shadow of death leads to the light of awakening, symbolized by the ascent on Owuo Atwedee — a climb towards enlightenment and the unending cycle of life's profound transformations.",
    lightAspect: "Transformation, endings, change, transition, rebirth",
    shadowAspect: "Resistance to change, fear, stagnation",
    inReadings: "This card suggests a period of significant change, a time to let go and prepare for rebirth."
  },
  {
    id: "temperance",
    name: "Temperance",
    adinkraSymbol: "Sesa Wo Suban",
    adinkraMeaning: "Change or transform your character",
    fullDescription: "Bathed in the light of equilibrium and renewal, the Temperance-Sesa Wo Suban card symbolizes the art of blending and balancing, the alchemy of transformation that leads to wholeness. Sesa Wo Suban, representing change and the importance of altering one's life for the better, perfectly mirrors Temperance's message of finding the middle path, harmonizing disparate elements, and fostering inner peace through self-reflection and adaptation. This card invites you to pour your energies into the crucible of life with mindfulness and purpose, to mix the ingredients of your existence with wisdom, and to emerge renewed, with a clearer understanding of your path and purpose. It speaks to the continuous process of self-evaluation and transformation, urging you to embrace the flow of life's changes with grace and to align your external actions with your internal growth. The Temperance-Sesa Wo Suban encourages patience, adaptability, and the delicate art of living in harmony with oneself and the world, reminding you that true balance is achieved through constant motion and the willingness to transform. In readings, this card signifies a time of healing, moderation, and the beneficial integration of aspects of your life, guiding you towards a state of deeper self-awareness and balanced tranquility.",
    lightAspect: "Balance, moderation, patience, purpose, harmony",
    shadowAspect: "Imbalance, excess, lack of long-term vision",
    inReadings: "This card signifies a time of healing and integration, guiding you towards balance and self-transformation."
  },
  {
    id: "devil",
    name: "The Devil",
    adinkraSymbol: "Nea Ope Se Obedi Hene",
    adinkraMeaning: "He who wants to be king, leadership through service",
    fullDescription: "Enshrouded in the chains of temptation, The Devil-Nea Ope Se Obedi Hene card serves as a stark reminder of the dual nature of power and the ease with which one can become enslaved by one's desires. Nea Ope Se Obedi Hene, symbolizing those who choose service over dominion and the dignified bearing of leadership, contrasts with The Devil's themes of bondage, materialism, and the shadow side of succumbing to lesser instincts. This card challenges you to confront the aspects of your life where you may be giving away your power, whether through addiction, materialism, or the pursuit of control over others. It calls for a deep reflection on the nature of true leadership and the strength found in self-mastery and the service of others. The Devil-Nea Ope Se Obedi Hene urges you to break free from the chains of your own making, to rise above the illusions of power that bind, and to embrace a leadership style that is rooted in integrity, compassion, and the uplifting of those around you. In readings, this card warns of the potential for self-imposed limitations and the need for introspection to reclaim one's autonomy, urging a return to the noble path of leading by example and wielding power with a sense of responsibility and humility.",
    lightAspect: "Breaking free, reclaiming power, detachment",
    shadowAspect: "Bondage, addiction, materialism, helplessness",
    inReadings: "This card warns of self-imposed limitations and urges introspection to reclaim your autonomy."
  },
  {
    id: "tower",
    name: "The Tower",
    adinkraSymbol: "Mrammuo",
    adinkraMeaning: "The spiritual world, unseen energies",
    fullDescription: "Engulfed in the lightning strike of revelation, The Tower-Mrammuo card captures the essence of cataclysmic change and the profound awakening that comes from confronting the invisible forces at play in our lives. Mrammuo, symbolizing the mysteries of the spiritual world and the influence of unseen energies, aligns with The Tower's themes of destruction, revelation, and the necessity of foundational upheaval. This card serves as a stark reminder that the structures we build, both literal and metaphorical, can be vulnerable to the forces beyond our immediate perception. It challenges you to consider the spiritual and intangible elements that you may have overlooked or taken for granted. The Tower-Mrammuo urges a reevaluation of beliefs, values, and the illusions of security that blind us to the truth. It speaks to the power of spiritual awakening, the liberation from confinements of the past, and the opportunity for growth through disruption. In readings, this card signifies a moment of shock that leads to clarity, the breakdown of false structures to reveal a deeper understanding of our lives and our path forward, guided by the often-invisible hand of spiritual forces.",
    lightAspect: "Sudden change, revelation, awakening, liberation",
    shadowAspect: "Disaster, upheaval, avoiding change, fear",
    inReadings: "This card signifies a moment of sudden revelation that clears away false structures for deeper truth."
  },
  {
    id: "star",
    name: "The Star",
    adinkraSymbol: "Nsoromma",
    adinkraMeaning: "Child of the heavens, stars as divine children",
    fullDescription: "Bathed in the serene light of hope and renewal, The Star-Nsoromma card glimmers with the promise of healing, inspiration, and the unbreakable bond between the individual and the cosmos. Nsoromma, symbolizing the stars as divine children watching over humanity, enhances The Star's themes of guidance, clarity, and the pursuit of one's highest potential. This card invites you to look upwards and within, to reconnect with the universal energy that flows through everything, reminding you that you are never alone in your journey. It speaks to the power of faith in the unseen, the comfort found in knowing that the stars—the Nsoromma—offer guidance and wisdom from above. The Star-Nsoromma encourages a deep breath of cosmic energy, a replenishment of hope and strength from the celestial realms, and the pursuit of your true purpose with the confidence that the universe supports your path. In readings, this card is a beacon of optimism, signifying a phase of spiritual and emotional healing, the renewal of faith, and the unfolding of blessings and potential, all under the watchful eyes of the Nsoromma, reminding us of our eternal connection to the divine spark within and all around us.",
    lightAspect: "Hope, faith, renewal, inspiration, serenity",
    shadowAspect: "Despair, disconnection, lack of faith",
    inReadings: "This card is a beacon of hope, signifying healing, renewal of faith, and divine guidance."
  },
  {
    id: "moon",
    name: "The Moon",
    adinkraSymbol: "Duafa",
    adinkraMeaning: "Wooden comb, beauty, care for oneself",
    fullDescription: "Shrouded in the silver veil of night, The Moon-Duafe card whispers of the deep, nurturing journey into the soul's shadowy realms, where the beauty of our inner truths lies waiting to be discovered. Duafe, symbolizing the wooden comb used in the care and grooming of one's hair, reflects the themes of The Moon by emphasizing the importance of tending to the inner self with the same care and attention we might give to our external appearance. This card invites you on a voyage of emotional and psychic exploration, encouraging you to comb through the tangled threads of your subconscious, to uncover and nurture the hidden aspects of your psyche. It speaks to the power of intuition and the moonlit path of self-discovery, where the mysteries of the soul are revealed under the nurturing gaze of the Duafe. The Moon-Duafe encourages you to embrace the cycles of your inner world, to listen to the whispers of your intuition, and to find beauty in the complexity of your emotions and dreams. In readings, this card suggests a time to pay attention to the undercurrents of your emotional landscape, to care for your inner self with compassion, and to trust in the process of uncovering the hidden treasures of your psyche, guided by the gentle and loving touch of Duafe.",
    lightAspect: "Intuition, illusion, dreams, the subconscious",
    shadowAspect: "Confusion, fear, misinterpretation",
    inReadings: "This card suggests a time of emotional exploration and trusting your intuition through uncertainty."
  },
  {
    id: "sun",
    name: "The Sun",
    adinkraSymbol: "Adinkrahene",
    adinkraMeaning: "Chief of Adinkra symbols, greatness, charisma, leadership",
    fullDescription: "Basking in the golden glow of achievement and clarity, The Sun-Adinkrahene card celebrates the zenith of personal power, the illumination of truth, and the inspirational force of exemplary leadership. Adinkrahene, the 'chief of the Adinkra symbols,' symbolizes greatness, charisma, and the influence of those who lead by example, mirroring The Sun's themes of enlightenment, vitality, and the joy that comes from true understanding. This card radiates the warmth of success, the brightness of clear-sighted goals, and the magnetic pull of positive role models who light the way for others. It invites you to step into your power, to embrace the clarity of your vision, and to lead with a heart full of joy and a spirit invigorated by purpose. The Sun-Adinkrahene encourages you to shine brightly, to share your light with the world, and to recognize the leadership qualities within yourself and others. In readings, this card signifies a time of great personal growth, happiness, and the positive influence that comes from embodying the principles of leadership, creativity, and the generous sharing of one's inner light, as exemplified by the regal essence of Adinkrahene.",
    lightAspect: "Joy, success, vitality, clarity, optimism",
    shadowAspect: "Temporary setbacks, lack of clarity, diminished joy",
    inReadings: "This card signifies a time of joy, success, and stepping into your authentic power and light."
  },
  {
    id: "chariot",
    name: "The Chariot",
    adinkraSymbol: "Woforo Dua Pa A",
    adinkraMeaning: "When you climb a good tree, support and cooperation",
    fullDescription: "Clad in the armor of willpower, The Chariot-Woforo Dua Pa A surges forward, embodying the essence of triumph through discipline and resolve. Woforo Dua Pa A, symbolizing excellence, perseverance, and the importance of seeking higher ideals, aligns with The Chariot's themes of conquest, control, and the vigor to overcome obstacles. This card is a clarion call to harness your inner strength, to steer the reins of your life with purpose and precision, and to drive towards your goals with unwavering determination. It celebrates the journey towards achievement, reminding you that the path to success is forged through effort, resilience, and the audacity to aim for the highest peak. The Chariot-Woforo Dua Pa A invites you to maintain your focus, to balance the forces within and without, and to push forward with confidence, knowing that perseverance is your key to unlocking the gates of excellence.",
    lightAspect: "Triumph, willpower, determination, control",
    shadowAspect: "Aggression, lack of direction, scattered energy",
    inReadings: "This card signifies a period of significant progress and momentum, urging you to remain steadfast in your resolve, to embody the spirit of Woforo Dua Pa A, and to embrace the rewards that come from pursuing your highest aspirations with courage and discipline."
  },
  {
    id: "strength",
    name: "Strength",
    adinkraSymbol: "Dwennimmen",
    adinkraMeaning: "Ram's horns, humility and strength",
    fullDescription: "Bathed in the golden light of courage and compassion, the Strength-Dwennimmen card emerges as a testament to the power of gentle assertiveness, inner calm, and the courage that comes from knowing oneself. Dwennimmen, symbolizing humility and strength, mirrors the essence of the Strength card, which represents not just physical power but the emotional and spiritual fortitude to face life's challenges with grace and patience. This card embodies the dual nature of strength, encouraging you to embrace your vulnerabilities as sources of power and to approach difficulties with a heart that is both open and resilient. It teaches that true strength lies in the balance between dominance and gentleness, urging you to wield your power with consideration and to lead with empathy. The Strength-Dwennimmen invites you on a journey of self-discovery, to cultivate courage not through force, but through understanding, patience, and the unwavering belief in the power of kindness.",
    lightAspect: "Inner strength, courage, patience, compassion",
    shadowAspect: "Self-doubt, weakness, lack of self-discipline",
    inReadings: "This card signifies a moment to assert your willpower softly, to trust in the strength of your character, and to remember that the most enduring power comes from a place of love and humility, as symbolized by the noble spirit of Dwennimmen."
  },
  {
    id: "judgement",
    name: "Judgement",
    adinkraSymbol: "Nyame Nnwu Na Mawu",
    adinkraMeaning: "God never dies, therefore I cannot die",
    fullDescription: "Echoing through the silent chambers of the soul, the Judgement-Nyame Nnwu Na Mawu card heralds a time of profound awakening and the realization of the soul's immortality. Nyame Nnwu Na Mawu, symbolizing the eternal nature of the human spirit and the divine essence that sustains it, complements the Judgement card's message of reflection, judgment, and the call to a higher purpose. This card invites you to stand before the mirror of your own being, to shed the layers of past mistakes and embrace the core of your truest self, reassured by the knowledge that the soul's journey is ever ongoing, guided by the divine. It speaks to the liberation that comes from self-realization, the joy of rebirth into a new understanding, and the call to rise to your full potential, knowing that your essence is eternal and divine. The Judgement-Nyame Nnwu Na Mawu encourages a moment of introspection and accountability, urging you to listen to the call of your higher self and to answer with a heart ready for transformation.",
    lightAspect: "Awakening, rebirth, inner calling, absolution",
    shadowAspect: "Self-doubt, refusal to change, harsh self-judgment",
    inReadings: "This card signifies a critical point of transition, a shedding of old ways for a rebirth into a new phase of spiritual awareness and purpose, echoing the unending cycle of death and renewal, underpinned by the everlasting presence of the divine, as symbolized by Nyame Nnwu Na Mawu."
  },
  {
    id: "fool",
    name: "The Fool",
    adinkraSymbol: "Nyame Nti",
    adinkraMeaning: "By God's grace, faith in God",
    fullDescription: "Stepping into the unknown with a heart full of optimism and eyes alight with wonder, The Fool-Nyame Nti card captures the essence of beginning anew, armed with unwavering faith and a trust in the divine guidance that leads us through life's journey. Nyame Nti, symbolizing trust and faith in a higher power, enriches The Fool's theme of new adventures, potential, and the purity of exploring life without preconceptions. This card invites you to embrace the journey ahead with an open heart and a soul ready to learn from every experience, guided by the belief that the universe has a plan for each of us. It speaks to the courage required to take the first step into uncharted territories, inspired by the confidence that comes from a deep-seated faith in the divine. The Fool-Nyame Nti encourages you to leap into the future with joy and anticipation, ready to embrace the lessons and blessings that come from living fully in the moment, trusting that every path, even those that lead into the unknown, is illuminated by the light of divine wisdom.",
    lightAspect: "New beginnings, innocence, spontaneity, faith",
    shadowAspect: "Naivety, recklessness, poor judgment",
    inReadings: "This card signifies a time of beginnings, urging you to proceed with both joy and trust, reminding you that with Nyame Nti, faith is your guide and protector on the journey of life, making every moment an opportunity for growth and discovery."
  },
  {
    id: "world",
    name: "The World",
    adinkraSymbol: "Mmere Dane",
    adinkraMeaning: "Time changes, the dynamics of life",
    fullDescription: "Encircled by the unending dance of completion and inception, The World-Mmere Dane card celebrates the culmination of a journey and the anticipation of new cycles to come. Mmere Dane, symbolizing the dynamism of time and the inevitability of change, mirrors The World's themes of achievement, wholeness, and the interconnectedness of all things through the flow of time. This card embodies the realization of potential, the satisfaction of efforts come to fruition, and the understanding that every end is merely the prelude to another beginning. It invites you to reflect on the path trodden, to savor the wisdom gained, and to look forward with hope to the future's infinite possibilities. The World-Mmere Dane encourages an embrace of life's cyclical nature, recognizing that time's passage brings growth, renewal, and the continuous opportunity to evolve.",
    lightAspect: "Completion, integration, accomplishment, wholeness",
    shadowAspect: "Incompletion, stagnation, lack of closure",
    inReadings: "This card signifies a moment of significant accomplishment and transition, offering a pause to celebrate your achievements while also preparing you for the next phase of your journey, guided by the ever-turning wheel of Mmere Dane, reminding us that in the grand tapestry of existence, every moment is precious and every ending is the seed of a new beginning."
  },

  // ============ SWORDS (Air) ============
  {
    id: "ace-swords",
    name: "Ace of Swords",
    adinkraSymbol: "Nea Onnim No Sua A, Ohu",
    adinkraMeaning: "He who does not know can know from learning",
    fullDescription: "The Ace of Swords-Nea Onnim No Sua A, Ohu blends the revelation of truth with the illusion of a mirage. This symbol, meaning 'He who does not know can know from learning,' highlights the card's emphasis on mental clarity, breakthroughs, and the discovery of truth. The Ace of Swords signifies a powerful beginning, where clear understanding cuts through confusion and deception, much like a sword slices through illusion. However, it also warns of the potential to be misled by mirages—false truths that seem real until closely examined. This card encourages you to pursue knowledge and truth diligently, using the sharpness of the sword to discern fact from fiction, ensuring that what you learn and act upon is based on reality and not mere illusion.",
    lightAspect: "Mental clarity, breakthrough, truth, new ideas",
    shadowAspect: "Confusion, misinformation, clouded judgment",
    inReadings: "This card encourages you to pursue knowledge diligently, using discernment to separate truth from illusion."
  },
  {
    id: "two-swords",
    name: "Two of Swords",
    adinkraSymbol: "Nyame Akruma",
    adinkraMeaning: "The spiritual world, mysteries they hold",
    fullDescription: "The 2 of Swords-Mrammuo encapsulates the tension between ambiguity and decisiveness. Mrammuo, symbolizing spiritual realms and the mysteries they hold, aligns with the card's theme of choices shrouded in uncertainty. This card depicts a moment of stalemate, requiring a decision yet hampered by limited visibility and conflicting information. It calls for inner balance and mental fortitude to cut through the fog of ambiguity. The 2 of Swords-Mrammuo urges you to draw upon your intuition and inner guidance to make a decision, encouraging a leap of faith into the decided, even when the path is not fully clear. This process highlights the necessity of choice and the courage it takes to trust one's judgment in the face of the unknown.",
    lightAspect: "Difficult decisions, weighing options, stalemate",
    shadowAspect: "Indecision, avoidance, information overload",
    inReadings: "This card urges you to trust your intuition and make a decision, even when the path forward is unclear."
  },
  {
    id: "three-swords",
    name: "Three of Swords",
    adinkraSymbol: "Odo Nnyew Fie Kwan",
    adinkraMeaning: "Love never loses its way home",
    fullDescription: "The 3 of Swords-Odo Nnyew Fie Kwan captures the poignant contrast between despair and the scorn of derision. Odo Nnyew Fie Kwan, translating to 'Love never loses its way home,' embodies the enduring, yet sometimes painful, nature of love and emotional connections. This card typically signifies heartbreak, betrayal, or emotional pain, reflecting a period of deep emotional turmoil and despair. However, it also cautions against the bitterness of derision, where scorn can arise from wounded feelings, further deepening the emotional rifts. The 3 of Swords-Odo Nnyew Fie Kwan urges you to navigate through pain with grace, seeking healing and forgiveness rather than succumbing to mockery or spite, reminding us that even through hurt, love's path can still lead us back to reconciliation and understanding.",
    lightAspect: "Heartbreak, grief, sorrow, painful truth",
    shadowAspect: "Recovery, forgiveness, releasing pain",
    inReadings: "This card urges you to navigate through emotional pain with grace, seeking healing rather than bitterness."
  },
  {
    id: "four-swords",
    name: "Four of Swords",
    adinkraSymbol: "Akoma",
    adinkraMeaning: "The heart, patience and tolerance",
    fullDescription: "The 4 of Swords-Akoma encapsulates the interplay between respite and rigor. Akoma, symbolizing the heart and often associated with patience and tolerance, reflects the card's theme of rest, meditation, and recovery. This card invites a pause from the battles of life, suggesting a necessary period of rest to restore one's mental and emotional strength. However, it also acknowledges the rigor required in such stillness—the discipline to truly disconnect and allow for healing rather than merely pausing without purpose. The 4 of Swords-Akoma encourages you to embrace this quiet time as a heart-centered retreat, where the rigor of genuine rest fosters deeper recovery and renewed readiness to face life's challenges.",
    lightAspect: "Rest, recovery, contemplation, recuperation",
    shadowAspect: "Restlessness, burnout, stagnation",
    inReadings: "This card encourages you to embrace rest as a heart-centered retreat for deeper recovery."
  },
  {
    id: "five-swords",
    name: "Five of Swords",
    adinkraSymbol: "Tumi Te Se Kosua",
    adinkraMeaning: "The power of the egg is its truth",
    fullDescription: "The 5 of Swords-Tumi Te Se Kosua explores the interplay between being recalcitrant—stubbornly resistant to authority or control—and adopting a realistic approach to conflict. Tumi Te Se Kosua, translating to 'the power of the egg is its truth,' reflects the delicate nature of truth and the consequences of handling situations with either honesty or deception. In tarot, the 5 of Swords often represents a hollow victory, achieved through deceit or manipulation, potentially leading to future conflicts or a loss of relationships. The addition of Tumi Te Se Kosua emphasizes the importance of handling truths carefully, much like handling an egg, suggesting that victory or resolution in conflicts should be approached with integrity and a realistic understanding of the situation. This card warns of the dangers of winning at all costs and encourages a reassessment of what is truly valuable in disputes.",
    lightAspect: "Conflict, defeat, winning at a cost",
    shadowAspect: "Reconciliation, making amends, moving on",
    inReadings: "This card warns against hollow victories and encourages seeking resolutions that respect relationships and trust."
  },
  {
    id: "six-swords",
    name: "Six of Swords",
    adinkraSymbol: "Tabono",
    adinkraMeaning: "Oar, strength and perseverance",
    fullDescription: "The 6 of Swords-Tabono masterfully navigates the journey from challenge to safer shores, encapsulated by the concepts of delivery and running the gauntlet. Tabono, symbolizing strength and perseverance, represented by the oar, aligns perfectly with the card's themes of transition and movement towards relief. This card depicts a passage through difficulties, suggesting a time of facing and overcoming obstacles, akin to running a gauntlet. However, it also promises delivery—moving to a more hopeful place where past troubles are left behind. The 6 of Swords-Tabono encourages steadfastness and courage as you paddle through turbulent waters, ensuring that you reach a place of greater peace and stability, driven by the strength and resolve that Tabono embodies.",
    lightAspect: "Transition, moving on, leaving behind",
    shadowAspect: "Resistance to change, unfinished business",
    inReadings: "This card encourages steadfastness as you navigate through difficulties toward calmer waters."
  },
  {
    id: "seven-swords",
    name: "Seven of Swords",
    adinkraSymbol: "Kramo Bone",
    adinkraMeaning: "Bad shepherd, dishonesty or deceit",
    fullDescription: "The 7 of Swords-Kramo Bone captures the dual nature of deceit and cunning. Kramo Bone, which translates to 'bad shepherd' and symbolizes dishonesty or one who uses knowledge for deceitful purposes, aligns closely with the card's theme of stealth and sometimes unethical tactics. This card often represents a situation where stealth or strategic evasion is employed, possibly indicating deceitful actions or the need to act with shrewdness. The 7 of Swords-Kramo Bone urges you to be wary of dishonesty in others and to consider the ethical implications of your actions. It encourages vigilance and strategic thinking, reminding you that while cunning can navigate complex situations, integrity forms the foundation of lasting trust and respect.",
    lightAspect: "Strategy, stealth, getting away with something",
    shadowAspect: "Deception, betrayal, acting dishonorably",
    inReadings: "This card urges vigilance and reminds you that integrity forms the foundation of lasting trust."
  },
  {
    id: "eight-swords",
    name: "Eight of Swords",
    adinkraSymbol: "Epa",
    adinkraMeaning: "Handcuffs, slavery and captivity",
    fullDescription: "The 8 of Swords-Epa intricately weaves themes of being immobilized with the potential for transient liberation. Epa, symbolizing handcuffs and often connected to slavery and captivity, reflects the card's depiction of restriction and the feeling of being trapped, whether mentally, emotionally, or physically. This card represents a period of feeling bound by circumstances, thoughts, or emotions, highlighting a sense of powerlessness. However, the transient nature suggested by Epa encourages the recognition that these binds are not permanent; there is potential for freedom through self-awareness and change in perspective. The 8 of Swords-Epa invites you to examine the restraints you believe are holding you back, encouraging you to realize that the keys to your liberation are often within your own hands.",
    lightAspect: "Restriction, imprisonment, self-victimization",
    shadowAspect: "Self-acceptance, new perspective, freedom",
    inReadings: "This card invites you to examine your perceived restraints and realize liberation is within your hands."
  },
  {
    id: "nine-swords",
    name: "Nine of Swords",
    adinkraSymbol: "Denkyem",
    adinkraMeaning: "Crocodile, adaptability to both water and land",
    fullDescription: "The 9 of Swords-Denkyem explores the stark contrast between being terrified and finding resoluteness. Denkyem, symbolizing the crocodile and its association with adaptability to both water and land, reflects the card's themes of intense fear, anxiety, and the mental turmoil that can invade our peace. This card typically portrays a scenario of overwhelming dread or worry, capturing moments when fears dominate our thoughts. However, Denkyem's adaptability inspires a call to resilience, urging you to be resolute in facing your fears. The 9 of Swords-Denkyem encourages you to confront what terrifies you with a steadfast spirit, harnessing your inner strength to adapt and overcome, transforming fear into a pathway for growth and resilience.",
    lightAspect: "Anxiety, worry, fear, nightmares",
    shadowAspect: "Hope, reaching out, recovery",
    inReadings: "This card encourages you to confront fears with resilience, transforming anxiety into growth."
  },
  {
    id: "ten-swords",
    name: "Ten of Swords",
    adinkraSymbol: "Okodee Mmowere",
    adinkraMeaning: "Talons of the eagle, strength in overcoming challenges",
    fullDescription: "The 10 of Swords-Okodee Mmowere captures the intense theme of evisceration, yet urges a humane approach to ending cycles. Okodee Mmowere, symbolizing the talons of the eagle and the strength in overcoming challenges, aligns with the card's depiction of a conclusive and often brutal ending, symbolized by swords piercing through. This card reflects a moment of significant pain or betrayal, suggesting a finality that feels eviscerating. However, the presence of Okodee Mmowere encourages drawing on the eagle's strength to rise above, urging a conclusion that, while painful, is carried out with dignity and the intention to heal. The 10 of Swords-Okodee Mmowere invites you to confront endings with courage and compassion, allowing for a transition that respects the humanity in oneself and others, paving the way for eventual renewal and recovery.",
    lightAspect: "Painful endings, deep wounds, betrayal, loss",
    shadowAspect: "Recovery, regeneration, inevitable end",
    inReadings: "This card invites you to confront painful endings with courage, paving the way for renewal."
  },
  {
    id: "girl-swords",
    name: "Girl of Swords",
    adinkraSymbol: "Hwemudua",
    adinkraMeaning: "Measuring stick, examination and quality control",
    fullDescription: "The Girl of Swords-Hwemudua captures the dual aspects of being highly informative yet potentially intrusive, like a stalker. Hwemudua, symbolizing measuring and examination, highlights the Page's curiosity and thirst for knowledge. This card often represents a young or less experienced individual eager to learn and gather information, embodying an analytical and observant nature. However, Hwemudua also serves as a caution against overstepping boundaries, reminding us that the pursuit of information should be tempered with respect for privacy and ethical considerations. The Page of Swords-Hwemudua encourages you to use your intellect and curiosity constructively, ensuring that your methods of information gathering enhance understanding without infringing on others' personal spaces.",
    lightAspect: "Curiosity, mental energy, new ideas, thirst for knowledge",
    shadowAspect: "Gossip, hurtful words, lack of planning",
    inReadings: "This card encourages using intellect constructively while respecting boundaries."
  },
  {
    id: "boy-swords",
    name: "Boy of Swords",
    adinkraSymbol: "Akofena",
    adinkraMeaning: "Sword of war, courage and valor",
    fullDescription: "The Boy of Swords-Akofena embodies the sharp edge between conviction and provocation. Akofena, symbolizing courage and valor often depicted through crossed swords, resonates with the Knight's dynamic and forceful approach to pursuing his ideals and goals. This card typically portrays a figure charging forward with great speed and determination, driven by strong convictions. However, the inclusion of Akofena also hints at the potential for this assertive energy to slip into provocation, where the drive to assert one's beliefs can unintentionally challenge or confront others aggressively. The Knight of Swords-Akofena encourages harnessing the energy of one's convictions to advocate for causes justly and bravely, yet it also calls for mindfulness to ensure that this zeal does not become provocative but remains directed towards positive and constructive ends.",
    lightAspect: "Action, impulsiveness, defending beliefs",
    shadowAspect: "No direction, disregard for consequences",
    inReadings: "This card encourages advocating bravely while remaining mindful of impact on others."
  },
  {
    id: "woman-swords",
    name: "Woman of Swords",
    adinkraSymbol: "Fawohodie",
    adinkraMeaning: "Independence, emancipation and freedom",
    fullDescription: "The Woman of Swords-Fawohodie embodies the dual essence of being pristine in her clarity and independence, yet potentially merciless in her pursuit of freedom and autonomy. Fawohodie, symbolizing emancipation and independence, enhances the Queen's attributes of sharp intellect and a no-nonsense approach to truth and justice. This card portrays a leader who values transparency and purity of thought, unclouded by biases, ensuring her judgments are clear and straightforward. However, her unwavering commitment to autonomy and self-sufficiency can sometimes manifest as a merciless demeanor, especially when cutting through deceit or asserting her boundaries. The Queen of Swords-Fawohodie urges you to champion truth and independence while maintaining compassion, ensuring that the quest for personal freedom does not isolate or alienate.",
    lightAspect: "Clear boundaries, direct communication, independence",
    shadowAspect: "Coldness, cruelty, bitterness",
    inReadings: "This card urges championing truth and independence while maintaining compassion."
  },
  {
    id: "man-swords",
    name: "Man of Swords",
    adinkraSymbol: "Mate Masie",
    adinkraMeaning: "I understand, deep knowledge and wisdom",
    fullDescription: "The Man of Swords-Mate Masie expertly navigates the realms of integrity and the underlying threat of insidious influences. Mate Masie, symbolizing 'I understand,' reflects the King's deep knowledge and wisdom, as well as his capacity for discernment and judgment. This card portrays a ruler who wields his intellectual power with a strong sense of fairness and ethical conduct, epitomizing integrity in all decisions. However, the presence of Mate Masie also warns of the subtle, insidious challenges that can arise—manipulations and deceit that may not be immediately apparent. The King of Swords-Mate Masie encourages vigilance and ethical rigor, urging you to apply your understanding judiciously to navigate through complexities without compromising your principles.",
    lightAspect: "Mental clarity, intellectual power, authority, truth",
    shadowAspect: "Quiet power, inner truth, misuse of power",
    inReadings: "This card encourages vigilance and ethical rigor while navigating complex situations."
  },

  // ============ PENTACLES (Earth) ============
  {
    id: "ace-pentacles",
    name: "Ace of Pentacles",
    adinkraSymbol: "Obohemmaa",
    adinkraMeaning: "Diamond/Butterfly, delicate potential and transformation",
    fullDescription: "The Ace of Pentacles-Obohemmaa Diamond artfully explores the intersection of inherent value and potential liability. Here, 'Obohemmaa' representing the butterfly symbolizes delicate potential and transformation, while the addition of 'Diamond' signifies enduring value, strength, and the preciousness of new opportunities. This card heralds the beginning of new financial or material ventures, emphasizing both the potential for significant growth and the intrinsic worth of these opportunities. However, just as a diamond requires careful handling despite its toughness, this card warns of the liabilities or responsibilities that accompany such valuable beginnings. The Ace of Pentacles-Obohemmaa Diamond invites you to appreciate and nurture the new opportunities that arise, handling them with the care and consideration that precious ventures deserve, ensuring they yield lasting benefits rather than becoming burdensome liabilities.",
    lightAspect: "New financial opportunity, manifestation, abundance",
    shadowAspect: "Lost opportunity, lack of planning, scarcity",
    inReadings: "This card invites you to nurture new opportunities with care, ensuring they yield lasting benefits."
  },
  {
    id: "two-pentacles",
    name: "Two of Pentacles",
    adinkraSymbol: "Nkyinkyi",
    adinkraMeaning: "Initiative and versatility",
    fullDescription: "The 2 of Pentacles-Nkyinkyim captures the dynamic tension between efficiency and disorder, embodying the challenge of maintaining balance amid fluctuating circumstances. Nkyinkyim, symbolizing initiative and versatility, aligns with the card's theme of juggling multiple responsibilities or projects. This card portrays the act of balancing dual aspects of life—financial, professional, or personal—requiring adaptability and skillful management to maintain equilibrium. The efficiency represented here is the ability to handle these oscillations gracefully, but there's always the risk of the situation devolving into a 'shit-show' if balance is lost. The 2 of Pentacles-Nkyinkyim encourages resilience and flexibility, urging you to adapt and adjust as needed, while cautioning against overcommitment that could disrupt the careful harmony you strive to maintain.",
    lightAspect: "Balance, adaptability, time management, prioritization",
    shadowAspect: "Overwhelm, disorganization, reprioritization needed",
    inReadings: "This card encourages flexibility and adaptability while cautioning against overcommitment."
  },
  {
    id: "three-pentacles",
    name: "Three of Pentacles",
    adinkraSymbol: "Boa Me Na Me Mmoa Wo",
    adinkraMeaning: "Help me and let me help you, cooperation and interdependence",
    fullDescription: "The 3 of Pentacles-Boa Me Na Me Mmoa Wo explores the nuanced balance between healthy collaboration and the risk of usury. Boa Me Na Me Mmoa Wo, which translates to 'Help me and let me help you,' symbolizes mutual support and the synergistic benefits of teamwork. This card typically illustrates the value of skilled labor and the importance of combining efforts to achieve a common goal, emphasizing collaboration and the sharing of expertise. However, it also warns against the potential for usury—exploiting others' skills or contributions under the guise of teamwork. The 3 of Pentacles-Boa Me Na Me Mmoa Wo encourages you to engage in equitable partnerships where all parties benefit fairly, fostering a spirit of genuine cooperation rather than one-sided advantage.",
    lightAspect: "Teamwork, collaboration, learning, implementation",
    shadowAspect: "Disharmony, misalignment, working alone",
    inReadings: "This card encourages equitable partnerships where all parties benefit fairly."
  },
  {
    id: "four-pentacles",
    name: "Four of Pentacles",
    adinkraSymbol: "Aban",
    adinkraMeaning: "Fortress or fence, security and protection",
    fullDescription: "The 4 of Pentacles-Aban underscores the tension between being protectionist and crossing into the territory of a hoarder. Aban, symbolizing a fortress or fence, reflects the card's themes of security and control over one's resources. This card often depicts a person clinging tightly to their material wealth, indicating a desire to protect and secure their assets. However, Aban also warns of the potential to become overly protective, turning into hoarding behavior where the fear of loss leads to unnecessary and harmful accumulation. The 4 of Pentacles-Aban encourages you to evaluate your approach to financial security and material possessions, urging you to maintain a balance between safeguarding your resources and allowing for a healthy flow of giving and receiving. This ensures that protection does not become restriction, allowing for both security and growth.",
    lightAspect: "Security, control, conservatism, stability",
    shadowAspect: "Greed, materialism, self-protection",
    inReadings: "This card encourages balance between protecting resources and allowing healthy flow."
  },
  {
    id: "five-pentacles",
    name: "Five of Pentacles",
    adinkraSymbol: "Onyankopon Adom Nti Biribiara Bey Eyie",
    adinkraMeaning: "By God's grace, all will be well",
    fullDescription: "The 5 of Pentacles-Onyankopon Adom Nti Biribiara Beye Yie encapsulates the stark contrast between experiencing poverty and the hope for a rebound. The phrase, meaning 'By God's grace, all will be well,' speaks to the spiritual belief in eventual recovery and the divine benevolence that ensures resilience in the face of hardship. This card typically reflects moments of financial struggle or material loss, highlighting feelings of exclusion and need. However, Onyankopon Adom Nti Biribiara Beye Yie brings a message of faith and optimism, reminding those in distress that their current state is not permanent and that improvement is possible through divine grace and personal perseverance. The 5 of Pentacles encourages you to seek support and to remember that recovery and renewal are within reach, urging an attitude of hope and the belief that through faith and effort, things will indeed get better.",
    lightAspect: "Financial loss, poverty, lack, isolation",
    shadowAspect: "Recovery, charity, improvement",
    inReadings: "This card encourages seeking support and maintaining faith that recovery is within reach."
  },
  {
    id: "six-pentacles",
    name: "Six of Pentacles",
    adinkraSymbol: "Woforo Dua Pa A",
    adinkraMeaning: "When you climb a good tree, you are given a push",
    fullDescription: "The 6 of Pentacles-Woforo Dua Pa A navigates the delicate balance between being reciprocal and miserly. Woforo Dua Pa A, which translates to 'when you climb a good tree, you are given a push,' symbolizes the virtues of support and generosity, aligning with the card's theme of giving and receiving. This card typically represents financial or material assistance, highlighting the importance of charity and the flow of resources between those who have and those who need. However, it also cautions against the tendency to be miserly, where the fear of losing one's wealth leads to withholding necessary help. The 6 of Pentacles-Woforo Dua Pa A encourages a spirit of reciprocity, where generosity is met with support and kindness, fostering a community where aid is given freely and received with gratitude, ensuring that generosity enriches all involved.",
    lightAspect: "Generosity, charity, giving, receiving",
    shadowAspect: "Debt, selfishness, one-sided charity",
    inReadings: "This card encourages generosity and reciprocity, fostering community support."
  },
  {
    id: "seven-pentacles",
    name: "Seven of Pentacles",
    adinkraSymbol: "Hwe Mu Dua",
    adinkraMeaning: "Measuring stick, evaluation and assessment",
    fullDescription: "The 7 of Pentacles-Hwe Mu Dua examines the tension between diligent tending and cursory effort. Hwe Mu Dua, symbolizing the act of measuring and evaluating, resonates with the card's theme of assessing progress and returns on investments. This card reflects a moment of pause in the cycle of growth, where the fruits of labor are not yet fully realized, prompting a need for patience and continued effort. It encourages careful, attentive tending to one's ventures, contrasting with the risk of giving only cursory attention, which may lead to inadequate results or missed opportunities for improvement. The 7 of Pentacles-Hwe Mu Dua invites you to evaluate your efforts thoughtfully, ensuring that your work is thorough and that patience and perseverance are maintained to eventually harvest the rewards of your dedication.",
    lightAspect: "Long-term view, sustainable results, perseverance",
    shadowAspect: "Limited success, lack of long-term vision",
    inReadings: "This card invites you to evaluate your efforts and maintain patience for eventual rewards."
  },
  {
    id: "eight-pentacles",
    name: "Eight of Pentacles",
    adinkraSymbol: "Nkyimu",
    adinkraMeaning: "Precision, adeptness and skill",
    fullDescription: "The 8 of Pentacles-Nkyimu bridges the concepts of mastery and purposelessness. Nkyimu, symbolizing foundational skills and the expertise required in craftsmanship, aligns with the card's theme of diligence, skill development, and attention to detail. This card typically depicts a person engaged in meticulous work, emphasizing the pursuit of mastery through focused effort and continuous practice. However, it also confronts the challenge of feeling purposeless, where even skilled labor can seem devoid of deeper meaning if disconnected from one's passions or broader goals. The 8 of Pentacles-Nkyimu encourages you to refine your skills with dedication and precision, while also finding ways to connect your work to a greater sense of purpose, ensuring that your efforts not only lead to mastery but also contribute to a fulfilling and meaningful life journey.",
    lightAspect: "Apprenticeship, skill development, dedication",
    shadowAspect: "Perfectionism, lack of motivation",
    inReadings: "This card encourages refining skills while connecting work to greater purpose."
  },
  {
    id: "nine-pentacles",
    name: "Nine of Pentacles",
    adinkraSymbol: "Abe Dua",
    adinkraMeaning: "Palm tree, self-sufficiency and vitality",
    fullDescription: "The 9 of Pentacles-Abe Dua encapsulates the pride of being self-made and the solitude that can accompany such success. Abe Dua, symbolizing the palm tree known for its durability and self-sufficiency, resonates with the card's themes of independence, financial stability, and achievement through personal effort. This card celebrates the fruition of hard work and discipline, often showing a person enjoying the comforts and luxuries that their efforts have secured. However, it also highlights the potential isolation that can come with such independence, where one may find themselves enjoying their achievements alone. The 9 of Pentacles-Abe Dua encourages you to appreciate the rewards of your diligence while also being mindful of the connections and community that make life rich and meaningful, suggesting that true fulfillment often includes sharing one's success with others.",
    lightAspect: "Abundance, luxury, self-sufficiency, financial independence",
    shadowAspect: "Over-investment in work, isolation",
    inReadings: "This card encourages appreciating your achievements while staying connected to community."
  },
  {
    id: "ten-pentacles",
    name: "Ten of Pentacles",
    adinkraSymbol: "Nserewa",
    adinkraMeaning: "Cowrie shells, wealth and abundance",
    fullDescription: "The 10 of Pentacles-Nserewa adeptly navigates the balance between accumulating riches and veering into decadence. Nserewa, symbolizing cattle and often associated with wealth and abundance in many cultures, enhances the card's theme of material success and the legacy that comes from amassed wealth. This card typically portrays a scene of family and financial stability, reflecting the culmination of efforts leading to lasting security and prosperity. However, it also warns against the potential excesses of decadence, where the wealth and comfort might lead to overindulgence and a loss of foundational values. The 10 of Pentacles-Nserewa encourages you to enjoy the fruits of your labor and the security it brings, while maintaining humility and prudence, ensuring that your wealth serves to support a fulfilling life and enrich the lives of others around you.",
    lightAspect: "Wealth, inheritance, family, establishment",
    shadowAspect: "Financial failure, loneliness, loss",
    inReadings: "This card encourages enjoying prosperity while maintaining values and enriching others."
  },
  {
    id: "girl-pentacles",
    name: "Girl of Pentacles",
    adinkraSymbol: "Ese Ne Tekrema",
    adinkraMeaning: "The teeth and the tongue, interdependence",
    fullDescription: "The Girl of Pentacles-Ese Ne Tekrema illustrates the dynamic between devotion to tasks and the propensity for insubordination. Ese Ne Tekrema, symbolizing the tooth and the tail, signifies commitment and the inherent challenges of following through on responsibilities while maintaining personal integrity. This card typically represents a young or less experienced individual eager to learn and apply themselves diligently to their studies or work, embodying devotion and eagerness to grow. However, the symbol also hints at the potential for insubordination, where a strong sense of self and personal convictions might lead to questioning authority or established norms. The Page of Pentacles-Ese Ne Tekrema encourages a balanced approach to ambition and learning, urging you to pursue your tasks with commitment while also being mindful of the importance of respect and cooperation within hierarchical or structured settings.",
    lightAspect: "Ambition, diligence, goal setting, manifestation",
    shadowAspect: "Lack of progress, procrastination, missed opportunities",
    inReadings: "This card encourages pursuing tasks with commitment while respecting cooperation."
  },
  {
    id: "boy-pentacles",
    name: "Boy of Pentacles",
    adinkraSymbol: "Ahoden",
    adinkraMeaning: "Vigor, spirit and strength",
    fullDescription: "The Boy of Pentacles-Ahoden embodies the tension between commitment and obsession, exploring how dedication can slip into compulsive behavior. Ahoden, which translates to 'vigor' or 'spirit,' highlights the Knight's deep dedication to his tasks, symbolizing strength and the determination to achieve his goals through hard work and persistence. In the context of the tarot, the Knight of Pentacles is typically seen as the most diligent and reliable of the court cards, often focusing on the long-term completion of his duties with great care and unwavering attention. However, when paired with Ahoden, there's an added layer emphasizing the energy and enthusiasm he brings to his pursuits. This can serve as a double-edged sword; his strong commitment is admirable, but it also raises questions about the intensity of his focus. Does his vigor lead him to obsess over his tasks, perhaps neglecting other important areas of his life?",
    lightAspect: "Hard work, productivity, routine, conservatism",
    shadowAspect: "Self-discipline, boredom, feeling stuck",
    inReadings: "This card encourages dedicated effort while maintaining balance across life areas."
  },
  {
    id: "woman-pentacles",
    name: "Woman of Pentacles",
    adinkraSymbol: "Awurade Baatanfo",
    adinkraMeaning: "God's children, care and protection",
    fullDescription: "The Woman of Pentacles-Awurade Baatanfo navigates the delicate interplay between being a nurturer and the risk of Munchhausen syndrome, where care can turn into control. Awurade Baatanfo, meaning 'God's children,' symbolizes the care and protection granted to those who need it, aligning perfectly with the Queen's role as a provider and caretaker who fosters growth and stability in her environment. This card celebrates her ability to nurture, support, and provide comfort, making her a cornerstone in her community or family. However, it also warns against the dangers of overbearing involvement or creating dependencies, characteristic of Munchhausen by proxy, where the desire to be needed can lead to unhealthy control over others. The Queen of Pentacles-Awurade Baatanfo urges a balance in caregiving—offering support that empowers rather than stifles, ensuring that nurturing remains a genuine act of kindness and promotes independence and strength in those cared for.",
    lightAspect: "Nurturing, practical, provides financially, a working parent",
    shadowAspect: "Financial independence, self-care, work-home conflict",
    inReadings: "This card urges balanced caregiving that empowers rather than creates dependency."
  },
  {
    id: "man-pentacles",
    name: "Man of Pentacles",
    adinkraSymbol: "Bese Saka",
    adinkraMeaning: "Sack of cola nuts, affluence and abundance",
    fullDescription: "The Man of Pentacles-Bese Saka adeptly explores the polarity between being a provider and the tendencies of an egomaniac. Bese Saka, symbolizing a sack of cola nuts often used in trade and as a symbol of affluence and abundance, enhances the King's reputation as a successful, resourceful leader who generously provides for his community or family. This card reflects his capacity to generate wealth and ensure stability through practical and strategic management of resources. However, Bese Saka also warns against the potential for such success to foster egotism, where the King's identity and self-worth may become overly tied to his material achievements and status, leading to an egomaniacal approach to leadership. The King of Pentacles-Bese Saka encourages a careful balance between being a benevolent provider who uses his resources wisely and humbly, and guarding against the pride and vanity that can isolate him from those he aims to support.",
    lightAspect: "Wealth, business, leadership, security, discipline",
    shadowAspect: "Financially inept, obsessed with wealth and status",
    inReadings: "This card encourages benevolent provision while guarding against pride and vanity."
  }
];

// Helper function to get guidebook entry by card ID
export function getGuidebookEntry(cardId: string): CardGuidebookEntry | undefined {
  return guidebookEntries.find(entry => entry.id === cardId);
}

// Helper function to get suit intro
export function getSuitIntro(suit: string): SuitIntro | undefined {
  return suitIntros.find(intro => intro.suit === suit);
}
