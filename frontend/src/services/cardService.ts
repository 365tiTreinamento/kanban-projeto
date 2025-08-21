import { api } from './api';
import { logger } from './logger';

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
  assignees?: CardAssignee[];
  timeEntries?: TimeEntry[];
  attachments?: Attachment[];
}

export interface CardAssignee {
  id: number;
  cardId: number;
  userId: number;
  user?: User;
  assignedAt?: string;
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

export interface Attachment {
  id: number;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  isLogo: boolean;
  cardId: number;
  uploadedAt?: string;
}

export interface User {
  id: number;
  email: string;
  displayName: string;
  globalRole: string;
  avatarUrl?: string;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  dueAt?: string;
  flagColor?: string;
  position: number;
  columnId: number;
  assignees?: number[]; // IDs dos usuários
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  dueAt?: string | null;
  flagColor?: string | null;
  position?: number;
  columnId?: number;
}

export interface MoveCardRequest {
  columnId: number;
  position: number;
  reasonId?: number;
  note?: string;
}

export interface TimeEntryRequest {
  classification: string;
  note?: string;
}

export interface AttachmentUploadRequest {
  file: File;
  isLogo?: boolean;
}

class CardService {
  private baseURL = '/cards';

  // Operações básicas de Cards
  async getAllCards(projectId: number): Promise<Card[]> {
    try {
      logger.debug('Fetching all cards for project', { projectId });

      let data = []
      data.push({
        id: 1,
        name: "Project test",
        description: "Desc",
        createdAt: "...",
        createdBy: 1,
        columns: [{
          id: 1,
          name: "Column 1",
          position: 1,
          projectId: 1,
          cards: [{
            id: 1,
            title: "Card 1",
            description: "Description card",
            position: 1,
            columnId: 1,
            createdAt: "..."
          }]
        },
        {
          id: 2,
          name: "Column 2",
          position: 1,
          projectId: 1,
          cards: [{
            id: 2,
            title: "Card 2",
            description: "Description card",
            position: 1,
            columnId: 2,
            createdAt: "..."
          }]
        }],
        members: [{
          id: 1,
          role: "Admin",
          projectId: 1,
          userId: 1,
          user: {
            id: 1,
            email: "test@mail",
            displayName: "Pedro Pedro Pedro",
            globalRole: "Admin"
          }
        }]
      })

      logger.info('Cards fetched successfully', {
        projectId,
        count: 1
      });
      return [
        {
          id: 1,
          title: "Card 1",
          description: "Description card",
          position: 1,
          columnId: 1,
          createdAt: "..."
        },
        {
          id: 2,
          title: "Card 2",
          description: "Description card",
          position: 1,
          columnId: 2,
          createdAt: "..."
        }
      ];
    } catch (error: any) {
      logger.error('Failed to fetch cards', { projectId, error });
      throw this.handleError(error, `Failed to fetch cards for project ${projectId}`);
    }
  }

