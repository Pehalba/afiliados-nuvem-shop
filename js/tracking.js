/**
 * 📁 tracking.js - Sistema de rastreamento de afiliados
 *
 * Este arquivo contém:
 * - Captura de parâmetros de URL (ref, affiliate)
 * - Gerenciamento de cookies
 * - Rastreamento de conversões
 * - Integração com Nuvemshop
 */

// ===== CONFIGURAÇÕES DE TRACKING =====
const TRACKING_CONFIG = {
  COOKIE_NAME: "afiliado_ref",
  COOKIE_DURATION: 30, // dias
  PARAM_NAMES: ["ref", "affiliate", "afiliado", "codigo"],
  STORE_URL: "https://sua-loja.nuvemshop.com.br", // URL da sua loja
};

// ===== SISTEMA DE TRACKING =====
class TrackingSystem {
  constructor() {
    this.currentAffiliate = null;
    this.init();
  }

  init() {
    this.checkUrlParams();
    this.setupTracking();
    this.setupConversionTracking();
  }

  // Verificar parâmetros da URL
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Procurar por parâmetros de afiliado
    for (const paramName of TRACKING_CONFIG.PARAM_NAMES) {
      const affiliateCode = urlParams.get(paramName);
      if (affiliateCode) {
        this.setAffiliate(affiliateCode);
        break;
      }
    }
  }

  // Definir afiliado atual
  setAffiliate(affiliateCode) {
    this.currentAffiliate = affiliateCode;
    this.setCookie(
      TRACKING_CONFIG.COOKIE_NAME,
      affiliateCode,
      TRACKING_CONFIG.COOKIE_DURATION
    );

    console.log(`🎯 Afiliado rastreado: ${affiliateCode}`);

    // Disparar evento personalizado
    this.dispatchTrackingEvent("affiliate_tracked", {
      affiliate_code: affiliateCode,
      timestamp: new Date().toISOString(),
    });
  }

  // Obter afiliado atual
  getCurrentAffiliate() {
    if (this.currentAffiliate) {
      return this.currentAffiliate;
    }

    // Tentar obter do cookie
    const cookieValue = this.getCookie(TRACKING_CONFIG.COOKIE_NAME);
    if (cookieValue) {
      this.currentAffiliate = cookieValue;
      return cookieValue;
    }

    return null;
  }

  // Configurar tracking
  setupTracking() {
    // Interceptar cliques em links de produtos
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && this.isProductLink(link.href)) {
        this.trackProductClick(link.href);
      }
    });

    // Interceptar formulários de checkout
    document.addEventListener("submit", (e) => {
      if (this.isCheckoutForm(e.target)) {
        this.trackCheckoutStart();
      }
    });
  }

  // Verificar se é link de produto
  isProductLink(url) {
    return url.includes("/produtos/") || url.includes("/products/");
  }

  // Verificar se é formulário de checkout
  isCheckoutForm(form) {
    return (
      form.action.includes("/checkout") ||
      form.action.includes("/carrinho") ||
      form.classList.contains("checkout-form")
    );
  }

  // Rastrear clique em produto
  trackProductClick(productUrl) {
    const affiliate = this.getCurrentAffiliate();
    if (!affiliate) return;

    const trackingData = {
      affiliate_code: affiliate,
      product_url: productUrl,
      timestamp: new Date().toISOString(),
      event_type: "product_click",
    };

    this.sendTrackingData(trackingData);
    console.log("📊 Produto clicado:", trackingData);
  }

  // Rastrear início do checkout
  trackCheckoutStart() {
    const affiliate = this.getCurrentAffiliate();
    if (!affiliate) return;

    const trackingData = {
      affiliate_code: affiliate,
      timestamp: new Date().toISOString(),
      event_type: "checkout_start",
    };

    this.sendTrackingData(trackingData);
    console.log("🛒 Checkout iniciado:", trackingData);
  }

  // Configurar rastreamento de conversão
  setupConversionTracking() {
    // Verificar se estamos na página de sucesso
    if (this.isSuccessPage()) {
      this.trackConversion();
    }

    // Monitorar mudanças na URL (para SPAs)
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        if (this.isSuccessPage()) {
          this.trackConversion();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Verificar se é página de sucesso
  isSuccessPage() {
    return (
      window.location.href.includes("/sucesso") ||
      window.location.href.includes("/success") ||
      window.location.href.includes("/obrigado") ||
      window.location.href.includes("/thank-you")
    );
  }

  // Rastrear conversão
  trackConversion() {
    const affiliate = this.getCurrentAffiliate();
    if (!affiliate) return;

    // Obter dados do pedido da URL ou localStorage
    const orderData = this.getOrderData();

    const conversionData = {
      affiliate_code: affiliate,
      order_id: orderData.orderId,
      order_value: orderData.value,
      timestamp: new Date().toISOString(),
      event_type: "conversion",
    };

    this.sendTrackingData(conversionData);
    console.log("💰 Conversão rastreada:", conversionData);

    // Limpar cookie após conversão
    this.clearAffiliateCookie();
  }

  // Obter dados do pedido
  getOrderData() {
    // Tentar obter da URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id") || urlParams.get("pedido");

    // Tentar obter do localStorage (se foi salvo durante o checkout)
    const savedOrder = localStorage.getItem("current_order");
    const orderData = savedOrder ? JSON.parse(savedOrder) : {};

    return {
      orderId: orderId || orderData.orderId || "unknown",
      value: orderData.value || 0,
    };
  }

  // Enviar dados de tracking
  sendTrackingData(data) {
    // Em produção, enviar para sua API
    if (APP_CONFIG.DEMO_MODE) {
      // Simular envio
      console.log("📡 Dados enviados:", data);
      this.saveTrackingData(data);
    } else {
      // Enviar para API real
      fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).catch((error) => {
        console.error("Erro ao enviar tracking:", error);
      });
    }
  }

  // Salvar dados de tracking (demo)
  saveTrackingData(data) {
    const trackingData = JSON.parse(
      localStorage.getItem("tracking_data") || "[]"
    );
    trackingData.push(data);
    localStorage.setItem("tracking_data", JSON.stringify(trackingData));
  }

  // Disparar evento personalizado
  dispatchTrackingEvent(eventName, data) {
    const event = new CustomEvent("affiliate_tracking", {
      detail: {
        event: eventName,
        data: data,
      },
    });
    document.dispatchEvent(event);
  }

  // ===== SISTEMA DE COOKIES =====

  // Definir cookie
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  // Obter cookie
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Limpar cookie de afiliado
  clearAffiliateCookie() {
    document.cookie = `${TRACKING_CONFIG.COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    this.currentAffiliate = null;
  }

  // ===== GERADOR DE LINKS DE AFILIADO =====

  // Gerar link de afiliado
  generateAffiliateLink(affiliateCode, productUrl = null) {
    const baseUrl = productUrl || TRACKING_CONFIG.STORE_URL;
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}ref=${affiliateCode}`;
  }

  // Gerar link com cupom
  generateAffiliateLinkWithCoupon(
    affiliateCode,
    couponCode,
    productUrl = null
  ) {
    const baseLink = this.generateAffiliateLink(affiliateCode, productUrl);
    return `${baseLink}&cupom=${couponCode}`;
  }

  // ===== INTEGRAÇÃO COM NUVEMSHOP =====

  // Verificar se cupom pertence a afiliado
  async checkCouponAffiliate(couponCode) {
    try {
      // Em produção, fazer chamada para API da Nuvemshop
      if (APP_CONFIG.DEMO_MODE) {
        // Simular verificação
        return this.simulateCouponCheck(couponCode);
      } else {
        const response = await fetch(
          `${APP_CONFIG.API_BASE_URL}/discount_coupons`,
          {
            headers: {
              Authorization: `Bearer ${this.getAccessToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        const coupons = await response.json();
        return coupons.find((coupon) => coupon.code === couponCode);
      }
    } catch (error) {
      console.error("Erro ao verificar cupom:", error);
      return null;
    }
  }

  // Simular verificação de cupom (demo)
  simulateCouponCheck(couponCode) {
    const mockCoupons = {
      JOAO10: { affiliate_code: "JOAO10", discount: 10, type: "percent" },
      MARIA15: { affiliate_code: "MARIA15", discount: 15, type: "percent" },
      PEDRO20: { affiliate_code: "PEDRO20", discount: 20, type: "percent" },
    };

    return mockCoupons[couponCode] || null;
  }

  // Obter token de acesso
  getAccessToken() {
    // Em produção, obter do sistema de configuração
    return localStorage.getItem("nuvemshop_token");
  }
}

// ===== INICIALIZAÇÃO =====
let trackingSystem;

document.addEventListener("DOMContentLoaded", () => {
  trackingSystem = new TrackingSystem();
});

// ===== FUNÇÕES GLOBAIS =====
window.TrackingSystem = TrackingSystem;

// Função para gerar links de afiliado
window.generateAffiliateLink = (affiliateCode, productUrl) => {
  return trackingSystem.generateAffiliateLink(affiliateCode, productUrl);
};

// Função para verificar cupom
window.checkCouponAffiliate = (couponCode) => {
  return trackingSystem.checkCouponAffiliate(couponCode);
};
