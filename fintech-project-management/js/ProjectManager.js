/**
 * Класс ProjectManager для управления всеми проектами
 */
class ProjectManager {
    constructor() {
        this.projects = new Map();
        this.teamMembers = new Map();
        this.technologies = new Set(['JavaScript', 'Node.js', 'React', 'Python', 'Java', 'SQL', 'Blockchain', 'AWS', 'Docker']);
        this.clients = new Map();
        this.loadFromStorage();
    }

    // Управление проектами
    addProject(project) {
        this.projects.set(project.id, project);
        this.saveToStorage();
        return project;
    }

    getProject(projectId) {
        return this.projects.get(projectId);
    }

    updateProject(projectId, updates) {
        const project = this.projects.get(projectId);
        if (project) {
            Object.assign(project, updates);
            project.updatedAt = new Date();
            this.saveToStorage();
            return true;
        }
        return false;
    }

    deleteProject(projectId) {
        const deleted = this.projects.delete(projectId);
        if (deleted) {
            this.saveToStorage();
        }
        return deleted;
    }

    // Управление командой
    addTeamMember(member) {
        this.teamMembers.set(member.id, member);
        this.saveToStorage();
        return member;
    }

    getTeamMember(memberId) {
        return this.teamMembers.get(memberId);
    }

    // Аналитика
    getProjectsByStatus() {
        const statusCount = {};
        this.projects.forEach(project => {
            statusCount[project.status] = (statusCount[project.status] || 0) + 1;
        });
        return statusCount;
    }

    getProjectsAtRisk() {
        return Array.from(this.projects.values())
            .filter(project => project.isAtRisk())
            .map(project => project.toJSON());
    }

    getResourceUtilization() {
        const utilization = {
            teamMembers: this.teamMembers.size,
            availableMembers: Array.from(this.teamMembers.values())
                .filter(member => member.availability === 'available').length,
            totalProjects: this.projects.size,
            activeProjects: Array.from(this.projects.values())
                .filter(project => project.status !== 'completed').length
        };
        
        utilization.utilizationRate = (utilization.activeProjects / utilization.availableMembers) * 100;
        return utilization;
    }

    getBudgetAnalysis() {
        let totalBudget = 0;
        let totalSpent = 0;
        
        this.projects.forEach(project => {
            totalBudget += project.budget;
            const utilization = project.getBudgetUtilization();
            totalSpent += utilization.spent;
        });
        
        return {
            totalBudget,
            totalSpent,
            remaining: totalBudget - totalSpent,
            utilizationPercentage: (totalSpent / totalBudget) * 100
        };
    }

    // Поиск и фильтрация
    searchProjects(searchTerm) {
        return Array.from(this.projects.values())
            .filter(project => 
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.client.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(project => project.toJSON());
    }

    filterProjects(filters) {
        return Array.from(this.projects.values())
            .filter(project => {
                if (filters.status && project.status !== filters.status) return false;
                if (filters.client && project.client !== filters.client) return false;
                if (filters.minBudget && project.budget < filters.minBudget) return false;
                if (filters.maxBudget && project.budget > filters.maxBudget) return false;
                return true;
            })
            .map(project => project.toJSON());
    }

    // Распределение ресурсов
    findAvailableTeamMember(skills = []) {
        return Array.from(this.teamMembers.values())
            .filter(member => 
                member.availability === 'available' &&
                (skills.length === 0 || skills.every(skill => member.hasSkill(skill)))
            )
            .sort((a, b) => b.performance.qualityScore - a.performance.qualityScore)[0];
    }

    // Сохранение и загрузка
    saveToStorage() {
        const data = {
            projects: Array.from(this.projects.values()).map(p => p.toJSON()),
            teamMembers: Array.from(this.teamMembers.values()).map(m => m.toJSON()),
            technologies: Array.from(this.technologies),
            clients: Array.from(this.clients.entries())
        };
        localStorage.setItem('projectManagerData', JSON.stringify(data));
    }

    loadFromStorage() {
        const data = JSON.parse(localStorage.getItem('projectManagerData') || '{}');
        
        if (data.projects) {
            data.projects.forEach(projectData => {
                const project = new FinTechProject();
                Object.assign(project, projectData);
                project.startDate = new Date(projectData.startDate);
                project.deadline = new Date(projectData.deadline);
                project.createdAt = new Date(projectData.createdAt);
                project.updatedAt = new Date(projectData.updatedAt);
                this.projects.set(project.id, project);
            });
        }
        
        if (data.teamMembers) {
            data.teamMembers.forEach(memberData => {
                const member = new TeamMember();
                Object.assign(member, memberData);
                this.teamMembers.set(member.id, member);
            });
        }
        
        if (data.technologies) {
            data.technologies.forEach(tech => this.technologies.add(tech));
        }
        
        if (data.clients) {
            data.clients.forEach(([key, value]) => this.clients.set(key, value));
        }
    }

    // Экспорт данных
    exportData(format = 'json') {
        const data = {
            projects: Array.from(this.projects.values()).map(p => p.toJSON()),
            teamMembers: Array.from(this.teamMembers.values()).map(m => m.toJSON()),
            summary: {
                totalProjects: this.projects.size,
                activeProjects: this.getProjectsByStatus(),
                budgetAnalysis: this.getBudgetAnalysis(),
                resourceUtilization: this.getResourceUtilization()
            }
        };

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            default:
                return data;
        }
    }

    convertToCSV(data) {
        // Конвертация в CSV формат
        const projectsCSV = this.arrayToCSV(data.projects);
        const membersCSV = this.arrayToCSV(data.teamMembers);
        return `Projects:\n${projectsCSV}\n\nTeam Members:\n${membersCSV}`;
    }

    arrayToCSV(array) {
        if (array.length === 0) return '';
        
        const headers = Object.keys(array[0]);
        const rows = array.map(obj => 
            headers.map(header => JSON.stringify(obj[header] || '')).join(',')
        );
        
        return [headers.join(','), ...rows].join('\n');
    }
}