  async getCardById(cardId: number): Promise<Card> {
    try {
      logger.debug('Fetching card by ID', { cardId });
      const response = await api.get<Card>(`${this.baseURL}/${cardId}`);
      logger.info('Card fetched successfully', { cardId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch card', { cardId, error });
      throw this.handleError(error, `Failed to fetch card ${cardId}`);
    }
  }

  async createCard(projectId: number, cardData: CreateCardRequest): Promise<Card> {
    try {
      logger.debug('Creating new card', { projectId, data: cardData });
      const response = await api.post<Card>(`/projects/${projectId}/cards`, cardData);
      logger.info('Card created successfully', {
        cardId: response.data.id,
        title: response.data.title,
        projectId
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to create card', { projectId, data: cardData, error });
      throw this.handleError(error, `Failed to create card in project ${projectId}`);
    }
  }

  async updateCard(cardId: number, cardData: UpdateCardRequest): Promise<Card> {
    try {
      logger.debug('Updating card', { cardId, data: cardData });
      const response = await api.put<Card>(`${this.baseURL}/${cardId}`, cardData);
      logger.info('Card updated successfully', { cardId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to update card', { cardId, data: cardData, error });
      throw this.handleError(error, `Failed to update card ${cardId}`);
    }
  }

  async deleteCard(cardId: number): Promise<void> {
    try {
      logger.debug('Deleting card', { cardId });
      await api.delete(`${this.baseURL}/${cardId}`);
      logger.info('Card deleted successfully', { cardId });
    } catch (error: any) {
      logger.error('Failed to delete card', { cardId, error });
      throw this.handleError(error, `Failed to delete card ${cardId}`);
    }
  }

  // Movimentação de Cards
  async moveCard(cardId: number, newColumnId: number, reasonId: number): Promise<Card> {
    try {
      const response = await api.post<Card>(`${this.baseURL}/${cardId}/move`);
      logger.info('Card moved successfully', {
        cardId,
        newColumnId: newColumnId,
        newPosition: reasonId
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, `Failed to move card ${cardId}`);
    }
  }

  async reorderCards(columnId: number, cards: { id: number; position: number }[]): Promise<void> {
    try {
      logger.debug('Reordering cards in column', { columnId, cards });
      await api.put(`/columns/${columnId}/cards/reorder`, { cards });
      logger.info('Cards reordered successfully', { columnId });
    } catch (error: any) {
      logger.error('Failed to reorder cards', { columnId, cards, error });
      throw this.handleError(error, `Failed to reorder cards in column ${columnId}`);
    }
  }

  // Gestão de Assignees
  async getCardAssignees(cardId: number): Promise<CardAssignee[]> {
    try {
      logger.debug('Fetching card assignees', { cardId });
      const response = await api.get<CardAssignee[]>(`${this.baseURL}/${cardId}/assignees`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch card assignees', { cardId, error });
      throw this.handleError(error, `Failed to fetch assignees for card ${cardId}`);
    }
  }

  async addAssignee(cardId: number, userId: number): Promise<CardAssignee> {
    try {
      logger.debug('Adding assignee to card', { cardId, userId });
      const response = await api.post<CardAssignee>(`${this.baseURL}/${cardId}/assignees`, {
        userId
      });
      logger.info('Assignee added successfully', { cardId, userId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to add assignee', { cardId, userId, error });
      throw this.handleError(error, `Failed to add assignee to card ${cardId}`);
    }
  }

  async removeAssignee(cardId: number, userId: number): Promise<void> {
    try {
      logger.debug('Removing assignee from card', { cardId, userId });
      await api.delete(`${this.baseURL}/${cardId}/assignees/${userId}`);
      logger.info('Assignee removed successfully', { cardId, userId });
    } catch (error: any) {
      logger.error('Failed to remove assignee', { cardId, userId, error });
      throw this.handleError(error, `Failed to remove assignee from card ${cardId}`);
    }
  }

  async updateAssignees(cardId: number, userIds: number[]): Promise<CardAssignee[]> {
    try {
      logger.debug('Updating card assignees', { cardId, userIds });
      const response = await api.put<CardAssignee[]>(`${this.baseURL}/${cardId}/assignees`, {
        userIds
      });
      logger.info('Assignees updated successfully', { cardId, count: userIds.length });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to update assignees', { cardId, userIds, error });
      throw this.handleError(error, `Failed to update assignees for card ${cardId}`);
    }
  }

  // Gestão de Time Entries
  async getCardTimeEntries(cardId: number): Promise<TimeEntry[]> {
    try {
      logger.debug('Fetching card time entries', { cardId });
      const response = await api.get<TimeEntry[]>(`${this.baseURL}/${cardId}/time`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch time entries', { cardId, error });
      throw this.handleError(error, `Failed to fetch time entries for card ${cardId}`);
    }
  }

  async startTimeEntry(cardId: number, timeData: TimeEntryRequest): Promise<TimeEntry> {
    try {
      logger.debug('Starting time entry for card', { cardId, data: timeData });
      const response = await api.post<TimeEntry>(`${this.baseURL}/${cardId}/time/start`, timeData);
      logger.info('Time entry started successfully', {
        cardId,
        timeEntryId: response.data.id
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to start time entry', { cardId, data: timeData, error });
      throw this.handleError(error, `Failed to start time entry for card ${cardId}`);
    }
  }

  async stopTimeEntry(cardId: number, note?: string): Promise<TimeEntry> {
    try {
      logger.debug('Stopping time entry for card', { cardId, note });
      const response = await api.post<TimeEntry>(`${this.baseURL}/${cardId}/time/stop`, { note });
      logger.info('Time entry stopped successfully', { cardId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to stop time entry', { cardId, error });
      throw this.handleError(error, `Failed to stop time entry for card ${cardId}`);
    }
  }

  async pauseTimeEntry(cardId: number, timeData: TimeEntryRequest): Promise<TimeEntry> {
    try {
      logger.debug('Pausing time entry for card', { cardId, data: timeData });
      const response = await api.post<TimeEntry>(`${this.baseURL}/${cardId}/time/pause`, timeData);
      logger.info('Time entry paused successfully', { cardId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to pause time entry', { cardId, data: timeData, error });
      throw this.handleError(error, `Failed to pause time entry for card ${cardId}`);
    }
  }

  async resumeTimeEntry(cardId: number, note?: string): Promise<TimeEntry> {
    try {
      logger.debug('Resuming time entry for card', { cardId, note });
      const response = await api.post<TimeEntry>(`${this.baseURL}/${cardId}/time/resume`, { note });
      logger.info('Time entry resumed successfully', { cardId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to resume time entry', { cardId, error });
      throw this.handleError(error, `Failed to resume time entry for card ${cardId}`);
    }
  }

  // Gestão de Anexos
  async getCardAttachments(cardId: number): Promise<Attachment[]> {
    try {
      logger.debug('Fetching card attachments', { cardId });
      const response = await api.get<Attachment[]>(`${this.baseURL}/${cardId}/attachments`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch attachments', { cardId, error });
      throw this.handleError(error, `Failed to fetch attachments for card ${cardId}`);
    }
  }

  async uploadAttachment(cardId: number, file: File, isLogo: boolean = false): Promise<Attachment> {
    try {
      logger.debug('Uploading attachment to card', { cardId, filename: file.name, isLogo });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('isLogo', isLogo.toString());

      const response = await api.post<Attachment>(
        `${this.baseURL}/${cardId}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      logger.info('Attachment uploaded successfully', {
        cardId,
        attachmentId: response.data.id,
        filename: response.data.filename
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to upload attachment', { cardId, filename: file.name, error });
      throw this.handleError(error, `Failed to upload attachment to card ${cardId}`);
    }
  }

  async deleteAttachment(attachmentId: number): Promise<void> {
    try {
      logger.debug('Deleting attachment', { attachmentId });
      await api.delete(`/attachments/${attachmentId}`);
      logger.info('Attachment deleted successfully', { attachmentId });
    } catch (error: any) {
      logger.error('Failed to delete attachment', { attachmentId, error });
      throw this.handleError(error, `Failed to delete attachment ${attachmentId}`);
    }
  }

  async setAttachmentAsLogo(attachmentId: number): Promise<Attachment> {
    try {
      logger.debug('Setting attachment as logo', { attachmentId });
      const response = await api.put<Attachment>(`/attachments/${attachmentId}/logo`);
      logger.info('Attachment set as logo successfully', { attachmentId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to set attachment as logo', { attachmentId, error });
      throw this.handleError(error, `Failed to set attachment ${attachmentId} as logo`);
    }
  }

  // Manipulação de erros
  private handleError(error: any, defaultMessage: string): Error {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return new Error(data?.message || 'Invalid request data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error(data?.message || 'Access denied');
        case 404:
          return new Error('Card not found');
        case 409:
          return new Error(data?.message || 'Conflict occurred');
        case 500:
          return new Error('Server error');
        default:
          return new Error(data?.message || `${defaultMessage} (${status})`);
      }
    } else if (error.request) {
      return new Error('Network error: Cannot connect to server');
    } else {
      return new Error(error.message || defaultMessage);
    }
  }
}

export const cardService = new CardService();