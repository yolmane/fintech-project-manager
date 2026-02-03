/**
 * Основное приложение управления проектами FinTech
 */

import ProjectManager from './js/ProjectManager.js';
import FinTechProject from './js/Project.js';
import TeamMember from './js/TeamMember.js';
import Task from './js/Task.js';

class FinTechProjectApp {
    constructor() {
        this.projectManager = new ProjectManager();
        this.currentView = 'dashboard';
        this.currentProject = null;
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.renderDashboard();
        this.updateStats();
    }

    loadInitialData() {
        // Загрузка тестовых данных, если нет сохраненных
        if (this.projectManager.projects.size === 0) {
            this.loadSampleData();
        }
    }

    loadSampleData() {
        // Создание тестовых участников команды
        const members = [
            new TeamMember(null, 'Алексей Петров', 'projectManager', 'a.petrov@iip-intellect.ru', 
                ['Project Management', 'FinTech', 'Regulatory Compliance'], 5000),
            new TeamMember(null, 'Мария Сидорова', 'analyst', 'm.sidorova@iip-intellect.ru',
                ['Financial Analysis', 'Risk Assessment', 'Data Analysis'], 3000),
            new TeamMember(null, 'Дмитрий Иванов', 'developer', 'd.ivanov@iip-intellect.ru',
                ['JavaScript', 'Node.js', 'Blockchain', 'Security'], 2500),
            new TeamMember(null, 'Елена Кузнецова', 'tester', 'e.kuznetsova@iip-intellect.ru',
                ['QA', 'Automation Testing', 'Security Testing'], 2000)
        ];

        members.forEach(member => this.projectManager.addTeamMember(member));

        // Создание тестовых проектов
        const project1 = new FinTechProject(
            null,
            'Мобильный банкинг для Альфа-Банка',
            'Альфа-Банк',
            5000000,
            '2024-01-15',
            '2024-06-30'
        );
        project1.status = 'development';
        project1.technologies = ['React Native', 'Node.js', 'PostgreSQL', 'AWS'];
        
        const project2 = new FinTechProject(
            null,
            'Система AML-мониторинга',
            'Сбербанк',
            8000000,
            '2024-02-01',
            '2024-08-15'
        );
        project2.status = 'design';
        project2.technologies = ['Python', 'Machine Learning', 'Kafka', 'Kubernetes'];

        this.projectManager.addProject(project1);
        this.projectManager.addProject(project2);
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Форма создания проекта
        document.getElementById('createProjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject();
        });

