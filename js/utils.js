// ========================================
// Utility Functions
// ========================================

const Utils = {
    /**
     * 通貨フォーマット
     * @param {number} amount - 金額
     * @returns {string} - フォーマットされた金額 (例: "¥1,000")
     */
    formatCurrency(amount) {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount) || 0;
        }
        return '¥' + amount.toLocaleString('ja-JP');
    },

    /**
     * 日付フォーマット
     * @param {string|Date} date - 日付
     * @param {string} format - フォーマット形式
     * @returns {string} - フォーマットされた日付
     */
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        if (format === 'YYYY年MM月DD日') {
            return `${year}年${month}月${day}日`;
        }
        return `${year}-${month}-${day}`;
    },

    /**
     * 今日の日付を取得（YYYY-MM-DD形式）
     * @returns {string}
     */
    getTodayDate() {
        return this.formatDate(new Date(), 'YYYY-MM-DD');
    },

    /**
     * 今月の開始日と終了日を取得
     * @returns {Object} - { start, end }
     */
    getThisMonthRange() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            start: this.formatDate(start),
            end: this.formatDate(end)
        };
    },

    /**
     * 先月の開始日と終了日を取得
     * @returns {Object} - { start, end }
     */
    getLastMonthRange() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
            start: this.formatDate(start),
            end: this.formatDate(end)
        };
    },

    /**
     * 今週の開始日と終了日を取得
     * @returns {Object} - { start, end }
     */
    getThisWeekRange() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        const end = new Date(now);
        end.setDate(now.getDate() + (6 - dayOfWeek));
        return {
            start: this.formatDate(start),
            end: this.formatDate(end)
        };
    },

    /**
     * XSS対策のための入力サニタイズ
     * @param {string} input - サニタイズする文字列
     * @returns {string} - サニタイズされた文字列
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * デバウンス処理
     * @param {Function} func - 実行する関数
     * @param {number} delay - 遅延時間（ミリ秒）
     * @returns {Function}
     */
    debounce(func, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * スロットル処理
     * @param {Function} func - 実行する関数
     * @param {number} limit - 制限時間（ミリ秒）
     * @returns {Function}
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * トースト通知を表示
     * @param {string} message - メッセージ
     * @param {string} type - 通知タイプ ('success', 'error', 'warning')
     * @param {number} duration - 表示時間（ミリ秒）
     */
    showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = {
            success: '✓',
            error: '✕',
            warning: '⚠'
        }[type] || '✓';

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icon}</span>
            <span>${this.sanitizeInput(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * ローディングスピナーを表示
     */
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'flex';
        }
    },

    /**
     * ローディングスピナーを非表示
     */
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    },

    /**
     * ユニークIDを生成（タイムスタンプベース）
     * @returns {string}
     */
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    /**
     * 確認ダイアログを表示
     * @param {string} message - メッセージ
     * @returns {boolean}
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * パーセンテージを計算
     * @param {number} value - 値
     * @param {number} total - 合計
     * @returns {number}
     */
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    /**
     * 配列を日付でソート（新しい順）
     * @param {Array} arr - ソートする配列
     * @param {string} dateKey - 日付のキー
     * @returns {Array}
     */
    sortByDate(arr, dateKey = 'date') {
        return arr.sort((a, b) => {
            const dateA = new Date(a[dateKey]);
            const dateB = new Date(b[dateKey]);
            return dateB - dateA;
        });
    },

    /**
     * CSVデータを生成
     * @param {Array} expenses - 支出データ配列
     * @returns {string} - CSV文字列
     */
    generateCSV(expenses) {
        const headers = ['日付', 'カテゴリ', '金額', 'メモ', '作成日時'];
        const rows = expenses.map(exp => [
            exp.date,
            exp.category,
            exp.amount,
            exp.memo || '',
            exp.createdAt
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        // BOM付きUTF-8（Excelで文字化け防止）
        return '\ufeff' + csvContent;
    },

    /**
     * JSONデータを生成
     * @param {Array} expenses - 支出データ配列
     * @returns {string} - JSON文字列
     */
    generateJSON(expenses) {
        return JSON.stringify(expenses, null, 2);
    },

    /**
     * ファイルをダウンロード
     * @param {string} content - ファイル内容
     * @param {string} filename - ファイル名
     * @param {string} mimeType - MIMEタイプ
     */
    downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * カテゴリ情報を取得
     * @param {string} categoryName - カテゴリ名
     * @returns {Object|null}
     */
    getCategoryInfo(categoryName) {
        return CONFIG.CATEGORIES.find(cat => cat.name === categoryName) || null;
    },

    /**
     * カテゴリの色を取得（ダークモード対応）
     * @param {string} categoryName - カテゴリ名
     * @returns {string}
     */
    getCategoryColor(categoryName) {
        const category = this.getCategoryInfo(categoryName);
        if (!category) return '#6B7280';

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark ? category.darkColor : category.color;
    }
};

// グローバルアクセス可能にする
window.Utils = Utils;
