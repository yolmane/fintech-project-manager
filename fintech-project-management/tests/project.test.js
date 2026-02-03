import FinTechProject from '../js/Project.js';
import TeamMember from '../js/TeamMember.js';
import Task from '../js/Task.js';
import ProjectManager from '../js/ProjectManager.js';

describe('FinTech Project Management System', () => {
    describe('FinTechProject Class', () => {
        let project;

        beforeEach(() => {
            project = new FinTechProject(
                'PROJ-001',
                'Банковское приложение',
                'Сбербанк',
                1000000,
                '2024-01-01',
                '2024-06-30'
            );
        });

        test('should create project with correct properties', () => {
            expect(project.name).toBe('Банковское приложение');
            expect(project.client).toBe('Сбербанк');
            expect(project.budget).toBe(1000000);
            expect(project.status).toBe('planning');
        });

        test('should calculate progress correctly', () => {
            expect(project.calculateProgress()).toBe(0);
            
            const task = new Task('TASK-001', 'Тестовая задача', 'Описание', 'development');
            task.status = 'completed';
            project.addTask(task);
            
            expect(project.calculateProgress()).toBe(100);
        });

        test('should detect projects at risk', () => {
            // Проект с малым сроком и малым прогрессом должен быть в риске
            const riskyProject = new FinTechProject(
                'PROJ-002',
                'Рисковый проект',
                'Клиент',
                500000,
                '2024-01-01',
                '2024-01-10' // Очень близкий дедлайн
            );
            
            expect(riskyProject.isAtRisk()).toBe(true);
        });
    });

    describe('TeamMember Class', () => {
        let member;

        beforeEach(() => {
            member = new TeamMember(
                'TM-001',
                'Иван Петров',
                'developer',
                'ivan@example.com',
                ['JavaScript', 'Node.js', 'React'],
                2500
            );
        });

        test('should create team member with correct properties', () => {
            expect(member.name).toBe('Иван Петров');
            expect(member.role).toBe('developer');
            expect(member.hourlyRate).toBe(2500);
            expect(member.skills).toContain('JavaScript');
        });

        test('should assign tasks correctly', () => {
            member.assignTask('TASK-001');
            expect(member.assignedTasks).toContain('TASK-001');
        });

        test('should track performance', () => {
            member.assignTask('TASK-001');
            member.completeTask('TASK-001', 40, 95);
            
            expect(member.performance.completedTasks).toBe(1);
            expect(member.performance.averageCompletionTime).toBe(40);
            expect(member.performance.qualityScore).toBe(95);
        });
    });

    describe('ProjectManager Class', () => {
        let manager;

        beforeEach(() => {
            manager = new ProjectManager();
        });

        test('should add and retrieve projects', () => {
            const project = new FinTechProject(
                'PROJ-001',
                'Тестовый проект',
                'Тестовый клиент',
                500000,
                '2024-01-01',
                '2024-12-31'
            );
            
            manager.addProject(project);
            expect(manager.getProject('PROJ-001')).toBe(project);
        });

        test('should find available team members', () => {
            const member = new TeamMember(
                'TM-001',
                'Тестовый участник',
                'developer',
                'test@example.com',
                ['JavaScript'],
                2000
            );
            
            manager.addTeamMember(member);
            const availableMember = manager.findAvailableTeamMember(['JavaScript']);
            
            expect(availableMember).toBe(member);
        });

        test('should generate analytics', () => {
            // Добавляем тестовые проекты
            const project1 = new FinTechProject('PROJ-001', 'Проект 1', 'Клиент 1', 1000000, '2024-01-01', '2024-06-30');
            const project2 = new FinTechProject('PROJ-002', 'Проект 2', 'Клиент 2', 2000000, '2024-01-01', '2024-12-31');
            
            manager.addProject(project1);
            manager.addProject(project2);
            
            const budgetAnalysis = manager.getBudgetAnalysis();
            
            expect(budgetAnalysis.totalBudget).toBe(3000000);
            expect(budgetAnalysis.totalSpent).toBe(0); // Нет завершенных задач
        });
    });

    describe('Task Class', () => {
        let task;

        beforeEach(() => {
            task = new Task(
                'TASK-001',
                'Разработка API',
                'Разработка REST API для банковского приложения',
                'development',
                'high'
            );
        });

        test('should create task with correct properties', () => {
            expect(task.title).toBe('Разработка API');
            expect(task.phase).toBe('development');
            expect(task.priority).toBe('high');
            expect(task.status).toBe('todo');
        });

        test('should track task progress', () => {
            expect(task.calculateProgress()).toBe(0);
            
            task.updateStatus('inProgress');
            expect(task.calculateProgress()).toBe(50);
            
            task.updateStatus('completed');
            expect(task.calculateProgress()).toBe(100);
        });

        test('should detect overdue tasks', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            task.dueDate = pastDate;
            
            expect(task.isOverdue()).toBe(true);
        });
    });
});