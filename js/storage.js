// ========================================
// Storage Manager Class
// localStorage管理を担当
// ========================================

class StorageManager {
    constructor() {
        this.STORAGE_KEYS = CONFIG.STORAGE_KEYS;
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        // 設定が存在しない場合、デフォルト設定を保存
        if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
            this.saveSettings(CONFIG.DEFAULT_SETTINGS);
        }

        // 支出データが存在しない場合、空配列を保存
        if (!localStorage.getItem(this.STORAGE_KEYS.EXPENSES)) {
            this.saveExpenses([]);
        }
    }

    // ========================================
    // 支出データ操作
    // ========================================

    /**
     * 支出データを読み込む
     * @returns {Array}
     */
    loadExpenses() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.EXPENSES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('支出データの読み込みエラー:', error);
            return [];
        }
    }

    /**
     * 支出データを保存する
     * @param {Array} expenses - 支出データ配列
     */
    saveExpenses(expenses) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        } catch (error) {
            console.error('支出データの保存エラー:', error);
            Utils.showToast('データの保存に失敗しました', 'error');
        }
    }

    /**
     * 支出を追加する
     * @param {Object} expenseData - 支出データ
     * @returns {Object} - 追加された支出データ
     */
    addExpense(expenseData) {
        const expenses = this.loadExpenses();

        const newExpense = {
            id: Utils.generateId(),
            date: expenseData.date,
            category: expenseData.category,
            amount: parseInt(expenseData.amount),
            memo: Utils.sanitizeInput(expenseData.memo || ''),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        expenses.push(newExpense);
        this.saveExpenses(expenses);

        return newExpense;
    }

    /**
     * 支出を更新する
     * @param {string} id - 支出ID
     * @param {Object} updates - 更新データ
     * @returns {boolean}
     */
    updateExpense(id, updates) {
        const expenses = this.loadExpenses();
        const index = expenses.findIndex(exp => exp.id === id);

        if (index === -1) {
            return false;
        }

        expenses[index] = {
            ...expenses[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveExpenses(expenses);
        return true;
    }

    /**
     * 支出を削除する
     * @param {string} id - 支出ID
     * @returns {boolean}
     */
    deleteExpense(id) {
        const expenses = this.loadExpenses();
        const filtered = expenses.filter(exp => exp.id !== id);

        if (filtered.length === expenses.length) {
            return false;
        }

        this.saveExpenses(filtered);
        return true;
    }

    /**
     * IDで支出を取得する
     * @param {string} id - 支出ID
     * @returns {Object|null}
     */
    getExpenseById(id) {
        const expenses = this.loadExpenses();
        return expenses.find(exp => exp.id === id) || null;
    }

    // ========================================
    // 設定操作
    // ========================================

    /**
     * 設定を読み込む
     * @returns {Object}
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : CONFIG.DEFAULT_SETTINGS;
        } catch (error) {
            console.error('設定の読み込みエラー:', error);
            return CONFIG.DEFAULT_SETTINGS;
        }
    }

    /**
     * 設定を保存する
     * @param {Object} settings - 設定データ
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('設定の保存エラー:', error);
        }
    }

    /**
     * 設定を更新する
     * @param {Object} updates - 更新する設定
     */
    updateSettings(updates) {
        const settings = this.loadSettings();
        const newSettings = { ...settings, ...updates };
        this.saveSettings(newSettings);
    }

    // ========================================
    // データ管理
    // ========================================

    /**
     * CSVファイルとしてエクスポート
     */
    exportToCSV() {
        const expenses = this.loadExpenses();
        if (expenses.length === 0) {
            Utils.showToast('エクスポートするデータがありません', 'warning');
            return;
        }

        const csv = Utils.generateCSV(expenses);
        const filename = `expenses_${Utils.formatDate(new Date(), 'YYYY-MM-DD')}.csv`;
        Utils.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
        Utils.showToast('CSVファイルをエクスポートしました', 'success');
    }

    /**
     * JSONファイルとしてエクスポート
     */
    exportToJSON() {
        const expenses = this.loadExpenses();
        if (expenses.length === 0) {
            Utils.showToast('エクスポートするデータがありません', 'warning');
            return;
        }

        const json = Utils.generateJSON(expenses);
        const filename = `expenses_${Utils.formatDate(new Date(), 'YYYY-MM-DD')}.json`;
        Utils.downloadFile(json, filename, 'application/json');
        Utils.showToast('JSONファイルをエクスポートしました', 'success');
    }

    /**
     * ファイルからインポート
     * @param {File} file - インポートするファイル
     */
    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    let importedData = [];

                    if (file.name.endsWith('.json')) {
                        importedData = JSON.parse(content);
                    } else if (file.name.endsWith('.csv')) {
                        // CSV解析（簡易版）
                        const lines = content.split('\n');
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;

                            const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, ''));
                            if (values.length >= 4) {
                                importedData.push({
                                    id: Utils.generateId(),
                                    date: values[0],
                                    category: values[1],
                                    amount: parseInt(values[2]),
                                    memo: values[3] || '',
                                    createdAt: values[4] || new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                });
                            }
                        }
                    }

                    if (importedData.length === 0) {
                        Utils.showToast('インポートするデータがありません', 'warning');
                        resolve(false);
                        return;
                    }

                    // 既存データとマージ
                    const expenses = this.loadExpenses();
                    const merged = [...expenses, ...importedData];
                    this.saveExpenses(merged);

                    Utils.showToast(`${importedData.length}件のデータをインポートしました`, 'success');
                    resolve(true);
                } catch (error) {
                    console.error('インポートエラー:', error);
                    Utils.showToast('ファイルの読み込みに失敗しました', 'error');
                    reject(error);
                }
            };

            reader.onerror = () => {
                Utils.showToast('ファイルの読み込みに失敗しました', 'error');
                reject(new Error('File read error'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * すべてのデータを削除
     */
    clearAll() {
        if (Utils.confirm('本当にすべてのデータを削除しますか？\nこの操作は取り消せません。')) {
            if (Utils.confirm('最終確認：すべての支出データが完全に削除されます。よろしいですか？')) {
                this.saveExpenses([]);
                Utils.showToast('すべてのデータを削除しました', 'success');
                return true;
            }
        }
        return false;
    }

    /**
     * 同期設定を読み込む
     * @returns {Object}
     */
    loadSyncConfig() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SYNC_CONFIG);
            return data ? JSON.parse(data) : {
                spreadsheetId: '',
                sheetName: 'Expenses',
                lastSyncTime: null,
                syncEnabled: false
            };
        } catch (error) {
            console.error('同期設定の読み込みエラー:', error);
            return null;
        }
    }

    /**
     * 同期設定を保存する
     * @param {Object} config - 同期設定
     */
    saveSyncConfig(config) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SYNC_CONFIG, JSON.stringify(config));
        } catch (error) {
            console.error('同期設定の保存エラー:', error);
        }
    }
}

// グローバルアクセス可能にする
window.StorageManager = StorageManager;
