export interface User {
  id: number;
  email: string;
  displayName: string;
  globalRole: string;
  password?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Column {
  id: number;
  name: string;
  position: number;
  projectId: number;
  cards: Card[];
}

export interface Card {
  id: number;
  title: string;
  description: string;
  dueAt?: string;
  flagColor?: string;
  logoUrl?: string;
  position: number;
  columnId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CardAssignee {
  id: number;
  cardId: number;
  userId: number;
  user?: User;
}

export interface TimeEntry {
  id: number;
  startedAt: string;
  endedAt?: string;
  classification: string;
  note?: string;
  active: boolean;
  columnNameAtStart: string;
  cardId: number;
  userId: number;
  user?: User;
}

export interface ActivityLog {
  id: number;
  action: string;
  at: string;
  details?: string;
  userId: number;
  user?: User;
}

export interface MovementReason {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface ProjectMembership {
  id: number;
  role: string;
  projectId: number;
  userId: number;
  user?: User;
  project?: Project;
}

export interface Attachment {
  id: number;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  isLogo: boolean;
  cardId: number;
}