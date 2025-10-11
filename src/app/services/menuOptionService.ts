import apiClient from '../lib/api';
import { API_CONFIG } from '../config/api';
import { MenuOptionGroupOut, MenuOptionOut, MenuOptionGroupMappingOut, MenuOptionGroupMappingCreate } from '../types/api';

class MenuOptionService {
  /**
   * Get all menu option groups (with options included from backend)
   */
  static async getOptionGroups(): Promise<MenuOptionGroupOut[]> {
    try {
      const response = await apiClient.get<MenuOptionGroupOut[]>(
        API_CONFIG.ENDPOINTS.OPTION_GROUPS
      );
      console.log('📦 Option groups with options:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu option groups:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get a specific option group by ID (with options included from backend)
   */
  static async getOptionGroupById(id: number): Promise<MenuOptionGroupOut> {
    try {
      const response = await apiClient.get<MenuOptionGroupOut>(
        `${API_CONFIG.ENDPOINTS.OPTION_GROUPS}${id}`
      );
      console.log(`📦 Option group ${id} with options:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching option group ${id}:`, error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get options for a specific option group
   * Note: Backend doesn't support query parameters, so we fetch all and filter
   */
  static async getOptionsByGroupId(groupId: number): Promise<MenuOptionOut[]> {
    try {
      console.log(`🔍 Fetching all options and filtering by group ${groupId}`);
      const allOptionsResponse = await apiClient.get<MenuOptionOut[]>(API_CONFIG.ENDPOINTS.OPTIONS);
      const filteredOptions = allOptionsResponse.data.filter(option => option.option_group_id === groupId);
      console.log(`✅ Found ${filteredOptions.length} options for group ${groupId}:`, filteredOptions.map(o => o.name_th));
      return filteredOptions;
    } catch (error) {
      console.error(`❌ Error fetching options for group ${groupId}:`, error?.response?.data || error?.message || error);
      return [];
    }
  }

  /**
   * Get all options
   */
  static async getAllOptions(): Promise<MenuOptionOut[]> {
    try {
      const response = await apiClient.get<MenuOptionOut[]>(API_CONFIG.ENDPOINTS.OPTIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching all options:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get a specific option by ID
   */
  static async getOptionById(id: number): Promise<MenuOptionOut> {
    try {
      const response = await apiClient.get<MenuOptionOut>(`${API_CONFIG.ENDPOINTS.OPTIONS}${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching option ${id}:`, error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Create a new option
   */
  static async createOption(optionData: Partial<MenuOptionOut>): Promise<MenuOptionOut> {
    try {
      const response = await apiClient.post<MenuOptionOut>(API_CONFIG.ENDPOINTS.OPTIONS, optionData);
      return response.data;
    } catch (error) {
      console.error('Error creating option:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Delete all options
   */
  static async deleteAllOptions(): Promise<void> {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.OPTIONS);
    } catch (error) {
      console.error('Error deleting all options:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get option group by name (options_group field)
   */
  static async getOptionGroupByName(name: string): Promise<MenuOptionGroupOut | null> {
    try {
      const groups = await this.getOptionGroups();
      const group = groups.find(g => 
        g.name_en?.toLowerCase() === name.toLowerCase() || 
        g.name_th === name
      );
      return group || null;
    } catch (error) {
      console.error(`Error fetching option group by name ${name}:`, error?.response?.data || error?.message || error);
      return null;
    }
  }

  /**
   * Create a new option group
   */
  static async createOptionGroup(groupData: Partial<MenuOptionGroupOut>): Promise<MenuOptionGroupOut> {
    try {
      const response = await apiClient.post<MenuOptionGroupOut>(API_CONFIG.ENDPOINTS.OPTION_GROUPS, groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating option group:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Delete an option group by ID
   */
  static async deleteOptionGroup(id: number): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.OPTION_GROUPS}${id}`);
    } catch (error) {
      console.error(`Error deleting option group ${id}:`, error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get option groups for a specific menu
   */
  static async getMenuOptionGroups(menuId: number): Promise<MenuOptionGroupOut[]> {
    try {
      const response = await apiClient.get<MenuOptionGroupOut[]>(
        `${API_CONFIG.ENDPOINTS.MENUS}${menuId}/option-groups`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching option groups for menu ${menuId}:`, error?.response?.data || error?.message || error);
      return [];
    }
  }

  // ===== Menu-Option Group Mapping Methods =====

  /**
   * Get all menu-option group mappings
   */
  static async getAllMappings(): Promise<MenuOptionGroupMappingOut[]> {
    try {
      const response = await apiClient.get<MenuOptionGroupMappingOut[]>(
        API_CONFIG.ENDPOINTS.MENU_OPTION_GROUPS
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all mappings:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get all option groups for a specific menu (via mappings)
   */
  static async getMappingsByMenu(menuId: number): Promise<MenuOptionGroupMappingOut[]> {
    try {
      const response = await apiClient.get<MenuOptionGroupMappingOut[]>(
        `${API_CONFIG.ENDPOINTS.MENU_OPTION_GROUPS}menu/${menuId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching mappings for menu ${menuId}:`, error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get all menus that use a specific option group (via mappings)
   */
  static async getMappingsByOptionGroup(optionGroupId: number): Promise<MenuOptionGroupMappingOut[]> {
    try {
      const response = await apiClient.get<MenuOptionGroupMappingOut[]>(
        `${API_CONFIG.ENDPOINTS.MENU_OPTION_GROUPS}option-group/${optionGroupId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching mappings for option group ${optionGroupId}:`, error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Create a menu-option group mapping
   */
  static async createMapping(data: MenuOptionGroupMappingCreate): Promise<MenuOptionGroupMappingOut> {
    try {
      const response = await apiClient.post<MenuOptionGroupMappingOut>(
        API_CONFIG.ENDPOINTS.MENU_OPTION_GROUPS,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creating mapping:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Delete a menu-option group mapping
   */
  static async deleteMapping(menuId: number, optionGroupId: number): Promise<void> {
    try {
      await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.MENU_OPTION_GROUPS}${menuId}/${optionGroupId}`
      );
    } catch (error) {
      console.error(`Error deleting mapping (menu ${menuId}, group ${optionGroupId}):`, error?.response?.data || error?.message || error);
      throw error;
    }
  }
}

export default MenuOptionService;

