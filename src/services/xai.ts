import { config } from '../config/env';
import { TrendingTopic, Tweet } from '../types';
import { mockTopics, generateMockTweets } from '../data/mockData';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  backoff = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof APIError && error.status === 429 && retries > 0) {
      await delay(backoff);
      return retryWithBackoff(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function fetchTrendingTopics(location: { country: string, state?: string }): Promise<TrendingTopic[]> {
  try {
    if (!config.xAI.apiKey) {
      console.warn('xAI API key not configured, using mock data');
      return mockTopics;
    }

    const locationText = location.state 
      ? `${location.state}, ${location.country}`
      : location.country === 'Global' 
        ? 'worldwide' 
        : location.country;

    return await retryWithBackoff(async () => {
      const response = await fetch(`${config.xAI.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.xAI.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that provides trending topics data from the last 24 hours only. Return the response as a JSON array of objects, where each object has properties: id (string), title (string), and tweetCount (number). Focus on currently trending topics that are being actively discussed right now. The response should only contain the JSON data without any additional text."
            },
            {
              role: "user",
              content: `What are the current top 10 trending topics that are being discussed right now (within the last 24 hours) ${locationText}? Return only the JSON array.`
            }
          ],
          model: "grok-beta",
          temperature: 0.2,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limit reached, falling back to mock data');
          return mockTopics;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          response.status,
          errorData.error?.message || `API request failed: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response format');
      }

      let content = data.choices[0].message.content;
      
      try {
        content = content.replace(/```json\n?|\n?```/g, '');
        const topics = JSON.parse(content);
        const topicsArray = Array.isArray(topics) ? topics : topics.topics || [];
        
        return topicsArray.map((topic: any) => ({
          id: topic.id || `topic-${Math.random().toString(36).substr(2, 9)}`,
          title: topic.title || topic.name || topic.topic || '',
          tweetCount: topic.tweetCount || topic.count || Math.floor(Math.random() * 50000) + 1000
        })).filter(topic => topic.title);
      } catch (parseError) {
        console.error('Error parsing response:', parseError, 'Raw content:', content);
        return mockTopics;
      }
    });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return mockTopics;
  }
}

export async function fetchRelatedTweets(topic: string, location: { country: string, state?: string }): Promise<Tweet[]> {
  try {
    if (!config.xAI.apiKey) {
      console.warn('xAI API key not configured, using mock data');
      return generateMockTweets(topic);
    }

    const locationText = location.state 
      ? `${location.state}, ${location.country}`
      : location.country === 'Global' 
        ? 'worldwide' 
        : location.country;

    return await retryWithBackoff(async () => {
      const response = await fetch(`${config.xAI.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.xAI.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that provides tweet data from the last 24 hours only. Return the response as a JSON array of 5 tweet objects, where each object has properties: id, content, likes, retweets, timestamp (must be within the last 24 hours), and author (with name, handle, and avatar). Focus on the most recent and engaging tweets. The response should only contain the JSON data without any additional text."
            },
            {
              role: "user",
              content: `What are the 5 most recent and engaging tweets from the last 24 hours about "${topic}" ${locationText}? Return only the JSON array.`
            }
          ],
          model: "grok-beta",
          temperature: 0.2,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limit reached, falling back to mock data');
          return generateMockTweets(topic);
        }
        throw new APIError(
          response.status,
          `Failed to fetch related tweets: ${response.statusText}`
        );
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      content = content.replace(/```json\n?|\n?```/g, '');
      
      try {
        const tweets = JSON.parse(content);
        return tweets.slice(0, 5).map((tweet: any) => ({
          id: tweet.id || `tweet-${Math.random().toString(36).substr(2, 9)}`,
          content: tweet.content,
          likes: tweet.likes || Math.floor(Math.random() * 1000) + 100,
          retweets: tweet.retweets || Math.floor(Math.random() * 500) + 50,
          timestamp: tweet.timestamp || new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
          author: {
            name: tweet.author.name,
            handle: tweet.author.handle,
            avatar: tweet.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tweet.author.handle}`
          }
        }));
      } catch (parseError) {
        console.error('Error parsing tweets:', parseError);
        return generateMockTweets(topic);
      }
    });
  } catch (error) {
    console.error('Error fetching related tweets:', error);
    return generateMockTweets(topic);
  }
}