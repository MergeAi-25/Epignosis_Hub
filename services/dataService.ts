
import type { BlogPost, Quiz, QuizQuestion, QuizOption, StudyTopic, StudyTopicSection, UserData, UserQuizProgress, DailyScripture } from '../types';
import { QuizLevel } from '../types';
import { LOCAL_STORAGE_USER_DATA_KEY } from '../constants';

// Helper to generate placeholder questions
const generatePlaceholderQuestion = (quizId: string, index: number, existingQuestionCount: number): QuizQuestion => {
  const questionNumber = existingQuestionCount + index + 1;
  return {
    id: `${quizId}_placeholder_${questionNumber}`,
    text: `Placeholder Question ${questionNumber} for this quiz. What is 2 + ${index}?`,
    options: [
      { id: 'a', text: `Answer is ${2 + index -1}` },
      { id: 'b', text: `Correct answer: ${2 + index}` },
      { id: 'c', text: `Answer is ${2 + index + 1}` },
      { id: 'd', text: `Answer is ${2 + index + 2}` },
    ],
    correctOptionId: 'b',
    explanation: `This is a placeholder explanation. The correct answer is indeed ${2 + index}.`,
  };
};

const adjustQuestionCount = (quiz: Quiz): QuizQuestion[] => {
  let targetCount: number;
  switch (quiz.level) {
    case QuizLevel.Beginner:
      targetCount = 10; // Fixed requirement
      break;
    case QuizLevel.Intermediate:
      targetCount = 20; // Fixed requirement
      break;
    case QuizLevel.Advanced:
      targetCount = 30; // Fixed requirement
      break;
    default:
      // This case should ideally not be reached if levels are always correctly assigned
      console.warn(`Quiz ${quiz.id} has an unknown level: ${quiz.level}. Defaulting to existing question count.`);
      targetCount = quiz.questions.length;
  }

  const currentCount = quiz.questions.length;
  if (currentCount === targetCount) {
    return quiz.questions;
  } else if (currentCount < targetCount) {
    const questionsToAdd = targetCount - currentCount;
    const newQuestions: QuizQuestion[] = [];
    for (let i = 0; i < questionsToAdd; i++) {
      // Pass the actual currentCount to ensure placeholder IDs/text are unique if called multiple times
      newQuestions.push(generatePlaceholderQuestion(quiz.id, i, currentCount));
    }
    return [...quiz.questions, ...newQuestions];
  } else { // currentCount > targetCount
    // Truncate if the existing quiz has more questions than the target
    console.warn(`Quiz ${quiz.id} has ${currentCount} questions, exceeding target of ${targetCount}. Truncating.`);
    return quiz.questions.slice(0, targetCount);
  }
};


// Mock Data
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Epignosis: The Depth of Knowing Christ',
    author: 'Xolani Hlatshwayo',
    date: '2024-07-15T10:00:00Z',
    imageUrl: 'https://source.unsplash.com/800x600/?bible,open_book,light,christianity',
    summary: 'Explore the profound meaning of "epignosis" and its significance in the believer\'s journey to truly know Jesus Christ. This post delves deeper into the nuances of this critical Greek term.',
    content: `
      <p>Epignosis (ἐπίγνωσIS) is a Greek term that denotes a precise, full, and thorough knowledge. In the New Testament, it often refers to a deeper, more intimate understanding of God and His will, moving beyond mere factual awareness ('gnosis') to experiential and transformative knowledge. This post delves into scriptural references and theological insights on how believers can cultivate this transformative knowledge of Christ.</p>
      <h3>Distinguishing Epignosis from Gnosis</h3>
      <p>While 'gnosis' refers to general knowledge or understanding, 'epignosis' signifies a more complete, accurate, and comprehensive knowledge. It's the difference between knowing about someone and truly knowing them personally. In a spiritual context, epignosis is crucial for maturity and effective Christian living. It involves not just intellectual assent but a heartfelt embrace of truth that shapes one's character and conduct.</p>
      <h3>Key Scriptures on Epignosis:</h3>
      <ul>
        <li><strong>Philippians 1:9-11:</strong> Paul prays that the Philippians' love may abound more and more in knowledge (epignosis) and all discernment, so they may approve what is excellent and be pure and blameless for the day of Christ.</li>
        <li><strong>Colossians 1:9-10:</strong> Paul desires for the Colossians to be filled with the knowledge (epignosis) of God’s will in all spiritual wisdom and understanding, so as to walk in a manner worthy of the Lord, fully pleasing to him, bearing fruit in every good work and increasing in the knowledge (epignosis) of God.</li>
        <li><strong>Ephesians 1:17-19:</strong> The prayer here is for the Spirit of wisdom and of revelation in the knowledge (epignosis) of Him, having the eyes of their hearts enlightened.</li>
        <li><strong>2 Peter 1:2-3:</strong> Grace and peace be multiplied to you in the knowledge (epignosis) of God and of Jesus our Lord. His divine power has granted to us all things that pertain to life and godliness, through the knowledge (epignosis) of him who called us to his own glory and excellence.</li>
      </ul>
      <h3>Cultivating Epignosis</h3>
      <p>Cultivating epignosis involves several key practices:
        <ol>
          <li><strong>Diligent Study of Scripture:</strong> The Bible is the primary source of God's revelation. Engaging with it deeply and consistently is foundational.</li>
          <li><strong>Prayer for Understanding:</strong> As seen in Paul's prayers, we should ask God for spiritual wisdom and revelation.</li>
          <li><strong>Obedience to God's Commands:</strong> Living out what we know deepens our understanding and experience of God.</li>
          <li><strong>Fellowship with Other Believers:</strong> Learning and growing together within the community of faith provides encouragement and shared insights.</li>
          <li><strong>Meditation and Reflection:</strong> Taking time to ponder God's truths allows them to penetrate our hearts and minds more fully.</li>
        </ol>
      </p>
      <p>Join us as we unpack the richness of epignosis and its power to transform our faith, leading to a deeper relationship with Jesus Christ and a life that truly honors Him.</p>
    `,
    tags: ['theology', 'epignosis', 'spiritual growth', 'greek words']
  },
  {
    id: '2',
    title: 'The Role of the Holy Spirit in Gaining Spiritual Knowledge',
    author: 'Xolani Hlatshwayo',
    date: '2024-07-22T14:30:00Z',
    imageUrl: 'https://source.unsplash.com/800x600/?dove,light_rays,spiritual_guidance,holy_spirit',
    summary: 'How does the Holy Spirit guide us into all truth and help us understand the deep things of God? This article explores the Spirit\'s vital role in illuminating scripture and transforming hearts.',
    content: `
      <p>The Holy Spirit is our divine teacher, counselor, and guide, indispensable for true spiritual understanding. Without His work, the truths of God can remain obscure or merely intellectual. This article explores key biblical passages to illuminate how the Spirit works in us to reveal God's wisdom and foster genuine epignosis.</p>
      <h3>The Spirit as Teacher and Revealer</h3>
      <ul>
        <li><strong>John 16:13:</strong> Jesus promised, "When the Spirit of truth comes, he will guide you into all the truth, for he will not speak on his own authority, but whatever he hears he will speak, and he will declare to you the things that are to come." This highlights the Spirit's role in leading believers into the fullness of God's truth.</li>
        <li><strong>1 Corinthians 2:10-14:</strong> Paul explains, "...these things God has revealed to us through the Spirit. For the Spirit searches everything, even the depths of God... The natural person does not accept the things of the Spirit of God, for they are folly to him, and he is not able to understand them because they are spiritually discerned." This passage underscores that spiritual truths require spiritual discernment, which is a gift of the Holy Spirit.</li>
        <li><strong>Ephesians 1:17:</strong> Paul prays for believers to receive "the Spirit of wisdom and of revelation in the knowledge of him." This emphasizes that knowing God deeply is a work of the Spirit.</li>
      </ul>
      <h3>How the Spirit Illuminates Scripture</h3>
      <p>Illumination is the work of the Holy Spirit that enables believers to understand and apply the Word of God. While the Bible is objectively true, its spiritual significance and personal application become clear through the Spirit's ministry. He does not add new revelation beyond Scripture but helps us grasp the meaning and relevance of what is already written. This involves:
        <ul>
          <li>Opening our minds to understand the Scriptures (Luke 24:45).</li>
          <li>Bringing conviction of sin, righteousness, and judgment (John 16:8).</li>
          <li>Testifying about Christ (John 15:26).</li>
          <li>Transforming us into Christ's likeness as we behold His glory in the Word (2 Corinthians 3:18).</li>
        </ul>
      </p>
      <h3>Practical Ways to Be Receptive to the Spirit's Teaching:</h3>
      <ol>
        <li><strong>Prayer for Illumination:</strong> Before reading the Bible, ask the Holy Spirit to open your heart and mind to His truth (Psalm 119:18).</li>
        <li><strong>Humility:</strong> Approach Scripture with a teachable spirit, willing to submit to its authority.</li>
        <li><strong>Obedience:</strong> A willingness to obey what is learned creates a greater capacity for understanding.</li>
        <li><strong>Meditation:</strong> Reflect deeply on passages, asking the Spirit to reveal their meaning and application.</li>
        <li><strong>Community:</strong> Discussing Scripture with other believers can provide new insights as the Spirit works through the body of Christ.</li>
      </ol>
      <p>The Holy Spirit's ministry is essential for every believer seeking to grow in the grace and knowledge of our Lord Jesus Christ. By depending on Him, we can move from a superficial understanding to a deep, life-changing encounter with the living God through His Word.</p>
    `,
    tags: ['holy spirit', 'revelation', 'discipleship', 'bible study', 'illumination']
  },
  {
    id: '3',
    title: 'The Centrality of the Cross in Christian Faith',
    author: 'Xolani Hlatshwayo',
    date: '2024-08-01T09:00:00Z',
    imageUrl: 'https://source.unsplash.com/800x600/?cross_silhouette,sunset_Calvary,christian_symbol',
    summary: 'The cross of Christ is not merely a historical event but the very heart of the Christian message. This article explores its profound significance for salvation, reconciliation, and Christian living.',
    content: `
      <p>For Christians, the cross is the most profound symbol of their faith. It represents not suffering and death in isolation, but the pivotal act of God's redemptive plan for humanity. Understanding its centrality is crucial for a robust and biblically grounded faith.</p>
      <h3>Atonement and Sacrifice</h3>
      <p>At its core, the cross is about atonement – God's provision for reconciling sinful humanity to Himself. The Old Testament sacrificial system, with its emphasis on blood sacrifice for the remission of sins (Leviticus 17:11), pointed forward to the ultimate sacrifice. Jesus Christ, the Lamb of God (John 1:29), offered Himself as a perfect, once-for-all sacrifice for sins (Hebrews 9:26-28, 10:10-14). His death on the cross satisfied the righteous demands of God's justice against sin.</p>
      <p>Key aspects of the atonement include:
        <ul>
          <li><strong>Propitiation:</strong> Appeasing God's wrath against sin (Romans 3:25, 1 John 2:2).</li>
          <li><strong>Expiation:</strong> The removal or covering of sin's guilt.</li>
          <li><strong>Redemption:</strong> Buying back or setting free from slavery to sin (Ephesians 1:7, Galatians 3:13).</li>
          <li><strong>Reconciliation:</strong> Restoring a broken relationship between God and humanity (2 Corinthians 5:18-19, Colossians 1:20-22).</li>
        </ul>
      </p>
      <h3>Victory Over Sin, Death, and Satan</h3>
      <p>The cross was not a defeat but a decisive victory. Through His death and resurrection, Jesus Christ:
        <ul>
          <li><strong>Conquered Sin:</strong> He broke the power of sin in the lives of believers (Romans 6:6-11).</li>
          <li><strong>Defeated Death:</strong> He triumphed over physical and spiritual death, securing eternal life for those who believe (1 Corinthians 15:54-57, Hebrews 2:14-15).</li>
          <li><strong>Disarmed Satan:</strong> He nullified the power of the demonic forces (Colossians 2:15, 1 John 3:8).</li>
        </ul>
      </p>
      <h3>The Cross and Christian Living</h3>
      <p>The message of the cross profoundly shapes the believer's life:
        <ul>
          <li><strong>Foundation of Faith:</strong> Our salvation and relationship with God are based entirely on Christ's finished work on the cross (1 Corinthians 2:2).</li>
          <li><strong>Motivation for Holiness:</strong> Understanding the cost of our redemption motivates us to live lives pleasing to God (1 Peter 1:15-19).</li>
          <li><strong>Call to Self-Denial:</strong> Jesus calls His followers to take up their own cross and follow Him, signifying a life of surrender and sacrifice (Luke 9:23).</li>
          <li><strong>Power for Service:</strong> The "word of the cross is the power of God" (1 Corinthians 1:18), empowering us for witness and service.</li>
          <li><strong>Source of Humility and Unity:</strong> The cross demonstrates God's immense love and should lead to humility and unity among believers (Philippians 2:1-11).</li>
        </ul>
      </p>
      <p>The cross stands as an eternal testament to God's love, justice, and wisdom. It is the ground of our hope, the source of our forgiveness, and the pattern for our lives. As believers, we are called to "boast only in the cross of our Lord Jesus Christ" (Galatians 6:14).</p>
    `,
    tags: ['cross', 'atonement', 'salvation', 'theology', 'christian living']
  },
  {
    id: '4',
    title: 'Prayer: A Dialogue with the Divine',
    author: 'Xolani Hlatshwayo',
    date: '2024-08-10T11:00:00Z',
    imageUrl: 'https://source.unsplash.com/800x600/?praying_hands,bible,quiet_reflection,prayer',
    summary: 'Prayer is more than a religious ritual; it is a vital, ongoing conversation with God. This post explores the nature, importance, types, and practice of prayer in the Christian life.',
    content: `
      <p>Prayer is one of the most fundamental aspects of the Christian faith. It is our direct line of communication with the Creator of the universe, a privilege made possible through Jesus Christ. Far from being a monologue or a mere wish list, true prayer is a dynamic dialogue with God.</p>
      <h3>The Nature and Importance of Prayer</h3>
      <p>At its heart, prayer is an expression of our relationship with God. It acknowledges His sovereignty, our dependence, and the intimacy He desires with us. The Bible consistently emphasizes the importance of prayer:
        <ul>
          <li><strong>Commanded by God:</strong> "Pray without ceasing" (1 Thessalonians 5:17); "Continue steadfastly in prayer" (Colossians 4:2).</li>
          <li><strong>Modeled by Jesus:</strong> The Gospels frequently show Jesus withdrawing to pray, even in the midst of a demanding ministry (Mark 1:35, Luke 6:12). He also taught His disciples how to pray (Matthew 6:9-13).</li>
          <li><strong>Essential for Spiritual Life:</strong> Just as physical breath is necessary for physical life, prayer is essential for spiritual vitality and growth.</li>
        </ul>
      </p>
      <h3>Types of Prayer (ACTS Model)</h3>
      <p>A common acronym to remember different facets of prayer is ACTS:
        <ul>
          <li><strong>Adoration:</strong> Praising and worshiping God for who He is – His attributes, character, and majesty (Psalm 95:6, Revelation 4:11).</li>
          <li><strong>Confession:</strong> Honestly acknowledging and repenting of our sins before God, seeking His forgiveness and cleansing (Psalm 51, 1 John 1:9).</li>
          <li><strong>Thanksgiving:</strong> Expressing gratitude to God for His blessings, His goodness, His answers to prayer, and His constant presence (Philippians 4:6, Ephesians 5:20).</li>
          <li><strong>Supplication:</strong> Making our requests known to God. This includes:
            <ul>
              <li><em>Petition:</em> Praying for our own needs (Matthew 7:7-11).</li>
              <li><em>Intercession:</em> Praying on behalf of others (1 Timothy 2:1-2, James 5:16).</li>
            </ul>
          </li>
        </ul>
      </p>
      <h3>Practicing Effective Prayer</h3>
      <p>While there is no magic formula for prayer, certain attitudes and practices can enrich our prayer lives:
        <ul>
          <li><strong>Faith:</strong> Believing that God hears and answers prayer according to His will (Hebrews 11:6, Mark 11:24).</li>
          <li><strong>Sincerity:</strong> Praying from the heart, rather than merely reciting words (Matthew 6:7).</li>
          <li><strong>Persistence:</strong> Not giving up easily in prayer (Luke 18:1-8).</li>
          <li><strong>According to God's Will:</strong> Aligning our desires with God's purposes (1 John 5:14-15). This requires knowing His will through Scripture.</li>
          <li><strong>In Jesus' Name:</strong> Praying with the authority and on the merits of Jesus Christ (John 14:13-14).</li>
          <li><strong>Listening:</strong> Prayer is a two-way conversation. Take time to be still and listen for God's guidance.</li>
        </ul>
      </p>
      <h3>Hindrances to Prayer</h3>
      <p>The Bible also speaks of things that can hinder our prayers, such as unconfessed sin (Psalm 66:18), unforgiveness (Mark 11:25), and wrong motives (James 4:3).</p>
      <p>Developing a consistent and meaningful prayer life is a journey. It requires discipline, but the rewards are immeasurable: a deeper relationship with God, spiritual strength, guidance, and the joy of seeing God work in response to our prayers. Let us approach the throne of grace with confidence, knowing that our Heavenly Father delights to hear from His children.</p>
    `,
    tags: ['prayer', 'spiritual disciplines', 'christian living', 'communication with God']
  },
  {
    id: '5',
    title: 'Biblical Hope: More Than Wishful Thinking',
    author: 'Xolani Hlatshwayo',
    date: '2024-08-18T16:00:00Z',
    imageUrl: 'https://source.unsplash.com/800x600/?anchor,ocean,sunrise,hope_cross',
    summary: 'In a world often filled with uncertainty, biblical hope stands as a firm anchor for the believer\'s soul. This article distinguishes true hope from mere optimism and explores its foundations and impact.',
    content: `
      <p>The word "hope" in contemporary language often implies uncertainty or wishful thinking, as in "I hope it doesn't rain." However, biblical hope (Greek: <em>elpis</em>) is vastly different. It is a confident expectation and firm assurance regarding things that are unseen but true, based on the character and promises of God.</p>
      <h3>Defining Biblical Hope</h3>
      <p>Biblical hope is not a desire for a possible future outcome but a settled conviction about a guaranteed future. It is:
        <ul>
          <li><strong>Certain:</strong> Its fulfillment is as sure as God's faithfulness. "We have this as a sure and steadfast anchor of the soul, a hope that enters into the inner place behind the curtain" (Hebrews 6:19).</li>
          <li><strong>Future-Oriented:</strong> While it impacts the present, its ultimate focus is on God's future promises, particularly the return of Christ, the resurrection, and eternal life (Titus 2:13, 1 Peter 1:3-4).</li>
          <li><strong>Based on God:</strong> Its foundation is not in circumstances or human ability, but in God's unchanging character, His power, and His specific promises revealed in Scripture (Romans 15:13, Hebrews 10:23).</li>
        </ul>
      </p>
      <h3>The Foundation of Our Hope</h3>
      <p>The Christian's hope is not groundless. It is firmly rooted in:
        <ol>
          <li><strong>God's Character:</strong> He is faithful, loving, sovereign, and all-powerful. He cannot lie and He keeps His promises (Numbers 23:19, Titus 1:2).</li>
          <li><strong>The Work of Jesus Christ:</strong> His death and resurrection are the cornerstone of our hope. His resurrection guarantees our own future resurrection and eternal life (1 Corinthians 15:19-22, 1 Peter 1:3).</li>
          <li><strong>The Promises of Scripture:</strong> God's Word is filled with promises that fuel our hope, such as the promise of His presence, provision, guidance, and ultimate victory over evil (Romans 8:28, Philippians 4:19, Revelation 21:3-4).</li>
          <li><strong>The Indwelling Holy Spirit:</strong> The Holy Spirit is given as a "guarantee" or "down payment" of our future inheritance (Ephesians 1:13-14, 2 Corinthians 1:22).</li>
        </ol>
      </p>
      <h3>The Impact of Hope on the Believer's Life</h3>
      <p>Biblical hope is not passive; it actively shapes our present reality:
        <ul>
          <li><strong>Perseverance in Trials:</strong> Hope enables believers to endure suffering and hardship with patience and joy, knowing that present difficulties are temporary and working for an eternal glory (Romans 5:3-5, James 1:2-4, 12).</li>
          <li><strong>Purity and Holiness:</strong> The expectation of Christ's return and our future glorification motivates us to live holy lives (1 John 3:2-3).</li>
          <li><strong>Courage and Boldness:</strong> Hope in God's ultimate triumph gives us courage to live for Him and share our faith, even in the face of opposition (Acts 4:13, 29).</li>
          <li><strong>Joy and Peace:</strong> "May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope" (Romans 15:13).</li>
          <li><strong>Love for Others:</strong> Hope in eternal life frees us from self-preservation and empowers us to love and serve others sacrificially.</li>
        </ul>
      </p>
      <p>In a world that often seems hopeless, biblical hope is a radical and transformative reality. It is not a denial of present struggles but a confident assurance that God is in control and His ultimate purposes will prevail. Let us hold fast to the confession of our hope without wavering, for He who promised is faithful (Hebrews 10:23).</p>
    `,
    tags: ['hope', 'eschatology', 'christian living', 'faith', 'perseverance']
  },
];

