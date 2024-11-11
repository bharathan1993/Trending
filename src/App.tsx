import React, { useState, useEffect } from 'react';
import { Globe2, AlertCircle } from 'lucide-react';
import { LocationSelector } from './components/LocationSelector';
import { TrendingTopics } from './components/TrendingTopics';
import { fetchTrendingTopics, fetchRelatedTweets } from './services/xai';
import type { TrendingTopic, Tweet } from './types';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [selectedState, setSelectedState] = useState('');
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [relatedTweets, setRelatedTweets] = useState<Tweet[]>([]);
  const [isTweetsLoading, setIsTweetsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTrendingTopics() {
      setIsLoading(true);
      setError(null);
      setSelectedTopic(null);
      setRelatedTweets([]);
      
      try {
        const newTopics = await fetchTrendingTopics({
          country: selectedCountry,
          state: selectedState
        });
        if (isMounted) {
          setTopics(newTopics);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch trending topics');
          setTopics([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTrendingTopics();

    return () => {
      isMounted = false;
    };
  }, [selectedCountry, selectedState]);

  const handleTopicSelect = async (topicId: string) => {
    setSelectedTopic(topicId);
    setIsTweetsLoading(true);
    setRelatedTweets([]); // Clear previous tweets

    try {
      const selectedTopicData = topics.find(t => t.id === topicId);
      if (selectedTopicData) {
        const tweets = await fetchRelatedTweets(selectedTopicData.title, {
          country: selectedCountry,
          state: selectedState
        });
        setRelatedTweets(tweets);
      }
    } catch (err) {
      console.error('Failed to fetch related tweets:', err);
      setRelatedTweets([]);
    } finally {
      setIsTweetsLoading(false);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedTopic(null);
    setRelatedTweets([]);
  };

  const locationDisplay = selectedState
    ? `${selectedState}, ${selectedCountry}`
    : selectedCountry;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Globe2 className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Trending Topics
            </h1>
          </div>
          <p className="text-gray-600">
            Discover what's trending around the world in the last 24 hours
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <LocationSelector
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            onCountryChange={handleCountryChange}
            onStateChange={setSelectedState}
          />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Trending in {locationDisplay}
            </h2>
          </div>

          <TrendingTopics
            topics={topics}
            isLoading={isLoading}
            location={locationDisplay}
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
            relatedTweets={relatedTweets}
            isTweetsLoading={isTweetsLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;