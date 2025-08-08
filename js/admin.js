/**
 * 📁 admin.js - Painel Administrativo
 *
 * Este arquivo contém:
 * - Gestão de afiliados
 * - Criação e gestão de cupons
 * - Relatórios de vendas
 * - Dashboard administrativo
 */

// ===== CLASSE PRINCIPAL DO ADMIN =====
class AdminPanel {
  constructor() {
    this.affiliates = [];
    this.coupons = [];
    this.sales = [];
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.loadDashboard();
  }

  // Carregar dados
  loadData() {
    this.loadAffiliates();
    this.loadCoupons();
    this.loadSales();
  }

  // Configurar event listeners
  setupEventListeners() {
    // Botões de ação
    this.setupActionButtons();

    // Formulários
    this.setupForms();

    // Filtros
    this.setupFilters();
  }

  // Configurar botões de ação
  setupActionButtons() {
    // Adicionar afiliado
    const addAffiliadoBtn = document.getElementById("btnAddAfiliado");
    if (addAffiliadoBtn) {
      addAffiliadoBtn.addEventListener("click", () => {
        this.openAffiliateModal();
      });
    }

    // Adicionar cupom
    const addCupomBtn = document.getElementById("btnAddCupom");
    if (addCupomBtn) {
      addCupomBtn.addEventListener("click", () => {
        this.openCouponModal();
      });
    }

    // Sincronizar cupons
    const syncCuponsBtn = document.getElementById("btnSyncCupons");
    if (syncCuponsBtn) {
      syncCuponsBtn.addEventListener("click", () => {
        this.syncCoupons();
      });
    }

    // Exportar afiliados
    const exportBtn = document.getElementById("btnExportAfiliados");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportAffiliates();
      });
    }

    // Filtrar vendas
    const filterBtn = document.getElementById("btnFiltrar");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        this.filterSales();
      });
    }
  }

  // Configurar formulários
  setupForms() {
    // Formulário de afiliado
    const affiliateForm = document.getElementById("afiliadoForm");
    if (affiliateForm) {
      affiliateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAffiliateSubmit(e);
      });
    }
  }

  // Configurar filtros
  setupFilters() {
    // Filtros de data
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.updateFilters();
      });
    });

    // Filtro de afiliado
    const affiliateFilter = document.getElementById("afiliadoFilter");
    if (affiliateFilter) {
      affiliateFilter.addEventListener("change", () => {
        this.updateFilters();
      });
    }
  }

  // ===== GESTÃO DE AFILIADOS =====

  // Carregar afiliados
  loadAffiliates() {
    const stored = localStorage.getItem("demo_affiliates");
    this.affiliates = stored ? JSON.parse(stored) : this.getDefaultAffiliates();
    this.renderAffiliatesTable();
  }

  // Obter afiliados padrão (demo)
  getDefaultAffiliates() {
    const defaultAffiliates = [
      {
        id: 1,
        name: "João Silva",
        email: "joao@teste.com",
        code: "JOAO10",
        commission: 10,
        status: "active",
        sales: 15,
        totalEarnings: 150.0,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@teste.com",
        code: "MARIA15",
        commission: 15,
        status: "active",
        sales: 8,
        totalEarnings: 120.0,
        createdAt: "2024-01-05T00:00:00Z",
      },
      {
        id: 3,
        name: "Pedro Costa",
        email: "pedro@teste.com",
        code: "PEDRO20",
        commission: 20,
        status: "inactive",
        sales: 3,
        totalEarnings: 60.0,
        createdAt: "2024-01-10T00:00:00Z",
      },
    ];

    localStorage.setItem("demo_affiliates", JSON.stringify(defaultAffiliates));
    return defaultAffiliates;
  }

  // Renderizar tabela de afiliados
  renderAffiliatesTable() {
    const tbody = document.getElementById("afiliadosTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    this.affiliates.forEach((affiliate) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${affiliate.name}</td>
                <td>${affiliate.email}</td>
                <td><strong>${affiliate.code}</strong></td>
                <td>${affiliate.commission}%</td>
                <td>
                    <span class="status-badge ${affiliate.status}">
                        ${affiliate.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                </td>
                <td>${affiliate.sales}</td>
                <td>
                    <button class="btn btn-small" onclick="adminPanel.editAffiliate(${
                      affiliate.id
                    })">
                        Editar
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="adminPanel.toggleAffiliateStatus(${
                      affiliate.id
                    })">
                        ${
                          affiliate.status === "active" ? "Desativar" : "Ativar"
                        }
                    </button>
                </td>
            `;
      tbody.appendChild(row);
    });
  }

  // Abrir modal de afiliado
  openAffiliateModal(affiliateId = null) {
    const modal = document.getElementById("afiliadoModal");
    const modalTitle = document.getElementById("modalTitle");
    const form = document.getElementById("afiliadoForm");

    if (affiliateId) {
      // Modo edição
      const affiliate = this.affiliates.find((a) => a.id === affiliateId);
      if (affiliate) {
        modalTitle.textContent = "Editar Afiliado";
        form.querySelector("#modalNome").value = affiliate.name;
        form.querySelector("#modalEmail").value = affiliate.email;
        form.querySelector("#modalCodigo").value = affiliate.code;
        form.querySelector("#modalComissao").value = affiliate.commission;
        form.dataset.editId = affiliateId;
      }
    } else {
      // Modo criação
      modalTitle.textContent = "Novo Afiliado";
      form.reset();
      delete form.dataset.editId;
    }

    modalSystem.openModal("afiliadoModal");
  }

  // Editar afiliado
  editAffiliate(affiliateId) {
    this.openAffiliateModal(affiliateId);
  }

  // Alternar status do afiliado
  toggleAffiliateStatus(affiliateId) {
    const affiliate = this.affiliates.find((a) => a.id === affiliateId);
    if (affiliate) {
      affiliate.status = affiliate.status === "active" ? "inactive" : "active";
      this.saveAffiliates();
      this.renderAffiliatesTable();
      Utils.showMessage(
        `Afiliado ${affiliate.name} ${
          affiliate.status === "active" ? "ativado" : "desativado"
        }`,
        "success"
      );
    }
  }

  // Handler para submit do formulário de afiliado
  async handleAffiliateSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const affiliateData = {
      name: formData.get("nome"),
      email: formData.get("email"),
      code: formData.get("codigo"),
      commission: parseInt(formData.get("comissao")),
    };

    try {
      if (e.target.dataset.editId) {
        // Edição
        await this.updateAffiliate(
          parseInt(e.target.dataset.editId),
          affiliateData
        );
      } else {
        // Criação
        await this.createAffiliate(affiliateData);
      }

      modalSystem.closeModal(document.getElementById("afiliadoModal"));
      Utils.showMessage("Afiliado salvo com sucesso!", "success");
    } catch (error) {
      Utils.showMessage("Erro ao salvar afiliado: " + error.message, "error");
    }
  }

  // Criar afiliado
  async createAffiliate(data) {
    const newAffiliate = {
      id: Date.now(),
      ...data,
      status: "active",
      sales: 0,
      totalEarnings: 0,
      createdAt: new Date().toISOString(),
    };

    this.affiliates.push(newAffiliate);
    this.saveAffiliates();
    this.renderAffiliatesTable();

    // Criar cupom automaticamente
    await this.createAffiliateCoupon(newAffiliate);
  }

  // Atualizar afiliado
  async updateAffiliate(id, data) {
    const affiliate = this.affiliates.find((a) => a.id === id);
    if (affiliate) {
      Object.assign(affiliate, data);
      this.saveAffiliates();
      this.renderAffiliatesTable();
    }
  }

  // Salvar afiliados
  saveAffiliates() {
    localStorage.setItem("demo_affiliates", JSON.stringify(this.affiliates));
  }

  // ===== GESTÃO DE CUPONS =====

  // Carregar cupons
  loadCoupons() {
    const stored = localStorage.getItem("demo_coupons");
    this.coupons = stored ? JSON.parse(stored) : [];
    this.renderCouponsTable();
  }

  // Renderizar tabela de cupons
  renderCouponsTable() {
    const tbody = document.getElementById("cuponsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    this.coupons.forEach((coupon) => {
      const affiliate = this.affiliates.find(
        (a) => a.code === coupon.affiliate_code
      );
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><strong>${coupon.code}</strong></td>
                <td>${affiliate ? affiliate.name : "N/A"}</td>
                <td>${coupon.value}%</td>
                <td>${coupon.type}</td>
                <td>
                    <span class="status-badge active">Ativo</span>
                </td>
                <td>${coupon.usage_count || 0}</td>
                <td>
                    <button class="btn btn-small" onclick="adminPanel.editCoupon('${
                      coupon.id
                    }')">
                        Editar
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="adminPanel.deleteCoupon('${
                      coupon.id
                    }')">
                        Deletar
                    </button>
                </td>
            `;
      tbody.appendChild(row);
    });
  }

  // Criar cupom para afiliado
  async createAffiliateCoupon(affiliate) {
    const couponData = {
      name: `${affiliate.code} - Cupom de Afiliado`,
      code: affiliate.code,
      value: affiliate.commission,
      type: "percent",
      affiliate_code: affiliate.code,
    };

    try {
      const coupon = await createCoupon(couponData);
      this.coupons.push(coupon);
      this.saveCoupons();
      this.renderCouponsTable();

      console.log("✅ Cupom criado para afiliado:", coupon);
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
    }
  }

  // Sincronizar cupons
  async syncCoupons() {
    try {
      Utils.showMessage("Sincronizando cupons...", "info");

      const apiCoupons = await listCoupons();
      this.coupons = apiCoupons;
      this.saveCoupons();
      this.renderCouponsTable();

      Utils.showMessage("Cupons sincronizados com sucesso!", "success");
    } catch (error) {
      Utils.showMessage(
        "Erro ao sincronizar cupons: " + error.message,
        "error"
      );
    }
  }

  // Salvar cupons
  saveCoupons() {
    localStorage.setItem("demo_coupons", JSON.stringify(this.coupons));
  }

  // ===== GESTÃO DE VENDAS =====

  // Carregar vendas
  loadSales() {
    const stored = localStorage.getItem("demo_sales");
    this.sales = stored ? JSON.parse(stored) : this.getDefaultSales();
    this.renderSalesTable();
  }

  // Obter vendas padrão (demo)
  getDefaultSales() {
    const defaultSales = [
      {
        id: 1001,
        orderNumber: "1001",
        customer: "João Silva",
        affiliate: "JOAO10",
        coupon: "JOAO10",
        value: 150.0,
        commission: 15.0,
        date: "2024-01-15T10:30:00Z",
        status: "paid",
      },
      {
        id: 1002,
        orderNumber: "1002",
        customer: "Maria Santos",
        affiliate: "MARIA15",
        coupon: "MARIA15",
        value: 200.0,
        commission: 30.0,
        date: "2024-01-16T14:20:00Z",
        status: "paid",
      },
    ];

    localStorage.setItem("demo_sales", JSON.stringify(defaultSales));
    return defaultSales;
  }

  // Renderizar tabela de vendas
  renderSalesTable() {
    const tbody = document.getElementById("vendasTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    this.sales.forEach((sale) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>#${sale.orderNumber}</td>
                <td>${sale.customer}</td>
                <td>${sale.affiliate}</td>
                <td>${sale.coupon}</td>
                <td>${Utils.formatCurrency(sale.value)}</td>
                <td>${Utils.formatCurrency(sale.commission)}</td>
                <td>${Utils.formatDate(sale.date)}</td>
            `;
      tbody.appendChild(row);
    });
  }

  // Filtrar vendas
  filterSales() {
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const affiliateFilter = document.getElementById("afiliadoFilter").value;

    let filteredSales = this.sales;

    if (dataInicio) {
      filteredSales = filteredSales.filter(
        (sale) => new Date(sale.date) >= new Date(dataInicio)
      );
    }

    if (dataFim) {
      filteredSales = filteredSales.filter(
        (sale) => new Date(sale.date) <= new Date(dataFim)
      );
    }

    if (affiliateFilter) {
      filteredSales = filteredSales.filter(
        (sale) => sale.affiliate === affiliateFilter
      );
    }

    this.renderFilteredSales(filteredSales);
  }

  // Renderizar vendas filtradas
  renderFilteredSales(sales) {
    const tbody = document.getElementById("vendasTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    sales.forEach((sale) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>#${sale.orderNumber}</td>
                <td>${sale.customer}</td>
                <td>${sale.affiliate}</td>
                <td>${sale.coupon}</td>
                <td>${Utils.formatCurrency(sale.value)}</td>
                <td>${Utils.formatCurrency(sale.commission)}</td>
                <td>${Utils.formatDate(sale.date)}</td>
            `;
      tbody.appendChild(row);
    });
  }

  // ===== DASHBOARD =====

  // Carregar dashboard
  loadDashboard() {
    this.updateStats();
    this.loadRecentActivity();
  }

  // Atualizar estatísticas
  updateStats() {
    const totalAfiliados = document.getElementById("totalAfiliados");
    const cuponsAtivos = document.getElementById("cuponsAtivos");
    const vendasHoje = document.getElementById("vendasHoje");
    const comissoesPendentes = document.getElementById("comissoesPendentes");

    if (totalAfiliados) {
      totalAfiliados.textContent = this.affiliates.filter(
        (a) => a.status === "active"
      ).length;
    }

    if (cuponsAtivos) {
      cuponsAtivos.textContent = this.coupons.length;
    }

    if (vendasHoje) {
      const hoje = new Date().toDateString();
      const vendasHojeCount = this.sales.filter(
        (sale) => new Date(sale.date).toDateString() === hoje
      ).length;
      vendasHoje.textContent = vendasHojeCount;
    }

    if (comissoesPendentes) {
      const totalComissoes = this.sales.reduce(
        (sum, sale) => sum + sale.commission,
        0
      );
      comissoesPendentes.textContent = Utils.formatCurrency(totalComissoes);
    }
  }

  // Carregar atividade recente
  loadRecentActivity() {
    const activityList = document.getElementById("activityList");
    if (!activityList) return;

    const recentActivity = [
      {
        type: "sale",
        message: "Nova venda via cupom JOAO10",
        time: "2 minutos atrás",
      },
      {
        type: "affiliate",
        message: "Novo afiliado cadastrado: Pedro Costa",
        time: "1 hora atrás",
      },
      {
        type: "coupon",
        message: "Cupom MARIA15 criado automaticamente",
        time: "3 horas atrás",
      },
    ];

    activityList.innerHTML = "";

    recentActivity.forEach((activity) => {
      const activityItem = document.createElement("div");
      activityItem.className = "activity-item";
      activityItem.innerHTML = `
                <div class="activity-icon ${
                  activity.type
                }">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <small>${activity.time}</small>
                </div>
            `;
      activityList.appendChild(activityItem);
    });
  }

  // Obter ícone da atividade
  getActivityIcon(type) {
    const icons = {
      sale: "💰",
      affiliate: "👤",
      coupon: "🎫",
    };
    return icons[type] || "📝";
  }

  // ===== UTILITÁRIOS =====

  // Exportar afiliados
  exportAffiliates() {
    const csvContent = this.generateAffiliatesCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "afiliados.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Gerar CSV de afiliados
  generateAffiliatesCSV() {
    const headers = [
      "Nome",
      "Email",
      "Código",
      "Comissão (%)",
      "Status",
      "Vendas",
      "Ganhos Totais",
    ];
    const rows = this.affiliates.map((affiliate) => [
      affiliate.name,
      affiliate.email,
      affiliate.code,
      affiliate.commission,
      affiliate.status,
      affiliate.sales,
      affiliate.totalEarnings,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  // Atualizar filtros
  updateFilters() {
    // Atualizar opções do filtro de afiliados
    const affiliateFilter = document.getElementById("afiliadoFilter");
    if (affiliateFilter) {
      const currentValue = affiliateFilter.value;
      affiliateFilter.innerHTML =
        '<option value="">Todos os Afiliados</option>';

      this.affiliates.forEach((affiliate) => {
        const option = document.createElement("option");
        option.value = affiliate.code;
        option.textContent = `${affiliate.name} (${affiliate.code})`;
        affiliateFilter.appendChild(option);
      });

      affiliateFilter.value = currentValue;
    }
  }
}

// ===== INICIALIZAÇÃO =====
let adminPanel;

document.addEventListener("DOMContentLoaded", () => {
  // Verificar se é página de admin
  if (window.location.pathname.includes("admin.html")) {
    adminPanel = new AdminPanel();
  }
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.AdminPanel = AdminPanel;