// fix: Correct the type definition for mockQuizzesRaw
const mockQuizzesRaw: (Omit<Quiz, 'questions'> & { questions: QuizQuestion[] })[] = [
  // BEGINNER QUIZZES
  {
    id: 'q1',
    title: 'Foundations of Faith',
    description: 'Test your knowledge on the basic doctrines of Christianity.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?cross_symbol,faith_foundation,church_building',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
      { id: 'q1_1', text: 'Who is considered the Son of God in Christianity?', options: [{id:'a',text:'Moses'}, {id:'b',text:'Abraham'}, {id:'c',text:'Jesus Christ'}, {id:'d',text:'David'}], correctOptionId: 'c', explanation: 'Jesus Christ is recognized as the Son of God (John 3:16). He is the second person of the Trinity.' },
      { id: 'q1_2', text: 'What is the central message of the Gospel?', options: [{id:'a',text:'Love your neighbor'}, {id:'b',text:'The Ten Commandments'}, {id:'c',text:'Salvation through faith in Jesus Christ'}, {id:'d',text:'The creation story'}], correctOptionId: 'c', explanation: 'The Gospel (Good News) is about God\'s plan of salvation for humanity through faith in Jesus Christ\'s death and resurrection (Ephesians 2:8-9).' },
      { id: 'q1_3', text: 'What are the first four books of the New Testament collectively called?', options: [{id:'a',text:'The Epistles'}, {id:'b',text:'The Gospels'}, {id:'c',text:'The Pentateuch'}, {id:'d',text:'The Prophets'}], correctOptionId: 'b', explanation: 'The first four books of the New Testament (Matthew, Mark, Luke, and John) are called the Gospels, meaning "good news," and they narrate the life, ministry, death, and resurrection of Jesus Christ.' },
      { id: 'q1_4', text: 'What is the significance of Jesus\' resurrection for Christians?', options: [{id:'a',text:'It proved He was a good teacher'}, {id:'b',text:'It fulfilled Old Testament prophecy only'}, {id:'c',text:'It signifies His victory over sin and death, and guarantees believers\' future resurrection'}, {id:'d',text:'It was a symbolic story'}], correctOptionId: 'c', explanation: 'The resurrection is central to Christian faith, demonstrating Jesus\' divine power, His victory over sin and death, and it is the basis for the believer\'s hope of eternal life and future resurrection (1 Corinthians 15).' },
      { id: 'q1_5', text: 'What is the Holy Trinity?', options: [{id:'a',text:'Three different Gods'}, {id:'b',text:'God appearing in three different modes'}, {id:'c',text:'One God existing in three co-equal and co-eternal persons: Father, Son, and Holy Spirit'}, {id:'d',text:'A council of divine beings'}], correctOptionId: 'c', explanation: 'The doctrine of the Trinity states that there is one God who eternally exists as three distinct persons: the Father, the Son (Jesus Christ), and the Holy Spirit. Each person is fully God, and there is one God.' },
    ],
  },
  {
    id: 'qGenFigures',
    title: 'Key Figures in Genesis',
    description: 'Identify prominent individuals from the book of Genesis.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?ancient_scroll,adam_eve,genesis_characters',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
        { id: 'qGF_1', text: 'Who were the first man and woman created by God?', options: [{id:'a',text:'Abraham and Sarah'}, {id:'b',text:'Isaac and Rebekah'}, {id:'c',text:'Adam and Eve'}, {id:'d',text:'Jacob and Rachel'}], correctOptionId: 'c', explanation: 'Adam and Eve are described in Genesis as the first humans created by God (Genesis 1-2).' },
        { id: 'qGF_2', text: 'Who built an ark to save his family and animals from a great flood?', options: [{id:'a',text:'Moses'}, {id:'b',text:'Noah'}, {id:'c',text:'Joseph'}, {id:'d',text:'Elijah'}], correctOptionId: 'b', explanation: 'Noah was instructed by God to build an ark to preserve life during the great flood (Genesis 6-9).' },
        { id: 'qGF_3', text: 'Who is known as the "Father of Many Nations" and was promised descendants as numerous as the stars?', options: [{id:'a',text:'Jacob'}, {id:'b',text:'Isaac'}, {id:'c',text:'Abraham'}, {id:'d',text:'Adam'}], correctOptionId: 'c', explanation: 'Abraham (originally Abram) received God\'s covenant promise that he would be the father of a multitude of nations (Genesis 17:4-5).' },
        { id: 'qGF_4', text: 'Who was Abraham\'s promised son, through whom the covenant continued?', options: [{id:'a',text:'Ishmael'}, {id:'b',text:'Esau'}, {id:'c',text:'Isaac'}, {id:'d',text:'Joseph'}], correctOptionId: 'c', explanation: 'Isaac was the son of Abraham and Sarah, born in their old age, through whom God\'s covenant promises were to be fulfilled (Genesis 21).' },
        { id: 'qGF_5', text: 'Which of Jacob\'s sons was sold into slavery by his brothers but later rose to prominence in Egypt?', options: [{id:'a',text:'Reuben'}, {id:'b',text:'Judah'}, {id:'c',text:'Benjamin'}, {id:'d',text:'Joseph'}], correctOptionId: 'd', explanation: 'Joseph, favored by his father Jacob, was sold by his jealous brothers but eventually became a powerful ruler in Egypt, saving many from famine (Genesis 37, 39-50).' },
    ]
  },
  {
    id: 'bq_creation',
    title: 'The Creation Story',
    description: 'Test your knowledge about the biblical account of creation in Genesis.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?earth_from_space,genesis_creation_story,garden_of_eden_view',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
      { id: 'bqc_1', text: 'On which day did God create man?', options: [{id:'a',text:'First day'}, {id:'b',text:'Third day'}, {id:'c',text:'Sixth day'}, {id:'d',text:'Seventh day'}], correctOptionId: 'c', explanation: 'God created mankind in His own image on the sixth day of creation (Genesis 1:26-31).' },
      { id: 'bqc_2', text: 'What was created on the first day, according to Genesis 1?', options: [{id:'a',text:'Animals'}, {id:'b',text:'Light'}, {id:'c',text:'Sun, moon, and stars'}, {id:'d',text:'Plants'}], correctOptionId: 'b', explanation: 'On the first day, God said, "Let there be light," and there was light (Genesis 1:3-5).' },
      { id: 'bqc_3', text: 'From what did God form Eve?', options: [{id:'a',text:'Dust of the ground'}, {id:'b',text:'Adam\'s rib'}, {id:'c',text:'An angel'}, {id:'d',text:'Light'}], correctOptionId: 'b', explanation: 'God created Eve from one of Adam\'s ribs (Genesis 2:21-22).' },
      { id: 'bqc_4', text: 'What did God do on the seventh day after completing creation?', options: [{id:'a',text:'Created more animals'}, {id:'b',text:'Planted a garden'}, {id:'c',text:'Rested'}, {id:'d',text:'Gave man dominion'}], correctOptionId: 'c', explanation: 'On the seventh day, God rested from all His work that He had done in creation and blessed it (Genesis 2:2-3).' },
      { id: 'bqc_5', text: 'What was the name of the garden where Adam and Eve lived before the fall?', options: [{id:'a',text:'Garden of Gethsemane'}, {id:'b',text:'Garden of Eden'}, {id:'c',text:'Hanging Gardens of Babylon'}, {id:'d',text:'Promised Land'}], correctOptionId: 'b', explanation: 'Adam and Eve lived in the Garden of Eden (Genesis 2:8,15).' },
    ]
  },
  {
    id: 'bq_moses_early',
    title: 'Life of Moses: Early Life & Exodus',
    description: 'Explore the early life of Moses and the Exodus from Egypt.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?burning_bush_moses,moses_parting_sea,red_sea_exodus',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
      { id: 'bqm_1', text: 'Who found baby Moses hidden in a basket among the reeds of the Nile?', options: [{id:'a',text:'His mother Jochebed'}, {id:'b',text:'His sister Miriam'}, {id:'c',text:'Pharaoh\'s daughter'}, {id:'d',text:'A Hebrew midwife'}], correctOptionId: 'c', explanation: 'Pharaoh\'s daughter discovered baby Moses in the Nile River (Exodus 2:5-6).' },
      { id: 'bqm_2', text: 'Why did Moses flee from Egypt to Midian?', options: [{id:'a',text:'He stole from Pharaoh'}, {id:'b',text:'He killed an Egyptian who was beating a Hebrew'}, {id:'c',text:'He wanted to become a shepherd'}, {id:'d',text:'He was sent on a mission by Pharaoh'}], correctOptionId: 'b', explanation: 'Moses fled Egypt after killing an Egyptian taskmaster and fearing for his life when Pharaoh found out (Exodus 2:11-15).' },
      { id: 'bqm_3', text: 'How did God first speak to Moses, calling him to deliver Israel?', options: [{id:'a',text:'In a dream'}, {id:'b',text:'Through an angel in a pillar of cloud'}, {id:'c',text:'From a burning bush that was not consumed'}, {id:'d',text:'Through a prophet'}], correctOptionId: 'c', explanation: 'God spoke to Moses from a burning bush on Mount Horeb (Sinai) (Exodus 3:1-4).' },
      { id: 'bqm_4', text: 'What was the tenth and final plague God sent upon Egypt?', options: [{id:'a',text:'Plague of frogs'}, {id:'b',text:'Plague of darkness'}, {id:'c',text:'Death of the firstborn sons and animals'}, {id:'d',text:'Plague of locusts'}], correctOptionId: 'c', explanation: 'The final plague was the death of every firstborn in Egypt, both human and animal (Exodus 11-12).' },
      { id: 'bqm_5', text: 'What body of water did God miraculously part for the Israelites to escape the pursuing Egyptian army?', options: [{id:'a',text:'Jordan River'}, {id:'b',text:'Sea of Galilee'}, {id:'c',text:'Red Sea (Sea of Reeds)'}, {id:'d',text:'The Great Sea (Mediterranean)'}], correctOptionId: 'c', explanation: 'God parted the Red Sea (or Sea of Reeds) allowing the Israelites to cross on dry ground (Exodus 14).' },
    ]
  },
  {
    id: 'bq_disciples',
    title: 'The Twelve Disciples',
    description: 'Learn about Jesus\' closest followers, the twelve disciples.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?jesus_with_disciples_art,last_supper_scene,fishing_boat_apostles',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
      { id: 'bqd_1', text: 'Which disciple was a tax collector, also known by the name Levi?', options: [{id:'a',text:'Peter'}, {id:'b',text:'Andrew'}, {id:'c',text:'Matthew'}, {id:'d',text:'Thomas'}], correctOptionId: 'c', explanation: 'Matthew, also called Levi, was a tax collector before Jesus called him (Matthew 9:9).' },
      { id: 'bqd_2', text: 'Which disciple famously denied Jesus three times before the rooster crowed?', options: [{id:'a',text:'John'}, {id:'b',text:'Judas Iscariot'}, {id:'c',text:'Peter'}, {id:'d',text:'James'}], correctOptionId: 'c', explanation: 'Peter denied Jesus three times, as Jesus had predicted (Matthew 26:69-75).' },
      { id: 'bqd_3', text: 'Which disciple is often referred to as "the disciple whom Jesus loved"?', options: [{id:'a',text:'Peter'}, {id:'b',text:'Andrew'}, {id:'c',text:'John'}, {id:'d',text:'Philip'}], correctOptionId: 'c', explanation: 'John, son of Zebedee and brother of James, is traditionally identified as "the disciple whom Jesus loved" (John 13:23).' },
      { id: 'bqd_4', text: 'Who betrayed Jesus to the authorities for thirty pieces of silver?', options: [{id:'a',text:'Thomas'}, {id:'b',text:'Judas Iscariot'}, {id:'c',text:'Simon the Zealot'}, {id:'d',text:'Bartholomew'}], correctOptionId: 'b', explanation: 'Judas Iscariot, one of the twelve, betrayed Jesus (Matthew 26:14-16, 47-49).' },
      { id: 'bqd_5', text: 'James and John, sons of Zebedee, were also known by what nickname given by Jesus?', options: [{id:'a',text:'The Rock and the Pillar'}, {id:'b',text:'Sons of Thunder (Boanerges)'}, {id:'c',text:'The Twins'}, {id:'d',text:'The Beloved and the Faithful'}], correctOptionId: 'b', explanation: 'Jesus nicknamed James and John "Boanerges," which means "Sons of Thunder" (Mark 3:17).' },
    ]
  },
  // Additional beginner quizzes if needed to reach 5 (already have 7, so these are illustrative if logic was to *exactly* pick 5 from a smaller set)
   {
    id: 'bq_psalms',
    title: 'Famous Psalms (Beginner)',
    description: 'Recognize key themes and verses from well-known Psalms.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?harp_instrument_psalms,psalms_book_open,worship_music_bible',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
      { id: 'bqp_1', text: 'Which Psalm begins with the words, "The LORD is my shepherd; I shall not want"?', options: [{id:'a',text:'Psalm 1'}, {id:'b',text:'Psalm 23'}, {id:'c',text:'Psalm 91'}, {id:'d',text:'Psalm 100'}], correctOptionId: 'b', explanation: 'Psalm 23 is famously known as the Shepherd Psalm.' },
      { id: 'bqp_2', text: 'According to Psalm 1, the blessed man meditates on God\'s law at what times?', options: [{id:'a',text:'Only in the morning'}, {id:'b',text:'Only on the Sabbath'}, {id:'c',text:'Day and night'}, {id:'d',text:'Once a week'}], correctOptionId: 'c', explanation: 'Psalm 1:2 says the blessed man\'s "delight is in the law of the LORD, and on his law he meditates day and night."' },
      { id: 'bqp_3', text: 'Which Psalm is a well-known prayer of repentance by King David after his sin involving Bathsheba and Uriah?', options: [{id:'a',text:'Psalm 32'}, {id:'b',text:'Psalm 51'}, {id:'c',text:'Psalm 73'}, {id:'d',text:'Psalm 139'}], correctOptionId: 'b', explanation: 'Psalm 51 is David\'s heartfelt confession and plea for forgiveness ("Create in me a clean heart, O God...").' },
      { id: 'bqp_4', text: 'Psalm 119, the longest chapter in the Bible, is primarily about what subject?', options: [{id:'a',text:'God\'s creation'}, {id:'b',text:'The history of Israel'}, {id:'c',text:'The attributes of God'}, {id:'d',text:'God\'s Word (law, statutes, precepts, commandments)'}], correctOptionId: 'd', explanation: 'Psalm 119 is an extensive acrostic poem exalting the beauty, power, and importance of God\'s Word in its various forms.' },
      { id: 'bqp_5', text: 'Psalm 100 is often called "A Psalm of _______." What is its main theme?', options: [{id:'a',text:'Lament'}, {id:'b',text:'Wisdom'}, {id:'c',text:'Thanksgiving/Praise'}, {id:'d',text:'Messianic Prophecy'}], correctOptionId: 'c', explanation: 'Psalm 100 is a call to joyful worship and thanksgiving: "Make a joyful noise to the LORD, all the earth! Serve the LORD with gladness! Come into his presence with singing!"' },
    ]
  },
  {
    id: 'bq_bible_facts',
    title: 'Basic Bible Facts (Beginner)',
    description: 'Test your knowledge on general facts about the Bible.',
    level: QuizLevel.Beginner,
    imageUrl: 'https://source.unsplash.com/800x600/?old_bible_pages,scripture_study_desk,reading_holy_text',
    durationMinutes: 5, // Will be padded to 10 questions
    questions: [
      { id: 'bqbf_1', text: 'The Bible is divided into how many main sections or testaments?', options: [{id:'a',text:'One'}, {id:'b',text:'Two'}, {id:'c',text:'Three'}, {id:'d',text:'Four'}], correctOptionId: 'b', explanation: 'The Bible is divided into two main sections: the Old Testament and the New Testament.' },
      { id: 'bqbf_2', text: 'What is the very first book of the New Testament?', options: [{id:'a',text:'Genesis'}, {id:'b',text:'John'}, {id:'c',text:'Matthew'}, {id:'d',text:'Acts'}], correctOptionId: 'c', explanation: 'The Gospel According to Matthew is the first book of the New Testament.' },
      { id: 'bqbf_3', text: 'What was the primary original language of most of the Old Testament?', options: [{id:'a',text:'Greek'}, {id:'b',text:'Latin'}, {id:'c',text:'Aramaic'}, {id:'d',text:'Hebrew'}], correctOptionId: 'd', explanation: 'Most of the Old Testament was originally written in Hebrew, with some portions in Aramaic.' },
      { id: 'bqbf_4', text: 'What was the primary original language of most of the New Testament?', options: [{id:'a',text:'Hebrew'}, {id:'b',text:'Latin'}, {id:'c',text:'Greek (Koine)'}, {id:'d',text:'Aramaic'}], correctOptionId: 'c', explanation: 'The New Testament was primarily written in Koine Greek.' },
      { id: 'bqbf_5', text: 'What is the very last book in the Christian Bible?', options: [{id:'a',text:'Malachi'}, {id:'b',text:'Jude'}, {id:'c',text:'Revelation'}, {id:'d',text:'3 John'}], correctOptionId: 'c', explanation: 'The Book of Revelation (also known as The Apocalypse of John) is the final book of the New Testament and the Bible.' },
    ]
  },


  // INTERMEDIATE QUIZZES
  {
    id: 'q2',
    title: 'The Gospels: Life of Christ',
    description: 'Explore key events and teachings from the life of Jesus.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?jesus_teaching_disciples,miracles_jesus_performed,bethlehem_manger',
    durationMinutes: 10, // Will be padded to 20 questions
    questions: [
      { id: 'q2_1', text: 'In which town was Jesus born?', options: [{id:'a',text:'Jerusalem'}, {id:'b',text:'Nazareth'}, {id:'c',text:'Bethlehem'}, {id:'d',text:'Capernaum'}], correctOptionId: 'c', explanation: 'Jesus was born in Bethlehem of Judea, as prophesied (Matthew 2:1, Micah 5:2).' },
      { id: 'q2_2', text: 'How many disciples did Jesus choose as his closest apostles?', options: [{id:'a',text:'7'}, {id:'b',text:'10'}, {id:'c',text:'12'}, {id:'d',text:'3'}], correctOptionId: 'c', explanation: 'Jesus chose twelve disciples, also called apostles, to be His closest followers and to carry on His ministry (Mark 3:13-19).' },
      { id: 'q2_3', text: 'Who baptized Jesus in the Jordan River?', options: [{id:'a',text:'Peter'}, {id:'b',text:'John the Baptist'}, {id:'c',text:'Andrew'}, {id:'d',text:'Ananias'}], correctOptionId: 'b', explanation: 'John the Baptist baptized Jesus in the Jordan River at the beginning of Jesus\' public ministry (Matthew 3:13-17).' },
      { id: 'q2_4', text: 'What is the name of the famous sermon Jesus delivered on a mountainside, found in Matthew 5-7?', options: [{id:'a',text:'The Olivet Discourse'}, {id:'b',text:'The Farewell Discourse'}, {id:'c',text:'The Sermon on the Mount'}, {id:'d',text:'The Bread of Life Discourse'}], correctOptionId: 'c', explanation: 'The Sermon on the Mount contains core teachings of Jesus, including the Beatitudes and the Lord\'s Prayer (Matthew 5-7).' },
      { id: 'q2_5', text: 'Which miracle involved Jesus feeding a large crowd with a few loaves and fish?', options: [{id:'a',text:'Walking on water'}, {id:'b',text:'Healing the blind man'}, {id:'c',text:'Feeding the 5000'}, {id:'d',text:'Calming the storm'}], correctOptionId: 'c', explanation: 'Jesus miraculously fed over 5000 people with just five loaves of bread and two fish (Matthew 14:13-21).' },
      { id: 'q2_6', text: 'What event is commemorated by Christians during the Last Supper?', options: [{id:'a',text:'Jesus\' birth'}, {id:'b',text:'Jesus\' transfiguration'}, {id:'c',text:'Jesus\' institution of Communion (Eucharist)'}, {id:'d',text:'Jesus\' ascension'}], correctOptionId: 'c', explanation: 'During the Last Supper, Jesus instituted the Lord\'s Supper (Communion or Eucharist), instructing His disciples to remember His sacrifice (Matthew 26:26-29).' },
      { id: 'q2_7', text: 'On what charge was Jesus primarily crucified by the Roman authorities, according to the inscription on the cross?', options: [{id:'a',text:'Blasphemy'}, {id:'b',text:'Sedition against Rome'}, {id:'c',text:'"King of the Jews"'}, {id:'d',text:'Sorcery'}], correctOptionId: 'c', explanation: 'The inscription (titulus) placed on the cross, "Jesus of Nazareth, the King of the Jews" (John 19:19), indicated the official Roman charge, though the Sanhedrin accused Him of blasphemy.' },
      { id: 'q2_8', text: 'To whom did Jesus first appear after His resurrection, according to most Gospel accounts?', options: [{id:'a',text:'Peter'}, {id:'b',text:'The twelve disciples'}, {id:'c',text:'Mary Magdalene'}, {id:'d',text:'His mother Mary'}], correctOptionId: 'c', explanation: 'Mary Magdalene is consistently portrayed as one of the first, if not the first, to see the risen Christ (John 20:11-18, Mark 16:9).' },
      { id: 'q2_9', text: 'What is the Great Commission?', options: [{id:'a',text:'The command to love God and neighbor'}, {id:'b',text:'Jesus\' instruction to His disciples to make disciples of all nations'}, {id:'c',text:'The Beatitudes'}, {id:'d',text:'The Ten Commandments'}], correctOptionId: 'b', explanation: 'The Great Commission is Jesus\' final command to His disciples to go and make disciples of all nations, baptizing them and teaching them to obey His commands (Matthew 28:18-20).' },
    ],
  },
  {
    id: 'qActsChurch',
    title: 'The Book of Acts: Early Church',
    description: 'Test your knowledge of the early church\'s formation and expansion.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?pentecost_event,apostles_journey,early_christian_symbols',
    durationMinutes: 10, // Will be padded to 20 questions
    questions: [
        { id: 'qAC_1', text: 'What major event occurred on the Day of Pentecost in Acts 2?', options: [{id:'a',text:'Jesus\' ascension'}, {id:'b',text:'The stoning of Stephen'}, {id:'c',text:'The Holy Spirit descended upon the disciples'}, {id:'d',text:'Saul\'s conversion'}], correctOptionId: 'c', explanation: 'On the Day of Pentecost, the Holy Spirit was poured out on the disciples, empowering them to speak in other tongues and preach the gospel (Acts 2:1-4).' },
        { id: 'qAC_2', text: 'Who was the first Christian martyr, stoned to death for his faith?', options: [{id:'a',text:'James, son of Zebedee'}, {id:'b',text:'Peter'}, {id:'c',text:'Stephen'}, {id:'d',text:'Paul'}], correctOptionId: 'c', explanation: 'Stephen, one of the seven chosen to serve, became the first Christian martyr after delivering a powerful speech before the Sanhedrin (Acts 7).' },
        { id: 'qAC_3', text: 'What was Saul of Tarsus doing before his conversion experience on the road to Damascus?', options: [{id:'a',text:'He was a fisherman'}, {id:'b',text:'He was a tax collector'}, {id:'c',text:'He was persecuting Christians'}, {id:'d',text:'He was a Roman soldier'}], correctOptionId: 'c', explanation: 'Saul was a zealous persecutor of the early Christian church before encountering the risen Christ on the road to Damascus (Acts 9:1-2).' },
        { id: 'qAC_4', text: 'Which apostle received a vision leading him to preach the gospel to Cornelius, a Gentile centurion?', options: [{id:'a',text:'Paul'}, {id:'b',text:'John'}, {id:'c',text:'James'}, {id:'d',text:'Peter'}], correctOptionId: 'd', explanation: 'Peter received a vision (Acts 10) that taught him God shows no partiality, leading him to share the gospel with the Gentile household of Cornelius.' },
        { id: 'qAC_5', text: 'What city served as the home base for Paul\'s missionary journeys?', options: [{id:'a',text:'Jerusalem'}, {id:'b',text:'Rome'}, {id:'c',text:'Antioch (in Syria)'}, {id:'d',text:'Ephesus'}], correctOptionId: 'c', explanation: 'The church in Antioch of Syria commissioned and sent out Paul and Barnabas on their first missionary journey, and it remained a key center (Acts 13:1-3).' },
        { id: 'qAC_6', text: 'What was the main issue debated at the Jerusalem Council in Acts 15?', options: [{id:'a',text:'Whether Jesus was divine'}, {id:'b',text:'Whether Gentile believers needed to be circumcised and follow the Mosaic Law'}, {id:'c',text:'The date of Easter'}, {id:'d',text:'The authorship of the Gospels'}], correctOptionId: 'b', explanation: 'The Jerusalem Council addressed the critical question of whether Gentile converts to Christianity were required to observe Jewish ceremonial laws, like circumcision (Acts 15).' },
        { id: 'qAC_7', text: 'In what city did Paul preach on Mars Hill (Areopagus) to Greek philosophers?', options: [{id:'a',text:'Corinth'}, {id:'b',text:'Ephesus'}, {id:'c',text:'Athens'}, {id:'d',text:'Philippi'}], correctOptionId: 'c', explanation: 'Paul delivered his famous sermon about the "Unknown God" to the Epicurean and Stoic philosophers in Athens at the Areopagus (Acts 17:16-34).' },
        { id: 'qAC_8', text: 'Who were Paul\'s main companions on his first missionary journey?', options: [{id:'a',text:'Silas and Timothy'}, {id:'b',text:'Barnabas and John Mark'}, {id:'c',text:'Aquila and Priscilla'}, {id:'d',text:'Luke and Titus'}], correctOptionId: 'b', explanation: 'Barnabas and John Mark accompanied Paul on his first missionary journey (Acts 13-14).' },
        { id: 'qAC_9', text: 'Where was Paul imprisoned at the end of the Book of Acts?', options: [{id:'a',text:'Jerusalem'}, {id:'b',text:'Caesarea'}, {id:'c',text:'A deserted island'}, {id:'d',text:'Rome'}], correctOptionId: 'd', explanation: 'The Book of Acts concludes with Paul under house arrest in Rome, still proclaiming the kingdom of God and teaching about the Lord Jesus Christ (Acts 28:30-31).' },
    ]
  },
  {
    id: 'iq1',
    title: 'The Trinity Explained (Intermediate)',
    description: 'Understand the Christian doctrine of one God in three Persons.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?trinity_symbol,three_in_one_god,divine_unity_christian',
    durationMinutes: 10, // Will be padded to 20 questions
    questions: [
      { id: 'iq1_1', text: 'The doctrine of the Trinity states that God is:', options: [{id:'a',text:'Three separate gods'}, {id:'b',text:'One person who appears in three modes'}, {id:'c',text:'One God in three co-equal, co-eternal Persons'}, {id:'d',text:'A divine family'}], correctOptionId: 'c', explanation: 'The Trinity is one God eternally existing in three distinct Persons: Father, Son, and Holy Spirit, all of whom are fully God.' },
      { id: 'iq1_2', text: 'Which of these is NOT one of the Persons of the Trinity?', options: [{id:'a',text:'The Father'}, {id:'b',text:'The Son (Jesus Christ)'}, {id:'c',text:'The Archangel Michael'}, {id:'d',text:'The Holy Spirit'}], correctOptionId: 'c', explanation: 'The three Persons of the Trinity are God the Father, God the Son (Jesus Christ), and God the Holy Spirit. Archangel Michael is a created being.' },
      { id: 'iq1_3', text: 'The term "Trinity" is explicitly found in the Bible.', options: [{id:'a',text:'True'}, {id:'b',text:'False'}], correctOptionId: 'b', explanation: 'While the word "Trinity" itself is not in the Bible, the concept is derived from numerous passages that reveal the distinct Persons and unity of God (e.g., Matthew 28:19, 2 Corinthians 13:14).' },
      { id: 'iq1_4', text: 'Which Person of the Trinity became incarnate as a human being?', options: [{id:'a',text:'The Father'}, {id:'b',text:'The Son'}, {id:'c',text:'The Holy Spirit'}, {id:'d',text:'All three equally'}], correctOptionId: 'b', explanation: 'God the Son, Jesus Christ, became incarnate (took on human flesh) (John 1:1, 14).' },
      { id: 'iq1_5', text: 'The belief that the Father, Son, and Holy Spirit are just different "modes" or "manifestations" of a single-person God is known as:', options: [{id:'a',text:'Arianism'}, {id:'b',text:'Modalism (Sabellianism)'}, {id:'c',text:'Tritheism'}, {id:'d',text:'Orthodoxy'}], correctOptionId: 'b', explanation: 'Modalism (or Sabellianism) is a heresy that denies the distinct Persons of the Trinity, teaching that God is one person who appears in different forms or modes at different times.' },
    ]
  },
  {
    id: 'iq2',
    title: 'The Fruit of the Spirit (Intermediate)',
    description: 'Identify and understand the Fruit of the Spirit from Galatians 5.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?fruitful_branch_sun,glowing_heart_nature,spiritual_gifts_bible',
    durationMinutes: 8, // Will be padded to 20 questions
    questions: [
      { id: 'iq2_1', text: 'Where in the Bible is the Fruit of the Spirit listed?', options: [{id:'a',text:'1 Corinthians 12'}, {id:'b',text:'Ephesians 6'}, {id:'c',text:'Galatians 5:22-23'}, {id:'d',text:'Romans 8'}], correctOptionId: 'c', explanation: 'The Fruit of the Spirit is listed in Galatians 5:22-23.' },
      { id: 'iq2_2', text: 'How many aspects of the Fruit of the Spirit are listed in Galatians 5?', options: [{id:'a',text:'Seven'}, {id:'b',text:'Nine'}, {id:'c',text:'Ten'}, {id:'d',text:'Twelve'}], correctOptionId: 'b', explanation: 'There are nine aspects of the Fruit of the Spirit listed: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.' },
      { id: 'iq2_3', text: 'Which of these is NOT part of the Fruit of the Spirit?', options: [{id:'a',text:'Love'}, {id:'b',text:'Knowledge'}, {id:'c',text:'Peace'}, {id:'d',text:'Patience'}], correctOptionId: 'b', explanation: 'While knowledge is valuable, it is not listed as part of the Fruit of the Spirit in Galatians 5. The list includes love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.' },
      { id: 'iq2_4', text: 'The Fruit of the Spirit is primarily a result of:', options: [{id:'a',text:'Human effort and discipline'}, {id:'b',text:'The work of the Holy Spirit in a believer\'s life'}, {id:'c',text:'Attending church regularly'}, {id:'d',text:'Strict adherence to rules'}], correctOptionId: 'b', explanation: 'The Fruit of the Spirit is produced by the Holy Spirit as a believer walks in fellowship with Him and submits to His leading.' },
      { id: 'iq2_5', text: 'What is listed as the first aspect of the Fruit of the Spirit?', options: [{id:'a',text:'Joy'}, {id:'b',text:'Peace'}, {id:'c',text:'Love'}, {id:'d',text:'Self-control'}], correctOptionId: 'c', explanation: 'Love is the first aspect of the Fruit of the Spirit mentioned in Galatians 5:22.' },
    ]
  },
  {
    id: 'iq3',
    title: 'Major Covenants in the Bible (Intermediate)',
    description: 'Explore the significant covenants God made with humanity.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?covenant_stone_tablet,rainbow_sky_promise,davidic_harp_crown',
    durationMinutes: 12, // Will be padded to 20 questions
    questions: [
      { id: 'iq3_1', text: 'What was the sign of the covenant God made with Noah?', options: [{id:'a',text:'Circumcision'}, {id:'b',text:'The Sabbath'}, {id:'c',text:'A rainbow'}, {id:'d',text:'A sacrifice'}], correctOptionId: 'c', explanation: 'The rainbow was the sign of God\'s covenant with Noah, promising never again to destroy all life on earth with a flood (Genesis 9:12-17).' },
      { id: 'iq3_2', text: 'God\'s covenant with Abraham primarily promised:', options: [{id:'a',text:'Eternal life'}, {id:'b',text:'Land, descendants, and blessing'}, {id:'c',text:'The Ten Commandments'}, {id:'d',text:'Forgiveness of sins'}], correctOptionId: 'b', explanation: 'God promised Abraham land (Canaan), numerous descendants, and that through him all nations of the earth would be blessed (Genesis 12, 15, 17).' },
      { id: 'iq3_3', text: 'The Mosaic Covenant, given at Mount Sinai, included:', options: [{id:'a',text:'The promise of the Holy Spirit'}, {id:'b',text:'The Law (Ten Commandments and other regulations)'}, {id:'c',text:'The building of the Temple by Solomon'}, {id:'d',text:'The Messiah\'s first coming'}], correctOptionId: 'b', explanation: 'The Mosaic Covenant included the Ten Commandments and various civil and ceremonial laws for the nation of Israel (Exodus 19-24).' },
      { id: 'iq3_4', text: 'To whom did God promise an eternal dynasty and that his descendant would reign forever?', options: [{id:'a',text:'Moses'}, {id:'b',text:'Joshua'}, {id:'c',text:'David'}, {id:'d',text:'Solomon'}], correctOptionId: 'c', explanation: 'God made a covenant with David, promising that his house, kingdom, and throne would be established forever, ultimately fulfilled in Jesus Christ (2 Samuel 7).' },
      { id: 'iq3_5', text: 'The New Covenant, prophesied by Jeremiah and inaugurated by Jesus, promises:', options: [{id:'a',text:'Conquest of earthly kingdoms'}, {id:'b',text:'A new temple in Jerusalem'}, {id:'c',text:'Forgiveness of sins and the law written on hearts'}, {id:'d',text:'Universal observance of Old Testament dietary laws'}], correctOptionId: 'c', explanation: 'The New Covenant, established through Jesus Christ, offers forgiveness of sins and an internal transformation where God\'s law is written on believers\' hearts by the Holy Spirit (Jeremiah 31:31-34, Hebrews 8, Luke 22:20).' },
    ]
  },
  // Additional intermediate quizzes if needed (already have 7)
   {
    id: 'iq4',
    title: 'The Life of King David (Intermediate)',
    description: 'Key events and characteristics of King David\'s life.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?shepherd_david_sling,king_david_israel_crown,goliath_battle_scene',
    durationMinutes: 10, // Will be padded to 20 questions
    questions: [
      { id: 'iq4_1', text: 'Before becoming king, David was known for what skill?', options: [{id:'a',text:'Building temples'}, {id:'b',text:'Leading armies'}, {id:'c',text:'Playing the harp and being a shepherd'}, {id:'d',text:'Writing laws'}], correctOptionId: 'c', explanation: 'David was a shepherd who played the harp for King Saul (1 Samuel 16).' },
      { id: 'iq4_2', text: 'Who was the giant Philistine warrior David defeated with a sling and a stone?', options: [{id:'a',text:'Og'}, {id:'b',text:'Goliath'}, {id:'c',text:'Sihon'}, {id:'d',text:'Agag'}], correctOptionId: 'b', explanation: 'David famously defeated the Philistine giant Goliath (1 Samuel 17).' },
      { id: 'iq4_3', text: 'Who was David\'s closest friend, the son of King Saul?', options: [{id:'a',text:'Joab'}, {id:'b',text:'Absalom'}, {id:'c',text:'Jonathan'}, {id:'d',text:'Nathan'}], correctOptionId: 'c', explanation: 'Jonathan, Saul\'s son, was David\'s loyal and close friend (1 Samuel 18).' },
      { id: 'iq4_4', text: 'Which prophet confronted David about his sin with Bathsheba and Uriah?', options: [{id:'a',text:'Samuel'}, {id:'b',text:'Elijah'}, {id:'c',text:'Nathan'}, {id:'d',text:'Isaiah'}], correctOptionId: 'c', explanation: 'The prophet Nathan confronted David with a parable about his adultery with Bathsheba and the murder of Uriah (2 Samuel 12).' },
      { id: 'iq4_5', text: 'David is traditionally credited with writing many of which Old Testament book?', options: [{id:'a',text:'Proverbs'}, {id:'b',text:'Ecclesiastes'}, {id:'c',text:'Psalms'}, {id:'d',text:'Job'}], correctOptionId: 'c', explanation: 'David is the attributed author of many of the Psalms.' },
    ]
  },
  {
    id: 'iq5',
    title: 'Understanding Salvation (Soteriology - Intermediate)',
    description: 'Core concepts related to God\'s plan of salvation.',
    level: QuizLevel.Intermediate,
    imageUrl: 'https://source.unsplash.com/800x600/?cross_rays_light,open_hands_receiving_grace,pathway_to_heaven_clouds',
    durationMinutes: 12, // Will be padded to 20 questions
    questions: [
      { id: 'iq5_1', text: 'What is the primary means by which a person is saved, according to Evangelical theology?', options: [{id:'a',text:'Good works and moral living'}, {id:'b',text:'Grace through faith in Jesus Christ'}, {id:'c',text:'Church membership and sacraments'}, {id:'d',text:'Following religious laws perfectly'}], correctOptionId: 'b', explanation: 'Salvation is a gift from God, received by grace through faith in the person and work of Jesus Christ, not by human effort or merit (Ephesians 2:8-9).' },
      { id: 'iq5_2', text: 'The term "justification" in theology refers to:', options: [{id:'a',text:'The process of becoming more holy'}, {id:'b',text:'God declaring a sinner righteous based on Christ\'s work'}, {id:'c',text:'The act of forgiving others'}, {id:'d',text:'Being freed from demonic influence'}], correctOptionId: 'b', explanation: 'Justification is a legal declaration by God where He imputes Christ\'s righteousness to a believing sinner, thus declaring them righteous in His sight.' },
      { id: 'iq5_3', text: 'What does "repentance" involve?', options: [{id:'a',text:'Simply feeling sorry for sin'}, {id:'b',text:'A change of mind and heart leading to a turning away from sin and towards God'}, {id:'c',text:'Performing acts of penance'}, {id:'d',text:'Perfectly ceasing from all sin'}], correctOptionId: 'b', explanation: 'Repentance is more than sorrow; it involves a genuine change of mind and direction, turning from sin to God.' },
      { id: 'iq5_4', text: 'The concept of "atonement" refers to:', options: [{id:'a',text:'Jesus\' miracles and teachings'}, {id:'b',text:'The work of Christ, particularly His death, in reconciling humanity to God'}, {id:'c',text:'The process of church discipline'}, {id:'d',text:'The future judgment of believers'}], correctOptionId: 'b', explanation: 'Atonement is Christ\'s sacrificial work on the cross that paid the penalty for sin and made reconciliation with God possible.' },
      { id: 'iq5_5', text: 'What is "sanctification"?', options: [{id:'a',text:'The initial act of being saved'}, {id:'b',text:'The future state of perfection in heaven'}, {id:'c',text:'The ongoing process of being made holy and conformed to Christ\'s image by the Holy Spirit'}, {id:'d',text:'A special spiritual gift for some believers'}], correctOptionId: 'c', explanation: 'Sanctification is the lifelong work of the Holy Spirit in a believer, progressively setting them apart for God and transforming their character to be more like Christ.' },
    ]
  },
  
  // ADVANCED QUIZZES
  {
    id: 'q3',
    title: 'Pauline Epistles: Core Doctrines',
    description: 'Deep dive into the theological teachings of Apostle Paul.',
    level: QuizLevel.Advanced,
    imageUrl: 'https://source.unsplash.com/800x600/?apostle_paul_scroll,ancient_roman_coliseum,epistles_bible_study',
    durationMinutes: 15, // Will be padded to 30 questions
    questions: [
      { id: 'q3_1', text: 'Which Pauline epistle extensively discusses justification by faith?', options: [{id:'a',text:'Ephesians'}, {id:'b',text:'Romans'}, {id:'c',text:'1 Corinthians'}, {id:'d',text:'Philippians'}], correctOptionId: 'b', explanation: 'The book of Romans provides a detailed theological explanation of justification by faith (Romans 3-5), emphasizing that righteousness is a gift from God received through faith in Jesus Christ.' },
      { id: 'q3_2', text: 'What fruit of the Spirit is listed first in Galatians 5:22-23?', options: [{id:'a',text:'Joy'}, {id:'b',text:'Peace'}, {id:'c',text:'Love'}, {id:'d',text:'Patience'}], correctOptionId: 'c', explanation: '"But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness..." (Galatians 5:22-23a ESV). Love is foundational.' },
      { id: 'q3_3', text: 'In Ephesians, what metaphor does Paul use to describe the Church with Christ as the head?', options: [{id:'a',text:'A building or temple'}, {id:'b',text:'A bride'}, {id:'c',text:'A body'}, {id:'d',text:'All of the above'}], correctOptionId: 'd', explanation: 'Paul uses multiple metaphors for the Church in Ephesians: the Body of Christ (Eph 1:22-23, 4:15-16), a Holy Temple (Eph 2:21-22), and the Bride of Christ (Eph 5:25-32).' },
      { id: 'q3_4', text: 'Which epistle contains the "Kenosis Hymn" (Philippians 2:5-11) describing Christ\'s self-emptying?', options: [{id:'a',text:'Romans'}, {id:'b',text:'Colossians'}, {id:'c',text:'Philippians'}, {id:'d',text:'1 Timothy'}], correctOptionId: 'c', explanation: 'Philippians 2:5-11 is a profound passage describing Christ\'s humility, incarnation, and exaltation, often referred to as the Kenosis hymn.' },
      { id: 'q3_5', text: 'In Colossians, Paul emphasizes the preeminence and sufficiency of Christ against what kind of false teaching?', options: [{id:'a',text:'Legalism (Judaizers)'}, {id:'b',text:'Gnosticism and ascetic practices'}, {id:'c',text:'Antinomianism (lawlessness)'}, {id:'d',text:'Emperor worship'}], correctOptionId: 'b', explanation: 'Paul wrote Colossians to combat a syncretistic false teaching that involved elements of Jewish legalism, Greek philosophy, angel worship, and asceticism, by highlighting the all-sufficiency and supremacy of Christ (Colossians 2).' },
      { id: 'q3_6', text: 'Which two Pauline epistles are known as the "Thessalonian Epistles" and deal significantly with eschatology (end times)?', options: [{id:'a',text:'1 & 2 Timothy'}, {id:'b',text:'Titus & Philemon'}, {id:'c',text:'1 & 2 Thessalonians'}, {id:'d',text:'Galatians & Ephesians'}], correctOptionId: 'c', explanation: '1 and 2 Thessalonians address questions and misunderstandings about the return of Christ and events related to the end times.' },
      { id: 'q3_7', text: 'What is the main theme of Paul\'s letter to Philemon?', options: [{id:'a',text:'Church order and leadership'}, {id:'b',text:'Justification by faith'}, {id:'c',text:'Forgiveness and reconciliation regarding a runaway slave'}, {id:'d',text:'The collection for the saints in Jerusalem'}], correctOptionId: 'c', explanation: 'Philemon is a personal letter from Paul appealing to Philemon to forgive and restore his runaway slave, Onesimus, who had become a Christian.' },
      { id: 'q3_8', text: 'In 1 Corinthians 15, Paul gives a detailed defense and explanation of what crucial Christian doctrine?', options: [{id:'a',text:'The Trinity'}, {id:'b',text:'The deity of Christ'}, {id:'c',text:'The resurrection of the dead'}, {id:'d',text:'The inspiration of Scripture'}], correctOptionId: 'c', explanation: '1 Corinthians 15 is the most extensive treatment of the doctrine of the resurrection in the New Testament, emphasizing its historical reality and future hope.' },
      { id: 'q3_9', text: 'The "Pastoral Epistles" (1 Timothy, 2 Timothy, Titus) primarily focus on what?', options: [{id:'a',text:'Systematic theology'}, {id:'b',text:'Apologetics against Greek philosophy'}, {id:'c',text:'Church leadership, order, and sound doctrine'}, {id:'d',text:'Paul\'s missionary strategies'}], correctOptionId: 'c', explanation: 'The Pastoral Epistles provide guidance to Timothy and Titus on matters of church organization, qualifications for leaders, combating false teaching, and maintaining sound doctrine.' },
      { id: 'q3_10', text: 'What does Paul mean by "sanctification" as discussed in epistles like Romans and 1 Thessalonians?', options: [{id:'a',text:'The act of God declaring a sinner righteous'}, {id:'b',text:'The lifelong process of being conformed to the image of Christ by the Holy Spirit'}, {id:'c',text:'The future removal of sin at Christ\'s return'}, {id:'d',text:'A special spiritual gift'}], correctOptionId: 'b', explanation: 'Sanctification is the ongoing work of the Holy Spirit in a believer\'s life, setting them apart for God\'s purposes and transforming them into Christ-likeness (Romans 6, 1 Thessalonians 4:3).' },
      { id: 'q3_11', text: 'In Galatians, Paul passionately defends the doctrine of justification by faith against whom?', options: [{id:'a',text:'Gnostic teachers'}, {id:'b',text:'Roman authorities'}, {id:'c',text:'Judaizers who insisted on circumcision for Gentile believers'}, {id:'d',text:'Antinomian libertines'}], correctOptionId: 'c', explanation: 'Paul wrote Galatians to counter the influence of Judaizers who were teaching that Gentile Christians must observe the Mosaic Law, particularly circumcision, in addition to faith in Christ for salvation.' },
      { id: 'q3_12', text: 'What is the "mystery" Paul frequently refers to, especially in Ephesians and Colossians?', options: [{id:'a',text:'The exact date of Christ\'s return'}, {id:'b',text:'The union of Jews and Gentiles in one body, the Church, through Christ'}, {id:'c',text:'The process of biblical inspiration'}, {id:'d',text:'The problem of evil'}], correctOptionId: 'b', explanation: 'The "mystery" often refers to God\'s previously hidden plan, now revealed in Christ, to unite both Jews and Gentiles into one new humanity, the Church (Ephesians 3:3-6, Colossians 1:26-27).' },
      { id: 'q3_13', text: 'Which Pauline epistle contains the "Armor of God" passage (Ephesians 6:10-18)?', options: [{id:'a',text:'Romans'}, {id:'b',text:'Philippians'}, {id:'c',text:'Ephesians'}, {id:'d',text:'Colossians'}], correctOptionId: 'c', explanation: 'Ephesians 6:10-18 describes the spiritual armor believers are to put on to stand against the schemes of the devil.' },
    ],
  },
  {
    id: 'aq1',
    title: 'Eschatology: End Times Doctrines',
    description: 'Examine biblical teachings about future events and Christ\'s return.',
    level: QuizLevel.Advanced,
    imageUrl: 'https://source.unsplash.com/800x600/?heavenly_clouds_return_christ,angel_trumpet_judgment,revelation_book_prophecy',
    durationMinutes: 18, // Will be padded to 30 questions
    questions: [
      { id: 'aq1_1', text: 'The term "eschatology" refers to the study of:', options: [{id:'a',text:'The nature of the church'}, {id:'b',text:'The doctrine of salvation'}, {id:'c',text:'End times or last things'}, {id:'d',text:'The person of Christ'}], correctOptionId: 'c', explanation: 'Eschatology is the branch of theology concerned with the final events of history, or the ultimate destiny of humanity.' },
      { id: 'aq1_2', text: 'Which New Testament book is most focused on detailed apocalyptic prophecy?', options: [{id:'a',text:'Acts'}, {id:'b',text:'Hebrews'}, {id:'c',text:'Revelation'}, {id:'d',text:'1 Peter'}], correctOptionId: 'c', explanation: 'The Book of Revelation is the primary source of apocalyptic prophecy in the New Testament.' },
      { id: 'aq1_3', text: 'The "Second Coming" of Christ refers to:', options: [{id:'a',text:'His birth in Bethlehem'}, {id:'b',text:'His triumphal entry into Jerusalem'}, {id:'c',text:'His future, visible return to earth in glory'}, {id:'d',text:'The coming of the Holy Spirit at Pentecost'}], correctOptionId: 'c', explanation: 'The Second Coming is the anticipated return of Jesus Christ to earth in power and glory to judge the living and the dead and establish His kingdom.' },
      { id: 'aq1_4', text: 'What is the "Millennium" as discussed in Revelation 20?', options: [{id:'a',text:'A period of intense persecution'}, {id:'b',text:'The eternal state in heaven'}, {id:'c',text:'A 1000-year reign of Christ on earth'}, {id:'d',text:'The first century of the church'}], correctOptionId: 'c', explanation: 'Revelation 20 describes a 1000-year period during which Christ will reign on earth. Interpretations (premillennialism, amillennialism, postmillennialism) vary.' },
      { id: 'aq1_5', text: 'The concept of the "Rapture" in some eschatological views refers to:', options: [{id:'a',text:'The final judgment'}, {id:'b',text:'The resurrection of unbelievers'}, {id:'c',text:'Believers being "caught up" to meet the Lord in the air'}, {id:'d',text:'The destruction of the current earth'}], correctOptionId: 'c', explanation: 'The Rapture, based on 1 Thessalonians 4:17, is understood by some as an event where living believers will be transformed and caught up to meet Christ, often before a period of tribulation.' },
    ]
  },
  {
    id: 'aq2',
    title: 'Christology: Person and Work of Christ',
    description: 'Explore the biblical understanding of Jesus Christ\'s nature and redemptive work.',
    level: QuizLevel.Advanced,
    imageUrl: 'https://source.unsplash.com/800x600/?jesus_divine_light,cross_atonement_theology,incarnation_mystery_bible',
    durationMinutes: 20, // Will be padded to 30 questions
    questions: [
      { id: 'aq2_1', text: 'The Council of Chalcedon (AD 451) affirmed what about Christ\'s nature?', options: [{id:'a',text:'He was fully divine but not fully human'}, {id:'b',text:'He was fully human but not fully divine'}, {id:'c',text:'He had one nature that was a mixture of divine and human'}, {id:'d',text:'He is one Person with two distinct natures: fully divine and fully human'}], correctOptionId: 'd', explanation: 'The Council of Chalcedon defined Christ as having two natures, divine and human, united in one Person, without confusion, change, division, or separation (the hypostatic union).' },
      { id: 'aq2_2', text: 'The "kenosis" of Christ (Philippians 2) refers to His:', options: [{id:'a',text:'Divine power demonstrated in miracles'}, {id:'b',text:'Self-emptying or voluntary humiliation in becoming human'}, {id:'c',text:'Ascension into heaven'}, {id:'d',text:'Final judgment of humanity'}], correctOptionId: 'b', explanation: 'Kenosis describes Christ\'s act of "emptying Himself" by taking the form of a servant, humbling Himself by becoming obedient to death on a cross.' },
      { id: 'aq2_3', text: 'Which of these is NOT typically considered one of Christ\'s "offices"?', options: [{id:'a',text:'Prophet'}, {id:'b',text:'Priest'}, {id:'c',text:'King'}, {id:'d',text:'Scribe'}], correctOptionId: 'd', explanation: 'Christ\'s threefold office is traditionally understood as Prophet (revealing God), Priest (mediating between God and humanity), and King (ruling over all creation).' },
      { id: 'aq2_4', text: 'The term "propitiation" regarding Christ\'s atonement means His sacrifice:', options: [{id:'a',text:'Demonstrated God\'s love'}, {id:'b',text:'Satisfied God\'s righteous wrath against sin'}, {id:'c',text:'Defeated Satan\'s power'}, {id:'d',text:'Paid a ransom to Satan'}], correctOptionId: 'b', explanation: 'Propitiation means Christ\'s death appeased or satisfied the justice and wrath of God against sin (Romans 3:25, 1 John 2:2).' },
      { id: 'aq2_5', text: 'What does the "impeccability" of Christ mean?', options: [{id:'a',text:'He was capable of sinning but chose not to'}, {id:'b',text:'He was not only sinless but also incapable of sinning'}, {id:'c',text:'He was unaware of sin'}, {id:'d',text:'He could forgive sins'}], correctOptionId: 'b', explanation: 'Impeccability asserts that due to His divine nature, Jesus was not merely without sin (sinless) but was also unable to sin.' },
    ]
  },
  {
    id: 'aq3',
    title: 'The Attributes of God (In-Depth)',
    description: 'A deeper study into God\'s characteristics as revealed in Scripture.',
    level: QuizLevel.Advanced,
    imageUrl: 'https://source.unsplash.com/800x600/?god_majesty_universe,divine_attributes_scroll,theology_book_light',
    durationMinutes: 15, // Will be padded to 30 questions
    questions: [
      { id: 'aq3_1', text: 'God\'s "aseity" means He is:', options: [{id:'a',text:'All-powerful'}, {id:'b',text:'Self-existent and independent'}, {id:'c',text:'Unchanging'}, {id:'d',text:'Present everywhere'}], correctOptionId: 'b', explanation: 'Aseity (from Latin "a se," meaning "from himself") refers to God\'s self-existence; He is uncaused and depends on nothing for His being.' },
      { id: 'aq3_2', text: 'Which attribute describes God as being unchanging in His character, will, and promises?', options: [{id:'a',text:'Omniscience'}, {id:'b',text:'Immutability'}, {id:'c',text:'Omnipresence'}, {id:'d',text:'Sovereignty'}], correctOptionId: 'b', explanation: 'Immutability means God is unchanging (Malachi 3:6, James 1:17).' },
      { id: 'aq3_3', text: 'God\'s "incommunicable attributes" are those that:', options: [{id:'a',text:'He shares with humans to some degree'}, {id:'b',text:'He does not share, or shares very little, with created beings'}, {id:'c',text:'Relate only to His communication with humanity'}, {id:'d',text:'Are primarily about His actions in history'}], correctOptionId: 'b', explanation: 'Incommunicable attributes (like aseity, immutability, infinity, omnipresence, omniscience, omnipotence) are unique to God and not shared significantly with creatures.' },
      { id: 'aq3_4', text: 'The "sovereignty" of God refers to His:', options: [{id:'a',text:'Love and mercy'}, {id:'b',text:'Knowledge of all things'}, {id:'c',text:'Supreme rule, authority, and control over all creation'}, {id:'d',text:'Presence in all places'}], correctOptionId: 'c', explanation: 'Sovereignty describes God\'s absolute right and power to govern all things according to His will.' },
      { id: 'aq3_5', text: 'What is a key difference between God\'s love and human love?', options: [{id:'a',text:'God\'s love is conditional, human love is unconditional'}, {id:'b',text:'God\'s love is primarily self-originating and unconditional, often proactive; human love is often responsive and conditional'}, {id:'c',text:'God\'s love is limited to believers, human love can be universal'}, {id:'d',text:'There is no fundamental difference'}], correctOptionId: 'b', explanation: 'God\'s agape love is self-giving, sacrificial, and often initiates undeservedly, whereas human love can be more reactive and based on perceived worth or reciprocity.' },
    ]
  },
  {
    id: 'aq4',
    title: 'Hermeneutics: Bible Interpretation',
    description: 'Principles and methods for correctly interpreting Scripture.',
    level: QuizLevel.Advanced,
    imageUrl: 'https://source.unsplash.com/800x600/?magnifying_glass_on_bible,ancient_scripture_study,hermeneutics_principles_book',
    durationMinutes: 18, // Will be padded to 30 questions
    questions: [
      { id: 'aq4_1', text: 'Hermeneutics is the science and art of:', options: [{id:'a',text:'Biblical translation'}, {id:'b',text:'Textual criticism'}, {id:'c',text:'Biblical interpretation'}, {id:'d',text:'Systematic theology'}], correctOptionId: 'c', explanation: 'Hermeneutics deals with the principles and theories of interpretation, especially of biblical texts.' },
      { id: 'aq4_2', text: 'The "grammatico-historical" method of interpretation emphasizes:', options: [{id:'a',text:'Allegorical meanings hidden in the text'}, {id:'b',text:'The reader\'s personal feelings and experiences'}, {id:'c',text:'Understanding the text based on its grammar and historical context'}, {id:'d',text:'Finding prophecies in every passage'}], correctOptionId: 'c', explanation: 'The grammatico-historical method seeks to understand the original meaning of the text by analyzing its language (grammar, syntax, word meanings) and the historical-cultural setting in which it was written.' },
      { id: 'aq4_3', text: 'What does "exegesis" mean in biblical studies?', options: [{id:'a',text:'Reading one\'s own ideas into the text'}, {id:'b',text:'Drawing out the original meaning from the text'}, {id:'c',text:'Comparing different translations'}, {id:'d',text:'Applying the text to modern life'}], correctOptionId: 'b', explanation: 'Exegesis is the critical explanation or interpretation of a text, aiming to discover the author\'s intended meaning by carefully analyzing the text itself.' },
      { id: 'aq4_4', text: 'The principle of "Scripture interprets Scripture" means that:', options: [{id:'a',text:'Only pastors can interpret the Bible'}, {id:'b',text:'Clearer passages of Scripture should be used to help understand more obscure ones'}, {id:'c',text:'The Bible contains contradictions that interpret each other'}, {id:'d',text:'Every verse has multiple valid interpretations'}], correctOptionId: 'b', explanation: 'This principle (analogia scripturae or analogia fidei) suggests that the Bible is its own best interpreter, and less clear passages should be understood in light of clearer, overarching biblical themes and teachings.' },
      { id: 'aq4_5', text: 'Understanding the "genre" of a biblical passage (e.g., narrative, poetry, law, prophecy, epistle) is important because:', options: [{id:'a',text:'It determines the passage\'s canonicity'}, {id:'b',text:'It helps identify the original author'}, {id:'c',text:'Different genres have different literary conventions and should be interpreted accordingly'}, {id:'d',text:'It dictates the theological importance of the passage'}], correctOptionId: 'c', explanation: 'Recognizing the literary genre helps in applying appropriate interpretive rules; for example, poetry is interpreted differently than historical narrative or legal codes.' },
    ]
  },
  // Additional advanced quizzes if needed (already have 6)
  {
    id: 'aq5',
    title: 'Church History: The Reformation (Advanced)',
    description: 'Key figures, events, and doctrines of the Protestant Reformation.',
    level: QuizLevel.Advanced,
    imageUrl: 'https://source.unsplash.com/800x600/?martin_luther_95_theses,reformation_map_europe,geneva_calvin_church',
    durationMinutes: 15, // Will be padded to 30 questions
    questions: [
      { id: 'aq5_1', text: 'Who is considered the primary instigator of the Protestant Reformation by posting his 95 Theses in 1517?', options: [{id:'a',text:'John Calvin'}, {id:'b',text:'Ulrich Zwingli'}, {id:'c',text:'Martin Luther'}, {id:'d',text:'John Knox'}], correctOptionId: 'c', explanation: 'Martin Luther\'s posting of the 95 Theses in Wittenberg, Germany, is widely regarded as the spark that ignited the Reformation.' },
      { id: 'aq5_2', text: 'The "Five Solas" summarize key theological principles of the Reformation. "Sola Scriptura" means:', options: [{id:'a',text:'By Scripture alone'}, {id:'b',text:'By faith alone'}, {id:'c',text:'By grace alone'}, {id:'d',text:'To God\'s glory alone'}], correctOptionId: 'a', explanation: 'Sola Scriptura emphasizes the Bible as the supreme and sole infallible authority for Christian faith and practice.' },
      { id: 'aq5_3', text: 'John Calvin is most famously associated with which city, where he implemented his reforms?', options: [{id:'a',text:'Wittenberg'}, {id:'b',text:'Zurich'}, {id:'c',text:'Geneva'}, {id:'d',text:'London'}], correctOptionId: 'c', explanation: 'John Calvin was instrumental in the Reformation in Geneva, Switzerland, establishing a theocratic government and influencing Protestant theology significantly.' },
      { id: 'aq5_4', text: 'A major theological dispute during the Reformation concerned the doctrine of transubstantiation, which is the belief that:', options: [{id:'a',text:'The Pope is infallible'}, {id:'b',text:'Saints can intercede for believers'}, {id:'c',text:'The bread and wine in Communion literally become the body and blood of Christ'}, {id:'d',text:'Only adults should be baptized'}], correctOptionId: 'c', explanation: 'Transubstantiation, a Roman Catholic doctrine, teaches that the substance of the bread and wine changes into the actual body and blood of Christ, while the appearances remain. Reformers largely rejected this view, proposing alternatives like consubstantiation or a symbolic understanding.' },
      { id: 'aq5_5', text: 'The sale of what by the Catholic Church was a major catalyst for Luther\'s 95 Theses?', options: [{id:'a',text:'Church offices (simony)'}, {id:'b',text:'Relics of saints'}, {id:'c',text:'Indulgences'}, {id:'d',text:'Biblical manuscripts'}], correctOptionId: 'c', explanation: 'The sale of indulgences, which were claimed to reduce time in purgatory, was a key practice Luther protested against, as it undermined the doctrine of salvation by grace through faith.' },
    ]
  }
];

