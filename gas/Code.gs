// ========================================
// Google Apps Script - Backend
// Spreadsheet連携用サーバーレスバックエンド
// ========================================

// 設定（デプロイ時に変更してください）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Expenses';

/**
 * Web Appエンドポイント
 * @param {Object} e - イベントオブジェクト
 * @returns {TextOutput} - JSON応答
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    switch(data.action) {
      case 'sync':
        return syncExpenses(data.data);
      case 'fetch':
        return fetchExpenses();
      case 'test':
        return testConnection();
      default:
        return createErrorResponse('Unknown action');
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createErrorResponse(error.toString());
  }
}

/**
 * GET リクエスト処理（テスト用）
 */
function doGet() {
  return ContentService
    .createTextOutput('Expense Tracker Backend is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Spreadsheetに支出データを同期
 * @param {Array} expenses - 支出データ配列
 * @returns {TextOutput}
 */
function syncExpenses(expenses) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
    // シートをクリア
    sheet.clear();
    
    // ヘッダー行を設定
    const headers = ['ID', '日付', 'カテゴリ', '金額', 'メモ', '作成日時', '更新日時'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // ヘッダーのスタイル設定
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4F46E5');
    headerRange.setFontColor('#FFFFFF');
    
    // データがない場合は終了
    if (!expenses || expenses.length === 0) {
      return createSuccessResponse('No data to sync');
    }
    
    // データ行を作成
    const rows = expenses.map(exp => [
      exp.id || '',
      exp.date || '',
      exp.category || '',
      exp.amount || 0,
      exp.memo || '',
      exp.createdAt || '',
      exp.updatedAt || ''
    ]);
    
    // データを書き込み
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    // 列幅を自動調整
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // 金額列の数値フォーマット
    if (rows.length > 0) {
      sheet.getRange(2, 4, rows.length, 1).setNumberFormat('¥#,##0');
    }
    
    return createSuccessResponse(`Synced ${expenses.length} expenses successfully`);
  } catch (error) {
    Logger.log('Sync error: ' + error.toString());
    return createErrorResponse('Sync failed: ' + error.toString());
  }
}

/**
 * Spreadsheetから支出データを取得
 * @returns {TextOutput}
 */
function fetchExpenses() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createSuccessResponse('No data found', []);
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return createSuccessResponse('No data found', []);
    }
    
    const range = sheet.getRange(2, 1, lastRow - 1, 7);
    const values = range.getValues();
    
    const expenses = values.map(row => ({
      id: row[0],
      date: row[1],
      category: row[2],
      amount: row[3],
      memo: row[4],
      createdAt: row[5],
      updatedAt: row[6]
    }));
    
    return createSuccessResponse('Fetched successfully', expenses);
  } catch (error) {
    Logger.log('Fetch error: ' + error.toString());
    return createErrorResponse('Fetch failed: ' + error.toString());
  }
}

/**
 * 接続テスト
 * @returns {TextOutput}
 */
function testConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = ss.getName();
    
    return createSuccessResponse(`Connected to: ${sheetName}`);
  } catch (error) {
    Logger.log('Connection test error: ' + error.toString());
    return createErrorResponse('Connection failed: ' + error.toString());
  }
}

/**
 * 成功レスポンスを作成
 * @param {string} message - メッセージ
 * @param {*} data - データ
 * @returns {TextOutput}
 */
function createSuccessResponse(message, data = null) {
  const response = {
    success: true,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * エラーレスポンスを作成
 * @param {string} message - エラーメッセージ
 * @returns {TextOutput}
 */
function createErrorResponse(message) {
  const response = {
    success: false,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
