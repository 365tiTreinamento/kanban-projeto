import { api } from './api';
import { logger } from './logger';

export interface Project {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string;
    createdBy?: number;
    columns?: Column[];
    members?: ProjectMember[];
}

export interface Column {
    id: number;
    name: string;
    position: number;
    projectId: number;
    cards?: Card[];
    createdAt?: string;
    updatedAt?: string;
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
    assignees?: CardAssignee[];
    timeEntries?: TimeEntry[];
    attachments?: Attachment[];
}

export interface ProjectMember {
    id: number;
    role: string;
    projectId: number;
    userId: number;
    user?: User;
    joinedAt?: string;
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

export interface CreateProjectRequest {
    name: string;
    description: string;
    columns?: string[]; // Nomes das colunas padrão
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
}

export interface CreateColumnRequest {
    name: string;
    position: number;
}

export interface CreateCardRequest {
    title: string;
    description?: string;
    dueAt?: string;
    flagColor?: string;
    position: number;
}

export interface MoveCardRequest {
    columnId: number;
    position: number;
    reasonId?: number;
    note?: string;
}

class ProjectService {
    private baseURL = '/projects';

    // Operações de Projeto
    async getAllProjects(): Promise<Project[]> {

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

        try {
            logger.debug('Fetching all projects');
            //const response = await api.get<Project[]>(this.baseURL);
            //logger.info('Projects fetched successfully', { count: response.data.length });
            return data;
        } catch (error: any) {
            logger.error('Failed to fetch projects', error);
            throw this.handleError(error, 'Failed to fetch projects');
        }
    }

    async getProjectById(id: number): Promise<Project> {
        try {
            logger.debug('Fetching project by ID', { projectId: id });
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
            logger.info('Project fetched successfully', { projectId: id });
            return data[0];
        } catch (error: any) {
            logger.error('Failed to fetch project', { projectId: id, error });
            throw this.handleError(error, `Failed to fetch project ${id}`);
        }
    }

    async createProject(projectData: CreateProjectRequest): Promise<Project> {
        try {
            logger.debug('Creating new project', { name: projectData.name });
            const response = await api.post<Project>(this.baseURL, projectData);
            logger.info('Project created successfully', {
                projectId: response.data.id,
                name: response.data.name
            });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to create project', { data: projectData, error });
            throw this.handleError(error, 'Failed to create project');
        }
    }

    async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
        try {
            logger.debug('Updating project', { projectId: id, data: projectData });
            const response = await api.put<Project>(`${this.baseURL}/${id}`, projectData);
            logger.info('Project updated successfully', { projectId: id });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to update project', { projectId: id, data: projectData, error });
            throw this.handleError(error, `Failed to update project ${id}`);
        }
    }

    async deleteProject(id: number): Promise<void> {
        try {
            logger.debug('Deleting project', { projectId: id });
            await api.delete(`${this.baseURL}/${id}`);
            logger.info('Project deleted successfully', { projectId: id });
        } catch (error: any) {
            logger.error('Failed to delete project', { projectId: id, error });
            throw this.handleError(error, `Failed to delete project ${id}`);
        }
    }

    // Operações de Membros do Projeto
    async getProjectMembers(projectId: number): Promise<ProjectMember[]> {
        try {
            logger.debug('Fetching project members', { projectId });
            const response = await api.get<ProjectMember[]>(`${this.baseURL}/${projectId}/members`);
            return response.data;
        } catch (error: any) {
            logger.error('Failed to fetch project members', { projectId, error });
            throw this.handleError(error, `Failed to fetch members for project ${projectId}`);
        }
    }

    async addProjectMember(projectId: number, userId: number, role: string = 'MEMBER'): Promise<ProjectMember> {
        try {
            logger.debug('Adding project member', { projectId, userId, role });
            const response = await api.post<ProjectMember>(`${this.baseURL}/${projectId}/members`, {
                userId,
                role
            });
            logger.info('Project member added successfully', { projectId, userId });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to add project member', { projectId, userId, role, error });
            throw this.handleError(error, `Failed to add member to project ${projectId}`);
        }
    }

    async removeProjectMember(projectId: number, userId: number): Promise<void> {
        try {
            logger.debug('Removing project member', { projectId, userId });
            await api.delete(`${this.baseURL}/${projectId}/members/${userId}`);
            logger.info('Project member removed successfully', { projectId, userId });
        } catch (error: any) {
            logger.error('Failed to remove project member', { projectId, userId, error });
            throw this.handleError(error, `Failed to remove member from project ${projectId}`);
        }
    }

    async updateMemberRole(projectId: number, userId: number, role: string): Promise<ProjectMember> {
        try {
            logger.debug('Updating member role', { projectId, userId, role });
            const response = await api.put<ProjectMember>(`${this.baseURL}/${projectId}/members/${userId}`, { role });
            logger.info('Member role updated successfully', { projectId, userId, role });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to update member role', { projectId, userId, role, error });
            throw this.handleError(error, `Failed to update member role in project ${projectId}`);
        }
    }

    // Operações de Colunas
    async getProjectColumns(projectId: number): Promise<Column[]> {
        try {
            logger.debug('Fetching project columns', { projectId });
            const response = await api.get<Column[]>(`${this.baseURL}/${projectId}/columns`);
            return response.data;
        } catch (error: any) {
            logger.error('Failed to fetch project columns', { projectId, error });
            throw this.handleError(error, `Failed to fetch columns for project ${projectId}`);
        }
    }

