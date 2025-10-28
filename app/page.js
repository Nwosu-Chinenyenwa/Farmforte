"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
const loader = useState(false)
const route = useRouter();

useEffect(() => {
  const loader = setInterval(() => route.push("/Home"), 3000)
  return () => clearInterval(loader)
},[])
  return (
    <>
      <section className="flex items-center justify-center h-[100vh]">
        <div className="container">
          <div className="tree">
            <div className="branch" style={{ "--x": 0 }}>
              <span style={{ "--i": 0 }} />
              <span style={{ "--i": 1 }} />
              <span style={{ "--i": 2 }} />
              <span style={{ "--i": 3 }} />
            </div>
            <div className="branch" style={{ "--x": 1 }}>
              <span style={{ "--i": 0 }} />
              <span style={{ "--i": 1 }} />
              <span style={{ "--i": 2 }} />
              <span style={{ "--i": 3 }} />
            </div>
            <div className="branch" style={{ "--x": 2 }}>
              <span style={{ "--i": 0 }} />
              <span style={{ "--i": 1 }} />
              <span style={{ "--i": 2 }} />
              <span style={{ "--i": 3 }} />
            </div>
            <div className="branch" style={{ "--x": 3 }}>
              <span style={{ "--i": 0 }} />
              <span style={{ "--i": 1 }} />
              <span style={{ "--i": 2 }} />
              <span style={{ "--i": 3 }} />
            </div>
            <div className="stem">
              <span style={{ "--i": 0 }} />
              <span style={{ "--i": 1 }} />
              <span style={{ "--i": 2 }} />
              <span style={{ "--i": 3 }} />
            </div>
            <span className="shadow" />
          </div>
        </div>
      </section>
    </>
  );
}