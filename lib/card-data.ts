export type CardSuit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type CardType = {
  id: string;
  name: string;
  number: number | string;
  suit: CardSuit;
  adinkraSymbol: string;
  adinkraMeaning: string;
  tarotMeaning: string;
  fusedInterpretation: string;
  keywords: string[];
  element?: string;
  celestialBody?: string;
  zodiacSign?: string;
  numerology?: string;
  imageUrl?: string;
};

// DrawnCard includes polarity determined by cosmic synchronicity
export type CardPolarity = "upright" | "reversed";

export type DrawnCard = CardType & {
  polarity: CardPolarity;
  polarityKeywords: string[]; // Keywords for this specific polarity
};

// Major Arcana with Adinkra fusions
export const majorArcana: CardType[] = [
  {
    id: "fool",
    name: "The Fool",
    number: 0,
    suit: "major",
    adinkraSymbol: "Nyame Nti",
    adinkraMeaning: "By God's grace, faith and trust in divine providence",
    tarotMeaning: "New beginnings, innocence, spontaneity, free spirit",
    fusedInterpretation: "The Fool steps into the void with Nyame Nti's unshakeable faith. Dressed in cosmic splendor, they trust the universe to catch them. Every leap into the unknown is an act of divine grace.",
    keywords: ["beginnings", "faith", "divine trust", "innocence"],
    celestialBody: "Uranus",
    imageUrl: "/images/cards/fool.jpeg"
  },
  {
    id: "magician",
    name: "The Magician",
    number: 1,
    suit: "major",
    adinkraSymbol: "Ananse Ntentan",
    adinkraMeaning: "Spider's web, wisdom, creativity, and the complexity of life",
    tarotMeaning: "Manifestation, resourcefulness, power, inspired action",
    fusedInterpretation: "The Magician weaves Ananse Ntentan, the spider's web connecting all elements of creation. Like the trickster Ananse, true magic lies in understanding how all threads of existence interconnect.",
    keywords: ["manifestation", "creativity", "wisdom", "connection"],
    celestialBody: "Mercury",
    imageUrl: "/images/cards/magician.jpeg"
  },
  {
    id: "high-priestess",
    name: "The High Priestess",
    number: 2,
    suit: "major",
    adinkraSymbol: "Hye Wonhye",
    adinkraMeaning: "That which cannot be burned, imperishability and endurance",
    tarotMeaning: "Intuition, hidden knowledge, divine feminine, the subconscious",
    fusedInterpretation: "The High Priestess embodies Hye Wonhye, the imperishable flame of inner knowing. She guards eternal truths that no fire can consume, wisdom that endures beyond time.",
    keywords: ["intuition", "imperishability", "hidden knowledge", "mystery"],
    celestialBody: "Moon",
    imageUrl: "/images/cards/high-priestess.jpeg"
  },
  {
    id: "empress",
    name: "The Empress",
    number: 3,
    suit: "major",
    adinkraSymbol: "Asase Ye Duru",
    adinkraMeaning: "The Earth has weight, providence and the divinity of Mother Earth",
    tarotMeaning: "Femininity, beauty, nature, nurturing, abundance",
    fusedInterpretation: "The Empress embodies Asase Ye Duru, the weight of Mother Earth herself. Her abundance springs from honoring the land, her nurturing mirrors the providence of the divine feminine ground beneath all life.",
    keywords: ["abundance", "earth", "providence", "divine feminine"],
    celestialBody: "Venus",
    imageUrl: "/images/cards/empress.jpeg"
  },
  {
    id: "emperor",
    name: "The Emperor",
    number: 4,
    suit: "major",
    adinkraSymbol: "Ohen Adwae",
    adinkraMeaning: "King's scepter, authority, legitimacy, and divine right to rule",
    tarotMeaning: "Authority, establishment, structure, father figure",
    fusedInterpretation: "The Emperor holds Ohen Adwae, the king's scepter of legitimate authority. His power flows not from force but from the cosmic order that recognizes rightful sovereignty.",
    keywords: ["authority", "sovereignty", "structure", "divine right"],
    celestialBody: "Aries",
    imageUrl: "/images/cards/emperor.jpeg"
  },
  {
    id: "hierophant",
    name: "The Hierophant",
    number: 5,
    suit: "major",
    adinkraSymbol: "Mpuannum",
    adinkraMeaning: "Five tufts of hair, priestly office, loyalty, and adroitness",
    tarotMeaning: "Spiritual wisdom, religious beliefs, tradition, conformity",
    fusedInterpretation: "The Hierophant wears Mpuannum, the five tufts marking priestly consecration. He bridges heaven and earth through ritual, transmitting ancient wisdom to those who seek.",
    keywords: ["tradition", "priesthood", "esoteric knowledge", "spiritual authority"],
    celestialBody: "Taurus",
    imageUrl: "/images/cards/hierophant.jpeg"
  },
  {
    id: "lovers",
    name: "The Lovers",
    number: 6,
    suit: "major",
    adinkraSymbol: "Odo Nnyew Fie Kwan",
    adinkraMeaning: "Love never loses its way home",
    tarotMeaning: "Love, harmony, relationships, values alignment, choices",
    fusedInterpretation: "The Lovers embody Odo Nnyew Fie Kwan—love that always finds its way home. Their souls intertwine like DNA spirals, two becoming one while remaining distinct.",
    keywords: ["love", "soul connection", "homecoming", "union"],
    celestialBody: "Gemini",
    imageUrl: "/images/cards/lovers.jpeg"
  },
  {
    id: "chariot",
    name: "The Chariot",
    number: 7,
    suit: "major",
    adinkraSymbol: "Woforo Dua Pa A",
    adinkraMeaning: "When you climb a good tree, you are given a push",
    tarotMeaning: "Control, willpower, success, determination, action",
    fusedInterpretation: "The Chariot embodies Woforo Dua Pa A—when you pursue worthy goals, the universe provides assistance. Harness opposing forces into unified momentum.",
    keywords: ["willpower", "divine assistance", "victory", "unified force"],
    celestialBody: "Cancer",
    imageUrl: "/images/cards/chariot.jpeg"
  },
  {
    id: "strength",
    name: "Strength",
    number: 8,
    suit: "major",
    adinkraSymbol: "Dwennimmen",
    adinkraMeaning: "Ram's horns, humility with strength",
    tarotMeaning: "Strength, courage, persuasion, influence, compassion",
    fusedInterpretation: "Strength wears Dwennimmen, the ram's horns that symbolize power tempered by wisdom. True strength bows when necessary, knowing when to charge and when to yield.",
    keywords: ["inner strength", "humility", "courage", "wisdom"],
    celestialBody: "Leo",
    imageUrl: "/images/cards/strength.jpeg"
  },
  {
    id: "hermit",
    name: "The Hermit",
    number: 9,
    suit: "major",
    adinkraSymbol: "Owo Foro Adobe",
    adinkraMeaning: "Snake climbing the palm tree, prudence and diligence",
    tarotMeaning: "Soul searching, introspection, being alone, inner guidance",
    fusedInterpretation: "The Hermit climbs like Owo Foro Adobe, the snake ascending the palm with patient persistence. Solitary ascent requires both wisdom and endurance to reach illumination.",
    keywords: ["solitude", "prudence", "ascension", "inner light"],
    celestialBody: "Virgo",
    imageUrl: "/images/cards/hermit.jpeg"
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    number: 10,
    suit: "major",
    adinkraSymbol: "Mmusuyidee",
    adinkraMeaning: "Good fortune, sanctity, and spiritual protection",
    tarotMeaning: "Good luck, karma, life cycles, destiny, turning point",
    fusedInterpretation: "The Wheel spins with Mmusuyidee's cosmic cross at its center—good fortune and sanctity intertwined. As the zodiac turns and planets align, remember: you stand at the threshold where fate and free will meet.",
    keywords: ["cycles", "fortune", "destiny", "cosmic order"],
    celestialBody: "Jupiter",
    imageUrl: "/images/cards/wheel-of-fortune.jpeg"
  },
  {
    id: "justice",
    name: "Justice",
    number: 11,
    suit: "major",
    adinkraSymbol: "Sepow",
    adinkraMeaning: "The executioner's knife, justice and the consequences of evil",
    tarotMeaning: "Justice, fairness, truth, cause and effect, law",
    fusedInterpretation: "Justice wields Sepow, the blade that separates truth from falsehood. Her scales weigh all actions; her sword executes the consequences of cosmic law.",
    keywords: ["fairness", "truth", "consequences", "balance"],
    celestialBody: "Libra",
    imageUrl: "/images/cards/justice.jpeg"
  },
  {
    id: "hanged-man",
    name: "The Hanged Man",
    number: 12,
    suit: "major",
    adinkraSymbol: "Sankofa",
    adinkraMeaning: "Return and get it, learning from the past",
    tarotMeaning: "Surrender, letting go, new perspectives, pause",
    fusedInterpretation: "The Hanged Man practices Sankofa, reaching backward to retrieve what was lost. Suspension is not punishment but the stillness needed to see truth inverted.",
    keywords: ["surrender", "reflection", "retrieval", "perspective"],
    celestialBody: "Neptune",
    imageUrl: "/images/cards/hanged-man.jpeg"
  },
  {
    id: "death",
    name: "Death",
    number: 13,
    suit: "major",
    adinkraSymbol: "Owuo Atwedee",
    adinkraMeaning: "Death's ladder, mortality and transition",
    tarotMeaning: "Endings, change, transformation, transition",
    fusedInterpretation: "Death extends Owuo Atwedee, the ladder all must climb. This is not end but transformation, the caterpillar's necessary dissolution before wings emerge.",
    keywords: ["transformation", "endings", "transition", "rebirth"],
    celestialBody: "Scorpio",
    imageUrl: "/images/cards/death.jpeg"
  },
  {
    id: "temperance",
    name: "Temperance",
    number: 14,
    suit: "major",
    adinkraSymbol: "Sesa Wo Suban",
    adinkraMeaning: "Change or transform your character",
    tarotMeaning: "Balance, moderation, patience, purpose, meaning",
    fusedInterpretation: "Temperance embodies Sesa Wo Suban, the star of transformation. Through patient alchemy, opposing forces blend into harmony, fire and water becoming steam of spiritual evolution.",
    keywords: ["transformation", "balance", "patience", "alchemy"],
    celestialBody: "Sagittarius",
    imageUrl: "/images/cards/temperance.jpeg"
  },
  {
    id: "devil",
    name: "The Devil",
    number: 15,
    suit: "major",
    adinkraSymbol: "Nea Ope Se Obedi Hene",
    adinkraMeaning: "He who wants to be king, ambition and service",
    tarotMeaning: "Shadow self, attachment, addiction, restriction, sexuality",
    fusedInterpretation: "The Devil reveals Nea Ope Se Obedi Hene's shadow: ambition unchecked becomes tyranny. The puppet strings we think bind us are held by our own hands—liberation awaits recognition.",
    keywords: ["bondage", "ambition", "shadow", "liberation"],
    celestialBody: "Capricorn",
    imageUrl: "/images/cards/devil.jpeg"
  },
  {
    id: "tower",
    name: "The Tower",
    number: 16,
    suit: "major",
    adinkraSymbol: "Mrammuo",
    adinkraMeaning: "Measuring scale, justice and prudence",
    tarotMeaning: "Sudden change, upheaval, chaos, revelation, awakening",
    fusedInterpretation: "The Tower crumbles when Mrammuo's scales tip too far. Structures built on false foundations cannot stand cosmic correction. In destruction lies the seed of truer architecture.",
    keywords: ["upheaval", "revelation", "breakdown", "rebuilding"],
    celestialBody: "Mars",
    imageUrl: "/images/cards/tower.jpeg"
  },
  {
    id: "star",
    name: "The Star",
    number: 17,
    suit: "major",
    adinkraSymbol: "Nsoromma",
    adinkraMeaning: "Star, child of the heavens, guardianship",
    tarotMeaning: "Hope, faith, purpose, renewal, spirituality",
    fusedInterpretation: "The Star pours Nsoromma's light upon parched earth. After the Tower's destruction, hope returns as gentle starlight, reminding us we are children of the cosmos.",
    keywords: ["hope", "renewal", "faith", "guidance"],
    celestialBody: "Aquarius",
    imageUrl: "/images/cards/star.jpeg"
  },
  {
    id: "moon",
    name: "The Moon",
    number: 18,
    suit: "major",
    adinkraSymbol: "Duafe",
    adinkraMeaning: "Wooden comb, beauty, cleanliness, and feminine qualities",
    tarotMeaning: "Illusion, fear, anxiety, subconscious, intuition",
    fusedInterpretation: "The Moon rises with Duafe, the comb that separates truth from illusion in the tangled unconscious. Feminine intuition guides through the dreamscape's deceptive beauty.",
    keywords: ["intuition", "illusion", "feminine wisdom", "subconscious"],
    celestialBody: "Pisces",
    imageUrl: "/images/cards/moon.jpeg"
  },
  {
    id: "sun",
    name: "The Sun",
    number: 19,
    suit: "major",
    adinkraSymbol: "Adinkrahene",
    adinkraMeaning: "King of Adinkra symbols, greatness, charisma, leadership",
    tarotMeaning: "Positivity, fun, warmth, success, vitality",
    fusedInterpretation: "The Sun blazes with Adinkrahene, the chief of all symbols from which all others derive. This is pure radiance, the source of all warmth, the center around which life orbits in joy.",
    keywords: ["joy", "vitality", "greatness", "radiance"],
    celestialBody: "Sun",
    imageUrl: "/images/cards/sun.jpeg"
  },
  {
    id: "judgement",
    name: "Judgement",
    number: 20,
    suit: "major",
    adinkraSymbol: "Nyame Nnwu Na Mawu",
    adinkraMeaning: "God never dies, therefore I cannot die - immortality of the soul",
    tarotMeaning: "Judgement, rebirth, inner calling, absolution",
    fusedInterpretation: "Judgement sounds with Nyame Nnwu Na Mawu's eternal truth: the divine within never perishes. The trumpet calls souls to remember their immortal nature and rise to their highest purpose.",
    keywords: ["awakening", "immortality", "rebirth", "calling"],
    celestialBody: "Pluto",
    imageUrl: "/images/cards/judgement.jpeg"
  },
  {
    id: "world",
    name: "The World",
    number: 21,
    suit: "major",
    adinkraSymbol: "Mmere Dane",
    adinkraMeaning: "Time changes, the impermanence of all things",
    tarotMeaning: "Completion, integration, accomplishment, travel",
    fusedInterpretation: "The World spirals with Mmere Dane's eternal truth: time transforms all things. Standing at the cosmic portal, the dancer embodies completion—yet within every ending spins the seed of new beginning.",
    keywords: ["completion", "cycles", "integration", "wholeness"],
    celestialBody: "Saturn",
    imageUrl: "/images/cards/world.jpeg"
  }
];

