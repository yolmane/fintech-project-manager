/**
 * Класс TeamMember для управления участниками команды
 */
class TeamMember {
    constructor(id, name, role, email, skills = [], hourlyRate = 0) {
        this.id = id || this.generateId();
        this.name = name;
        this.role = role; // developer, analyst, tester, projectManager, etc.
        this.email = email;
        this.skills = skills;
        this.hourlyRate = hourlyRate;
        this.availability = 'available'; // available, busy, vacation
        this.currentProjects = [];
        this.assignedTasks = [];
        this.performance = {
            completedTasks: 0,
            averageCompletionTime: 0,
            qualityScore: 100
        };
    }

    generateId() {
        return 'TM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    assignToProject(projectId) {
        if (!this.currentProjects.includes(projectId)) {
            this.currentProjects.push(projectId);
            return true;
        }
        return false;
    }

    assignTask(taskId) {
        if (!this.assignedTasks.includes(taskId)) {
            this.assignedTasks.push(taskId);
            return true;
        }
        return false;
    }

    completeTask(taskId, actualHours, qualityScore = 100) {
        const taskIndex = this.assignedTasks.indexOf(taskId);
        if (taskIndex !== -1) {
            this.assignedTasks.splice(taskIndex, 1);
            this.performance.completedTasks++;
            
            // Обновление средней скорости выполнения
            const totalTasks = this.performance.completedTasks;
            this.performance.averageCompletionTime = 
                (this.performance.averageCompletionTime * (totalTasks - 1) + actualHours) / totalTasks;
            
            // Обновление показателя качества
            this.performance.qualityScore = 
                (this.performance.qualityScore * (totalTasks - 1) + qualityScore) / totalTasks;
            
            return true;
        }
        return false;
    }

    getWorkload() {
        return {
            currentProjects: this.currentProjects.length,
            assignedTasks: this.assignedTasks.length,
            availability: this.availability
        };
    }

    hasSkill(skill) {
        return this.skills.some(s => s.toLowerCase() === skill.toLowerCase());
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            email: this.email,
            skills: this.skills,
            hourlyRate: this.hourlyRate,
            availability: this.availability,
            workload: this.getWorkload(),
            performance: this.performance
        };
    }
}