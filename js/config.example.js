/**
 * 📁 config.example.js - Exemplo de configurações da API da Nuvemshop
 * 
 * ⚠️ IMPORTANTE: 
 * - Este é um arquivo de exemplo
 * - Copie para config.js e adicione suas credenciais reais
 * - Nunca compartilhe o config.js com credenciais reais
 */

// ===== CONFIGURAÇÕES DA API =====
const NUVERMSHOP_CONFIG = {
  // Suas credenciais da Nuvemshop
  STORE_ID: "SEU_STORE_ID_AQUI", // Substitua pelo seu Store ID
  ACCESS_TOKEN: "SEU_ACCESS_TOKEN_AQUI", // Substitua pelo seu Access Token
  
  // Configurações da API
  BASE_URL: "https://api.nuvemshop.com.br/v1",
  
  // Configurações de comissão
  COMISSAO_PADRAO: 10, // Porcentagem padrão de comissão
  
  // Configurações de cupons
  CUPOM_PREFIXO: "SHIR7", // Prefixo para cupons da sua loja
  CUPOM_VALIDADE_DIAS: 30, // Validade padrão dos cupons
  
  // Configurações de teste
  DEMO_MODE: false, // true para usar dados de teste
};

// ===== CONFIGURAÇÕES DO SISTEMA =====
const APP_CONFIG = {
  // Configurações gerais
  APP_NAME: "SHIR7 - Plataforma de Afiliados",
  APP_VERSION: "1.0.0",
  
  // Configurações de interface
  THEME: {
    PRIMARY_COLOR: "#0050c3",
    SECONDARY_COLOR: "#4b5fa0",
    SUCCESS_COLOR: "#28a745",
    WARNING_COLOR: "#ffc107",
    ERROR_COLOR: "#dc3545",
  },
  
  // Configurações de armazenamento
  STORAGE_KEYS: {
    USERS: "affiliate_users",
    ORDERS: "affiliate_orders",
    COMMISSIONS: "affiliate_commissions",
    SETTINGS: "app_settings",
  },
  
  // Configurações de paginação
  ITEMS_PER_PAGE: 10,
  
  // Configurações de notificações
  NOTIFICATION_DURATION: 5000, // 5 segundos
};

// ===== FUNÇÕES DE CONFIGURAÇÃO =====

// Carregar configurações salvas
function loadConfig() {
  const savedConfig = localStorage.getItem("nuvemshop_config");
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    Object.assign(NUVERMSHOP_CONFIG, config);
  }
}

// Salvar configurações
function saveConfig(config) {
  localStorage.setItem("nuvemshop_config", JSON.stringify(config));
  Object.assign(NUVERMSHOP_CONFIG, config);
}

// Verificar se API está configurada
function isApiConfigured() {
  return NUVERMSHOP_CONFIG.STORE_ID && NUVERMSHOP_CONFIG.ACCESS_TOKEN;
}

// Obter URL da API
function getApiUrl(endpoint = "") {
  return `${NUVERMSHOP_CONFIG.BASE_URL}/${NUVERMSHOP_CONFIG.STORE_ID}${endpoint}`;
}

// Obter headers da API
function getApiHeaders() {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${NUVERMSHOP_CONFIG.ACCESS_TOKEN}`,
  };
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  console.log("✅ Configurações carregadas");
  
  // Verificar se API está configurada
  if (isApiConfigured()) {
    console.log("✅ API configurada");
  } else {
    console.log("⚠️ API não configurada");
  }
});

// ===== EXPORTAÇÃO =====
window.NUVERMSHOP_CONFIG = NUVERMSHOP_CONFIG;
window.APP_CONFIG = APP_CONFIG;
window.loadConfig = loadConfig;
window.saveConfig = saveConfig;
window.isApiConfigured = isApiConfigured;
window.getApiUrl = getApiUrl;
window.getApiHeaders = getApiHeaders;