// Minor Arcana - Wands (Fire/Spirit)
export const wands: CardType[] = [
  {
    id: "ace-wands",
    name: "Ace of Wands",
    number: 1,
    suit: "wands",
    adinkraSymbol: "Sunsum",
    adinkraMeaning: "The soul or spirit, spiritual essence and life force",
    tarotMeaning: "Inspiration, new opportunities, growth, potential",
    fusedInterpretation: "The Ace blazes with Sunsum's soul-fire. Passion ignites new creative force—but unchecked becomes obsession. Channel this spiritual spark with intention.",
    keywords: ["passion", "obsession", "soul fire", "inspiration"],
    element: "Fire",
    imageUrl: "/images/cards/ace-wands.jpeg"
  },
  {
    id: "two-wands",
    name: "Two of Wands",
    number: 2,
    suit: "wands",
    adinkraSymbol: "Nyame Akruma",
    adinkraMeaning: "God's cross, divine authority and command",
    tarotMeaning: "Future planning, progress, decisions, discovery",
    fusedInterpretation: "Nyame Akruma's divine cross marks the crossroads of command. Will you lead with authority or abdicate your power? The world awaits your decision.",
    keywords: ["command", "abdicate", "authority", "decisions"],
    element: "Fire",
    imageUrl: "/images/cards/2-wands.jpeg"
  },
  {
    id: "three-wands",
    name: "Three of Wands",
    number: 3,
    suit: "wands",
    adinkraSymbol: "Okuafo Pa",
    adinkraMeaning: "Good farmer, hard work and enterprise",
    tarotMeaning: "Progress, expansion, foresight, overseas opportunities",
    fusedInterpretation: "Okuafo Pa's industrious spirit calls you to expand your territory. Plant seeds in distant soil, but beware of overreach—retrench when necessary.",
    keywords: ["expand", "retrench", "foresight", "enterprise"],
    element: "Fire",
    imageUrl: "/images/cards/3-wands.jpeg"
  },
  {
    id: "four-wands",
    name: "Four of Wands",
    number: 4,
    suit: "wands",
    adinkraSymbol: "Me Ware Wo",
    adinkraMeaning: "I shall marry you, commitment and devotion",
    tarotMeaning: "Celebration, joy, harmony, relaxation, homecoming",
    fusedInterpretation: "Me Ware Wo's interlocking rings mark the culmination of effort. Celebrate this milestone—but guard against counterfeit achievements that ring hollow.",
    keywords: ["culmination", "counterfeit", "celebration", "commitment"],
    element: "Fire",
    imageUrl: "/images/cards/4-wands.jpeg"
  },
  {
    id: "five-wands",
    name: "Five of Wands",
    number: 5,
    suit: "wands",
    adinkraSymbol: "Pa Gya",
    adinkraMeaning: "Strike fire, conflict and the spark of change",
    tarotMeaning: "Conflict, disagreements, competition, tension, diversity",
    fusedInterpretation: "Pa Gya's sparks fly as wands clash. Conflict ignites growth—or destruction. Call a ceasefire when the cost outweighs the cause.",
    keywords: ["conflict", "ceasefire", "competition", "transformation"],
    element: "Fire",
    imageUrl: "/images/cards/5-wands.jpeg"
  },
  {
    id: "six-wands",
    name: "Six of Wands",
    number: 6,
    suit: "wands",
    adinkraSymbol: "Kwatakye Atiko",
    adinkraMeaning: "Hairstyle of a war captain, bravery and valor",
    tarotMeaning: "Success, public recognition, progress, self-confidence",
    fusedInterpretation: "Kwatakye Atiko crowns the victor with a warrior's glory. Succeed with honor—but remember, today's champion may be tomorrow's runner-up.",
    keywords: ["succeed", "runner-up", "valor", "recognition"],
    element: "Fire",
    imageUrl: "/images/cards/6-wands.jpeg"
  },
  {
    id: "seven-wands",
    name: "Seven of Wands",
    number: 7,
    suit: "wands",
    adinkraSymbol: "Mframadan",
    adinkraMeaning: "Wind-resistant house, fortitude and resilience",
    tarotMeaning: "Challenge, competition, protection, perseverance",
    fusedInterpretation: "Mframadan's fortified walls teach: defend what you've built, but know when to allow entry. Rigid boundaries protect—or isolate. Stand firm in wisdom.",
    keywords: ["defend", "allow", "resilience", "conviction"],
    element: "Fire",
    imageUrl: "/images/cards/7-wands.jpeg"
  },
  {
    id: "eight-wands",
    name: "Eight of Wands",
    number: 8,
    suit: "wands",
    adinkraSymbol: "Akoben",
    adinkraMeaning: "War horn, vigilance and call to action",
    tarotMeaning: "Movement, fast paced change, action, alignment, air travel",
    fusedInterpretation: "Akoben sounds the call—quickness is demanded. Messages fly, opportunities race past. Act with speed, but know when delay serves strategy.",
    keywords: ["quickness", "delay", "momentum", "action"],
    element: "Fire",
    imageUrl: "/images/cards/8-wands.jpeg"
  },
  {
    id: "nine-wands",
    name: "Nine of Wands",
    number: 9,
    suit: "wands",
    adinkraSymbol: "Aya",
    adinkraMeaning: "Fern, endurance and defiance against adversity",
    tarotMeaning: "Resilience, courage, persistence, test of faith, boundaries",
    fusedInterpretation: "Aya's fern stands wounded but unbowed. The warrior persists—yet knows when realignment serves better than stubborn resistance.",
    keywords: ["wounded warrior", "realignment", "endurance", "persistence"],
    element: "Fire",
    imageUrl: "/images/cards/9-wands.jpeg"
  },
  {
    id: "ten-wands",
    name: "Ten of Wands",
    number: 10,
    suit: "wands",
    adinkraSymbol: "Ani Bere",
    adinkraMeaning: "Seriousness, the weight of grave matters",
    tarotMeaning: "Burden, extra responsibility, hard work, completion",
    fusedInterpretation: "Ani Bere's grave pattern marks the crushing load. Can you incapacitate oppression, or will you succumb to its weight? Know when to set burdens down.",
    keywords: ["incapacitate", "succumb", "burden", "responsibility"],
    element: "Fire",
    imageUrl: "/images/cards/10-wands.jpeg"
  },
  {
    id: "boy-wands",
    name: "Boy of Wands",
    number: "Boy",
    suit: "wands",
    adinkraSymbol: "Pempamsie",
    adinkraMeaning: "Sew in readiness, preparedness and steadfastness",
    tarotMeaning: "Exploration, excitement, freedom, new ideas",
    fusedInterpretation: "The Boy carries Pempamsie's vital spark, ready for adventure. His enthusiasm is infectious—but without direction becomes aimless wandering.",
    keywords: ["vital", "directionless", "enthusiasm", "readiness"],
    element: "Fire",
    imageUrl: "/images/cards/boy-wands.jpeg"
  },
  {
    id: "girl-wands",
    name: "Girl of Wands",
    number: "Girl",
    suit: "wands",
    adinkraSymbol: "Dame-Dame",
    adinkraMeaning: "Board game, intelligence and strategic play",
    tarotMeaning: "Energy, passion, adventure, impulsiveness",
    fusedInterpretation: "The Girl plays Dame-Dame's strategic game with charming confidence. Her moves captivate—but capricious whims can scatter focus. Channel this fire wisely.",
    keywords: ["charming", "capricious", "strategy", "passion"],
    element: "Fire",
    imageUrl: "/images/cards/girl-wands.jpeg"
  },
  {
    id: "woman-wands",
    name: "Woman of Wands",
    number: "Woman",
    suit: "wands",
    adinkraSymbol: "Nyansapo",
    adinkraMeaning: "Wisdom knot, patience and ingenuity",
    tarotMeaning: "Courage, confidence, independence, social butterfly, determination",
    fusedInterpretation: "The Woman wields Nyansapo's quintessential wisdom-fire. Her flame illuminates—but unchecked becomes toxic heat that scorches all it touches.",
    keywords: ["quintessential", "toxic", "wisdom", "confidence"],
    element: "Fire",
    imageUrl: "/images/cards/woman-wands.jpeg"
  },
  {
    id: "man-wands",
    name: "Man of Wands",
    number: "Man",
    suit: "wands",
    adinkraSymbol: "Nea Ope Se Obedi Hene",
    adinkraMeaning: "He who wants to be king, leadership and service",
    tarotMeaning: "Natural-born leader, vision, entrepreneur, honour",
    fusedInterpretation: "The Man commands with Nea Ope Se Obedi Hene's royal authority. A superlative leader—or one whose ambition suffocates all beneath him. Power demands responsibility.",
    keywords: ["superlative", "suffocation", "leadership", "vision"],
    element: "Fire",
    imageUrl: "/images/cards/man-wands.jpeg"
  }
];

