/**
 * Класс Task для управления задачами проекта
 */
class Task {
    constructor(id, title, description, phase, priority = 'medium') {
        this.id = id || this.generateId();
        this.title = title;
        this.description = description;
        this.phase = phase; // analysis, design, development, testing, implementation
        this.priority = priority; // low, medium, high, critical
        this.status = 'todo'; // todo, inProgress, review, completed
        this.assignedTo = null;
        this.estimatedHours = 0;
        this.actualHours = 0;
        this.startDate = null;
        this.dueDate = null;
        this.completedDate = null;
        this.dependencies = []; // IDs задач, от которых зависит данная задача
        this.tags = [];
        this.comments = [];
        this.estimatedCost = 0;
        this.actualCost = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateId() {
        return 'TASK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    assignTo(memberId) {
        this.assignedTo = memberId;
        this.status = 'inProgress';
        this.startDate = new Date();
        this.updatedAt = new Date();
        return true;
    }

    updateStatus(newStatus) {
        const validStatuses = ['todo', 'inProgress', 'review', 'completed'];
        if (validStatuses.includes(newStatus)) {
            this.status = newStatus;
            
            if (newStatus === 'completed') {
                this.completedDate = new Date();
            }
            
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    addDependency(taskId) {
        if (!this.dependencies.includes(taskId) && taskId !== this.id) {
            this.dependencies.push(taskId);
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    addComment(author, text) {
        this.comments.push({
            id: Date.now(),
            author: author,
            text: text,
            timestamp: new Date().toISOString()
        });
        this.updatedAt = new Date();
    }

    calculateProgress() {
        switch (this.status) {
            case 'todo': return 0;
            case 'inProgress': return 50;
            case 'review': return 75;
            case 'completed': return 100;
            default: return 0;
        }
    }

    isOverdue() {
        if (!this.dueDate || this.status === 'completed') return false;
        return new Date() > new Date(this.dueDate);
    }

    updateTimeTracking(actualHours, memberHourlyRate) {
        this.actualHours = actualHours;
        this.actualCost = actualHours * memberHourlyRate;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            phase: this.phase,
            priority: this.priority,
            status: this.status,
            assignedTo: this.assignedTo,
            progress: this.calculateProgress(),
            estimatedHours: this.estimatedHours,
            actualHours: this.actualHours,
            startDate: this.startDate,
            dueDate: this.dueDate,
            completedDate: this.completedDate,
            dependencies: this.dependencies,
            tags: this.tags,
            commentCount: this.comments.length,
            estimatedCost: this.estimatedCost,
            actualCost: this.actualCost,
            overdue: this.isOverdue(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}