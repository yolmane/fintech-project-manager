/**
 * Класс FinTechProject для управления проектами FinTech-разработки
 */
class FinTechProject {
    constructor(id, name, client, budget, startDate, deadline) {
        this.id = id || this.generateId();
        this.name = name;
        this.client = client;
        this.budget = budget;
        this.startDate = new Date(startDate);
        this.deadline = new Date(deadline);
        this.status = 'planning'; // planning, analysis, design, development, testing, implementation, maintenance, completed
        this.team = [];
        this.tasks = [];
        this.requirements = {
            functional: [],
            nonFunctional: [],
            regulatory: []
        };
        this.technologies = [];
        this.risks = [];
        this.milestones = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateId() {
        return 'PROJ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Методы управления проектом
    addTeamMember(member) {
        if (!this.team.some(m => m.id === member.id)) {
            this.team.push(member);
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    removeTeamMember(memberId) {
        const index = this.team.findIndex(m => m.id === memberId);
        if (index !== -1) {
            this.team.splice(index, 1);
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    addTask(task) {
        task.projectId = this.id;
        this.tasks.push(task);
        this.updatedAt = new Date();
        return task;
    }

    updateStatus(newStatus) {
        const validStatuses = ['planning', 'analysis', 'design', 'development', 'testing', 'implementation', 'maintenance', 'completed'];
        if (validStatuses.includes(newStatus)) {
            this.status = newStatus;
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    addRequirement(type, requirement) {
        if (['functional', 'nonFunctional', 'regulatory'].includes(type)) {
            this.requirements[type].push({
                id: Date.now(),
                description: requirement,
                status: 'pending',
                priority: 'medium'
            });
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    calculateProgress() {
        if (this.tasks.length === 0) return 0;
        const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
        return Math.round((completedTasks / this.tasks.length) * 100);
    }

    getRemainingDays() {
        const now = new Date();
        const diffTime = this.deadline - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    isAtRisk() {
        const remainingDays = this.getRemainingDays();
        const progress = this.calculateProgress();
        const daysPerPercent = remainingDays / (100 - progress);
        return daysPerPercent < 0.5 || remainingDays < 7;
    }

    getBudgetUtilization() {
        // Расчет использованного бюджета
        const spent = this.tasks
            .filter(task => task.status === 'completed')
            .reduce((sum, task) => sum + task.estimatedCost, 0);
        return {
            spent: spent,
            remaining: this.budget - spent,
            percentage: (spent / this.budget) * 100
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            client: this.client,
            budget: this.budget,
            startDate: this.startDate.toISOString(),
            deadline: this.deadline.toISOString(),
            status: this.status,
            progress: this.calculateProgress(),
            teamSize: this.team.length,
            taskCount: this.tasks.length,
            remainingDays: this.getRemainingDays(),
            budgetUtilization: this.getBudgetUtilization(),
            atRisk: this.isAtRisk(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}