// Minor Arcana - Cups (Water/Emotion)
export const cups: CardType[] = [
  {
    id: "ace-cups",
    name: "Ace of Cups",
    number: 1,
    suit: "cups",
    adinkraSymbol: "Mpatapo",
    adinkraMeaning: "Knot of reconciliation, peacemaking and unity",
    tarotMeaning: "Love, new relationships, compassion, creativity",
    fusedInterpretation: "The Ace overflows with Mpatapo's reconciling waters. A new wellspring of collective love emerges—the self and the whole become one in this chalice of emotional beginning.",
    keywords: ["love", "collective", "unity", "emotional beginning"],
    element: "Water",
    imageUrl: "/images/cards/ace-cups.jpeg"
  },
  {
    id: "two-cups",
    name: "Two of Cups",
    number: 2,
    suit: "cups",
    adinkraSymbol: "Akoka Sun",
    adinkraMeaning: "The joining of two souls, unity and combination",
    tarotMeaning: "Unified love, partnership, mutual attraction",
    fusedInterpretation: "Two cups meet in Akoka Sun's union. The power to combine or repel rests in this moment—choose connection and hearts align across all dimensions.",
    keywords: ["partnership", "combination", "unity", "attraction"],
    element: "Water",
    imageUrl: "/images/cards/2-cups.jpeg"
  },
  {
    id: "three-cups",
    name: "Three of Cups",
    number: 3,
    suit: "cups",
    adinkraSymbol: "Dono",
    adinkraMeaning: "The talking drum, praise, goodwill, and rhythm of life",
    tarotMeaning: "Celebration, friendship, creativity, collaborations",
    fusedInterpretation: "Three cups raise to Dono's celebratory rhythm. The bacchanal of friendship flows freely—joy multiplies when shared. Dance to the drumbeat of connection.",
    keywords: ["celebration", "friendship", "bacchanal", "joy"],
    element: "Water",
    imageUrl: "/images/cards/3-cups.jpeg"
  },
  {
    id: "four-cups",
    name: "Four of Cups",
    number: 4,
    suit: "cups",
    adinkraSymbol: "Menso Wo Kenten",
    adinkraMeaning: "I am not carrying your basket, self-reliance taken too far",
    tarotMeaning: "Meditation, contemplation, apathy, reevaluation",
    fusedInterpretation: "Four cups sit before you in Menso Wo Kenten's shadow. Complacency and narcissism blind you to offered blessings. Turn your gaze outward—the universe extends its hand.",
    keywords: ["complacency", "narcissism", "apathy", "introspection"],
    element: "Water",
    imageUrl: "/images/cards/4-cups.jpeg"
  },
  {
    id: "five-cups",
    name: "Five of Cups",
    number: 5,
    suit: "cups",
    adinkraSymbol: "Mmere Dane",
    adinkraMeaning: "Time changes, fortune is cyclical",
    tarotMeaning: "Regret, failure, disappointment, pessimism",
    fusedInterpretation: "Three cups have spilled in Mmere Dane's turning wheel. Regret and self-pity cloud vision, yet two cups remain behind you. Time transforms all sorrow—turn around.",
    keywords: ["regret", "selfpity", "loss", "perspective"],
    element: "Water",
    imageUrl: "/images/cards/5-cups.jpeg"
  },
  {
    id: "six-cups",
    name: "Six of Cups",
    number: 6,
    suit: "cups",
    adinkraSymbol: "Yebehyia Bio",
    adinkraMeaning: "We shall meet again, reunion and soulmate connection",
    tarotMeaning: "Revisiting the past, childhood memories, innocence, joy",
    fusedInterpretation: "Six cups bloom with Yebehyia Bio's promise of reunion. Soulmate meets nemesis in the dance of karmic return. The past offers gifts—and lessons—when embraced with wisdom.",
    keywords: ["soulmate", "reunion", "nemesis", "karmic return"],
    element: "Water",
    imageUrl: "/images/cards/6-cups.jpeg"
  },
  {
    id: "seven-cups",
    name: "Seven of Cups",
    number: 7,
    suit: "cups",
    adinkraSymbol: "Tuo Ne Akofena",
    adinkraMeaning: "Gun and sword, the power of choice in conflict",
    tarotMeaning: "Opportunities, choices, wishful thinking, illusion",
    fusedInterpretation: "Seven cups shimmer with Tuo Ne Akofena's crossed weapons of choice. Every decision has consequences—illusion and opportunity intertwine. Choose with both wisdom and courage.",
    keywords: ["choices", "consequences", "illusion", "discernment"],
    element: "Water",
    imageUrl: "/images/cards/7-cups.jpeg"
  },
  {
    id: "eight-cups",
    name: "Eight of Cups",
    number: 8,
    suit: "cups",
    adinkraSymbol: "Wawa Aba",
    adinkraMeaning: "Seed of the wawa tree, hardiness through departure",
    tarotMeaning: "Disappointment, abandonment, withdrawal, escapism",
    fusedInterpretation: "Eight cups stand complete, yet Wawa Aba's seed calls you to depart. What seemed fulfilling no longer satisfies—abandon the familiar to find what truly nourishes.",
    keywords: ["departure", "abandon", "seeking", "courage"],
    element: "Water",
    imageUrl: "/images/cards/8-cups.jpeg"
  },
  {
    id: "nine-cups",
    name: "Nine of Cups",
    number: 9,
    suit: "cups",
    adinkraSymbol: "Kintinkantan",
    adinkraMeaning: "Puffed up pride, arrogance mixed with accomplishment",
    tarotMeaning: "Contentment, satisfaction, gratitude, wish fulfilled",
    fusedInterpretation: "Nine cups arc with Kintinkantan's interlocking pride. Wishes fulfilled bring reputation—but guard against showoff tendencies. True satisfaction needs no audience.",
    keywords: ["reputable", "showoff", "satisfaction", "pride"],
    element: "Water",
    imageUrl: "/images/cards/9-cups.jpeg"
  },
  {
    id: "ten-cups",
    name: "Ten of Cups",
    number: 10,
    suit: "cups",
    adinkraSymbol: "Bese Saka",
    adinkraMeaning: "Sack of cola nuts, abundance, affluence, and unity",
    tarotMeaning: "Divine love, blissful relationships, harmony, alignment",
    fusedInterpretation: "Ten cups overflow with Bese Saka's abundant prosperity. Emotional fulfillment reaches its zenith—but beware indulgence. True happiness is shared, not hoarded.",
    keywords: ["prosperity", "indulgence", "abundance", "fulfillment"],
    element: "Water",
    imageUrl: "/images/cards/10-cups.jpeg"
  },
  {
    id: "boy-cups",
    name: "Boy of Cups",
    number: "Boy",
    suit: "cups",
    adinkraSymbol: "Agyinduwura",
    adinkraMeaning: "Symbol of faithfulness and devoted service",
    tarotMeaning: "Creative opportunities, curiosity, possibility",
    fusedInterpretation: "The Boy gazes into the cup with Agyinduwura's devoted heart. Emotional innocence can become devotion or naivety—discern between those who inspire and those who use.",
    keywords: ["devotion", "user", "innocence", "sensitivity"],
    element: "Water",
    imageUrl: "/images/cards/boy-cups.jpeg"
  },
  {
    id: "girl-cups",
    name: "Girl of Cups",
    number: "Girl",
    suit: "cups",
    adinkraSymbol: "Fafanto",
    adinkraMeaning: "The butterfly, gentleness, honesty, and fragility",
    tarotMeaning: "Creativity, romance, charm, imagination, beauty",
    fusedInterpretation: "The Girl carries the cup with Fafanto's delicate grace. A confidant who keeps secrets—or a gossip who spreads them. Beauty can mask both loyalty and betrayal.",
    keywords: ["confidant", "gossip", "charm", "fragility"],
    element: "Water",
    imageUrl: "/images/cards/girl-cups.jpeg"
  },
  {
    id: "woman-cups",
    name: "Woman of Cups",
    number: "Woman",
    suit: "cups",
    adinkraSymbol: "Osram Ne Nsoromma",
    adinkraMeaning: "Moon and star, love, faithfulness, and feminine bond",
    tarotMeaning: "Compassion, calm, comfort, intuition",
    fusedInterpretation: "The Woman holds Osram Ne Nsoromma's celestial chalice. As matriarch she nurtures—but beware the shadow of the evil stepmother. Love and control wear similar faces.",
    keywords: ["matriarch", "evil stepmother", "nurturing", "control"],
    element: "Water",
    imageUrl: "/images/cards/woman-cups.jpeg"
  },
  {
    id: "man-cups",
    name: "Man of Cups",
    number: "Man",
    suit: "cups",
    adinkraSymbol: "Kete Pa",
    adinkraMeaning: "Good mat, good character and hospitality",
    tarotMeaning: "Emotionally balanced, compassionate, diplomatic",
    fusedInterpretation: "The Man holds court with Kete Pa's woven wisdom. A patriarch who provides shelter—or a charlatan who weaves deception. Emotional mastery can heal or manipulate.",
    keywords: ["patriarch", "charlatan", "diplomacy", "hospitality"],
    element: "Water",
    imageUrl: "/images/cards/man-cups.jpeg"
  }
];

