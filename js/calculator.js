// ========================================
// Calculator Feature Module
// ========================================

/**
 * Calculator クラス
 * 金額入力フィールドに計算機能を追加
 */
class Calculator {
    /**
     * コンストラクタ
     * @param {HTMLInputElement} inputElement - 金額入力フィールド
     */
    constructor(inputElement) {
        this.input = inputElement;
        this.previewElement = document.getElementById('calculatorPreview');
        this.previewValue = document.getElementById('previewValue');
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        if (!this.input || !this.previewElement || !this.previewValue) {
            console.warn('Calculator: Required elements not found');
            return;
        }

        // リアルタイムプレビュー
        this.input.addEventListener('input', () => this.updatePreview());
        
        // Enter キーで計算実行
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calculate();
            }
        });
        
        // フォーカスアウト時に計算
        this.input.addEventListener('blur', () => this.calculate());
        
        // 電卓ボタン（ツールチップ表示）
        const calcBtn = document.getElementById('calculatorBtn');
        if (calcBtn) {
            calcBtn.addEventListener('click', () => this.showHelp());
            
            // Bootstrap tooltip 初期化
            if (typeof bootstrap !== 'undefined') {
                new bootstrap.Tooltip(calcBtn);
            }
        }
    }

    /**
     * 計算式を安全に評価
     * @param {string} expression - 計算式
     * @returns {number|null} 計算結果（エラー時はnull）
     */
    evaluate(expression) {
        try {
            // セキュリティ: 数字と演算子のみ許可
            const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
            if (!sanitized || sanitized.trim() === '') return null;
            
            // Function コンストラクタを使用（eval より安全）
            const result = Function('"use strict"; return (' + sanitized + ')')();
            
            // 結果の検証
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                return Math.round(result); // 整数に丸める
            }
            return null;
        } catch (error) {
            console.debug('Calculator: Evaluation error:', error);
            return null;
        }
    }

    /**
     * プレビュー更新
     */
    updatePreview() {
        const value = this.input.value.trim();
        
        // 数式が含まれているかチェック
        if (/[+\-*/()]/.test(value)) {
            const result = this.evaluate(value);
            
            if (result !== null && result > 0) {
                this.previewValue.textContent = Utils.formatCurrency(result);
                this.previewElement.style.display = 'block';
                this.previewElement.classList.remove('error');
                this.previewElement.classList.add('text-success');
            } else {
                this.previewValue.textContent = '計算エラー';
                this.previewElement.style.display = 'block';
                this.previewElement.classList.remove('text-success');
                this.previewElement.classList.add('error');
            }
        } else {
            this.previewElement.style.display = 'none';
        }
    }

    /**
     * 計算実行
     */
    calculate() {
        const value = this.input.value.trim();
        
        // 計算式が含まれている場合のみ処理
        if (/[+\-*/()]/.test(value)) {
            const result = this.evaluate(value);
            
            if (result !== null && result > 0) {
                this.input.value = result;
                this.previewElement.style.display = 'none';
                
                // 成功トースト
                if (typeof Utils !== 'undefined' && Utils.showToast) {
                    Utils.showToast('✓ 計算完了: ' + Utils.formatCurrency(result), 'success');
                }
            } else {
                // エラートースト
                if (typeof Utils !== 'undefined' && Utils.showToast) {
                    Utils.showToast('⚠ 計算エラー: 正しい式を入力してください', 'error');
                }
            }
        }
    }

    /**
     * ヘルプメッセージ表示
     */
    showHelp() {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(
                '💡 計算式の使い方\n\n' +
                '• 加算: 800+500 → 1300\n' +
                '• 減算: 1000-200 → 800\n' +
                '• 乗算: 300*3 → 900\n' +
                '• 除算: 1000/2 → 500\n' +
                '• 複合: (500+300)*2 → 1600',
                'info'
            );
        }
    }
}

// グローバルスコープに公開（他のモジュールから使用可能）
window.Calculator = Calculator;
