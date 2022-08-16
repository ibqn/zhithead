import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { Cards } from "../lib";

interface HandProps {
  hand: Cards;
  onCardClick: (index: number) => void;
  hideCards?: boolean;
  flipped?: boolean;
}

export default function HandView(props: HandProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [handWidth, setHandWidth] = useState(0);
  const virtualFanWidth = Math.min(handWidth, props.hand.length * 100);
  const virtualFanHeight = virtualFanWidth * 0.75;

  const hasRef = ref.current !== undefined;
  useEffect(() => {
    const onResize = () => setHandWidth(ref.current!.clientWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasRef]);

  function angle(i: number) {
    const factor = props.hand.length / 4;
    let x = offsetFromCenter(props.hand, i) * 0.05;
    if (props.hand.length % 2 === 0) x += 0.025;
    return x * (Math.PI / factor);
  }

  const variants: Variants = {
    show: (i: number) => ({
      y: virtualFanHeight * (1 - Math.cos(angle(i))),
      x: virtualFanWidth * Math.sin(angle(i)),
      rotate: `${angle(i)}rad`,
    }),
    hidden: {
      y: 400,
    },
  };

  return (
    <div
      ref={ref}
      className="relative flex h-card-height w-full justify-center"
    >
      {props.hand.map((card, i) => (
        <motion.div
          custom={i}
          initial="hidden"
          animate="show"
          variants={variants}
          className="absolute"
          key={card}
          style={{ transformOrigin: "center bottom" }}
        >
          <Card
            card={card}
            onClick={() => props.onCardClick(i)}
            flipped={props.hideCards}
          />
        </motion.div>
      ))}
    </div>
  );
}

function offsetFromCenter<T>(array: T[], index: number): number {
  return index - Math.floor(array.length / 2);
}