// Minor Arcana - Swords (Air/Mind)
export const swords: CardType[] = [
  {
    id: "ace-swords",
    name: "Ace of Swords",
    number: 1,
    suit: "swords",
    adinkraSymbol: "Nea Onnim No Sua A, Ohu",
    adinkraMeaning: "He who does not know can know from learning",
    tarotMeaning: "Breakthroughs, new ideas, mental clarity, success",
    fusedInterpretation: "The Ace rises with Nea Onnim's promise of truth through knowledge. Cut through mirage and illusion—the sword of understanding awaits those who seek.",
    keywords: ["truth", "mirage", "clarity", "breakthrough"],
    element: "Air",
    imageUrl: "/images/cards/ace-swords.jpeg"
  },
  {
    id: "two-swords",
    name: "Two of Swords",
    number: 2,
    suit: "swords",
    adinkraSymbol: "Mrammuo",
    adinkraMeaning: "Crossed swords, the balance of justice",
    tarotMeaning: "Difficult decisions, weighing options, stalemate, denial",
    fusedInterpretation: "Two swords cross in Mrammuo's square of decision. Remain ambiguous at your peril—or choose decisively and face the consequences. Balance demands resolution.",
    keywords: ["ambiguous", "decided", "balance", "stalemate"],
    element: "Air",
    imageUrl: "/images/cards/2-swords.jpeg"
  },
  {
    id: "three-swords",
    name: "Three of Swords",
    number: 3,
    suit: "swords",
    adinkraSymbol: "Odo Nnyew Fie Kwan",
    adinkraMeaning: "Love never loses its way home",
    tarotMeaning: "Heartbreak, emotional pain, sorrow, grief, hurt",
    fusedInterpretation: "The sword pierces Odo Nnyew's heart of love. Despair and derision follow betrayal—yet love's path home remains. Even broken hearts can find their way.",
    keywords: ["despair", "derision", "heartbreak", "return"],
    element: "Air",
    imageUrl: "/images/cards/3-swords.jpeg"
  },
  {
    id: "four-swords",
    name: "Four of Swords",
    number: 4,
    suit: "swords",
    adinkraSymbol: "Akoma",
    adinkraMeaning: "The heart, patience and endurance",
    tarotMeaning: "Rest, relaxation, meditation, contemplation, recuperation",
    fusedInterpretation: "Akoma's heart finds respite in stillness. After battle, rest restores—but beware rigor mortis of the soul. Know when recovery becomes avoidance.",
    keywords: ["respite", "rigor", "meditation", "restoration"],
    element: "Air",
    imageUrl: "/images/cards/4-swords.jpeg"
  },
  {
    id: "five-swords",
    name: "Five of Swords",
    number: 5,
    suit: "swords",
    adinkraSymbol: "Tumi Te Se Kosua",
    adinkraMeaning: "Power is like an egg, fragile authority",
    tarotMeaning: "Conflict, disagreements, competition, defeat, winning at all costs",
    fusedInterpretation: "Tumi Te Se Kosua warns: power shatters easily. The recalcitrant refuse to yield—but the realistic know when victory costs too much. Choose your battles.",
    keywords: ["recalcitrant", "realistic", "conflict", "fragility"],
    element: "Air",
    imageUrl: "/images/cards/5-swords.jpeg"
  },
  {
    id: "six-swords",
    name: "Six of Swords",
    number: 6,
    suit: "swords",
    adinkraSymbol: "Tabono",
    adinkraMeaning: "Oar, strength and perseverance",
    tarotMeaning: "Transition, change, rite of passage, releasing baggage",
    fusedInterpretation: "Tabono's oar guides you through troubled waters. Delivery to safer shores awaits—but running the gauntlet of transition demands courage and persistence.",
    keywords: ["delivery", "gauntlet", "transition", "perseverance"],
    element: "Air",
    imageUrl: "/images/cards/6-swords.jpeg"
  },
  {
    id: "seven-swords",
    name: "Seven of Swords",
    number: 7,
    suit: "swords",
    adinkraSymbol: "Kramo Bone",
    adinkraMeaning: "Bad Muslim, hypocrisy and deceit",
    tarotMeaning: "Betrayal, deception, getting away with something, acting strategically",
    fusedInterpretation: "Kramo Bone's knotted deceit tangles truth with lies. Cunning may serve survival—but trickery corrodes the soul. Choose your strategies wisely.",
    keywords: ["deceit", "cunning", "strategy", "hypocrisy"],
    element: "Air",
    imageUrl: "/images/cards/7-swords.jpeg"
  },
  {
    id: "eight-swords",
    name: "Eight of Swords",
    number: 8,
    suit: "swords",
    adinkraSymbol: "Epa",
    adinkraMeaning: "Handcuffs, law and slavery",
    tarotMeaning: "Negative thoughts, self-imposed restriction, imprisonment, victim mentality",
    fusedInterpretation: "Epa's interlocking bonds immobilize the mind. Are you truly trapped, or merely transient in this cage? The chains may be of your own making.",
    keywords: ["immobilized", "transient", "restriction", "self-imposed"],
    element: "Air",
    imageUrl: "/images/cards/8-swords.jpeg"
  },
  {
    id: "nine-swords",
    name: "Nine of Swords",
    number: 9,
    suit: "swords",
    adinkraSymbol: "Denkyem",
    adinkraMeaning: "Crocodile, adaptability and survival",
    tarotMeaning: "Anxiety, worry, fear, depression, nightmares",
    fusedInterpretation: "Denkyem's crocodile lurks in nightmare waters. Terror stalks the sleepless mind—but the resolute find strength even in darkness. Face the shadows.",
    keywords: ["terrify", "resolute", "anxiety", "adaptability"],
    element: "Air",
    imageUrl: "/images/cards/9-swords.jpeg"
  },
  {
    id: "ten-swords",
    name: "Ten of Swords",
    number: 10,
    suit: "swords",
    adinkraSymbol: "Okodee Mmowere",
    adinkraMeaning: "Eagle's talons, bravery and strength",
    tarotMeaning: "Painful endings, deep wounds, betrayal, loss, crisis",
    fusedInterpretation: "Okodee Mmowere's talons eviscerate—the final blow. Yet even in complete destruction, choose to end humanely. From ashes, the eagle rises again.",
    keywords: ["eviscerate", "humanely", "ending", "rebirth"],
    element: "Air",
    imageUrl: "/images/cards/10-swords.jpeg"
  },
  {
    id: "boy-swords",
    name: "Boy of Swords",
    number: "Boy",
    suit: "swords",
    adinkraSymbol: "Akofena",
    adinkraMeaning: "Sword of war, courage and valor",
    tarotMeaning: "New ideas, curiosity, thirst for knowledge, new ways of communicating",
    fusedInterpretation: "The Boy brandishes Akofena with fierce conviction. Quick-minded and sharp-tongued—but provocation without wisdom invites conflict. Channel this edge wisely.",
    keywords: ["conviction", "provocation", "courage", "curiosity"],
    element: "Air",
    imageUrl: "/images/cards/boy-swords.jpeg"
  },
  {
    id: "girl-swords",
    name: "Girl of Swords",
    number: "Girl",
    suit: "swords",
    adinkraSymbol: "Hwemudua",
    adinkraMeaning: "Measuring stick, excellence and quality control",
    tarotMeaning: "Ambitious, action-oriented, driven to succeed, fast-thinking",
    fusedInterpretation: "The Girl wields Hwemudua's measuring blade—informative and precise. But beware the stalker's obsession with perfection. Knowledge serves, not controls.",
    keywords: ["informative", "stalker", "precision", "ambition"],
    element: "Air",
    imageUrl: "/images/cards/girl-swords.jpeg"
  },
  {
    id: "woman-swords",
    name: "Woman of Swords",
    number: "Woman",
    suit: "swords",
    adinkraSymbol: "Fawohodie",
    adinkraMeaning: "Independence and freedom",
    tarotMeaning: "Independent, unbiased judgement, clear boundaries, direct communication",
    fusedInterpretation: "The Woman wields Fawohodie's blade of pristine independence. Her clarity cuts through illusion—but merciless judgment severs connection. Balance truth with compassion.",
    keywords: ["pristine", "merciless", "independence", "clarity"],
    element: "Air",
    imageUrl: "/images/cards/woman-swords.jpeg"
  },
  {
    id: "man-swords",
    name: "Man of Swords",
    number: "Man",
    suit: "swords",
    adinkraSymbol: "Mate Masie",
    adinkraMeaning: "What I hear I keep, wisdom and prudence",
    tarotMeaning: "Mental clarity, intellectual power, authority, truth",
    fusedInterpretation: "The Man wields Mate Masie's blade of integrity—he listens before judging. But beware the insidious edge of cold logic without compassion.",
    keywords: ["integrity", "insidious", "authority", "wisdom"],
    element: "Air",
    imageUrl: "/images/cards/man-swords.jpeg"
  }
];

