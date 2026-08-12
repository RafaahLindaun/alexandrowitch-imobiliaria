"use client";

import { useMemo, useState } from "react";
import { CITY_NEIGHBORHOODS, CITY_OPTIONS } from "../data/locationOptions";

export default function LocationFields({
  defaultCity = "São Roque",
  defaultNeighborhood = "",
}: {
  defaultCity?: string;
  defaultNeighborhood?: string;
}) {
  const [city, setCity] = useState(defaultCity || "São Roque");
  const [neighborhood, setNeighborhood] = useState(defaultNeighborhood || "");
  const neighborhoods = useMemo(() => CITY_NEIGHBORHOODS[city] || [], [city]);

  return (
    <>
      <select className="select" name="city" value={city} onChange={(event) => { setCity(event.target.value); setNeighborhood(""); }}>
        {CITY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>

      <select className="select" name="neighborhood" value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)}>
        <option value="">Selecione o bairro</option>
        {neighborhoods.map((bairro) => <option key={bairro} value={bairro}>{bairro}</option>)}
      </select>
    </>
  );
}
