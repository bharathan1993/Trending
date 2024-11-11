import React from 'react';
import { TrendingTopic, Tweet } from '../types';
import { TrendingUp, MessageCircle, Repeat2, Heart, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  isLoading: boolean;
  location: string;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string) => void;
  relatedTweets: Tweet[];
  isTweetsLoading: boolean;
}

export function TrendingTopics({
  topics,
  isLoading,
  location,
  selectedTopic,
  onTopicSelect,
  relatedTweets,
  isTweetsLoading
}: TrendingTopicsProps) {
  const handleTopicClick = (topicId: string) => {
    if (topicId !== selectedTopic) {
      onTopicSelect(topicId);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No trending topics</h3>
        <p className="mt-1 text-sm text-gray-500">No trending topics found for {location}</p>
      </div>
    );
  }

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            className={`cursor-pointer p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors ${
              selectedTopic === topic.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {topic.tweetCount.toLocaleString()} tweets
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Last 24h
                  </span>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="lg:border-l lg:pl-6">
        <h3 className="text-lg font-semibold mb-4">
          {selectedTopicData
            ? `Related Tweets for "${selectedTopicData.title}"`
            : 'Select a topic to see related tweets'}
        </h3>
        
        {isTweetsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : selectedTopic && relatedTweets.length > 0 ? (
          <div className="space-y-4 max-h-[800px] overflow-y-auto">
            {relatedTweets.map((tweet) => (
              <div key={tweet.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <img
                    src={tweet.author.avatar}
                    alt={tweet.author.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{tweet.author.name}</div>
                    <div className="text-sm text-gray-500">@{tweet.author.handle}</div>
                  </div>
                </div>
                <p className="text-gray-800 mb-3">{tweet.content}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    {tweet.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Repeat2 className="h-4 w-4 mr-1 text-green-500" />
                    {tweet.retweets.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : selectedTopic ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No related tweets found</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Select a topic to see related tweets</p>
          </div>
        )}
      </div>
    </div>
  );
}