"use client";
import { useMemo, useState } from "react";
import { CITY_NEIGHBORHOODS } from "../data/locationOptions";
export default function LocationFields({ defaultCity = "São Roque", defaultNeighborhood = "" }: { defaultCity?: string; defaultNeighborhood?: string; }) {
  const [city, setCity] = useState(defaultCity || "São Roque");
  const [neighborhood, setNeighborhood] = useState(defaultNeighborhood || "");
  const neighborhoods = useMemo(() => CITY_NEIGHBORHOODS[city] || [], [city]);
  return <><select className="select" name="city" value={city} onChange={e => { setCity(e.target.value); setNeighborhood(""); }}><option value="São Roque">São Roque</option><option value="Mairinque">Mairinque</option><option value="Alumínio">Alumínio</option></select><select className="select" name="neighborhood" value={neighborhood} onChange={e => setNeighborhood(e.target.value)}><option value="">Selecione o bairro</option>{neighborhoods.map(b => <option key={b} value={b}>{b}</option>)}</select></>;
}
