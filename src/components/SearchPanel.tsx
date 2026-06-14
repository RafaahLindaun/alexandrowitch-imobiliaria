"use client";

import { useMemo, useState } from "react";
import { CITY_NEIGHBORHOODS, PROPERTY_TYPES } from "../data/locationOptions";

type SearchParams = {
  operacao?: string;
  tipo?: string;
  cidade?: string;
  bairro?: string;
  quartos?: string;
  valorMin?: string;
  valorMax?: string;
  codigo?: string;
};

export default function SearchPanel({ initial = {} }: { initial?: SearchParams }) {
  const [city, setCity] = useState(initial.cidade || "");
  const [loading, setLoading] = useState(false);
  const neighborhoods = useMemo(() => (city ? CITY_NEIGHBORHOODS[city] || [] : []), [city]);

  return (
    <section className="premiumSearchShell">
      <div className="premiumSearchHead">
        <div>
          <span className="eyebrow">Busca premium</span>
          <h2>Encontre o imóvel ideal com precisão</h2>
        </div>
        <p>Filtre por pretensão, tipo, cidade, bairro, dormitórios, valor e código.</p>
      </div>

      <form className={`premiumSearch ${loading ? "searchIsLoading" : ""}`} action="/imoveis" onSubmit={() => setLoading(true)}>
        <div className="searchField">
          <label>Pretensão</label>
          <select name="operacao" defaultValue={initial.operacao || ""}>
            <option value="">Comprar ou alugar</option>
            <option value="Venda">Comprar</option>
            <option value="Locação">Alugar</option>
          </select>
        </div>

        <div className="searchField">
          <label>Tipo de imóvel</label>
          <select name="tipo" defaultValue={initial.tipo || ""}>
            <option value="">Todos os tipos</option>
            {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="searchField">
          <label>Cidade</label>
          <select name="cidade" value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">Todas as cidades</option>
            <option value="São Roque">São Roque</option>
            <option value="Mairinque">Mairinque</option>
            <option value="Alumínio">Alumínio</option>
          </select>
        </div>

        <div className="searchField">
          <label>Bairro</label>
          <select name="bairro" defaultValue={initial.bairro || ""}>
            <option value="">Todos os bairros</option>
            {neighborhoods.map((bairro) => <option key={bairro} value={bairro}>{bairro}</option>)}
          </select>
        </div>

        <div className="searchField">
          <label>Quartos</label>
          <select name="quartos" defaultValue={initial.quartos || ""}>
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <details className="luxuryDetails">
          <summary><span>Busque por valor</span><strong>+</strong></summary>
          <div className="detailsGrid">
            <div className="searchField"><label>Valor mínimo</label><input name="valorMin" inputMode="numeric" placeholder="Ex: 500000" defaultValue={initial.valorMin || ""} /></div>
            <div className="searchField"><label>Valor máximo</label><input name="valorMax" inputMode="numeric" placeholder="Ex: 1500000" defaultValue={initial.valorMax || ""} /></div>
          </div>
        </details>

        <details className="luxuryDetails">
          <summary><span>Busque por código</span><strong>+</strong></summary>
          <div className="searchField"><label>Código ou trecho do imóvel</label><input name="codigo" placeholder="Ex: casa-alto-padrao ou parte do título" defaultValue={initial.codigo || ""} /></div>
        </details>

        <button className="searchButton" type="submit">
          {loading ? (<><span className="tinyLoader" />Buscando imóveis</>) : "Buscar imóveis"}
        </button>
      </form>
    </section>
  );
}