const mockQuizzes: Quiz[] = mockQuizzesRaw.map(quiz => ({
  ...quiz,
  questions: adjustQuestionCount(quiz as Quiz) // Cast quiz to Quiz here as it matches the structure
}));


const mockStudyTopics: StudyTopic[] = [
  {
    id: 'st1',
    title: 'The Attributes of God',
    description: 'A comprehensive study of God\'s character as revealed in Scripture, exploring His incommunicable and communicable attributes.',
    imageUrl: 'https://source.unsplash.com/800x600/?god_glory_sky,divine_light_abstract,heavenly_attributes_scroll',
    verseCount: 12, // Example
    keyVerses: ['Jeremiah 32:17', 'Psalm 147:5', '1 John 4:8'], // Example
    contentSections: [
      { 
        id: 'st1_s1', 
        title: 'God\'s Omnipotence (All-Powerful)', 
        content: `
          <p>Omnipotence means God possesses all power and can do anything consistent with His holy character. It doesn't mean God can do what is logically impossible (like make a square circle) or act against His own nature (like sin or lie). His power is exercised in wisdom and love.</p>
          <p><strong>Key Verses:</strong></p>
          <ul>
            <li><strong>Jeremiah 32:17:</strong> "Ah, Lord GOD! It is you who have made the heavens and the earth by your great power and by your outstretched arm! Nothing is too hard for you."</li>
            <li><strong>Matthew 19:26:</strong> "But Jesus looked at them and said, 'With man this is impossible, but with God all things are possible.'"</li>
            <li><strong>Revelation 19:6:</strong> "Then I heard what seemed to be the voice of a great multitude, like the roar of many waters and like the sound of mighty peals of thunder, crying out, 'Hallelujah! For the Lord our God the Almighty reigns.'"</li>
          </ul>
          <p>Understanding God's omnipotence brings comfort and confidence. He is able to accomplish His purposes, protect His people, and ultimately triumph over all evil. It calls us to trust in His sovereign power rather than our own limited strength.</p>
        ` 
      },
      { 
        id: 'st1_s2', 
        title: 'God\'s Omniscience (All-Knowing)', 
        content: `
          <p>Omniscience means God knows all things – past, present, and future – including our thoughts, intentions, and the most minute details of creation. His knowledge is complete, perfect, and effortless. Nothing is hidden from Him, and He is never surprised.</p>
          <p><strong>Key Verses:</strong></p>
          <ul>
            <li><strong>Psalm 147:5:</strong> "Great is our Lord, and abundant in power; his understanding is beyond measure."</li>
            <li><strong>Hebrews 4:13:</strong> "And no creature is hidden from his sight, but all are naked and exposed to the eyes of him to whom we must give account."</li>
            <li><strong>1 John 3:20:</strong> "...for whenever our heart condemns us, God is greater than our heart, and he knows everything."</li>
            <li><strong>Isaiah 46:9-10:</strong> "...I am God, and there is no other; I am God, and there is none like me, declaring the end from the beginning and from ancient times things not yet done..."</li>
          </ul>
          <p>God's omniscience provides assurance that He understands our situations fully, even when we don't. It also brings accountability, as all our actions and thoughts are known to Him. This attribute works in harmony with His love and justice.</p>
        `
      },
      { 
        id: 'st1_s3', 
        title: 'God\'s Love and Grace', 
        content: `
          <p>God's love (agape) is a foundational aspect of His character. It is unconditional, sacrificial, and eternal. Grace is God's unmerited favor – His free gift of kindness and salvation to those who do not deserve it. Both love and grace are most clearly demonstrated in the sending of Jesus Christ.</p>
          <p><strong>Key Verses on Love:</strong></p>
          <ul>
            <li><strong>John 3:16:</strong> "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."</li>
            <li><strong>Romans 5:8:</strong> "But God shows his love for us in that while we were still sinners, Christ died for us."</li>
            <li><strong>1 John 4:8, 16:</strong> "Anyone who does not love does not know God, because God is love... So we have come to know and to believe the love that God has for us. God is love, and whoever abides in love abides in God, and God abides in him."</li>
          </ul>
          <p><strong>Key Verses on Grace:</strong></p>
          <ul>
            <li><strong>Ephesians 2:8-9:</strong> "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast."</li>
            <li><strong>Titus 2:11:</strong> "For the grace of God has appeared, bringing salvation for all people."</li>
            <li><strong>2 Corinthians 12:9:</strong> "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'"</li>
          </ul>
          <p>Understanding God's love and grace transforms our relationship with Him, freeing us from performance-based religion and assuring us of His constant care and provision for our salvation and daily lives.</p>
        `
      },
      { 
        id: 'st1_s4', 
        title: 'God\'s Holiness', 
        content: `
          <p>Holiness means God is utterly separate from sin and morally perfect. He is pure, righteous, and set apart in His majesty and character. His holiness is the standard for all moral goodness and the reason He cannot tolerate sin.</p>
          <p><strong>Key Verses:</strong></p>
          <ul>
            <li><strong>Isaiah 6:3:</strong> "And one called to another and said: 'Holy, holy, holy is the LORD of hosts; the whole earth is full of his glory!'"</li>
            <li><strong>1 Peter 1:15-16:</strong> "But as he who called you is holy, you also be holy in all your conduct, since it is written, 'You shall be holy, for I am holy.'"</li>
            <li><strong>Leviticus 19:2:</strong> "Speak to all the congregation of the people of Israel and say to them, You shall be holy, for I the LORD your God am holy."</li>
            <li><strong>Hebrews 12:14:</strong> "Strive for peace with everyone, and for the holiness without which no one will see the Lord."</li>
          </ul>
          <p>God's holiness is both awe-inspiring and convicting. It reveals our sinfulness and the need for a Savior. Through Christ, we are declared holy (positional sanctification) and are called to live holy lives (progressive sanctification), reflecting His character.</p>
        `
      },
    ],
  },
  {
    id: 'st2',
    title: 'The Sermon on the Mount',
    description: 'An in-depth look at Jesus\' foundational teachings in Matthew 5-7, outlining the ethics and character of Kingdom citizens.',
    imageUrl: 'https://source.unsplash.com/800x600/?jesus_on_mount,crowd_listening_teacher,beatitudes_landscape',
    verseCount: 107, // Example (Matthew 5-7 has many verses)
    keyVerses: ['Matthew 5:3-12', 'Matthew 6:33', 'Matthew 7:12'],
    contentSections: [
      { 
        id: 'st2_s1', 
        title: 'The Beatitudes (Matthew 5:1-12)', 
        content: `
          <p>The Sermon on the Mount begins with the Beatitudes, a series of blessings that describe the character of those who belong to God's Kingdom. They are counter-cultural and portray an upside-down value system compared to the world.</p>
          <p><strong>Key Blessings:</strong></p>
          <ul>
            <li><strong>Poor in spirit:</strong> Those who recognize their spiritual bankruptcy before God.</li>
            <li><strong>Those who mourn:</strong> Those who grieve over sin – their own and the world's.</li>
            <li><strong>Meek:</strong> Those who are gentle and humble, submitting to God's will.</li>
            <li><strong>Hunger and thirst for righteousness:</strong> Those who passionately desire God's righteousness in their lives and the world.</li>
            <li><strong>Merciful:</strong> Those who show compassion and forgiveness to others.</li>
            <li><strong>Pure in heart:</strong> Those whose motives and inner life are aligned with God.</li>
            <li><strong>Peacemakers:</strong> Those who actively work to reconcile people to God and to one another.</li>
            <li><strong>Persecuted for righteousness' sake:</strong> Those who suffer for their allegiance to Christ.</li>
          </ul>
          <p>The Beatitudes are not commands to obey but descriptions of the character that God blesses and cultivates in His people through His grace. They challenge us to examine our hearts and priorities.</p>
        `
      },
      { 
        id: 'st2_s2', 
        title: 'Salt and Light (Matthew 5:13-16)', 
        content: `
          <p>Jesus uses two powerful metaphors to describe the influence of His followers in the world: salt and light. These images highlight the responsibility and impact of Kingdom citizens.</p>
          <p><strong>Salt of the Earth:</strong></p>
          <ul>
            <li>Salt was used as a preservative, preventing corruption. Believers are to have a preserving influence, hindering moral decay in society.</li>
            <li>Salt adds flavor. Christians should bring a distinct, positive quality to the world around them.</li>
            <li>Jesus warns against losing saltiness, becoming ineffective and useless.</li>
          </ul>
          <p><strong>Light of the World:</strong></p>
          <ul>
            <li>Light dispels darkness and reveals what is hidden. Believers are to shine the light of God's truth and goodness in a dark world.</li>
            <li>Light is meant to be seen. Jesus instructs His followers to let their light shine before others, so that they may see their good works and glorify God.</li>
            <li>Hiding one's light (like putting it under a basket) negates its purpose.</li>
          </ul>
          <p>These metaphors call believers to live distinct lives that positively impact society and draw attention not to themselves, but to God. It's a call to active, visible faith.</p>
        `
      },
      { 
        id: 'st2_s3', 
        title: 'Christ and the Law (Matthew 5:17-48)', 
        content: `
          <p>Jesus clarifies His relationship to the Old Testament Law. He did not come to abolish it but to fulfill it, bringing it to its intended meaning and purpose. He then demonstrates this by contrasting common interpretations of the Law with its deeper, heart-level demands.</p>
          <p><strong>Key Teachings:</strong></p>
          <ul>
            <li><strong>Fulfillment, not Abolition (5:17-20):</strong> Jesus affirms the Law's authority and permanence, but shows He is its ultimate fulfillment. He calls for a righteousness exceeding that of the scribes and Pharisees, which is an internal righteousness of the heart.</li>
            <li><strong>Anger and Murder (5:21-26):</strong> Jesus teaches that unrighteous anger and contemptuous words are as serious as murder in God's eyes, as they stem from the same root of hatred. He emphasizes reconciliation.</li>
            <li><strong>Lust and Adultery (5:27-30):</strong> Jesus internalizes the command against adultery, stating that lustful thoughts are a violation of its spirit. He calls for radical measures to deal with sin.</li>
            <li><strong>Divorce (5:31-32):</strong> Jesus restricts the grounds for divorce, highlighting God's original intent for the permanence of marriage.</li>
            <li><strong>Oaths (5:33-37):</strong> Jesus calls for simple truthfulness, where a "yes" means yes and a "no" means no, without the need for elaborate oaths.</li>
            <li><strong>Retaliation (5:38-42):</strong> Jesus overturns the "eye for an eye" principle for personal vengeance, calling for non-retaliation and generosity.</li>
            <li><strong>Love for Enemies (5:43-48):</strong> Jesus commands the radical love of enemies, reflecting the character of God who sends rain on the just and unjust. This is a hallmark of true children of God.</li>
          </ul>
          <p>Throughout this section, Jesus emphasizes that God is concerned not just with outward actions but with the inner attitudes and motives of the heart. He raises the standard of righteousness to a divine level, showing our need for His grace and transformation.</p>
        `
      },
      { 
        id: 'st2_s4', 
        title: 'True Righteousness: Giving, Praying, Fasting (Matthew 6:1-18)', 
        content: `
          <p>Jesus addresses three key religious practices: giving alms, praying, and fasting. He warns against performing these acts for public recognition and teaches the importance of sincere, God-focused motives.</p>
          <p><strong>Giving to the Needy (6:1-4):</strong></p>
          <ul>
            <li>The wrong way: Giving publicly to be seen and praised by others. Such people have already received their reward.</li>
            <li>The right way: Giving secretly, without drawing attention to oneself. God, who sees in secret, will reward this genuine charity.</li>
          </ul>
          <p><strong>Prayer (6:5-15):</strong></p>
          <ul>
            <li>The wrong way: Praying ostentatiously in public or using vain repetitions like pagans.</li>
            <li>The right way: Praying privately and sincerely to the Father. Jesus then provides a model prayer (The Lord's Prayer), emphasizing adoration, submission to God's will, dependence for provision, confession, and seeking deliverance. He also stresses the importance of forgiving others.</li>
          </ul>
          <p><strong>Fasting (6:16-18):</strong></p>
          <ul>
            <li>The wrong way: Fasting with a gloomy appearance to show others their piety.</li>
            <li>The right way: Fasting in a way that is not obvious to others, doing it for God alone.</li>
          </ul>
          <p>The underlying principle is that true piety is directed toward God, not for human applause. God values the secret devotion of the heart over outward displays designed to impress people.</p>
        `
      },
    ],
  },
  {
    id: 'st3',
    title: 'The Person and Work of the Holy Spirit',
    description: 'An exploration of the third person of the Trinity: His deity, personality, and His multifaceted ministry in the world and in the lives of believers.',
    imageUrl: 'https://source.unsplash.com/800x600/?dove_holy_spirit,pentecost_fire_flames,spiritual_wind_abstract',
    verseCount: 15,
    keyVerses: ['John 16:13', 'Acts 5:3-4', '1 Corinthians 12:11'],
    contentSections: [
      { 
        id: 'st3_s1', 
        title: 'The Deity and Personality of the Holy Spirit', 
        content: `
          <p>The Holy Spirit is not an impersonal force or influence, but a distinct divine Person, co-equal and co-eternal with God the Father and God the Son. Scripture attributes to Him divine titles, divine attributes, and divine works, and He possesses the characteristics of personality (intellect, emotion, will).</p>
          <p><strong>Evidence of Deity:</strong></p>
          <ul>
            <li><strong>Called God:</strong> Acts 5:3-4 (lying to the Holy Spirit is lying to God).</li>
            <li><strong>Possesses Divine Attributes:</strong> Omnipresence (Psalm 139:7-10), Omniscience (1 Corinthians 2:10-11), Omnipotence (Luke 1:35), Eternality (Hebrews 9:14).</li>
            <li><strong>Performs Divine Works:</strong> Creation (Genesis 1:2), Regeneration (John 3:5-8, Titus 3:5), Inspiration of Scripture (2 Peter 1:21).</li>
            <li><strong>Associated equally with Father and Son:</strong> Matthew 28:19 (Baptismal formula), 2 Corinthians 13:14 (Apostolic benediction).</li>
          </ul>
          <p><strong>Evidence of Personality:</strong></p>
          <ul>
            <li><strong>Intellect:</strong> He teaches, reminds, and guides into truth (John 14:26, 16:13); He has a mind (Romans 8:27); He searches the depths of God (1 Corinthians 2:10).</li>
            <li><strong>Emotion:</strong> He can be grieved (Ephesians 4:30); He loves (Romans 15:30 - implied through "love of the Spirit").</li>
            <li><strong>Will:</strong> He distributes spiritual gifts as He wills (1 Corinthians 12:11); He directs the activities of believers (Acts 16:6-7).</li>
            <li><strong>Performs Personal Actions:</strong> He speaks (Acts 13:2), testifies (John 15:26), intercedes (Romans 8:26), comforts (Acts 9:31).</li>
          </ul>
          <p>Understanding the Holy Spirit as a divine Person is crucial for a proper relationship with Him and for appreciating the fullness of His ministry.</p>
        `
      },
      { 
        id: 'st3_s2', 
        title: 'The Holy Spirit in the Old Testament', 
        content: `
          <p>While the outpouring of the Holy Spirit is a distinctive feature of the New Covenant age, the Spirit was active in the Old Testament period, though His ministry was often selective and sometimes temporary upon individuals.</p>
          <p><strong>Key Areas of Activity:</strong></p>
          <ul>
            <li><strong>Creation:</strong> The Spirit of God was involved in the creation of the universe (Genesis 1:2, Psalm 33:6, Job 26:13).</li>
            <li><strong>Empowering for Service:</strong>
              <ul>
                <li><strong>Leadership:</strong> Equipping leaders like Joseph (Genesis 41:38), Moses and the elders (Numbers 11:17, 25), Joshua (Numbers 27:18).</li>
                <li><strong>Judges:</strong> Empowering judges like Othniel (Judges 3:10), Gideon (Judges 6:34), Samson (Judges 14:6, 19).</li>
                <li><strong>Craftsmanship:</strong> Gifting artisans like Bezalel for constructing the tabernacle (Exodus 31:1-5).</li>
                <li><strong>Prophecy:</strong> Inspiring prophets to speak God's word (Numbers 24:2 - Balaam; 1 Samuel 10:10 - Saul; Ezekiel 2:2). David acknowledged the Spirit spoke through him (2 Samuel 23:2).</li>
              </ul>
            </li>
            <li><strong>Striving with Humanity:</strong> God's Spirit strove with mankind before the flood (Genesis 6:3).</li>
            <li><strong>Producing Moral and Spiritual Life (Individual):</strong> While not universal like in the New Covenant, there's evidence of the Spirit's internal work in individuals like David (Psalm 51:11 - "Take not your Holy Spirit from me").</li>
            <li><strong>Prophecies of Future Outpouring:</strong> The Old Testament looked forward to a time when the Spirit would be poured out more broadly on God's people (Isaiah 32:15, 44:3; Ezekiel 36:26-27, 39:29; Joel 2:28-29).</li>
          </ul>
          <p>The Old Testament lays the foundation for understanding the expanded and more personal ministry of the Holy Spirit in the New Covenant, particularly after Pentecost.</p>
        `
      },
      { 
        id: 'st3_s3', 
        title: 'The Work of the Holy Spirit in Salvation', 
        content: `
          <p>The Holy Spirit is indispensable in every aspect of a person's salvation, from initial conviction to final glorification. He applies the work of Christ to the believer's heart.</p>
          <p><strong>Key Aspects of His Salvific Work:</strong></p>
          <ul>
            <li><strong>Conviction of Sin (Pre-Conversion):</strong> The Spirit convicts the world of sin, righteousness, and judgment, drawing people to Christ (John 16:8-11). He opens hearts to receive the gospel (Acts 16:14 - Lydia).</li>
            <li><strong>Regeneration (New Birth):</strong> This is the Spirit's work of imparting new, spiritual life to a spiritually dead person (John 3:5-8; Titus 3:5). It's a radical transformation, making one a new creation (2 Corinthians 5:17).</li>
            <li><strong>Indwelling:</strong> At the moment of salvation, the Holy Spirit comes to live permanently within every believer (Romans 8:9; 1 Corinthians 3:16, 6:19; Galatians 4:6). This is a promise for all New Covenant believers.</li>
            <li><strong>Baptism with/in the Spirit:</strong> This refers to the Spirit's work of uniting the believer to Christ and incorporating them into the Body of Christ, the Church, at conversion (1 Corinthians 12:13; Galatians 3:27-28).</li>
            <li><strong>Sealing:</strong> The Holy Spirit is the seal of God upon believers, signifying ownership, security, and the guarantee of future redemption (Ephesians 1:13-14, 4:30; 2 Corinthians 1:22).</li>
            <li><strong>Assurance of Salvation:</strong> The Spirit bears witness with our spirit that we are children of God (Romans 8:16).</li>
            <li><strong>Sanctification:</strong> The ongoing process by which the Spirit sets believers apart for God and conforms them to the image of Christ (Romans 8:13; 2 Thessalonians 2:13; 1 Peter 1:2; Galatians 5:16-25 - Fruit of the Spirit).</li>
          </ul>
          <p>Without the Holy Spirit's active involvement, no one could come to faith, be born again, or grow in Christ-likeness. His work is essential for experiencing the fullness of God's salvation.</p>
        `
      },
    ],
  },
  {
    id: 'st4',
    title: 'Understanding Biblical Genres',
    description: 'Learn to identify and interpret different literary styles in the Bible for richer understanding.',
    imageUrl: 'https://source.unsplash.com/800x600/?ancient_library_scrolls,bible_literary_styles,interpreting_scripture_tools',
    verseCount: 8,
    keyVerses: ['2 Timothy 3:16', 'Hebrews 1:1-2'],
    contentSections: [
      {
        id: 'st4_s1',
        title: 'Introduction to Biblical Genres',
        content: `<p>The Bible is not a single book but a library of books written in various literary styles or genres. Recognizing the genre of a passage is crucial for accurate interpretation, as different genres have different rules and aims. Key genres include Narrative, Law, Poetry, Wisdom Literature, Prophecy, Gospels, Epistles, and Apocalyptic.</p>`
      },
      {
        id: 'st4_s2',
        title: 'Narrative',
        content: `<p>Biblical narratives tell stories of historical events, individuals, and God's interaction with humanity (e.g., Genesis, Exodus, Acts). Interpretive keys: Identify characters, plot, setting, and the narrator's viewpoint. Look for theological truths conveyed through the story, not just historical facts. Understand that not everything recorded is endorsed.</p>`
      },
      {
        id: 'st4_s3',
        title: 'Poetry and Wisdom Literature',
        content: `<p>Books like Psalms, Proverbs, Job, Ecclesiastes, and Song of Solomon use vivid imagery, parallelism, and metaphor. Interpretive keys: Recognize figurative language. Understand that poetry often expresses emotional and experiential truth. Proverbs are general principles, not absolute promises. Job and Ecclesiastes explore deep questions of suffering and meaning.</p>`
      },
      {
        id: 'st4_s4',
        title: 'Epistles (Letters)',
        content: `<p>Letters written by apostles to churches or individuals (e.g., Romans, Ephesians, 1 Peter). Interpretive keys: Understand the historical context (author, recipients, occasion). Identify the main argument and theological themes. Apply principles to contemporary situations while respecting the original context.</p>`
      }
    ]
  },
  {
    id: 'st5',
    title: 'The Parables of Jesus: Deeper Meanings',
    description: 'Explore the rich teachings of Jesus conveyed through His parables, uncovering their context and timeless truths.',
    imageUrl: 'https://source.unsplash.com/800x600/?sower_seeds_field,good_samaritan_helping,lost_sheep_found_rejoice',
    verseCount: 10,
    keyVerses: ['Matthew 13:34-35', 'Luke 15:1-2'],
    contentSections: [
      {
        id: 'st5_s1',
        title: 'What is a Parable?',
        content: `<p>A parable is an earthly story with a heavenly meaning. Jesus used parables to illustrate spiritual truths, often related to the Kingdom of God. They were designed to make truth memorable, reveal it to the receptive, and conceal it from the hardened.</p>`
      },
      {
        id: 'st5_s2',
        title: 'Interpreting Parables',
        content: `<p>Key principles: 1. Identify the main point(s) – parables usually have one or a few central messages. 2. Understand the original audience and cultural context. 3. Pay attention to details Jesus emphasizes. 4. Avoid over-allegorizing every detail unless the text supports it. 5. Look for the unexpected twist or surprise element.</p>`
      },
      {
        id: 'st5_s3',
        title: 'Examples: Parable of the Sower & Good Samaritan',
        content: `<p><strong>The Sower (Matthew 13):</strong> Illustrates different responses to the Word of God. The focus is on the types of soil (hearts). <br/> <strong>The Good Samaritan (Luke 10):</strong> Defines what it means to be a true neighbor, challenging cultural prejudices and emphasizing compassionate action.</p>`
      }
    ]
  },
  {
    id: 'st6',
    title: 'Spiritual Disciplines for Growth',
    description: 'Discover ancient and biblical practices that foster spiritual maturity and a deeper relationship with God.',
    imageUrl: 'https://source.unsplash.com/800x600/?prayer_hands_bible_study,meditation_sunrise_cross,journaling_scripture_reflection',
    verseCount: 7,
    keyVerses: ['1 Timothy 4:7-8', 'Psalm 1:2', 'Matthew 6:6'],
    contentSections: [
      {
        id: 'st6_s1',
        title: 'Why Spiritual Disciplines?',
        content: `<p>Spiritual disciplines are not means of earning salvation but practices that position us to receive God's grace and be transformed by the Holy Spirit. They help us train for godliness (1 Timothy 4:7-8) and cultivate intimacy with Christ.</p>`
      },
      {
        id: 'st6_s2',
        title: 'Key Disciplines: Inward & Outward',
        content: `<p><strong>Inward Disciplines:</strong> Meditation (on Scripture), Prayer (various forms), Fasting, Study.<br/><strong>Outward Disciplines:</strong> Simplicity, Solitude, Submission, Service.<br/><strong>Corporate Disciplines:</strong> Confession, Worship, Guidance, Celebration.</p><p>These are activities we engage in to deepen our spiritual lives.</p>`
      },
      {
        id: 'st6_s3',
        title: 'The Goal: Transformation, Not Legalism',
        content: `<p>The purpose of spiritual disciplines is Christ-likeness, not mere outward observance or earning God's favor. They should lead to greater love for God and others, joy, peace, and the Fruit of the Spirit. The attitude of the heart is paramount.</p>`
      }
    ]
  },
  {
    id: 'st7',
    title: 'The Early Church and Its Expansion (Book of Acts)',
    description: 'Study the birth and explosive growth of the Christian church as recorded in the Book of Acts.',
    imageUrl: 'https://source.unsplash.com/800x600/?ancient_world_map_spread,apostles_preaching_crowd,christian_community_sharing_food',
    verseCount: 20,
    keyVerses: ['Acts 1:8', 'Acts 2:42-47', 'Acts 9:1-19'],
    contentSections: [
      {
        id: 'st7_s1',
        title: 'The Coming of the Spirit (Acts 1-2)',
        content: `<p>The Book of Acts begins with Jesus' ascension and the promise of the Holy Spirit. Pentecost marks the birth of the Church, as the Spirit empowers the disciples to preach the Gospel, resulting in thousands of conversions.</p>`
      },
      {
        id: 'st7_s2',
        title: 'Characteristics of the Early Church (Acts 2-5)',
        content: `<p>The early believers devoted themselves to the apostles' teaching, fellowship, breaking of bread, and prayer. They shared generously, experienced miracles, and faced persecution with boldness. Key figures include Peter, John, and Stephen.</p>`
      },
      {
        id: 'st7_s3',
        title: 'Expansion to Gentiles (Acts 6-12)',
        content: `<p>Persecution scatters believers, spreading the Gospel. Philip preaches in Samaria. Saul's conversion transforms him into Paul, the apostle to the Gentiles. Peter's vision leads to Cornelius' conversion, opening the door for Gentiles into the Church without needing to become Jewish first.</p>`
      },
      {
        id: 'st7_s4',
        title: 'Paul\'s Missionary Journeys (Acts 13-28)',
        content: `<p>The latter half of Acts focuses on Paul's extensive missionary journeys, planting churches throughout the Roman Empire. This section details his preaching, miracles, opposition, and eventual imprisonment in Rome, from where he continued to spread the Gospel.</p>`
      }
    ]
  },
  {
    id: 'st8',
    title: 'Christian Apologetics: Defending the Faith',
    description: 'Learn how to provide a reasoned defense of the Christian faith and address common questions and objections.',
    imageUrl: 'https://source.unsplash.com/800x600/?open_bible_reason,faith_dialogue_question,defending_christianity_podium',
    verseCount: 9,
    keyVerses: ['1 Peter 3:15', 'Jude 1:3', 'Colossians 4:6'],
    contentSections: [
      {
        id: 'st8_s1',
        title: 'What is Apologetics? (1 Peter 3:15)',
        content: `<p>Christian apologetics is the discipline of defending the Christian faith through systematic argument and evidence. It involves giving reasons for our hope in Christ, answering objections, and clearing away misunderstandings about Christianity.</p>`
      },
      {
        id: 'st8_s2',
        title: 'Key Areas of Apologetics',
        content: `<p>Common areas include: Arguments for God's existence (cosmological, teleological, moral), the reliability of the Bible, the historical evidence for Jesus' life, death, and resurrection, addressing the problem of evil and suffering, and responding to scientific or philosophical challenges.</p>`
      },
      {
        id: 'st8_s3',
        title: 'Approaches and Attitudes',
        content: `<p>Effective apologetics requires not only sound arguments but also humility, gentleness, and respect (1 Peter 3:15). The goal is not just to win arguments but to lovingly persuade and point people to Christ. Different approaches (classical, evidential, presuppositional) can be used depending on the context and audience.</p>`
      }
    ]
  }
];

