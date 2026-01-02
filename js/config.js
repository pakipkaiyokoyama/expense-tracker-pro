// ========================================
// Application Configuration
// ========================================

const CONFIG = {
    // Application Info
    APP_VERSION: '1.0.0',
    APP_NAME: 'Expense Tracker Pro',
    
    // Categories Definition
    CATEGORIES: [
        { 
            name: '食費', 
            icon: '🍽️', 
            color: '#F59E0B',
            darkColor: '#FBBF24'
        },
        { 
            name: '交通費', 
            icon: '🚃', 
            color: '#3B82F6',
            darkColor: '#60A5FA'
        },
        { 
            name: '娯楽費', 
            icon: '🎮', 
            color: '#EF4444',
            darkColor: '#F87171'
        },
        { 
            name: '光熱費', 
            icon: '💡', 
            color: '#FBBF24',
            darkColor: '#FCD34D'
        },
        { 
            name: '通信費', 
            icon: '📱', 
            color: '#8B5CF6',
            darkColor: '#A78BFA'
        },
        { 
            name: '医療費', 
            icon: '🏥', 
            color: '#10B981',
            darkColor: '#34D399'
        },
        { 
            name: 'その他', 
            icon: '📦', 
            color: '#6B7280',
            darkColor: '#9CA3AF'
        }
    ],
    
    // Google Apps Script Configuration
    GAS_WEB_APP_URL: '', // 後で設定
    SPREADSHEET_ID: '',  // 後で設定
    
    // LocalStorage Keys
    STORAGE_KEYS: {
        EXPENSES: 'expenses',
        SETTINGS: 'settings',
        SYNC_CONFIG: 'syncConfig'
    },
    
    // Default Settings
    DEFAULT_SETTINGS: {
        darkMode: false,
        monthlyBudget: 0,
        categoryBudgets: {},
        autoSync: false,
        syncInterval: 300000, // 5分
        currency: 'JPY',
        dateFormat: 'YYYY-MM-DD'
    },
    
    // Date Formats
    DATE_FORMAT: {
        DISPLAY: 'YYYY年MM月DD日',
        INPUT: 'YYYY-MM-DD',
        STORAGE: 'YYYY-MM-DD'
    },
    
    // Limits
    MAX_MEMO_LENGTH: 200,
    RECENT_EXPENSES_COUNT: 5,
    TOP_CATEGORIES_COUNT: 3
};

// Make CONFIG globally accessible
window.CONFIG = CONFIG;