// Minor Arcana - Pentacles (Earth/Material)
export const pentacles: CardType[] = [
  {
    id: "ace-pentacles",
    name: "Ace of Pentacles",
    number: 1,
    suit: "pentacles",
    adinkraSymbol: "Obohemmaa",
    adinkraMeaning: "Queen of gems, purity and royalty",
    tarotMeaning: "New financial opportunity, manifestation, abundance",
    fusedInterpretation: "The Ace emerges bearing Obohemmaa's promise of true value. New material opportunity presents itself—but is it an asset or liability? Discern wisely.",
    keywords: ["value", "liability", "opportunity", "manifestation"],
    element: "Earth",
    imageUrl: "/images/cards/ace-pentacles.jpeg"
  },
  {
    id: "two-pentacles",
    name: "Two of Pentacles",
    number: 2,
    suit: "pentacles",
    adinkraSymbol: "Nkyinkyi",
    adinkraMeaning: "Twisting, initiative and dynamism",
    tarotMeaning: "Multiple priorities, time management, prioritization, adaptability",
    fusedInterpretation: "Two pentacles dance in Nkyinkyi's twisted path. Are you efficient in your juggling—or is it becoming a shitshow? Find rhythm or drown in chaos.",
    keywords: ["efficient", "shitshow", "balance", "adaptability"],
    element: "Earth",
    imageUrl: "/images/cards/2-pentacles.jpeg"
  },
  {
    id: "three-pentacles",
    name: "Three of Pentacles",
    number: 3,
    suit: "pentacles",
    adinkraSymbol: "Boa Me Ne Me Mmoa Wo",
    adinkraMeaning: "Help me and let me help you, cooperation",
    tarotMeaning: "Teamwork, collaboration, learning, implementation",
    fusedInterpretation: "Three pentacles rise through Boa Me Ne Me Mmoa Wo's exchange. True collaboration enriches all—but beware usury disguised as partnership.",
    keywords: ["collaboration", "usury", "teamwork", "skill"],
    element: "Earth",
    imageUrl: "/images/cards/3-pentacles.jpeg"
  },
  {
    id: "four-pentacles",
    name: "Four of Pentacles",
    number: 4,
    suit: "pentacles",
    adinkraSymbol: "Aban",
    adinkraMeaning: "Fence, fortress of security",
    tarotMeaning: "Saving money, security, conservatism, scarcity, control",
    fusedInterpretation: "Four pentacles cling within Aban's crossed fence. Are you a wise protectionist—or a fearful hoarder? Security becomes prison when grip cannot loosen.",
    keywords: ["protectionist", "hoarder", "security", "control"],
    element: "Earth",
    imageUrl: "/images/cards/4-pentacles.jpeg"
  },
  {
    id: "five-pentacles",
    name: "Five of Pentacles",
    number: 5,
    suit: "pentacles",
    adinkraSymbol: "Onyankopon Adom Ntibiribiara Bey Eyie",
    adinkraMeaning: "By God's grace all will be well",
    tarotMeaning: "Financial loss, poverty, lack mindset, isolation, worry",
    fusedInterpretation: "Five pentacles gleam beyond reach in poverty's cold. Yet Onyankopon's grace promises rebound from despair. Even in lack, hope persists.",
    keywords: ["poverty", "rebound", "hardship", "grace"],
    element: "Earth",
    imageUrl: "/images/cards/5-pentacles.jpeg"
  },
  {
    id: "six-pentacles",
    name: "Six of Pentacles",
    number: 6,
    suit: "pentacles",
    adinkraSymbol: "Woforo Dua Pa A",
    adinkraMeaning: "When you climb a good tree, support and cooperation",
    tarotMeaning: "Giving, receiving, sharing wealth, generosity, charity",
    fusedInterpretation: "Six pentacles flow through Woforo Dua Pa A's reciprocal scales. True generosity creates cycles—but is your giving reciprocal or miserly in spirit?",
    keywords: ["reciprocal", "miserly", "generosity", "charity"],
    element: "Earth",
    imageUrl: "/images/cards/6-pentacles.jpeg"
  },
  {
    id: "seven-pentacles",
    name: "Seven of Pentacles",
    number: 7,
    suit: "pentacles",
    adinkraSymbol: "Hwe Mu Dua",
    adinkraMeaning: "Measuring stick, excellence and quality",
    tarotMeaning: "Long-term view, sustainable results, perseverance, investment",
    fusedInterpretation: "Seven pentacles grow under Hwe Mu Dua's patient measure. Will you tend your garden with care—or give only cursory attention? Growth rewards the diligent.",
    keywords: ["tend", "cursory", "patience", "assessment"],
    element: "Earth",
    imageUrl: "/images/cards/7-pentacles.jpeg"
  },
  {
    id: "eight-pentacles",
    name: "Eight of Pentacles",
    number: 8,
    suit: "pentacles",
    adinkraSymbol: "Nkyimu",
    adinkraMeaning: "Crossed divisions, skillfulness and precision",
    tarotMeaning: "Apprenticeship, repetitive tasks, mastery, skill development",
    fusedInterpretation: "Eight pentacles align through Nkyimu's precise grid. True mastery emerges from disciplined practice—but purposeless repetition leads nowhere. Know your aim.",
    keywords: ["mastery", "purposeless", "skill", "precision"],
    element: "Earth",
    imageUrl: "/images/cards/8-pentacles.jpeg"
  },
  {
    id: "nine-pentacles",
    name: "Nine of Pentacles",
    number: 9,
    suit: "pentacles",
    adinkraSymbol: "Abe Dua",
    adinkraMeaning: "Palm tree, self-sufficiency and vitality",
    tarotMeaning: "Abundance, luxury, self-sufficiency, financial independence",
    fusedInterpretation: "Nine pentacles flourish around Abe Dua's selfmade abundance. You've built this garden alone—but has self-sufficiency become isolation? Share your harvest.",
    keywords: ["selfmade", "isolated", "abundance", "independence"],
    element: "Earth",
    imageUrl: "/images/cards/9-pentacles.jpeg"
  },
  {
    id: "ten-pentacles",
    name: "Ten of Pentacles",
    number: 10,
    suit: "pentacles",
    adinkraSymbol: "Nserewa",
    adinkraMeaning: "Cowrie shells, affluence and wealth",
    tarotMeaning: "Wealth, financial security, family, long-term success, contribution",
    fusedInterpretation: "Ten pentacles cascade through Nserewa's generational riches. Wealth becomes legacy—but unchecked abundance breeds decadence. Steward wisely across time.",
    keywords: ["riches", "decadence", "legacy", "wealth"],
    element: "Earth",
    imageUrl: "/images/cards/10-pentacles.jpeg"
  },
  {
    id: "boy-pentacles",
    name: "Boy of Pentacles",
    number: "Boy",
    suit: "pentacles",
    adinkraSymbol: "Ahoden",
    adinkraMeaning: "Strength of mind and body",
    tarotMeaning: "Manifestation, financial opportunity, skill development",
    fusedInterpretation: "The Boy studies with Ahoden's earnest commitment to mastery. Dreams meet practical planning—but beware when dedication becomes obsession. Balance ambition with life.",
    keywords: ["commitment", "obsession", "ambition", "learning"],
    element: "Earth",
    imageUrl: "/images/cards/boy-pentacles.jpeg"
  },
  {
    id: "girl-pentacles",
    name: "Girl of Pentacles",
    number: "Girl",
    suit: "pentacles",
    adinkraSymbol: "Ese Ne Tekrema",
    adinkraMeaning: "The teeth and tongue, friendship and interdependence",
    tarotMeaning: "Hard work, productivity, routine, conservatism",
    fusedInterpretation: "The Girl serves with Ese Ne Tekrema's devoted reliability. Steadfast loyalty builds trust—but beware when devotion becomes insubordinate defiance. Know your boundaries.",
    keywords: ["devotion", "insubordinate", "reliability", "dedication"],
    element: "Earth",
    imageUrl: "/images/cards/girl-pentacles.jpeg"
  },
  {
    id: "woman-pentacles",
    name: "Woman of Pentacles",
    number: "Woman",
    suit: "pentacles",
    adinkraSymbol: "Awurade Baatanfo",
    adinkraMeaning: "God is the guardian, divine providence",
    tarotMeaning: "Nurturing, practical, providing financially, working parent",
    fusedInterpretation: "The Woman nurtures through Awurade Baatanfo's divine care. True nurturing empowers growth—but beware the Munchausen shadow of creating dependency. Love liberates.",
    keywords: ["nurturer", "munchausen", "abundance", "practical"],
    element: "Earth",
    imageUrl: "/images/cards/woman-pentacles.jpeg"
  },
  {
    id: "man-pentacles",
    name: "Man of Pentacles",
    number: "Man",
    suit: "pentacles",
    adinkraSymbol: "Bese Saka",
    adinkraMeaning: "Bunch of cola nuts, affluence and abundance",
    tarotMeaning: "Wealth, business, leadership, security, discipline, abundance",
    fusedInterpretation: "The Man commands through Bese Saka's abundant provision. True providers build empires that serve—but ego unchecked becomes egomaniac tyranny. Lead with humility.",
    keywords: ["provider", "egomaniac", "wealth", "mastery"],
    element: "Earth",
    imageUrl: "/images/cards/man-pentacles.jpeg"
  }
];

