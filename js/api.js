/**
 * 📁 api.js - Integração com API da Nuvemshop
 *
 * Este arquivo contém:
 * - Criação de cupons de desconto
 * - Consulta de pedidos
 * - Verificação de cupons
 * - Gestão de comissões
 */

// ===== CONFIGURAÇÕES DA API =====
const API_CONFIG = {
  BASE_URL: "https://api.nuvemshop.com.br/v1",
  ENDPOINTS: {
    DISCOUNT_COUPONS: "/discount_coupons",
    ORDERS: "/orders",
    PRODUCTS: "/products",
    STORE: "/store",
  },
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// ===== CLASSE PRINCIPAL DA API =====
class NuvemshopAPI {
  constructor() {
    this.storeId = null;
    this.accessToken = null;
    this.init();
  }

  init() {
    this.loadCredentials();
    this.setupEventListeners();
  }

  // Carregar credenciais salvas
  loadCredentials() {
    this.storeId = localStorage.getItem("nuvemshop_store_id");
    this.accessToken = localStorage.getItem("nuvemshop_token");
  }

  // Salvar credenciais
  saveCredentials(storeId, accessToken) {
    this.storeId = storeId;
    this.accessToken = accessToken;

    localStorage.setItem("nuvemshop_store_id", storeId);
    localStorage.setItem("nuvemshop_token", accessToken);
  }

  // Verificar se API está configurada
  isConfigured() {
    return this.storeId && this.accessToken;
  }

  // Configurar event listeners
  setupEventListeners() {
    // Configurar formulário de API se existir
    const apiConfigForm = document.getElementById("apiConfigForm");
    if (apiConfigForm) {
      apiConfigForm.addEventListener("submit", this.handleApiConfig.bind(this));
    }

    // Botão de teste da API
    const testApiBtn = document.getElementById("btnTestApi");
    if (testApiBtn) {
      testApiBtn.addEventListener("click", this.testApiConnection.bind(this));
    }
  }

  // Handler para configuração da API
  async handleApiConfig(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const storeId = formData.get("storeId");
    const accessToken = formData.get("accessToken");
    const comissaoPadrao = formData.get("comissaoPadrao");

    try {
      this.saveCredentials(storeId, accessToken);

      // Testar conexão
      const isValid = await this.testApiConnection();

      if (isValid) {
        Utils.showMessage("API configurada com sucesso!", "success");
        this.updateApiStatus("Conectado");
      } else {
        Utils.showMessage("Erro na configuração da API", "error");
        this.updateApiStatus("Erro na conexão");
      }
    } catch (error) {
      Utils.showMessage("Erro ao configurar API: " + error.message, "error");
      this.updateApiStatus("Erro na configuração");
    }
  }

  // Testar conexão com a API
  async testApiConnection() {
    if (!this.isConfigured()) {
      this.updateApiStatus("Não configurado");
      return false;
    }

    try {
      const response = await this.makeRequest("GET", "/store");

      if (response.ok) {
        const storeData = await response.json();
        this.updateApiStatus(`Conectado - ${storeData.name}`);
        return true;
      } else {
        this.updateApiStatus("Erro na conexão");
        return false;
      }
    } catch (error) {
      console.error("Erro ao testar API:", error);
      this.updateApiStatus("Erro na conexão");
      return false;
    }
  }

  // Atualizar status da API
  updateApiStatus(status) {
    const statusElement = document.getElementById("apiStatus");
    if (statusElement) {
      statusElement.textContent = status;
      statusElement.className = status.includes("Conectado")
        ? "success"
        : "error";
    }
  }

  // ===== CUPONS DE DESCONTO =====

  // Criar cupom de desconto
  async createDiscountCoupon(couponData) {
    const payload = {
      name: couponData.name,
      code: couponData.code,
      value: couponData.value,
      type: couponData.type || "percent",
      minimum_amount: couponData.minimumAmount || 0,
      usage_limit: couponData.usageLimit || 1000,
      expires_at: couponData.expiresAt || null,
    };

    try {
      const response = await this.makeRequest(
        "POST",
        "/discount_coupons",
        payload
      );

      if (response.ok) {
        const coupon = await response.json();
        console.log("✅ Cupom criado:", coupon);
        return coupon;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar cupom");
      }
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      throw error;
    }
  }

  // Listar cupons
  async listDiscountCoupons() {
    try {
      const response = await this.makeRequest("GET", "/discount_coupons");

      if (response.ok) {
        const coupons = await response.json();
        return coupons;
      } else {
        throw new Error("Erro ao listar cupons");
      }
    } catch (error) {
      console.error("Erro ao listar cupons:", error);
      throw error;
    }
  }

  // Verificar cupom específico
  async getDiscountCoupon(couponId) {
    try {
      const response = await this.makeRequest(
        "GET",
        `/discount_coupons/${couponId}`
      );

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Cupom não encontrado");
      }
    } catch (error) {
      console.error("Erro ao obter cupom:", error);
      throw error;
    }
  }

  // Atualizar cupom
  async updateDiscountCoupon(couponId, updateData) {
    try {
      const response = await this.makeRequest(
        "PUT",
        `/discount_coupons/${couponId}`,
        updateData
      );

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Erro ao atualizar cupom");
      }
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      throw error;
    }
  }

  // Deletar cupom
  async deleteDiscountCoupon(couponId) {
    try {
      const response = await this.makeRequest(
        "DELETE",
        `/discount_coupons/${couponId}`
      );

      if (response.ok) {
        console.log("✅ Cupom deletado:", couponId);
        return true;
      } else {
        throw new Error("Erro ao deletar cupom");
      }
    } catch (error) {
      console.error("Erro ao deletar cupom:", error);
      throw error;
    }
  }

  // ===== PEDIDOS =====

  // Listar pedidos
  async listOrders(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append("status", filters.status);
      if (filters.date_from) queryParams.append("date_from", filters.date_from);
      if (filters.date_to) queryParams.append("date_to", filters.date_to);
      if (filters.limit) queryParams.append("limit", filters.limit);

      const response = await this.makeRequest(
        "GET",
        `/orders?${queryParams.toString()}`
      );

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Erro ao listar pedidos");
      }
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      throw error;
    }
  }

  // Obter pedido específico
  async getOrder(orderId) {
    try {
      const response = await this.makeRequest("GET", `/orders/${orderId}`);

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Pedido não encontrado");
      }
    } catch (error) {
      console.error("Erro ao obter pedido:", error);
      throw error;
    }
  }

  // Verificar se pedido usou cupom de afiliado
  async checkOrderAffiliateCoupon(orderId) {
    try {
      const order = await this.getOrder(orderId);

      if (order.discount_coupon) {
        // Verificar se o cupom pertence a um afiliado
        const couponInfo = await this.getDiscountCoupon(
          order.discount_coupon.id
        );

        // Verificar se o nome do cupom contém código de afiliado
        const affiliateCode = this.extractAffiliateCode(couponInfo.name);

        if (affiliateCode) {
          return {
            affiliate_code: affiliateCode,
            coupon_code: couponInfo.code,
            discount_value: order.discount_coupon.value,
            order_value: order.total,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Erro ao verificar cupom do pedido:", error);
      return null;
    }
  }

  // Extrair código de afiliado do nome do cupom
  extractAffiliateCode(couponName) {
    // Padrões comuns de códigos de afiliado
    const patterns = [
      /^([A-Z]{2,10}\d{1,3})/, // JOAO10, MARIA15, etc.
      /^([A-Z]{2,10}_\d{1,3})/, // JOAO_10, MARIA_15, etc.
      /^([A-Z]{2,10}-\d{1,3})/, // JOAO-10, MARIA-15, etc.
    ];

    for (const pattern of patterns) {
      const match = couponName.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  // ===== PRODUTOS =====

  // Listar produtos
  async listProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.offset) queryParams.append("offset", filters.offset);

      const response = await this.makeRequest(
        "GET",
        `/products?${queryParams.toString()}`
      );

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Erro ao listar produtos");
      }
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw error;
    }
  }

  // ===== REQUESTS HTTP =====

  // Fazer requisição HTTP
  async makeRequest(method, endpoint, data = null) {
    if (!this.isConfigured()) {
      throw new Error("API não configurada");
    }

    const url = `${API_CONFIG.BASE_URL}/${this.storeId}${endpoint}`;
    const headers = {
      ...API_CONFIG.HEADERS,
      Authorization: `Bearer ${this.accessToken}`,
    };

    const options = {
      method,
      headers,
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options);
  }

  // ===== FUNÇÕES DE DEMO =====

  // Simular criação de cupom (demo)
  simulateCreateCoupon(couponData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCoupon = {
          id: Utils.generateId(),
          name: couponData.name,
          code: couponData.code,
          value: couponData.value,
          type: couponData.type || "percent",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Salvar no localStorage para demo
        const coupons = JSON.parse(
          localStorage.getItem("demo_coupons") || "[]"
        );
        coupons.push(mockCoupon);
        localStorage.setItem("demo_coupons", JSON.stringify(coupons));

        resolve(mockCoupon);
      }, 1000);
    });
  }

  // Simular listagem de cupons (demo)
  simulateListCoupons() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const coupons = JSON.parse(
          localStorage.getItem("demo_coupons") || "[]"
        );
        resolve(coupons);
      }, 500);
    });
  }

  // Simular listagem de pedidos (demo)
  simulateListOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockOrders = [
          {
            id: 1001,
            number: "1001",
            status: "paid",
            total: 150.0,
            discount_coupon: { code: "JOAO10", value: 15.0 },
            created_at: "2024-01-15T10:30:00Z",
            customer: { name: "João Silva", email: "joao@email.com" },
          },
          {
            id: 1002,
            number: "1002",
            status: "paid",
            total: 200.0,
            discount_coupon: { code: "MARIA15", value: 30.0 },
            created_at: "2024-01-16T14:20:00Z",
            customer: { name: "Maria Santos", email: "maria@email.com" },
          },
        ];
        resolve(mockOrders);
      }, 500);
    });
  }
}

// ===== INICIALIZAÇÃO =====
let nuvemshopAPI;

document.addEventListener("DOMContentLoaded", () => {
  nuvemshopAPI = new NuvemshopAPI();
});

// ===== FUNÇÕES GLOBAIS =====
window.NuvemshopAPI = NuvemshopAPI;

// Função para criar cupom
window.createCoupon = (couponData) => {
  if (APP_CONFIG.DEMO_MODE) {
    return nuvemshopAPI.simulateCreateCoupon(couponData);
  } else {
    return nuvemshopAPI.createDiscountCoupon(couponData);
  }
};

// Função para listar cupons
window.listCoupons = () => {
  if (APP_CONFIG.DEMO_MODE) {
    return nuvemshopAPI.simulateListCoupons();
  } else {
    return nuvemshopAPI.listDiscountCoupons();
  }
};

// Função para listar pedidos
window.listOrders = (filters) => {
  if (APP_CONFIG.DEMO_MODE) {
    return nuvemshopAPI.simulateListOrders();
  } else {
    return nuvemshopAPI.listOrders(filters);
  }
};