const mockDailyScriptures: DailyScripture[] = [
  { id: 'ds1', reference: 'Isaiah 41:10', text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.", isFavorite: false },
  { id: 'ds2', reference: 'Romans 6:23', text: "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.", isFavorite: false },
  { id: 'ds3', reference: '1 Peter 1:8-9', text: "Though you have not seen him, you love him. Though you do not now see him, you believe in him and rejoice with joy that is inexpressible and filled with glory, obtaining the outcome of your faith, the salvation of your souls.", isFavorite: false },
];


// Helper function to get user data from localStorage
const getUserData = (userId: string): UserData => {
  const rawData = localStorage.getItem(`${LOCAL_STORAGE_USER_DATA_KEY}_${userId}`);
  if (rawData) {
    try {
      return JSON.parse(rawData) as UserData;
    } catch (e) {
      console.error("Failed to parse user data:", e);
    }
  }
  // Default structure if no data or parse error
  return { quizProgress: {} };
};

// Helper function to save user data to localStorage
const saveUserData = (userId: string, data: UserData): void => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_USER_DATA_KEY}_${userId}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save user data:", e);
  }
};


// Public API for data service
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockBlogPosts]), 300));
};

export const getBlogPost = async (id: string): Promise<BlogPost | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockBlogPosts.find(post => post.id === id)), 200));
};

