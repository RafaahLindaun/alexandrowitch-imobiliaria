"use client";
import {useState} from "react";import Link from "next/link";
export default function MobileNavbar(){const[open,setOpen]=useState(false);return <><button className="mobileMenuButton" onClick={()=>setOpen(v=>!v)}>Menu</button>{open&&<div className="mobilePanel"><Link href="/">Início</Link><Link href="/imoveis">Imóveis</Link><Link href="/sobre">Sobre</Link><Link href="/contato">Contato</Link><Link href="/admin/login">Corretor</Link><a href="https://wa.me/5511974005163" target="_blank">WhatsApp</a></div>}</>}
