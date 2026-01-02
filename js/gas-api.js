// ========================================
// Google Apps Script API Client
// Google Spreadsheet連携を管理
// ========================================

class GASAPIClient {
    constructor() {
        this.webAppUrl = CONFIG.GAS_WEB_APP_URL;
        this.spreadsheetId = CONFIG.SPREADSHEET_ID;
    }

    /**
     * Spreadsheetに同期
     * @param {Array} expenses - 支出データ配列
     * @returns {Promise}
     */
    async syncToSpreadsheet(expenses) {
        if (!this.webAppUrl) {
            Utils.showToast('Google Apps Scriptが設定されていません', 'warning');
            return { success: false, message: 'GAS URL not configured' };
        }

        Utils.showLoading();

        try {
            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'sync',
                    data: expenses,
                    spreadsheetId: this.spreadsheetId
                })
            });

            const result = await response.json();
            Utils.hideLoading();

            if (result.success) {
                Utils.showToast('Spreadsheetに同期しました', 'success');

                // 同期時刻を記録
                const storage = new StorageManager();
                const syncConfig = storage.loadSyncConfig();
                syncConfig.lastSyncTime = new Date().toISOString();
                storage.saveSyncConfig(syncConfig);
            } else {
                Utils.showToast(`同期エラー: ${result.message}`, 'error');
            }

            return result;
        } catch (error) {
            Utils.hideLoading();
            console.error('同期エラー:', error);
            Utils.showToast('Spreadsheetへの同期に失敗しました', 'error');
            return { success: false, message: error.message };
        }
    }

    /**
     * Spreadsheetからデータを取得
     * @returns {Promise}
     */
    async fetchFromSpreadsheet() {
        if (!this.webAppUrl) {
            Utils.showToast('Google Apps Scriptが設定されていません', 'warning');
            return { success: false, message: 'GAS URL not configured' };
        }

        Utils.showLoading();

        try {
            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'fetch',
                    spreadsheetId: this.spreadsheetId
                })
            });

            const result = await response.json();
            Utils.hideLoading();

            if (result.success) {
                Utils.showToast('Spreadsheetからデータを取得しました', 'success');
            } else {
                Utils.showToast(`取得エラー: ${result.message}`, 'error');
            }

            return result;
        } catch (error) {
            Utils.hideLoading();
            console.error('取得エラー:', error);
            Utils.showToast('Spreadsheetからのデータ取得に失敗しました', 'error');
            return { success: false, message: error.message };
        }
    }

    /**
     * 接続テスト
     * @returns {Promise}
     */
    async testConnection() {
        if (!this.webAppUrl) {
            Utils.showToast('Google Apps Scriptが設定されていません', 'warning');
            return false;
        }

        Utils.showLoading();

        try {
            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'test'
                })
            });

            const result = await response.json();
            Utils.hideLoading();

            if (result.success) {
                Utils.showToast('接続テスト成功', 'success');
                return true;
            } else {
                Utils.showToast('接続テスト失敗', 'error');
                return false;
            }
        } catch (error) {
            Utils.hideLoading();
            console.error('接続エラー:', error);
            Utils.showToast('接続テストに失敗しました', 'error');
            return false;
        }
    }
}

// グローバルアクセス可能にする
window.GASAPIClient = GASAPIClient;
