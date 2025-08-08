/**
 * 📁 dashboard.js - Dashboard do Afiliado
 *
 * Este arquivo contém:
 * - Visualização de vendas pessoais
 * - Gestão de comissões
 * - Links de afiliado
 * - Gráficos e estatísticas
 */

// ===== CLASSE PRINCIPAL DO DASHBOARD =====
class AffiliateDashboard {
  constructor() {
    this.currentUser = null;
    this.mySales = [];
    this.myCommissions = [];
    this.myCoupons = [];
    this.init();
  }

  init() {
    this.loadUserData();
    this.setupEventListeners();
    this.loadDashboard();
  }

  // Carregar dados do usuário
  loadUserData() {
    const storedUser = localStorage.getItem("afiliados_platform");
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.updateUserInfo();
    }
  }

  // Atualizar informações do usuário
  updateUserInfo() {
    const userName = document.getElementById("userName");
    if (userName && this.currentUser) {
      userName.textContent = this.currentUser.name;
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Filtros de vendas
    this.setupSalesFilters();

    // Links de afiliado
    this.setupAffiliateLinks();

    // QR Code
    this.setupQRCode();
  }

  // Configurar filtros de vendas
  setupSalesFilters() {
    const filterBtn = document.getElementById("btnFiltrar");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        this.filterMySales();
      });
    }

    // Filtros automáticos
    const filterInputs = document.querySelectorAll(".filter-input");
    filterInputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.filterMySales();
      });
    });
  }

  // Configurar links de afiliado
  setupAffiliateLinks() {
    this.generateAffiliateLinks();
  }

  // Configurar QR Code
  setupQRCode() {
    this.generateQRCode();
  }

  // ===== DASHBOARD PRINCIPAL =====

  // Carregar dashboard
  loadDashboard() {
    this.loadMyData();
    this.updateStats();
    this.loadCharts();
    this.loadPerformanceData();
  }

  // Carregar dados pessoais
  loadMyData() {
    this.loadMySales();
    this.loadMyCommissions();
    this.loadMyCoupons();
  }

  // Carregar minhas vendas
  loadMySales() {
    const allSales = JSON.parse(localStorage.getItem("demo_sales") || "[]");
    this.mySales = allSales.filter(
      (sale) => sale.affiliate === this.currentUser?.affiliateCode
    );
    this.renderMySales();
  }

  // Carregar minhas comissões
  loadMyCommissions() {
    this.myCommissions = this.mySales.map((sale) => ({
      id: sale.id,
      date: sale.date,
      orderNumber: sale.orderNumber,
      saleValue: sale.value,
      commissionRate: this.currentUser?.commission || 10,
      commissionValue: sale.commission,
      status: sale.status,
    }));
    this.renderMyCommissions();
  }

  // Carregar meus cupons
  loadMyCoupons() {
    const allCoupons = JSON.parse(localStorage.getItem("demo_coupons") || "[]");
    this.myCoupons = allCoupons.filter(
      (coupon) => coupon.affiliate_code === this.currentUser?.affiliateCode
    );
    this.renderMyCoupons();
  }

  // ===== RENDERIZAÇÃO DE DADOS =====

  // Renderizar minhas vendas
  renderMySales() {
    const tbody = document.getElementById("vendasTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    this.mySales.forEach((sale) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>#${sale.orderNumber}</td>
                <td>${sale.customer}</td>
                <td>${sale.coupon}</td>
                <td>${Utils.formatCurrency(sale.value)}</td>
                <td>${Utils.formatCurrency(sale.commission)}</td>
                <td>
                    <span class="status-badge ${sale.status}">
                        ${this.getStatusText(sale.status)}
                    </span>
                </td>
                <td>${Utils.formatDate(sale.date)}</td>
            `;
      tbody.appendChild(row);
    });
  }

  // Renderizar minhas comissões
  renderMyCommissions() {
    const tbody = document.getElementById("comissoesTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    this.myCommissions.forEach((commission) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${Utils.formatDate(commission.date)}</td>
                <td>#${commission.orderNumber}</td>
                <td>${Utils.formatCurrency(commission.saleValue)}</td>
                <td>${commission.commissionRate}%</td>
                <td>${Utils.formatCurrency(commission.commissionValue)}</td>
                <td>
                    <span class="status-badge ${commission.status}">
                        ${this.getStatusText(commission.status)}
                    </span>
                </td>
            `;
      tbody.appendChild(row);
    });
  }

  // Renderizar meus cupons
  renderMyCoupons() {
    const cuponsGrid = document.getElementById("cuponsGrid");
    if (!cuponsGrid) return;

    cuponsGrid.innerHTML = "";

    this.myCoupons.forEach((coupon) => {
      const couponCard = document.createElement("div");
      couponCard.className = "cupom-card";
      couponCard.innerHTML = `
                <h3>${coupon.name}</h3>
                <div class="cupom-code">${coupon.code}</div>
                <div class="cupom-details">
                    <p><strong>Desconto:</strong> ${coupon.value}%</p>
                    <p><strong>Usos:</strong> ${coupon.usage_count || 0}</p>
                    <p><strong>Status:</strong> Ativo</p>
                </div>
                <div class="cupom-actions">
                    <button class="btn btn-small" onclick="affiliateDashboard.copyCouponCode('${
                      coupon.code
                    }')">
                        Copiar Código
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="affiliateDashboard.shareCoupon('${
                      coupon.code
                    }')">
                        Compartilhar
                    </button>
                </div>
            `;
      cuponsGrid.appendChild(couponCard);
    });
  }

  // Filtrar minhas vendas
  filterMySales() {
    const dataInicio = document.getElementById("dataInicio")?.value;
    const dataFim = document.getElementById("dataFim")?.value;
    const statusFilter = document.getElementById("statusFilter")?.value;

    let filteredSales = this.mySales;

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

    if (statusFilter) {
      filteredSales = filteredSales.filter(
        (sale) => sale.status === statusFilter
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
                <td>${sale.coupon}</td>
                <td>${Utils.formatCurrency(sale.value)}</td>
                <td>${Utils.formatCurrency(sale.commission)}</td>
                <td>
                    <span class="status-badge ${sale.status}">
                        ${this.getStatusText(sale.status)}
                    </span>
                </td>
                <td>${Utils.formatDate(sale.date)}</td>
            `;
      tbody.appendChild(row);
    });
  }

  // ===== ESTATÍSTICAS =====

  // Atualizar estatísticas
  updateStats() {
    this.updateMonthlyStats();
    this.updateCommissionStats();
    this.updateCouponStats();
    this.updateConversionStats();
  }

  // Atualizar estatísticas do mês
  updateMonthlyStats() {
    const vendasMes = document.getElementById("vendasMes");
    if (vendasMes) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlySales = this.mySales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear
        );
      });

      vendasMes.textContent = monthlySales.length;
    }
  }

  // Atualizar estatísticas de comissões
  updateCommissionStats() {
    const comissoesPendentes = document.getElementById("comissoesPendentes");
    if (comissoesPendentes) {
      const pendingCommissions = this.myCommissions
        .filter((commission) => commission.status === "paid")
        .reduce((sum, commission) => sum + commission.commissionValue, 0);

      comissoesPendentes.textContent = Utils.formatCurrency(pendingCommissions);
    }
  }

  // Atualizar estatísticas de cupons
  updateCouponStats() {
    const cuponsAtivos = document.getElementById("cuponsAtivos");
    if (cuponsAtivos) {
      cuponsAtivos.textContent = this.myCoupons.length;
    }
  }

  // Atualizar estatísticas de conversão
  updateConversionStats() {
    const taxaConversao = document.getElementById("taxaConversao");
    if (taxaConversao) {
      // Simular taxa de conversão baseada em cliques vs vendas
      const totalClicks = 150; // Simulado
      const totalSales = this.mySales.length;
      const conversionRate =
        totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : 0;

      taxaConversao.textContent = `${conversionRate}%`;
    }
  }

  // ===== GRÁFICOS =====

  // Carregar gráficos
  loadCharts() {
    this.loadSalesChart();
    this.loadPerformanceData();
  }

  // Carregar gráfico de vendas
  loadSalesChart() {
    const canvas = document.getElementById("vendasChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Dados dos últimos 7 dias
    const last7Days = this.getLast7DaysData();

    // Criar gráfico simples (em produção, usar Chart.js)
    this.drawSimpleChart(ctx, last7Days);
  }

  // Obter dados dos últimos 7 dias
  getLast7DaysData() {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const daySales = this.mySales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate.toDateString() === date.toDateString();
      });

      data.push({
        date: date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        sales: daySales.length,
        revenue: daySales.reduce((sum, sale) => sum + sale.value, 0),
      });
    }

    return data;
  }

  // Desenhar gráfico simples
  drawSimpleChart(ctx, data) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Configurar estilo
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 3;
    ctx.fillStyle = "#3498db";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // Encontrar valores máximos
    const maxSales = Math.max(...data.map((d) => d.sales));
    const maxRevenue = Math.max(...data.map((d) => d.revenue));

    // Desenhar linhas do gráfico
    ctx.beginPath();
    data.forEach((day, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y =
        height - padding - (day.sales / maxSales) * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Desenhar ponto
      ctx.fillRect(x - 3, y - 3, 6, 6);

      // Desenhar label
      ctx.fillText(day.date, x, height - 10);
    });
    ctx.stroke();
  }

  // Carregar dados de performance
  loadPerformanceData() {
    const performanceList = document.getElementById("cuponsPerformance");
    if (!performanceList) return;

    performanceList.innerHTML = "";

    this.myCoupons.forEach((coupon) => {
      const performanceItem = document.createElement("div");
      performanceItem.className = "performance-item";

      const couponSales = this.mySales.filter(
        (sale) => sale.coupon === coupon.code
      );
      const totalRevenue = couponSales.reduce(
        (sum, sale) => sum + sale.value,
        0
      );
      const totalCommission = couponSales.reduce(
        (sum, sale) => sum + sale.commission,
        0
      );

      performanceItem.innerHTML = `
                <div class="performance-header">
                    <strong>${coupon.code}</strong>
                    <span class="performance-value">${coupon.value}%</span>
                </div>
                <div class="performance-details">
                    <span>Vendas: ${couponSales.length}</span>
                    <span>Receita: ${Utils.formatCurrency(totalRevenue)}</span>
                    <span>Comissão: ${Utils.formatCurrency(
                      totalCommission
                    )}</span>
                </div>
            `;

      performanceList.appendChild(performanceItem);
    });
  }

  // ===== LINKS DE AFILIADO =====

  // Gerar links de afiliado
  generateAffiliateLinks() {
    if (!this.currentUser?.affiliateCode) return;

    const baseUrl = "https://sua-loja.nuvemshop.com.br";
    const affiliateCode = this.currentUser.affiliateCode;

    // Link principal
    const linkPrincipal = document.getElementById("linkPrincipal");
    if (linkPrincipal) {
      linkPrincipal.value = `${baseUrl}?ref=${affiliateCode}`;
    }

    // Link com cupom
    const linkCupom = document.getElementById("linkCupom");
    if (linkCupom) {
      linkCupom.value = `${baseUrl}?ref=${affiliateCode}&cupom=${affiliateCode}`;
    }
  }

  // Gerar QR Code
  generateQRCode() {
    const qrContainer = document.getElementById("qrCodeContainer");
    if (!qrContainer) return;

    const affiliateCode = this.currentUser?.affiliateCode;
    if (!affiliateCode) return;

    // Em produção, usar biblioteca de QR Code
    // Por enquanto, criar um placeholder
    qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <div class="qr-code">📱</div>
                <p>QR Code para WhatsApp</p>
                <small>https://wa.me/5511999999999?text=Olá! Use o cupom ${affiliateCode} para ganhar desconto!</small>
            </div>
        `;
  }

  // ===== FUNÇÕES UTILITÁRIAS =====

  // Copiar código do cupom
  copyCouponCode(code) {
    Utils.copyToClipboard(code);
  }

  // Compartilhar cupom
  shareCoupon(code) {
    const text = `🎉 Use o cupom ${code} na nossa loja e ganhe desconto! 🛍️`;

    if (navigator.share) {
      navigator.share({
        title: "Cupom de Desconto",
        text: text,
        url: `https://sua-loja.nuvemshop.com.br?cupom=${code}`,
      });
    } else {
      // Fallback para copiar
      Utils.copyToClipboard(text);
      Utils.showMessage(
        "Texto copiado! Compartilhe nas suas redes sociais.",
        "success"
      );
    }
  }

  // Obter texto do status
  getStatusText(status) {
    const statusTexts = {
      paid: "Pago",
      pending: "Pendente",
      cancelled: "Cancelado",
      processing: "Processando",
    };
    return statusTexts[status] || status;
  }

  // ===== RESUMO DE COMISSÕES =====

  // Atualizar resumo de comissões
  updateCommissionSummary() {
    const totalGanho = document.getElementById("totalGanho");
    const disponivelSaque = document.getElementById("disponivelSaque");
    const proximoPagamento = document.getElementById("proximoPagamento");

    if (totalGanho) {
      const total = this.myCommissions.reduce(
        (sum, commission) => sum + commission.commissionValue,
        0
      );
      totalGanho.textContent = Utils.formatCurrency(total);
    }

    if (disponivelSaque) {
      const disponivel = this.myCommissions
        .filter((commission) => commission.status === "paid")
        .reduce((sum, commission) => sum + commission.commissionValue, 0);
      disponivelSaque.textContent = Utils.formatCurrency(disponivel);
    }

    if (proximoPagamento) {
      // Simular próximo pagamento (próximo mês)
      const proximo = this.myCommissions
        .filter((commission) => commission.status === "pending")
        .reduce((sum, commission) => sum + commission.commissionValue, 0);
      proximoPagamento.textContent = Utils.formatCurrency(proximo);
    }
  }
}

// ===== INICIALIZAÇÃO =====
let affiliateDashboard;

document.addEventListener("DOMContentLoaded", () => {
  // Verificar se é página de dashboard do afiliado e se está logado como afiliado
  if (window.location.pathname.includes("dashboard.html")) {
    // Aguardar um pouco para garantir que a autenticação foi verificada
    setTimeout(() => {
      if (window.auth && window.auth.isAffiliate()) {
        affiliateDashboard = new AffiliateDashboard();
      }
    }, 200);
  }
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.AffiliateDashboard = AffiliateDashboard;