    async createColumn(projectId: number, columnData: CreateColumnRequest): Promise<Column> {
        try {
            logger.debug('Creating column', { projectId, data: columnData });
            const response = await api.post<Column>(`${this.baseURL}/${projectId}/columns`, columnData);
            logger.info('Column created successfully', {
                projectId,
                columnId: response.data.id,
                name: response.data.name
            });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to create column', { projectId, data: columnData, error });
            throw this.handleError(error, `Failed to create column in project ${projectId}`);
        }
    }

    async updateColumn(columnId: number, columnData: Partial<CreateColumnRequest>): Promise<Column> {
        try {
            logger.debug('Updating column', { columnId, data: columnData });
            const response = await api.put<Column>(`/columns/${columnId}`, columnData);
            logger.info('Column updated successfully', { columnId });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to update column', { columnId, data: columnData, error });
            throw this.handleError(error, `Failed to update column ${columnId}`);
        }
    }

    async deleteColumn(columnId: number): Promise<void> {
        try {
            logger.debug('Deleting column', { columnId });
            await api.delete(`/columns/${columnId}`);
            logger.info('Column deleted successfully', { columnId });
        } catch (error: any) {
            logger.error('Failed to delete column', { columnId, error });
            throw this.handleError(error, `Failed to delete column ${columnId}`);
        }
    }

    async reorderColumns(projectId: number, columns: { id: number; position: number }[]): Promise<void> {
        try {
            logger.debug('Reordering columns', { projectId, columns });
            await api.put(`${this.baseURL}/${projectId}/columns/reorder`, { columns });
            logger.info('Columns reordered successfully', { projectId });
        } catch (error: any) {
            logger.error('Failed to reorder columns', { projectId, columns, error });
            throw this.handleError(error, `Failed to reorder columns in project ${projectId}`);
        }
    }

    // Operações de Cards
    async getProjectCards(projectId: number): Promise<Card[]> {
        try {
            logger.debug('Fetching project cards', { projectId });
            const response = await api.get<Card[]>(`${this.baseURL}/${projectId}/cards`);
            return response.data;
        } catch (error: any) {
            logger.error('Failed to fetch project cards', { projectId, error });
            throw this.handleError(error, `Failed to fetch cards for project ${projectId}`);
        }
    }

    async getCardById(cardId: number): Promise<Card> {
        try {
            logger.debug('Fetching card by ID', { cardId });
            const response = await api.get<Card>(`/cards/${cardId}`);
            return response.data;
        } catch (error: any) {
            logger.error('Failed to fetch card', { cardId, error });
            throw this.handleError(error, `Failed to fetch card ${cardId}`);
        }
    }

    async createCard(projectId: number, columnId: number, cardData: CreateCardRequest): Promise<Card> {
        try {
            logger.debug('Creating card', { projectId, columnId, data: cardData });
            const response = await api.post<Card>(`${this.baseURL}/${projectId}/cards`, {
                ...cardData,
                columnId
            });
            logger.info('Card created successfully', {
                projectId,
                cardId: response.data.id,
                title: response.data.title
            });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to create card', { projectId, columnId, data: cardData, error });
            throw this.handleError(error, `Failed to create card in project ${projectId}`);
        }
    }

    async updateCard(cardId: number, cardData: Partial<CreateCardRequest>): Promise<Card> {
        try {
            logger.debug('Updating card', { cardId, data: cardData });
            const response = await api.put<Card>(`/cards/${cardId}`, cardData);
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
            await api.delete(`/cards/${cardId}`);
            logger.info('Card deleted successfully', { cardId });
        } catch (error: any) {
            logger.error('Failed to delete card', { cardId, error });
            throw this.handleError(error, `Failed to delete card ${cardId}`);
        }
    }

    async moveCard(cardId: number, moveData: MoveCardRequest): Promise<Card> {
        try {
            logger.debug('Moving card', { cardId, data: moveData });
            const response = await api.post<Card>(`/cards/${cardId}/move`, moveData);
            logger.info('Card moved successfully', {
                cardId,
                newColumnId: moveData.columnId,
                newPosition: moveData.position
            });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to move card', { cardId, data: moveData, error });
            throw this.handleError(error, `Failed to move card ${cardId}`);
        }
    }

    async reorderCards(columnId: number, cards: { id: number; position: number }[]): Promise<void> {
        try {
            logger.debug('Reordering cards', { columnId, cards });
            await api.put(`/columns/${columnId}/cards/reorder`, { cards });
            logger.info('Cards reordered successfully', { columnId });
        } catch (error: any) {
            logger.error('Failed to reorder cards', { columnId, cards, error });
            throw this.handleError(error, `Failed to reorder cards in column ${columnId}`);
        }
    }

    // Manipulação de erros
    private handleError(error: any, defaultMessage: string): Error {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    return new Error(data?.message || 'Bad request');
                case 401:
                    return new Error('Authentication required');
                case 403:
                    return new Error(data?.message || 'Access denied');
                case 404:
                    return new Error('Resource not found');
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

export const projectService = new ProjectService();