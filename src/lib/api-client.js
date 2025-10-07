// lib/api-client.js - Cliente para la API REST
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dgproducciones.cl/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dgproducciones_api_key_2025';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE;
        this.apiKey = API_KEY;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Métodos para Contactos
    async getContacts() {
        return this.request('contacts');
    }

    async getContact(id) {
        return this.request(`contacts?id=${id}`);
    }

    async createContact(data) {
        return this.request('contacts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateContact(id, data) {
        return this.request(`contacts?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteContact(id) {
        return this.request(`contacts?id=${id}`, {
            method: 'DELETE',
        });
    }

    // Métodos para Proyectos
    async getProjects() {
        return this.request('projects');
    }

    async getProject(id) {
        return this.request(`projects?id=${id}`);
    }

    async createProject(data) {
        return this.request('projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProject(id, data) {
        return this.request(`projects?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProject(id) {
        return this.request(`projects?id=${id}`, {
            method: 'DELETE',
        });
    }

    // Métodos para Equipo
    async getTeam() {
        return this.request('team');
    }

    async getTeamMember(id) {
        return this.request(`team?id=${id}`);
    }

    async createTeamMember(data) {
        return this.request('team', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTeamMember(id, data) {
        return this.request(`team?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTeamMember(id) {
        return this.request(`team?id=${id}`, {
            method: 'DELETE',
        });
    }

    // Método para probar conexión
    async testConnection() {
        return this.request('?endpoint=test');
    }

    // Método para obtener estado de la API
    async getStatus() {
        return this.request('?endpoint=status');
    }
}

// Crear instancia singleton
const apiClient = new ApiClient();

export default apiClient;

// Exportar métodos individuales para facilitar el uso
export const {
    // Contactos
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,

    // Proyectos
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    // Equipo
    getTeam,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,

    // Utils
    testConnection,
    getStatus,
} = apiClient;