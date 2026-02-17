import type { EmergencyAlert } from '../types';

export class EmergencySOSManager {
  private static instance: EmergencySOSManager;
  private alerts: EmergencyAlert[] = [];
  private activeAlerts: Map<string, EmergencyAlert> = new Map();

  static getInstance(): EmergencySOSManager {
    if (!EmergencySOSManager.instance) {
      EmergencySOSManager.instance = new EmergencySOSManager();
    }
    return EmergencySOSManager.instance;
  }

  async triggerSOS(
    userId: string,
    alertType: EmergencyAlert['alertType'],
    location: EmergencyAlert['location'],
    message: string,
    tripId?: string,
    groupId?: string
  ): Promise<EmergencyAlert> {
    const alert: EmergencyAlert = {
      alertId: `alert-${Date.now()}-${userId}`,
      userId,
      tripId,
      groupId,
      location,
      alertType,
      message,
      severity: this.determineSeverity(alertType),
      status: 'Active',
      createdAt: new Date().toISOString(),
      responders: [],
    };

    this.alerts.push(alert);
    this.activeAlerts.set(alert.alertId, alert);

    // Simulate emergency response
    await this.notifyEmergencyServices(alert);
    await this.notifyEmergencyContacts(userId, alert);
    await this.notifyNearbyUsers(alert);

    return alert;
  }

  private determineSeverity(alertType: EmergencyAlert['alertType']): EmergencyAlert['severity'] {
    switch (alertType) {
      case 'SOS':
        return 'Critical';
      case 'Medical':
        return 'High';
      case 'Lost':
        return 'Medium';
      case 'Theft':
        return 'Medium';
      default:
        return 'Low';
    }
  }

  private async notifyEmergencyServices(alert: EmergencyAlert): Promise<void> {
    // Simulate API call to emergency services
    console.log(`🚨 EMERGENCY ALERT: ${alert.alertType} - ${alert.message}`);
    console.log(`📍 Location: ${alert.location.address}`);
    console.log(`📞 Notifying emergency services...`);
    
    // In production, this would integrate with real emergency services APIs
    // based on the location coordinates
  }

  private async notifyEmergencyContacts(userId: string, alert: EmergencyAlert): Promise<void> {
    // Simulate notification to user's emergency contacts
    console.log(`📱 Notifying emergency contacts for user ${userId}`);
    console.log(`🔴 Alert: ${alert.alertType} - ${alert.message}`);
  }

  private async notifyNearbyUsers(alert: EmergencyAlert): Promise<void> {
    // Simulate notification to nearby trusted users
    console.log(`👥 Notifying nearby users about ${alert.alertType} alert`);
  }

  async respondToAlert(
    alertId: string,
    responderId: string,
    action: 'acknowledge' | 'resolve'
  ): Promise<EmergencyAlert | null> {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return null;

    if (action === 'acknowledge') {
      if (!alert.responders.includes(responderId)) {
        alert.responders.push(responderId);
      }
      if (alert.status === 'Active') {
        alert.status = 'Acknowledged';
      }
    } else if (action === 'resolve') {
      alert.status = 'Resolved';
      alert.resolvedAt = new Date().toISOString();
      this.activeAlerts.delete(alertId);
    }

    return alert;
  }

  getActiveAlerts(): EmergencyAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  getUserAlerts(userId: string): EmergencyAlert[] {
    return this.alerts.filter(alert => alert.userId === userId);
  }

  getAlertById(alertId: string): EmergencyAlert | null {
    return this.alerts.find(alert => alert.alertId === alertId) || null;
  }

  async getCurrentLocation(): Promise<EmergencyAlert['location']> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  async sendLocationUpdate(alertId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return;

    try {
      const newLocation = await this.getCurrentLocation();
      alert.location = newLocation;
      
      // Notify responders of location update
      console.log(`📍 Location updated for alert ${alertId}`);
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  }

  generateEmergencyMessage(alertType: EmergencyAlert['alertType']): string {
    const templates = {
      SOS: 'EMERGENCY: I need immediate help!',
      Medical: 'Medical emergency: I need medical assistance',
      Lost: 'I am lost and need help finding my way',
      Theft: 'I have been robbed and need assistance',
      Other: 'I need help with an urgent situation',
    };

    return templates[alertType];
  }

  getEmergencyInstructions(alertType: EmergencyAlert['alertType']): string[] {
    const instructions = {
      SOS: [
        'Stay calm and try to move to a safe location',
        'Call emergency services if possible',
        'Share your location with trusted contacts',
        'Follow any instructions from emergency responders',
      ],
      Medical: [
        'Call emergency medical services immediately',
        'Provide your location and nature of medical emergency',
        'Follow medical guidance if available',
        'Keep emergency contacts informed',
      ],
      Lost: [
        'Stay in one location if safe',
        'Share your GPS coordinates',
        'Look for landmarks to help identify your location',
        'Contact local authorities if needed',
      ],
      Theft: [
        'Move to a safe location immediately',
        'Report the theft to local police',
        'Contact your bank to cancel cards if stolen',
        'Document what was stolen for insurance',
      ],
      Other: [
        'Assess the situation for immediate dangers',
        'Contact appropriate authorities or services',
        'Keep trusted contacts informed',
        'Follow safety protocols for your specific situation',
      ],
    };

    return instructions[alertType];
  }
}

// React hook for emergency functionality
export const useEmergencySOS = () => {
  const sosManager = EmergencySOSManager.getInstance();

  const triggerEmergency = async (
    userId: string,
    alertType: EmergencyAlert['alertType'],
    customMessage?: string
  ) => {
    try {
      const location = await sosManager.getCurrentLocation();
      const message = customMessage || sosManager.generateEmergencyMessage(alertType);
      
      return await sosManager.triggerSOS(userId, alertType, location, message);
    } catch (error) {
      console.error('Failed to trigger emergency alert:', error);
      throw error;
    }
  };

  const respondToAlert = async (alertId: string, responderId: string, action: 'acknowledge' | 'resolve') => {
    return await sosManager.respondToAlert(alertId, responderId, action);
  };

  const getActiveAlerts = () => {
    return sosManager.getActiveAlerts();
  };

  const getUserAlerts = (userId: string) => {
    return sosManager.getUserAlerts(userId);
  };

  const getInstructions = (alertType: EmergencyAlert['alertType']) => {
    return sosManager.getEmergencyInstructions(alertType);
  };

  return {
    triggerEmergency,
    respondToAlert,
    getActiveAlerts,
    getUserAlerts,
    getInstructions,
  };
};
