export interface Tweet {
  id: string;
  content: string;
  likes: number;
  retweets: number;
  timestamp: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
}

export interface TrendingTopic {
  id: string;
  title: string;
  tweetCount: number;
  tweets?: Tweet[];
}

export interface Location {
  country: string;
  state?: string;
}

export interface CountryData {
  name: string;
  states: string[];
}