// All cards combined
export const allCards: CardType[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
];

// Helper functions
export function getCardById(id: string): CardType | undefined {
  return allCards.find(card => card.id === id);
}

export function getCardsBySuit(suit: CardSuit): CardType[] {
  return allCards.filter(card => card.suit === suit);
}

export function getRandomCard(): CardType {
  return allCards[Math.floor(Math.random() * allCards.length)];
}

export function getRandomCards(count: number): CardType[] {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Draw cards with cosmic polarity - the universe decides upright or reversed
export function drawCardsWithPolarity(count: number): DrawnCard[] {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  const selectedCards = shuffled.slice(0, count);
  
  return selectedCards.map((card) => {
    // Cosmic synchronicity determines polarity (roughly 50/50 with slight variance)
    const cosmicChance = Math.random();
    const polarity: CardPolarity = cosmicChance < 0.5 ? "upright" : "reversed";
    
    // Split keywords for polarity (first half light, second half shadow tendencies)
    const midpoint = Math.ceil(card.keywords.length / 2);
    const polarityKeywords = polarity === "upright" 
      ? card.keywords.slice(0, midpoint)
      : card.keywords.slice(midpoint);
    
    return {
      ...card,
      polarity,
      polarityKeywords: polarityKeywords.length > 0 ? polarityKeywords : card.keywords,
    };
  });
}

export const suitInfo: Record<CardSuit, { name: string; element: string; color: string; description: string }> = {
  major: {
    name: "Major Arcana",
    element: "Spirit",
    color: "#d4af37",
    description: "The Fool's journey through life's profound archetypes"
  },
  wands: {
    name: "Wands",
    element: "Fire",
    color: "#e85d04",
    description: "Passion, creativity, will, and spiritual energy"
  },
  cups: {
    name: "Cups",
    element: "Water",
    color: "#7b8cce",
    description: "Emotions, relationships, intuition, and the subconscious"
  },
  swords: {
    name: "Swords",
    element: "Air",
    color: "#a8b4d4",
    description: "Intellect, thoughts, communication, and conflict"
  },
  pentacles: {
    name: "Pentacles",
    element: "Earth",
    color: "#2d6a4f",
    description: "Material world, career, finances, and physical health"
  }
};
