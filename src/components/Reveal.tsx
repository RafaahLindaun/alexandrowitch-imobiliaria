"use client";
import {useEffect,useRef} from "react";
export default function Reveal({children,className=""}:{children:React.ReactNode;className?:string}){const ref=useRef<HTMLDivElement|null>(null);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){el.classList.add("visible");obs.disconnect()}},{threshold:.16});obs.observe(el);return()=>obs.disconnect()},[]);return <div ref={ref} className={`reveal ${className}`}>{children}</div>}
