// ========================================
// Expense Tracker Pro - Main Application
// メインアプリケーションロジック
// ========================================

class ExpenseApp {
    constructor() {
        // 依存クラスのインスタンス化
        this.storage = new StorageManager();
        this.chartManager = new ChartManager();
        this.gasAPI = new GASAPIClient();

        // 電卓機能の初期化
        this.calculator = null;

        // 状態管理
        this.currentView = 'dashboard';
        this.expenses = [];
        this.settings = {};
        this.currentFilters = {};
        this.currentPeriod = 'month';

        // 初期化
        this.init();
    }

    /**
     * アプリケーション初期化
     */
    init() {
        // データ読み込み
        this.loadData();

        // イベントリスナー設定
        this.setupEventListeners();

        // 初期表示
        this.renderDashboard();
        this.applyTheme();

        // カテゴリ選択肢を設定
        this.populateCategorySelects();

        // 今日の日付を設定
        this.setTodayDate();

        // 電卓機能の初期化
        const amountInput = document.getElementById('expenseAmount');
        if (amountInput && typeof Calculator !== 'undefined') {
            this.calculator = new Calculator(amountInput);
        }

        console.log('✅ Expense Tracker Pro が起動しました');
    }

    /**
     * データ読み込み
     */
    loadData() {
        this.expenses = this.storage.loadExpenses();
        this.settings = this.storage.loadSettings();
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // ナビゲーション
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.navigateTo(view);
            });
        });

        // メニュートグル（モバイル）
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });

        // ダークモード切替
        document.getElementById('darkModeToggle')?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // 支出記録フォーム
        document.getElementById('expenseForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddExpense();
        });

        // メモ文字数カウント
        document.getElementById('expenseMemo')?.addEventListener('input', (e) => {
            document.getElementById('memoCount').textContent = e.target.value.length;
        });

        // フィルター
        document.getElementById('applyFilters')?.addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clearFilters')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // 検索（デバウンス）
        const searchInput = document.getElementById('searchQuery');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchExpenses(e.target.value);
            }, 300));
        }

        // 期間選択（分析ページ）
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changePeriod(e.target.dataset.period);
            });
        });

        document.getElementById('applyCustomPeriod')?.addEventListener('click', () => {
            this.applyCustomPeriod();
        });

        // 予算設定
        document.getElementById('budgetForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBudget();
        });

        // データ管理
        document.getElementById('exportCSV')?.addEventListener('click', () => {
            this.storage.exportToCSV();
        });

        document.getElementById('exportJSON')?.addEventListener('click', () => {
            this.storage.exportToJSON();
        });

        document.getElementById('importBtn')?.addEventListener('click', () => {
            document.getElementById('importFile')?.click();
        });

        document.getElementById('importFile')?.addEventListener('change', (e) => {
            this.handleImport(e.target.files[0]);
        });

        document.getElementById('syncSpreadsheet')?.addEventListener('click', () => {
            this.syncToSpreadsheet();
        });

        document.getElementById('clearAllData')?.addEventListener('click', () => {
            if (this.storage.clearAll()) {
                this.loadData();
                this.renderCurrentView();
            }
        });
    }

    // ========================================
    // ナビゲーション
    // ========================================

    /**
     * ビューを切り替え
     * @param {string} view - ビュー名
     */
    navigateTo(view) {
        // 現在のビューを非表示
        document.querySelectorAll('.content-view').forEach(v => {
            v.classList.remove('active');
        });

        // ナビゲーションの active クラスを更新
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 新しいビューを表示
        const viewElement = document.getElementById(`view-${view}`);
        if (viewElement) {
            viewElement.classList.add('active');
        }

        // ナビゲーションをアクティブに
        const navItem = document.querySelector(`[data-view="${view}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // モバイルでサイドバーを閉じる
        if (window.innerWidth < 992) {
            document.getElementById('sidebar')?.classList.remove('active');
        }

        // ビューを更新
        this.currentView = view;
        this.renderCurrentView();
    }

    /**
     * 現在のビューを再描画
     */
    renderCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'add':
                // フォームリセット
                break;
            case 'list':
                this.renderExpenseList();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'budget':
                this.renderBudget();
                break;
            case 'settings':
                // 設定ページ
                break;
        }
    }

    // ========================================
    // ダッシュボード
    // ========================================

    /**
     * ダッシュボードを描画
     */
    renderDashboard() {
        const thisMonth = Utils.getThisMonthRange();
        const lastMonth = Utils.getLastMonthRange();

        // 今月の支出を取得
        const thisMonthExpenses = this.getExpensesByPeriod(thisMonth.start, thisMonth.end);
        const lastMonthExpenses = this.getExpensesByPeriod(lastMonth.start, lastMonth.end);

        const thisMonthTotal = this.calculateTotal(thisMonthExpenses);
        const lastMonthTotal = this.calculateTotal(lastMonthExpenses);

        // 今月の総支出
        document.getElementById('totalExpense').textContent = Utils.formatCurrency(thisMonthTotal);

        // 前月比
        const changePercent = lastMonthTotal === 0 ?
            0 :
            Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);

        const changeElement = document.getElementById('monthChange');
        if (changeElement) {
            const isIncrease = changePercent > 0;
            changeElement.innerHTML = `
                <span class="change-icon">${isIncrease ? '↑' : '↓'}</span>
                <span class="change-text">前月比 ${Math.abs(changePercent)}%</span>
            `;
            changeElement.style.color = isIncrease ? '#EF4444' : '#10B981';
        }

        // 支出件数
        document.getElementById('expenseCount').textContent = thisMonthExpenses.length;

        // 予算使用率
        const budget = this.settings.monthlyBudget || 0;
        if (budget > 0) {
            const usagePercent = Math.round((thisMonthTotal / budget) * 100);
            document.getElementById('budgetUsage').textContent = `${usagePercent}%`;

            const progressBar = document.getElementById('budgetProgress');
            if (progressBar) {
                progressBar.style.width = `${Math.min(usagePercent, 100)}%`;
                progressBar.style.backgroundColor = usagePercent > 100 ? '#EF4444' : '#10B981';
            }
        } else {
            document.getElementById('budgetUsage').textContent = '未設定';
        }

        // TOP3カテゴリ
        this.renderTopCategories(thisMonthExpenses);

        // 最近の支出
        this.renderRecentExpenses();
    }

    /**
     * TOP3カテゴリを描画
     * @param {Array} expenses - 支出データ
     */
    renderTopCategories(expenses) {
        const container = document.getElementById('topCategories');
        if (!container) return;

        if (expenses.length === 0) {
            container.innerHTML = '<p class="text-muted">データがありません</p>';
            return;
        }

        const categoryData = this.calculateCategorySummary(expenses);
        const sorted = Object.entries(categoryData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, CONFIG.TOP_CATEGORIES_COUNT);

        const total = this.calculateTotal(expenses);

        container.innerHTML = sorted.map(([category, amount], index) => {
            const categoryInfo = Utils.getCategoryInfo(category);
            const percent = Utils.calculatePercentage(amount, total);

            return `
                <div class="category-item">
                    <div class="category-rank">${index + 1}</div>
                    <div class="category-info">
                        <div class="category-name">
                            ${categoryInfo ? categoryInfo.icon : ''} ${category}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="category-amount">${Utils.formatCurrency(amount)}</div>
                        <div class="category-percent">${percent}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 最近の支出を描画
     */
    renderRecentExpenses() {
        const container = document.getElementById('recentExpenses');
        if (!container) return;

        const recent = Utils.sortByDate(this.expenses, 'date')
            .slice(0, CONFIG.RECENT_EXPENSES_COUNT);

        if (recent.length === 0) {
            container.innerHTML = '<p class="text-muted">データがありません</p>';
            return;
        }

        container.innerHTML = recent.map(exp => this.createExpenseItemHTML(exp, false)).join('');
    }

    // ========================================
    // 支出記録
    // ========================================

    /**
     * 支出追加を処理
     */
    handleAddExpense() {
        const form = document.getElementById('expenseForm');
        const formData = new FormData(form);

        const expenseData = {
            date: document.getElementById('expenseDate').value,
            category: document.getElementById('expenseCategory').value,
            amount: document.getElementById('expenseAmount').value,
            memo: document.getElementById('expenseMemo').value
        };

        // バリデーション
        if (!expenseData.date || !expenseData.category || !expenseData.amount) {
            Utils.showToast('必須項目を入力してください', 'warning');
            return;
        }

        if (expenseData.amount <= 0) {
            Utils.showToast('金額は0より大きい必要があります', 'warning');
            return;
        }

        // 支出を追加
        const newExpense = this.storage.addExpense(expenseData);
        this.expenses.push(newExpense);

        Utils.showToast('支出を記録しました', 'success');

        // フォームをリセット
        form.reset();
        document.getElementById('memoCount').textContent = '0';
        this.setTodayDate();

        // ダッシュボードを更新
        if (this.currentView === 'dashboard') {
            this.renderDashboard();
        }
    }

    // ========================================
    // 支出一覧
    // ========================================

    /**
     * 支出一覧を描画
     * @param {Array} expenses - 表示する支出データ（省略時は全件）
     */
    renderExpenseList(expenses = null) {
        const container = document.getElementById('expenseList');
        const countElement = document.getElementById('listCount');

        if (!container) return;

        const displayExpenses = expenses || this.expenses;
        const sorted = Utils.sortByDate(displayExpenses, 'date');

        // 件数表示
        if (countElement) {
            countElement.textContent = `${sorted.length}件`;
        }

        if (sorted.length === 0) {
            container.innerHTML = '<p class="text-muted">データがありません</p>';
            return;
        }

        container.innerHTML = sorted.map(exp => this.createExpenseItemHTML(exp, true)).join('');

        // 削除ボタンのイベント設定
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.deleteExpense(id);
            });
        });
    }

    /**
     * 支出アイテムのHTMLを生成
     * @param {Object} expense - 支出データ
     * @param {boolean} showActions - アクションボタンを表示するか
     * @returns {string}
     */
    createExpenseItemHTML(expense, showActions = false) {
        const categoryInfo = Utils.getCategoryInfo(expense.category);
        const color = Utils.getCategoryColor(expense.category);

        return `
            <div class="expense-item">
                <div class="expense-icon" style="background-color: ${color};">
                    ${categoryInfo ? categoryInfo.icon : '📦'}
                </div>
                <div class="expense-details">
                    <div class="expense-category">${expense.category}</div>
                    <div class="expense-memo">${Utils.sanitizeInput(expense.memo || '—')}</div>
                </div>
                <div class="expense-meta">
                    <div class="expense-amount">${Utils.formatCurrency(expense.amount)}</div>
                    <div class="expense-date">${Utils.formatDate(expense.date, 'YYYY年MM月DD日')}</div>
                </div>
                ${showActions ? `
                    <div class="expense-actions">
                        <button class="btn-delete" data-id="${expense.id}" title="削除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 支出を削除
     * @param {string} id - 支出ID
     */
    deleteExpense(id) {
        if (!Utils.confirm('この支出を削除しますか？')) {
            return;
        }

        if (this.storage.deleteExpense(id)) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            Utils.showToast('支出を削除しました', 'success');
            this.renderCurrentView();
        } else {
            Utils.showToast('削除に失敗しました', 'error');
        }
    }

    // ========================================
    // フィルター・検索
    // ========================================

    /**
     * フィルターを適用
     */
    applyFilters() {
        const startDate = document.getElementById('filterStartDate').value;
        const endDate = document.getElementById('filterEndDate').value;
        const category = document.getElementById('filterCategory').value;

        let filtered = [...this.expenses];

        if (startDate) {
            filtered = filtered.filter(exp => exp.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(exp => exp.date <= endDate);
        }
        if (category) {
            filtered = filtered.filter(exp => exp.category === category);
        }

        this.renderExpenseList(filtered);
        Utils.showToast(`${filtered.length}件の支出が見つかりました`, 'success');
    }

    /**
     * フィルターをクリア
     */
    clearFilters() {
        document.getElementById('filterStartDate').value = '';
        document.getElementById('filterEndDate').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('searchQuery').value = '';
        this.renderExpenseList();
    }

    /**
     * メモで検索
     * @param {string} query - 検索クエリ
     */
    searchExpenses(query) {
        if (!query.trim()) {
            this.renderExpenseList();
            return;
        }

        const filtered = this.expenses.filter(exp =>
            exp.memo.toLowerCase().includes(query.toLowerCase())
        );

        this.renderExpenseList(filtered);
    }

    // ========================================
    // カテゴリ別集計
    // ========================================

    /**
     * 分析ページを描画
     */
    renderAnalytics() {
        this.updateAnalyticsByPeriod(this.currentPeriod);
    }

    /**
     * 期間を変更
     * @param {string} period - 期間（week, month, lastMonth, custom）
     */
    changePeriod(period) {
        this.currentPeriod = period;

        // ボタンのアクティブ状態を更新
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`)?.classList.add('active');

        // カスタム期間の表示/非表示
        const customPeriod = document.getElementById('customPeriod');
        if (customPeriod) {
            customPeriod.style.display = period === 'custom' ? 'block' : 'none';
        }

        if (period !== 'custom') {
            this.updateAnalyticsByPeriod(period);
        }
    }

    /**
     * カスタム期間を適用
     */
    applyCustomPeriod() {
        const startDate = document.getElementById('analyticsStartDate').value;
        const endDate = document.getElementById('analyticsEndDate').value;

        if (!startDate || !endDate) {
            Utils.showToast('期間を入力してください', 'warning');
            return;
        }

        const expenses = this.getExpensesByPeriod(startDate, endDate);
        this.renderCategoryAnalytics(expenses);
    }

    /**
     * 期間に応じて分析を更新
     * @param {string} period - 期間
     */
    updateAnalyticsByPeriod(period) {
        let range;

        switch (period) {
            case 'week':
                range = Utils.getThisWeekRange();
                break;
            case 'month':
                range = Utils.getThisMonthRange();
                break;
            case 'lastMonth':
                range = Utils.getLastMonthRange();
                break;
            default:
                range = Utils.getThisMonthRange();
        }

        const expenses = this.getExpensesByPeriod(range.start, range.end);
        this.renderCategoryAnalytics(expenses);
    }

    /**
     * カテゴリ別分析を描画
     * @param {Array} expenses - 支出データ
     */
    renderCategoryAnalytics(expenses) {
        const categoryData = this.calculateCategorySummary(expenses);

        // 円グラフ
        this.chartManager.createCategoryPieChart('pieChart', categoryData);

        // 棒グラフ
        this.chartManager.createCategoryBarChart('barChart', categoryData);

        // カテゴリ詳細
        this.renderCategorySummary(categoryData, this.calculateTotal(expenses));
    }

    /**
     * カテゴリ詳細を描画
     * @param {Object} categoryData - カテゴリ別データ
     * @param {number} total - 合計
     */
    renderCategorySummary(categoryData, total) {
        const container = document.getElementById('categorySummary');
        if (!container) return;

        const sorted = Object.entries(categoryData).sort((a, b) => b[1] - a[1]);

        container.innerHTML = sorted.map(([category, amount]) => {
            const categoryInfo = Utils.getCategoryInfo(category);
            const percent = Utils.calculatePercentage(amount, total);
            const color = Utils.getCategoryColor(category);

            return `
                <div class="category-item">
                    <div class="expense-icon" style="background-color: ${color};">
                        ${categoryInfo ? categoryInfo.icon : '📦'}
                    </div>
                    <div style="flex: 1;">
                        <div class="category-name">${category}</div>
                        <div class="category-amount">${Utils.formatCurrency(amount)}</div>
                        <div class="category-percent">${percent}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // 予算管理
    // ========================================

    /**
     * 予算ページを描画
     */
    renderBudget() {
        // 現在の予算を表示
        const budgetInput = document.getElementById('monthlyBudget');
        if (budgetInput) {
            budgetInput.value = this.settings.monthlyBudget || '';
        }

        this.renderBudgetStatus();
    }

    /**
     * 予算を保存
     */
    saveBudget() {
        const budget = parseInt(document.getElementById('monthlyBudget').value);

        if (isNaN(budget) || budget < 0) {
            Utils.showToast('正しい金額を入力してください', 'warning');
            return;
        }

        this.storage.updateSettings({ monthlyBudget: budget });
        this.settings.monthlyBudget = budget;

        Utils.showToast('予算を設定しました', 'success');
        this.renderBudgetStatus();
        this.renderDashboard();
    }

    /**
     * 予算状況を描画
     */
    renderBudgetStatus() {
        const container = document.getElementById('budgetStatus');
        if (!container) return;

        const budget = this.settings.monthlyBudget;

        if (!budget || budget === 0) {
            container.innerHTML = '<p class="text-muted">予算を設定してください</p>';
            return;
        }

        const thisMonth = Utils.getThisMonthRange();
        const expenses = this.getExpensesByPeriod(thisMonth.start, thisMonth.end);
        const total = this.calculateTotal(expenses);
        const remaining = budget - total;
        const usagePercent = Utils.calculatePercentage(total, budget);

        const statusColor = usagePercent > 100 ? '#EF4444' : usagePercent > 80 ? '#F59E0B' : '#10B981';

        container.innerHTML = `
            <div class="stat-card" style="border-left: 4px solid ${statusColor};">
                <div class="stat-content">
                    <p class="stat-label">月間予算</p>
                    <h3 class="stat-value">${Utils.formatCurrency(budget)}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-content">
                    <p class="stat-label">使用額</p>
                    <h3 class="stat-value">${Utils.formatCurrency(total)}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-content">
                    <p class="stat-label">残高</p>
                    <h3 class="stat-value" style="color: ${remaining >= 0 ? '#10B981' : '#EF4444'};">
                        ${Utils.formatCurrency(remaining)}
                    </h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-content">
                    <p class="stat-label">使用率</p>
                    <h3 class="stat-value">${usagePercent}%</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(usagePercent, 100)}%; background-color: ${statusColor};"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // ========================================
    // ヘルパーメソッド
    // ========================================

    /**
     * 期間で支出をフィルター
     * @param {string} startDate - 開始日
     * @param {string} endDate - 終了日
     * @returns {Array}
     */
    getExpensesByPeriod(startDate, endDate) {
        return this.expenses.filter(exp =>
            exp.date >= startDate && exp.date <= endDate
        );
    }

    /**
     * カテゴリ別集計を計算
     * @param {Array} expenses - 支出データ
     * @returns {Object}
     */
    calculateCategorySummary(expenses) {
        const summary = {};

        expenses.forEach(exp => {
            if (!summary[exp.category]) {
                summary[exp.category] = 0;
            }
            summary[exp.category] += exp.amount;
        });

        return summary;
    }

    /**
     * 合計金額を計算
     * @param {Array} expenses - 支出データ
     * @returns {number}
     */
    calculateTotal(expenses) {
        return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    /**
     * カテゴリ選択肢を設定
     */
    populateCategorySelects() {
        const selects = [
            document.getElementById('expenseCategory'),
            document.getElementById('filterCategory')
        ];

        selects.forEach(select => {
            if (!select) return;

            const isFilter = select.id === 'filterCategory';
            const options = CONFIG.CATEGORIES.map(cat =>
                `<option value="${cat.name}">${cat.icon} ${cat.name}</option>`
            ).join('');

            if (isFilter) {
                select.innerHTML = '<option value="">すべて</option>' + options;
            } else {
                select.innerHTML = '<option value="">選択してください</option>' + options;
            }
        });
    }

    /**
     * 今日の日付を設定
     */
    setTodayDate() {
        const dateInput = document.getElementById('expenseDate');
        if (dateInput) {
            dateInput.value = Utils.getTodayDate();
        }
    }

    /**
     * ダークモードを切り替え
     */
    toggleDarkMode() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        this.storage.updateSettings({ darkMode: newTheme === 'dark' });

        Utils.showToast(
            newTheme === 'dark' ? 'ダークモードをONにしました' : 'ライトモードに切り替えました',
            'success'
        );
    }

    /**
     * テーマを適用
     */
    applyTheme() {
        const html = document.documentElement;
        const theme = this.settings.darkMode ? 'dark' : 'light';
        html.setAttribute('data-theme', theme);
    }

    /**
     * Spreadsheetに同期
     */
    async syncToSpreadsheet() {
        const result = await this.gasAPI.syncToSpreadsheet(this.expenses);
        // 結果はGASAPIClient内で処理済み
    }

    /**
     * ファイルインポートを処理
     * @param {File} file - インポートするファイル
     */
    async handleImport(file) {
        if (!file) return;

        try {
            const success = await this.storage.importFromFile(file);
            if (success) {
                this.loadData();
                this.renderCurrentView();
            }
        } catch (error) {
            console.error('インポートエラー:', error);
        }
    }
}

// ========================================
// アプリケーション起動
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ExpenseApp();
});
