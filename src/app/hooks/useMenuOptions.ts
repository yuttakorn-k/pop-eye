import { useState, useEffect } from 'react';
import MenuOptionService from '../services/menuOptionService';
import { MenuOptionGroupOut, MenuOptionOut } from '../types/api';

interface UseMenuOptionsResult {
  optionGroups: MenuOptionGroupOut[];
  loading: boolean;
  error: string | null;
  getOptionsByGroupName: (groupName: string) => Promise<MenuOptionOut[]>;
  getOptionGroupByName: (groupName: string) => Promise<MenuOptionGroupOut | null>;
}

export function useMenuOptions(): UseMenuOptionsResult {
  const [optionGroups, setOptionGroups] = useState<MenuOptionGroupOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptionGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const groups = await MenuOptionService.getOptionGroups();
      setOptionGroups(groups);
    } catch (err) {
      console.error('Error loading menu option groups:', err);
      setError('Failed to load menu option groups');
    } finally {
      setLoading(false);
    }
  };

  const getOptionsByGroupName = async (groupName: string): Promise<MenuOptionOut[]> => {
    try {
      const group = await MenuOptionService.getOptionGroupByName(groupName);
      if (!group) {
        console.warn(`Option group "${groupName}" not found`);
        return [];
      }
      
      const options = await MenuOptionService.getOptionsByGroupId(group.id);
      return options;
    } catch (err) {
      console.error(`Error loading options for group "${groupName}":`, err);
      return [];
    }
  };

  const getOptionGroupByName = async (groupName: string): Promise<MenuOptionGroupOut | null> => {
    try {
      return await MenuOptionService.getOptionGroupByName(groupName);
    } catch (err) {
      console.error(`Error loading option group "${groupName}":`, err);
      return null;
    }
  };

  useEffect(() => {
    fetchOptionGroups();
  }, []);

  return {
    optionGroups,
    loading,
    error,
    getOptionsByGroupName,
    getOptionGroupByName,
  };
}

