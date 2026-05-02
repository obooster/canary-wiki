import useSWR, { mutate } from 'swr';
import axios from 'axios';

export const API_ENDPOINTS = {
  items: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json',
  enchantments: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/enchants.json',
  reforges: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/reforges.json',
  pets: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/pets.json',
  entities: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/entities.json',
  collections: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/collections.json',
};

const fetcher = (url) => axios.get(url, { timeout: 10000 }).then(res => res.data);

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 15000,
  errorRetryCount: 2,
};

const loadedKeys = new Set();

export function useGameData(endpoint) {
  const url = API_ENDPOINTS[endpoint];

  if (!loadedKeys.has(endpoint)) {
    loadedKeys.add(endpoint);
  }

  const { data, error, isLoading, isValidating } = useSWR(url, fetcher, swrOptions);

  return {
    data,
    loading: isLoading,
    validating: isValidating,
    error
  };
}

export function clearAllCache() {
  Object.values(API_ENDPOINTS).forEach(url => {
    mutate(url, null, true);
  });
}