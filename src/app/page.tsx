"use client";

import React, { useState } from "react";
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
  const [prediction, setPrediction] = useState<string | null>(null);
  const handlePredict = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ARQEN_API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_size: 12000,
          floors: 10,
          region_code: 2,
          complexity: 0.7,
          duration_months: 14,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch prediction");
      const data = await response.json();
      setPrediction(data.predicted_cost_usd_million);
      console.log("API URL:", process.env.NEXT_PUBLIC_ARQEN_API);
    } catch (error) {
      console.error(error);
      setPrediction("Error fetching prediction");
    }
  };

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

      <div className="flex flex-col items-center mt-10">
        <button
          onClick={handlePredict}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Predict
        </button>
        {prediction && (
          <p className="mt-4 text-black text-sm">
            Predicted Cost: {prediction === "Error fetching prediction" ? prediction : `$${prediction} million`}
          </p>
        )}
      </div>
    </main>
  );
}
