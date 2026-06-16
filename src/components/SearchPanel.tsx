"use client";
import { useEffect, useMemo, useState } from "react";
import { CITY_NEIGHBORHOODS, PROPERTY_TYPES } from "../data/locationOptions";
type SearchParams={operacao?:string;tipo?:string;cidade?:string;bairro?:string;quartos?:string;banheiros?:string;vagas?:string;valorMin?:string;valorMax?:string;codigo?:string;};
export default function SearchPanel({ initial = {}, variant = "default" }: { initial?: SearchParams; variant?: "default" | "hero" }) {
  const [city,setCity]=useState(initial.cidade||""); const [bairro,setBairro]=useState(initial.bairro||""); const [loading,setLoading]=useState(false);
  const neighborhoods=useMemo(()=>city ? (CITY_NEIGHBORHOODS[city]||[]) : [],[city]);
  useEffect(()=>{ if(bairro && !neighborhoods.includes(bairro)) setBairro(""); },[bairro,neighborhoods]);
  return <section className={`premiumSearchShell compactPremiumSearch ${variant==="hero"?"heroSearch":""}`}>
    <div className="premiumSearchHead"><div><span className="eyebrow">Busca premium</span><h2>Encontre o imóvel ideal</h2></div><p>Pesquisa rápida por pretensão, tipo, cidade, bairro e características.</p></div>
    <form className={`premiumSearch ${loading?"searchIsLoading":""}`} action="/imoveis" onSubmit={()=>setLoading(true)}>
      <div className="searchField primaryField"><label>Pretensão</label><select name="operacao" defaultValue={initial.operacao||""}><option value="">Comprar ou alugar</option><option value="Venda">Comprar</option><option value="Locação">Alugar</option></select></div>
      <div className="searchField primaryField"><label>Tipo</label><select name="tipo" defaultValue={initial.tipo||""}><option value="">Todos os tipos</option>{PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
      <div className="searchField primaryField"><label>Cidade</label><select name="cidade" value={city} onChange={e=>{setCity(e.target.value);setBairro("");}}><option value="">Todas as cidades</option><option value="São Roque">São Roque</option><option value="Mairinque">Mairinque</option><option value="Alumínio">Alumínio</option></select></div>
      <div className="searchField primaryField"><label>Bairro</label><select name="bairro" value={bairro} onChange={e=>setBairro(e.target.value)} disabled={!city}><option value="">{city?"Todos os bairros":"Cidade primeiro"}</option>{neighborhoods.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
      <details className="luxuryDetails advancedDetails"><summary><span>Mais filtros</span><strong>+</strong></summary><div className="detailsGrid advancedGrid">
        <div className="searchField"><label>Quartos</label><select name="quartos" defaultValue={initial.quartos||""}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></div>
        <div className="searchField"><label>Banheiros</label><select name="banheiros" defaultValue={initial.banheiros||""}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
        <div className="searchField"><label>Vagas</label><select name="vagas" defaultValue={initial.vagas||""}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
        <div className="searchField"><label>Valor mín.</label><input name="valorMin" inputMode="numeric" placeholder="500000" defaultValue={initial.valorMin||""}/></div>
        <div className="searchField"><label>Valor máx.</label><input name="valorMax" inputMode="numeric" placeholder="1500000" defaultValue={initial.valorMax||""}/></div>
        <div className="searchField"><label>Código ou nome</label><input name="codigo" placeholder="Vila Junqueira" defaultValue={initial.codigo||""}/></div>
      </div></details>
      <button className="searchButton" type="submit">{loading?<><span className="tinyLoader"/>Buscando</>:"Buscar"}</button>
    </form>
  </section>;
}
