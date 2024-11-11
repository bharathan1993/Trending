export interface TrendingTopic {
  id: string;
  title: string;
  tweetCount: number;
}

export interface Location {
  country: string;
  state?: string;
}

export interface CountryData {
  name: string;
  states: string[];
}