        // Форма добавления участника
        document.getElementById('addMemberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTeamMember();
        });

        // Поиск проектов
        document.getElementById('projectSearch').addEventListener('input', (e) => {
            this.searchProjects(e.target.value);
        });

        // Экспорт данных
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
    }

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`${view}View`).classList.remove('hidden');
        
        switch(view) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'projects':
                this.renderProjectsList();
                break;
            case 'team':
                this.renderTeamList();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
        }
    }

    renderDashboard() {
        const container = document.getElementById('dashboardContent');
        const projectsAtRisk = this.projectManager.getProjectsAtRisk();
        const resourceUtilization = this.projectManager.getResourceUtilization();
        const budgetAnalysis = this.projectManager.getBudgetAnalysis();

        container.innerHTML = `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <h3>Активные проекты</h3>
                    <div class="stat-value">${resourceUtilization.activeProjects}</div>
                    <div class="stat-label">из ${resourceUtilization.totalProjects} всего</div>
                </div>
                
                <div class="stat-card">
                    <h3>Использование бюджета</h3>
                    <div class="stat-value">${budgetAnalysis.utilizationPercentage.toFixed(1)}%</div>
                    <div class="stat-label">${this.formatCurrency(budgetAnalysis.totalSpent)} из ${this.formatCurrency(budgetAnalysis.totalBudget)}</div>
                </div>
                
                <div class="stat-card">
                    <h3>Команда</h3>
                    <div class="stat-value">${resourceUtilization.teamMembers}</div>
                    <div class="stat-label">${resourceUtilization.availableMembers} доступно</div>
                </div>
                
                <div class="stat-card warning">
                    <h3>Проекты в риске</h3>
                    <div class="stat-value">${projectsAtRisk.length}</div>
                    <div class="stat-label">требуют внимания</div>
                </div>
            </div>
            
            <div class="recent-projects">
                <h3>Последние проекты</h3>
                <div class="project-cards">
                    ${Array.from(this.projectManager.projects.values())
                        .slice(0, 3)
                        .map(project => this.renderProjectCard(project))
                        .join('')}
                </div>
            </div>
            
            <div class="quick-actions">
                <h3>Быстрые действия</h3>
                <div class="actions-grid">
                    <button class="btn-primary" onclick="app.createNewProject()">
                        <i class="icon-plus"></i> Новый проект
                    </button>
                    <button class="btn-secondary" onclick="app.addNewMember()">
                        <i class="icon-user-plus"></i> Добавить участника
                    </button>
                    <button class="btn-success" onclick="app.generateReport()">
                        <i class="icon-report"></i> Создать отчет
                    </button>
                </div>
            </div>
        `;
    }

    renderProjectCard(project) {
        const progress = project.calculateProgress();
        const remainingDays = project.getRemainingDays();
        const budget = project.getBudgetUtilization();
        
        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <h4>${project.name}</h4>
                    <span class="project-status ${project.status}">${this.getStatusText(project.status)}</span>
                </div>
                <div class="project-client">Клиент: ${project.client}</div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${progress}% выполнено</div>
                </div>
                <div class="project-info">
                    <div class="info-item">
                        <span class="label">Бюджет:</span>
                        <span class="value">${this.formatCurrency(budget.spent)} / ${this.formatCurrency(project.budget)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">До дедлайна:</span>
                        <span class="value ${remainingDays < 7 ? 'warning' : ''}">${remainingDays} дней</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Команда:</span>
                        <span class="value">${project.team.length} чел.</span>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn-small" onclick="app.openProject('${project.id}')">Открыть</button>
                    <button class="btn-small btn-secondary" onclick="app.editProject('${project.id}')">Редактировать</button>
                </div>
            </div>
        `;
    }

    createProject() {
        const formData = new FormData(document.getElementById('createProjectForm'));
        const projectData = {
            name: formData.get('projectName'),
            client: formData.get('client'),
            budget: parseFloat(formData.get('budget')),
            startDate: formData.get('startDate'),
            deadline: formData.get('deadline')
        };

        // Валидация
        if (!projectData.name || !projectData.client) {
            this.showMessage('Заполните все обязательные поля', 'error');
            return;
        }

        const project = new FinTechProject(
            null,
            projectData.name,
            projectData.client,
            projectData.budget,
            projectData.startDate,
            projectData.deadline
        );

        this.projectManager.addProject(project);
        this.showMessage('Проект успешно создан', 'success');
        this.renderProjectsList();
        this.updateStats();
    }

    addTeamMember() {
        const formData = new FormData(document.getElementById('addMemberForm'));
        const skills = formData.get('skills').split(',').map(skill => skill.trim());
        
        const member = new TeamMember(
            null,
            formData.get('name'),
            formData.get('role'),
            formData.get('email'),
            skills,
            parseFloat(formData.get('hourlyRate'))
        );

        this.projectManager.addTeamMember(member);
        this.showMessage('Участник команды добавлен', 'success');
        this.renderTeamList();
        this.updateStats();
    }

    searchProjects(searchTerm) {
        const results = this.projectManager.searchProjects(searchTerm);
        this.renderSearchResults(results);
    }

    exportData() {
        const data = this.projectManager.exportData('json');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fintech-projects-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    updateStats() {
        const stats = {
            totalProjects: this.projectManager.projects.size,
            activeProjects: Object.values(this.projectManager.getProjectsByStatus())
                .reduce((sum, count) => sum + count, 0) - (this.projectManager.getProjectsByStatus().completed || 0),
            totalBudget: this.projectManager.getBudgetAnalysis().totalBudget,
            teamSize: this.projectManager.teamMembers.size
        };

        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = key.includes('Budget') 
                    ? this.formatCurrency(value)
                    : value;
            }
        });
    }

    // Вспомогательные методы
    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(amount);
    }

    getStatusText(status) {
        const statusMap = {
            planning: 'Планирование',
            analysis: 'Анализ',
            design: 'Проектирование',
            development: 'Разработка',
            testing: 'Тестирование',
            implementation: 'Внедрение',
            maintenance: 'Поддержка',
            completed: 'Завершен'
        };
        return statusMap[status] || status;
    }

    showMessage(text, type = 'info') {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message message-${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

// Инициализация приложения
window.app = new FinTechProjectApp();