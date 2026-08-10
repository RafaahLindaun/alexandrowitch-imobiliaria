"use client";

import { useEffect, useMemo, useState } from "react";
import { CITY_OPTIONS, PROPERTY_TYPES } from "../data/locationOptions";
import { AvailableLocations } from "../lib/availableLocations";

type SearchParams = {
  operacao?: string;
  tipo?: string;
  cidade?: string;
  bairro?: string;
  quartos?: string;
  banheiros?: string;
  vagas?: string;
  valorMin?: string;
  valorMax?: string;
  codigo?: string;
};

export default function SearchPanel({
  initial = {},
  variant = "default",
  availableLocations = {},
  mobileCollapsed = false,
}: {
  initial?: SearchParams;
  variant?: "default" | "hero";
  availableLocations?: AvailableLocations;
  mobileCollapsed?: boolean;
}) {
  const [city, setCity] = useState(initial.cidade || "");
  const [bairro, setBairro] = useState(initial.bairro || "");
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(!mobileCollapsed);

  const neighborhoods = useMemo(() => {
    if (!city) return [];
    return availableLocations[city] || [];
  }, [city, availableLocations]);

  useEffect(() => {
    if (bairro && !neighborhoods.includes(bairro)) setBairro("");
  }, [bairro, neighborhoods]);

  useEffect(() => {
    if (!mobileCollapsed) setMobileOpen(true);
  }, [mobileCollapsed]);

  return (
    <section className={`premiumSearchShell compactPremiumSearch ${variant === "hero" ? "heroSearch" : ""} ${mobileCollapsed ? "mobileCollapsibleSearch" : ""} ${mobileOpen ? "mobileSearchOpen" : "mobileSearchClosed"}`}>
      {mobileCollapsed && (
        <button
          type="button"
          className="mobileSearchLauncher"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-search-content"
        >
          <span className="mobileSearchLauncherIcon" aria-hidden="true">⌕</span>
          <span className="mobileSearchLauncherText">
            <strong>Buscar imóveis</strong>
            <small>Toque para abrir a busca premium</small>
          </span>
          <span className={`mobileSearchLauncherArrow ${mobileOpen ? "open" : ""}`} aria-hidden="true">▾</span>
        </button>
      )}

      <div id="mobile-search-content" className="mobileSearchContentWrap">
        <div className="premiumSearchHead">
          <div>
            <span className="eyebrow">Busca premium</span>
            <h2>Encontre o imóvel ideal</h2>
          </div>
          <p>Filtre por objetivo, tipo, cidade, bairro, código, valor e características.</p>
        </div>

        <div className="desktopSearchChips" aria-label="Atalhos de busca">
          <a href="/imoveis?operacao=Venda">Comprar</a>
          <a href="/imoveis?operacao=Locação">Alugar</a>
          <a href="/imoveis?tipo=Casa">Casas</a>
          <a href="/imoveis?tipo=Apartamento">Apartamentos</a>
          <a href="/imoveis?cidade=São%20Roque">São Roque</a>
          <a href="/imoveis?cidade=São%20Paulo">São Paulo</a>
        </div>

        <div className="mobileSearchShortcuts" aria-label="Atalhos rápidos">
          <a href="/imoveis?operacao=Venda">Comprar</a>
          <a href="/imoveis?operacao=Locação">Alugar</a>
          <a href="/imoveis?cidade=São%20Roque">São Roque</a>
          <a href="/imoveis?cidade=São%20Paulo">São Paulo</a>
        </div>

        <form className={`premiumSearch ${loading ? "searchIsLoading" : ""}`} action="/imoveis" onSubmit={() => setLoading(true)}>
          <div className="searchField primaryField" data-step="1">
            <label>Pretensão</label>
            <select name="operacao" defaultValue={initial.operacao || ""}>
              <option value="">Comprar ou alugar</option>
              <option value="Venda">Comprar</option>
              <option value="Locação">Alugar</option>
            </select>
          </div>

          <div className="searchField primaryField" data-step="2">
            <label>Tipo</label>
            <select name="tipo" defaultValue={initial.tipo || ""}>
              <option value="">Todos os tipos</option>
              {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="searchField primaryField" data-step="3">
            <label>Cidade</label>
            <select name="cidade" value={city} onChange={(event) => { setCity(event.target.value); setBairro(""); }}>
              <option value="">Todas as cidades</option>
              {CITY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="searchField primaryField" data-step="4">
            <label>Bairro</label>
            <select name="bairro" value={bairro} onChange={(event) => setBairro(event.target.value)} disabled={!city || neighborhoods.length === 0}>
              <option value="">{!city ? "Cidade primeiro" : neighborhoods.length ? "Bairros com imóveis" : "Nenhum imóvel salvo"}</option>
              {neighborhoods.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="searchField primaryField keywordField" data-step="5">
            <label>Código ou palavra</label>
            <input name="codigo" placeholder="Código, bairro ou nome" defaultValue={initial.codigo || ""} />
          </div>

          <button className="searchButton" type="submit">
            {loading ? <><span className="tinyLoader" />Buscando</> : "Buscar"}
          </button>

          <details className="luxuryDetails advancedDetails">
            <summary><span>Mais filtros</span><strong>+</strong></summary>
            <div className="detailsGrid advancedGrid">
              <div className="searchField"><label>Quartos</label><select name="quartos" defaultValue={initial.quartos || ""}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></div>
              <div className="searchField"><label>Banheiros</label><select name="banheiros" defaultValue={initial.banheiros || ""}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
              <div className="searchField"><label>Vagas</label><select name="vagas" defaultValue={initial.vagas || ""}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
              <div className="searchField"><label>Valor mín.</label><input name="valorMin" inputMode="numeric" placeholder="500000" defaultValue={initial.valorMin || ""} /></div>
              <div className="searchField"><label>Valor máx.</label><input name="valorMax" inputMode="numeric" placeholder="1500000" defaultValue={initial.valorMax || ""} /></div>
            </div>
          </details>
        </form>
      </div>
    </section>
  );
}
