// ========================================
// Chart Manager Class
// Chart.jsを使用したグラフ描画を管理
// ========================================

class ChartManager {
    constructor() {
        this.charts = {}; // Chart.jsインスタンスを保持
    }

    /**
     * カテゴリ別円グラフを作成
     * @param {string} canvasId - Canvasエレメン ID
     * @param {Object} categoryData - カテゴリ別データ { categoryName: amount }
     */
    createCategoryPieChart(canvasId, categoryData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // 既存のチャートを破棄
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);
        const colors = labels.map(cat => Utils.getCategoryColor(cat));

        this.charts[canvasId] = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels.map(cat => {
                    const info = Utils.getCategoryInfo(cat);
                    return info ? `${info.icon} ${cat}` : cat;
                }),
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${Utils.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * カテゴリ別棒グラフを作成
     * @param {string} canvasId - CanvasエレメントID
     * @param {Object} categoryData - カテゴリ別データ
     */
    createCategoryBarChart(canvasId, categoryData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // 既存のチャートを破棄
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);
        const colors = labels.map(cat => Utils.getCategoryColor(cat));

        this.charts[canvasId] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels.map(cat => {
                    const info = Utils.getCategoryInfo(cat);
                    return info ? `${info.icon} ${cat}` : cat;
                }),
                datasets: [{
                    label: '支出金額',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Roboto Mono',
                                size: 11
                            },
                            callback: function (value) {
                                return Utils.formatCurrency(value);
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `支出: ${Utils.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * 月別推移グラフを作成（将来の拡張用）
     * @param {string} canvasId - CanvasエレメントID
     * @param {Array} monthlyData - 月別データ配列
     */
    createMonthlyTrendChart(canvasId, monthlyData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // 既存のチャートを破棄
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = monthlyData.map(item => item.month);
        const data = monthlyData.map(item => item.total);

        this.charts[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '月別支出',
                    data: data,
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#4F46E5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Roboto Mono',
                                size: 11
                            },
                            callback: function (value) {
                                return Utils.formatCurrency(value);
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `支出: ${Utils.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * チャートを更新
     * @param {string} chartId - チャートID
     * @param {Object} newData - 新しいデータ
     */
    updateChart(chartId, newData) {
        const chart = this.charts[chartId];
        if (!chart) return;

        if (newData.labels) {
            chart.data.labels = newData.labels;
        }
        if (newData.data) {
            chart.data.datasets[0].data = newData.data;
        }
        if (newData.colors) {
            chart.data.datasets[0].backgroundColor = newData.colors;
        }

        chart.update();
    }

    /**
     * チャートを破棄
     * @param {string} chartId - チャートID
     */
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    /**
     * すべてのチャートを破棄
     */
    destroyAll() {
        Object.keys(this.charts).forEach(chartId => {
            this.destroyChart(chartId);
        });
    }
}

// グローバルアクセス可能にする
window.ChartManager = ChartManager;
