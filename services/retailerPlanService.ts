import { RetailerPlan } from '@/types/domain';
import { ApiResponse } from '@/types/common';
import { mockRetailerPlans } from '@/mocks/mockPlans';


class RetailerPlanService {
  private plans: RetailerPlan[] = [...mockRetailerPlans];

  async getPlans(): Promise<ApiResponse<RetailerPlan[]>> {
    return {
      success: true,
      data: [...this.plans],
      timestamp: new Date().toISOString(),
    };
  }

  async getActiveRetailerPlans(): Promise<ApiResponse<RetailerPlan[]>> {
    const activePlans = this.plans.filter((p) => p.status === 'ACTIVE');
    return {
      success: true,
      data: activePlans,
      timestamp: new Date().toISOString(),
    };
  }

  async getPlanById(id: string): Promise<ApiResponse<RetailerPlan | null>> {
    const plan = this.plans.find((p) => p.id === id || p.code === id) || null;
    return {
      success: !!plan,
      data: plan,
      timestamp: new Date().toISOString(),
    };
  }

  async createPlan(planData: Omit<RetailerPlan, 'id' | 'assignedRetailersCount' | 'createdAt'>): Promise<ApiResponse<RetailerPlan>> {
    // Validate uniqueness of code
    const existingCode = this.plans.find((p) => p.code.toUpperCase() === planData.code.toUpperCase());
    if (existingCode) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_PLAN_CODE',
          message: `Plan code "${planData.code}" already exists. Please enter a unique code.`,
        },
        timestamp: new Date().toISOString(),
      };
    }

    const newPlan: RetailerPlan = {
      ...planData,
      id: `plan_${Date.now().toString(36)}`,
      assignedRetailersCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.plans.unshift(newPlan);

    return {
      success: true,
      data: newPlan,
      timestamp: new Date().toISOString(),
    };
  }

  async updatePlan(id: string, updates: Partial<RetailerPlan>): Promise<ApiResponse<RetailerPlan>> {
    const index = this.plans.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        success: false,
        error: {
          code: 'PLAN_NOT_FOUND',
          message: 'Retailer plan not found.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const updatedPlan: RetailerPlan = {
      ...this.plans[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.plans[index] = updatedPlan;

    return {
      success: true,
      data: updatedPlan,
      timestamp: new Date().toISOString(),
    };
  }

  async togglePlanStatus(id: string): Promise<ApiResponse<RetailerPlan>> {
    const plan = this.plans.find((p) => p.id === id);
    if (!plan) {
      return {
        success: false,
        error: {
          code: 'PLAN_NOT_FOUND',
          message: 'Retailer plan not found.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const newStatus = plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return this.updatePlan(id, { status: newStatus });
  }

  async getPlanSummary() {
    const totalPlans = this.plans.length;
    const activePlans = this.plans.filter((p) => p.status === 'ACTIVE').length;
    const inactivePlans = this.plans.filter((p) => p.status === 'INACTIVE').length;
    const assignedRetailers = this.plans.reduce((sum, p) => sum + p.assignedRetailersCount, 0);

    return {
      totalPlans,
      activePlans,
      inactivePlans,
      assignedRetailers,
    };
  }
}

export const retailerPlanService = new RetailerPlanService();
