"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat, Quicksand, Raleway, Hubot_Sans, Red_Hat_Display, Unbounded } from 'next/font/google'
import { ArrowDown, ArrowRight } from "lucide-react";


const unbounded = Unbounded({
  subsets: ['latin']
})

const montserrat = Montserrat({
  subsets: ['latin']
})


const red_hat = Red_Hat_Display({
  subsets: ['latin'],
  weight: '500',
})


const quicksand = Quicksand({
  weight: '500',
  subsets: ['latin'],
})


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className={`flex grid-row gap-20 items-center justify-between `}>
        <div className={` text-black text-xl cursor-pointer p-10 ${unbounded.className} `}>
          Arqen A.I.
        </div>
        <nav className="p-10 md:flex items-center font-normal gap-1 text-sm text-black/60">
          <a href="#home" className="hover:text-black flex items-center">
            Home
            <span className="inline-block h-4 w-px bg-black/30 mx-4 rotate-12"></span>
          </a>
          <a href="#about" className="hover:text-black flex items-center">
            About
            <span className="inline-block h-4 w-px bg-black/30 mx-4 rotate-12"></span>
          </a>
          <a href="/dashboard" className="hover:text-black flex items-center">
            Services
            <span className="inline-block h-4 w-px bg-black/30 mx-4 rotate-12"></span>
          </a>
          <a href="#pricing" className="hover:text-black flex items-center">
            Pricing
            <span className="inline-block h-4 w-px bg-black/30 mx-4 rotate-12"></span>
          </a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </nav>
      </header>


      <section className={`relative h-[450px] mx-6 rounded-2xl overflow-hidden ${montserrat.className}`}>
        <Image
          src="/image2.jpg"
          alt="Office Professional Service"
          fill
          quality={100}
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-[#151515]/80 z-0" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl font-bold text-white/80">
            Turn your sketches into clean models in seconds.
          </h1>
          <p className="mt-3 max-w-3xl text-md text-white/60">
            Our team works with intuitive sketching tools that make the design process simple and efficient.
            We help turn rough ideas into clear, organized outcomes with ease.
          </p>
        </div>

        <div className="absolute cursor-pointer gap-3 bottom-6 right-6 border border-black/60 bg-black/60 h-8 w-32 p-2 rounded-2xl flex items-center justify-center text-white text-xs">
          <p className="text-white font-semibold">Scroll down</p>
          <Link href=""><ArrowDown className="h-5 w-5 mt-1 animate-bounce" /></Link>
        </div>

      </section>
    </main>
  );
}
