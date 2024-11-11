import { Country } from '../types';

export const countries: Country[] = [
  {
    id: 'global',
    name: 'Global',
    states: []
  },
  {
    id: 'us',
    name: 'United States',
    states: [
      { id: 'ca', name: 'California' },
      { id: 'ny', name: 'New York' },
      { id: 'tx', name: 'Texas' },
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    states: []
  },
  {
    id: 'jp',
    name: 'Japan',
    states: []
  }
];