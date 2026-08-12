export type UserRole = 'resident' | 'security' | 'admin' | 'super_admin';

export interface IUser {
  _id: string;
  phone: string;
  name: string;
  role: UserRole;
  tower: string;
  flatNumber: string;
  isVerified: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type VehicleType = 'car' | 'bike' | 'ev' | 'commercial';

export interface IVehicle {
  _id: string;
  plateNumber: string; // Uppercase normalized e.g. HR85AB1234
  rawPlateNumber: string; // Formatting e.g. HR 85 AB 1234
  vehicleType: VehicleType;
  makeModel: string;
  ownerId: string | IUser;
  tower: string;
  flatNumber: string;
  parkingSlot?: string;
  stickerId?: string;
  photoUrl?: string;
  status: 'active' | 'unregistered' | 'flagged';
  createdAt: string;
  updatedAt: string;
}

export type IncidentStatus = 
  | 'pending_nudge' 
  | 'escalated' 
  | 'guard_assigned' 
  | 'resolved' 
  | 'cancelled';

export type IncidentPriority = 'normal' | 'urgent';

export interface IIncidentTimeline {
  timestamp: string;
  status: IncidentStatus;
  updatedBy: string | IUser;
  note?: string;
}

export interface IIncident {
  _id: string;
  incidentNumber: string;
  vehicleId?: string | IVehicle;
  plateNumber: string;
  reportedBy: string | IUser;
  ownerId?: string | IUser;
  location: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  description?: string;
  imageUrls?: string[];
  resolvedBy?: string | IUser;
  resolutionNote?: string;
  timeline: IIncidentTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  _id: string;
  recipientId: string;
  senderId?: string;
  type: 'move_request' | 'incident_escalated' | 'incident_resolved' | 'account_verified';
  title: string;
  message: string;
  incidentId?: string;
  vehicleId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface IAuditLog {
  _id: string;
  actorId: string | IUser;
  action: string;
  targetType: 'vehicle' | 'incident' | 'user';
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  phone: string;
  name: string;
  role: UserRole;
  tower: string;
  flatNumber: string;
  isVerified: boolean;
}
