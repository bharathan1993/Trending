import { TrendingTopic, Tweet } from '../types';

// Get a random timestamp from the last 24 hours
const getRecentTimestamp = () => {
  const now = Date.now();
  const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
  return new Date(twentyFourHoursAgo + Math.random() * (now - twentyFourHoursAgo)).toISOString();
};

export const mockTopics: TrendingTopic[] = [
  {
    id: 'topic-1',
    title: 'Breaking: Major Tech Announcement',
    tweetCount: 152400
  },
  {
    id: 'topic-2',
    title: 'Global Climate Summit 2024',
    tweetCount: 143200
  },
  {
    id: 'topic-3',
    title: '#AIInnovation',
    tweetCount: 138900
  },
  {
    id: 'topic-4',
    title: 'Latest Space Mission Updates',
    tweetCount: 131500
  },
  {
    id: 'topic-5',
    title: 'Breaking Sports News',
    tweetCount: 128700
  }
];

const tweetTemplates = {
  'Breaking: Major Tech Announcement': [
    "Just watched the live stream of the announcement. This is going to change everything! 🚀",
    "The new features they announced are mind-blowing. Can't wait to try them out! 💫",
    "This is exactly what the industry needed. Game-changing announcement! 🎯",
    "Already testing the beta version. The improvements are incredible! 🔥",
    "The market reaction to this announcement has been insane! 📈"
  ],
  'Global Climate Summit 2024': [
    "Live from the summit: Leaders just announced ambitious new targets! 🌍",
    "These new climate policies could be transformative. Here's why... 🌱",
    "Incredible to see such global cooperation at the summit today! 🤝",
    "Breaking: Major announcement from the climate summit! 🚨",
    "The data presented at today's session is eye-opening. We must act now. 📊"
  ],
  '#AIInnovation': [
    "Just tested the latest AI model. The results are unprecedented! 🤖",
    "This new AI breakthrough is revolutionizing how we work. Here's how... 💡",
    "Live demo of the new AI capabilities. Simply amazing! ✨",
    "The potential applications of this AI technology are endless! 🔮",
    "Breaking: Major AI research breakthrough announced today! 🎯"
  ]
};

export const generateMockTweets = (topic: string): Tweet[] => {
  const templates = tweetTemplates[topic] || [
    `Breaking news about ${topic}! This is happening right now! 🚨`,
    `Live updates on ${topic}: The situation is developing rapidly! 📱`,
    `Just in: Major announcement about ${topic}! Here's what we know... 🔥`,
    `Currently at the ${topic} event. The energy here is incredible! ✨`,
    `Breaking: New developments in ${topic}! This changes everything! 💫`
  ];

  return templates.map((content, index) => ({
    id: `tweet-${index}`,
    content,
    likes: Math.floor(Math.random() * 10000) + 500,
    retweets: Math.floor(Math.random() * 5000) + 200,
    timestamp: getRecentTimestamp(),
    author: {
      name: `${topic.split(' ')[0]} Expert`,
      handle: `${topic.split(' ')[0].toLowerCase()}_insider${index + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${topic}${index}`
    }
  }));
};