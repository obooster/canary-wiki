import { useMemo } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data);

const API_ENDPOINTS = {
  items: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json',
  enchantments: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/enchants.json',
  reforges: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/reforges.json',
  collections: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/collections.json',
  pets: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/pets.json',
  entities: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/entities.json',
};

export function useSearchData() {
  const { data: rawItems, isLoading: loadingItems } = useSWR(API_ENDPOINTS.items, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const items = rawItems?.items || rawItems || {};

  const { data: enchantments, isLoading: loadingEnchants } = useSWR(API_ENDPOINTS.enchantments, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: reforges, isLoading: loadingReforges } = useSWR(API_ENDPOINTS.reforges, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: collections, isLoading: loadingCollections } = useSWR(API_ENDPOINTS.collections, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: pets, isLoading: loadingPets } = useSWR(API_ENDPOINTS.pets, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: entities, isLoading: loadingEntities } = useSWR(API_ENDPOINTS.entities, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const loading = loadingItems || loadingEnchants || loadingReforges || loadingCollections || loadingPets || loadingEntities;

  const flatItems = useMemo(() => {
    if (!items) return {};
    const flat = {};
    for (const categoryObj of Object.values(items)) {
      if (categoryObj && typeof categoryObj === 'object') {
        for (const [key, item] of Object.entries(categoryObj)) {
          flat[key] = item;
        }
      }
    }
    return flat;
  }, [items]);

  const normalized = useMemo(() => {
    if (loading || !flatItems) return [];

    return [
      ...Object.entries(flatItems).map(([key, item]) => ({
        key,
        name: item.displayName,
        category: 'items',
        item
      })),

      ...Object.entries(enchantments || {}).map(([key, ench]) => ({
        key,
        name: ench.name,
        category: 'enchantments'
      })),

      ...Object.entries(reforges || {}).map(([key, ref]) => ({
        key,
        name: ref.name || key,
        category: 'reforges'
      })),

      ...Object.entries(collections || {}).map(([key, col]) => ({
        key,
        name: col.displayName || col.name || key,
        category: 'collections'
      })),

      ...Object.entries(pets || {}).map(([key, pet]) => ({
        key,
        name: pet.name,
        category: 'pets',
        item: pet
      })),

      ...Object.entries(entities || {}).map(([key, ent]) => ({
        key,
        name: ent.name || key,
        category: 'entities'
      })),
    ];
  }, [flatItems, enchantments, reforges, collections, pets, entities, loading]);

  return { data: normalized, loading };
}