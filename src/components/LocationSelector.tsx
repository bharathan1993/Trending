import React from 'react';
import { countries } from '../data/countries';

interface LocationSelectorProps {
  selectedCountry: string;
  selectedState: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
}

export function LocationSelector({
  selectedCountry,
  selectedState,
  onCountryChange,
  onStateChange,
}: LocationSelectorProps) {
  const states = countries[selectedCountry] || [];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2 border"
        >
          {Object.keys(countries).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {states.length > 0 && (
        <div className="flex-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State/Region
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2 border"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}