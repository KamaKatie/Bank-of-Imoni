"use client";

import { useState, useEffect } from "react";

const catAsciiArts = [
  ` /\\_/\\
( U.U )
 > ^ <`,

  ` /\\_/\\
( -.- )
 > ^ <`,

  ` /\\_/\\
( ^.^ )
 > ^ <`,

  `  /\\_/\\
( =^.^= )
 (")   (")`,

  `      |\\      _,,,---,,_
      /,\\\`.-'\\\`'    -.  ;-;;,_
     |,4-  ) )-,_. ,\\ (  \\\`'-'
    '---''(_/--'  \\\`-'\\_)`,

  `  |\\__/,|
  ( 0.0 )
   > 3 <`,

  `   /\\__/\\
 ( ✪ ω ✪ )
  >      <`,

  `   /\\_/\\
 (  @.@  )
  >  ^  <`,

  `   /\\_/\\
 (  >.<  )
  >  ^  <`,

  `   /\\_/\\
 (  T.T  )
  >  ^  <`,

  `   /\\_/\\
 (  •.•  )
  >  ^  <`,
];

export default function AsciiCat() {
  const [catArt, setCatArt] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * catAsciiArts.length);
    setCatArt(catAsciiArts[randomIndex]);
  }, []);

  if (!catArt) return null;

  return (
    <pre
      className="cat-ascii"
      style={{
        fontSize: "16px",
        color: "black",
        display: "inline-block",
        fontFamily: "monospace",
        lineHeight: "1.2",
        textAlign: "left",
      }}
    >
      {catArt}
    </pre>
  );
}