export const getQuizzes = async (): Promise<Quiz[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockQuizzes]), 300));
};

export const getQuiz = async (id: string): Promise<Quiz | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockQuizzes.find(quiz => quiz.id === id)), 200));
};

export const getStudyTopics = async (): Promise<StudyTopic[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockStudyTopics]), 300));
};

export const getStudyTopic = async (id: string): Promise<StudyTopic | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockStudyTopics.find(topic => topic.id === id)), 200));
};

export const getDailyScriptures = async (): Promise<DailyScripture[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockDailyScriptures]), 100));
};

// User Data specific services
export const getUserDataService = (userId: string): UserData => {
  return getUserData(userId);
};

export const updateUserQuizProgress = (userId: string, quizId: string, progress: Partial<UserQuizProgress>): void => {
  const userData = getUserData(userId);
  const existingProgress = userData.quizProgress[quizId] || { score: 0, completed: false, currentQuestionIndex: 0, answers: {} };
  userData.quizProgress[quizId] = { ...existingProgress, ...progress, timestamp: Date.now() };
  saveUserData(userId, userData);
};

export const getUserQuizProgress = (userId: string, quizId: string): UserQuizProgress | undefined => {
  const userData = getUserData(userId);
  return userData.quizProgress[quizId];
};

// Initializes user data if it doesn't exist. Called on login.
export const initializeUserData = (userId: string): void => {
  getUserData(userId); // This will create default if not exists
};
