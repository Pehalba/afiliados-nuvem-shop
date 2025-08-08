/**
 * 📁 main.js - Funções principais da plataforma de afiliados
 *
 * Este arquivo contém:
 * - Sistema de autenticação
 * - Funções utilitárias
 * - Gerenciamento de sessão
 * - Navegação entre páginas
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const APP_CONFIG = {
  API_BASE_URL: "https://api.nuvemshop.com.br/v1",
  STORAGE_KEY: "afiliados_platform",
  DEMO_MODE: true, // Modo demo para testes
};

// ===== SISTEMA DE AUTENTICAÇÃO =====
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Verificar se há usuário logado
    const savedUser = this.getStoredUser();
    if (savedUser) {
      this.currentUser = savedUser;
      this.redirectToDashboard();
    }
  }

  // Login do usuário
  login(email, password, userType) {
    return new Promise((resolve, reject) => {
      // Simular delay de API
      setTimeout(() => {
        if (this.validateCredentials(email, password, userType)) {
          const user = this.getUserData(email, userType);
          this.currentUser = user;
          this.storeUser(user);
          // Limpar flags de redirecionamento
          sessionStorage.removeItem("redirected");
          sessionStorage.removeItem("login_redirected");
          this.redirectToDashboard();
          resolve(user);
        } else {
          reject(new Error("Credenciais inválidas"));
        }
      }, 1000);
    });
  }

  // Validar credenciais (demo)
  validateCredentials(email, password, userType) {
    const validCredentials = {
      "admin@teste.com": { password: "senha123", type: "admin" },
      "joao@teste.com": { password: "senha123", type: "affiliate" },
    };

    const userCreds = validCredentials[email];
    return (
      userCreds &&
      userCreds.password === password &&
      userCreds.type === userType
    );
  }

  // Obter dados do usuário
  getUserData(email, userType) {
    const users = {
      "admin@teste.com": {
        id: 1,
        name: "Administrador",
        email: "admin@teste.com",
        type: "admin",
        avatar: "👨‍💼",
      },
      "joao@teste.com": {
        id: 2,
        name: "João Silva",
        email: "joao@teste.com",
        type: "affiliate",
        affiliateCode: "JOAO10",
        commission: 10,
        avatar: "👤",
      },
    };

    return users[email] || null;
  }

  // Logout
  logout() {
    this.currentUser = null;
    this.clearStoredUser();
    // Limpar flags de redirecionamento
    sessionStorage.removeItem("redirected");
    sessionStorage.removeItem("login_redirected");
    window.location.href = "index.html";
  }

  // Verificar se está logado
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Verificar se é admin
  isAdmin() {
    return this.currentUser && this.currentUser.type === "admin";
  }

  // Verificar se é afiliado
  isAffiliate() {
    return this.currentUser && this.currentUser.type === "affiliate";
  }

  // Armazenar usuário no localStorage
  storeUser(user) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(user));
  }

  // Obter usuário do localStorage
  getStoredUser() {
    const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Limpar usuário do localStorage
  clearStoredUser() {
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
  }

  // Redirecionar para dashboard apropriado
  redirectToDashboard() {
    if (this.isAdmin()) {
      window.location.href = "admin.html";
    } else if (this.isAffiliate()) {
      window.location.href = "dashboard.html";
    }
  }
}

// ===== FUNÇÕES UTILITÁRIAS =====
class Utils {
  // Formatar moeda
  static formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  // Formatar data
  static formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  // Formatar data e hora
  static formatDateTime(date) {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  // Gerar ID único
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Copiar texto para clipboard
  static copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.showMessage("Texto copiado!", "success");
      })
      .catch(() => {
        this.showMessage("Erro ao copiar texto", "error");
      });
  }

  // Mostrar mensagem
  static showMessage(message, type = "info") {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  // Mostrar loading
  static showLoading(element) {
    element.innerHTML = '<div class="loading">Carregando...</div>';
  }

  // Esconder loading
  static hideLoading(element) {
    element.innerHTML = "";
  }

  // Validar email
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ===== SISTEMA DE NAVEGAÇÃO =====
class Navigation {
  constructor() {
    this.currentSection = "dashboard";
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupLogout();
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.id === "btnLogout") return;

        // Remover classe active de todos os botões
        navButtons.forEach((b) => b.classList.remove("active"));

        // Adicionar classe active ao botão clicado
        btn.classList.add("active");

        // Mostrar seção correspondente
        const sectionId = btn.id.replace("btn", "").toLowerCase() + "Section";
        this.showSection(sectionId);
      });
    });
  }

  showSection(sectionId) {
    // Esconder todas as seções
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => section.classList.remove("active"));

    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    }
  }

  setupLogout() {
    const logoutBtn = document.getElementById("btnLogout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        auth.logout();
      });
    }
  }
}

// ===== SISTEMA DE MODAIS =====
class ModalSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupModalEvents();
  }

  setupModalEvents() {
    // Fechar modal ao clicar no X
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeModal(btn.closest(".modal"));
      });
    });

    // Fechar modal ao clicar fora
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.style.display = "none";
    }
  }
}

// ===== SISTEMA DE TABELAS =====
class TableSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupTableEvents();
  }

  setupTableEvents() {
    // Adicionar eventos de ordenação
    const tableHeaders = document.querySelectorAll(".data-table th[data-sort]");
    tableHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        this.sortTable(header);
      });
    });
  }

  sortTable(header) {
    const table = header.closest("table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const columnIndex = Array.from(header.parentNode.children).indexOf(header);
    const sortDirection = header.dataset.sort === "asc" ? "desc" : "asc";

    // Limpar direção de todos os headers
    table.querySelectorAll("th[data-sort]").forEach((th) => {
      delete th.dataset.sort;
    });

    // Definir nova direção
    header.dataset.sort = sortDirection;

    // Ordenar linhas
    rows.sort((a, b) => {
      const aValue = a.children[columnIndex].textContent;
      const bValue = b.children[columnIndex].textContent;

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    // Reordenar linhas na tabela
    rows.forEach((row) => tbody.appendChild(row));
  }

  // Renderizar tabela com dados
  renderTable(tableId, data, columns) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    data.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((column) => {
        const td = document.createElement("td");
        td.innerHTML = column.render
          ? column.render(row[column.key])
          : row[column.key];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
}

// ===== INICIALIZAÇÃO =====
let auth, navigation, modalSystem, tableSystem;

// Tornar auth global
window.auth = null;

// Inicializar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  auth = new AuthSystem();
  window.auth = auth; // Tornar global
  navigation = new Navigation();
  modalSystem = new ModalSystem();
  tableSystem = new TableSystem();

  // Configurar formulário de login se existir
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Verificar se está na página de login
  const isLoginPage = window.location.pathname.includes("index.html") || 
                     window.location.pathname === "/" ||
                     window.location.pathname.endsWith("/");
  
  if (isLoginPage) {
    // Se já está logado, redirecionar apenas uma vez
    if (auth.isLoggedIn() && !sessionStorage.getItem("redirected")) {
      sessionStorage.setItem("redirected", "true");
      setTimeout(() => {
        auth.redirectToDashboard();
      }, 100);
    }
  } else {
    // Se não está logado, redirecionar para login apenas uma vez
    if (!auth.isLoggedIn() && !sessionStorage.getItem("login_redirected")) {
      sessionStorage.setItem("login_redirected", "true");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 100);
    } else if (auth.isLoggedIn()) {
      // Se está logado, limpar flag de redirecionamento para login
      sessionStorage.removeItem("login_redirected");
    }
  }
});

// ===== HANDLERS =====
async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");
  const userType = formData.get("userType");

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  try {
    submitBtn.textContent = "Entrando...";
    submitBtn.disabled = true;

    await auth.login(email, password, userType);
    Utils.showMessage("Login realizado com sucesso!", "success");
  } catch (error) {
    Utils.showMessage("Erro no login: " + error.message, "error");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.Utils = Utils;
window.AuthSystem = AuthSystem;
window.copyToClipboard = Utils.copyToClipboard;
