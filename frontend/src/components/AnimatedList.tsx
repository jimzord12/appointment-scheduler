import { useEffect, useRef } from 'react';

import { observeInView } from '../lib/anim/inview.js';

interface Props {
  children: React.ReactNode;
}

export function AnimatedList({ children }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = observeInView(el);
    return () => io?.disconnect();
  }, []);
  return <ul ref={ref}>{children}</ul>;
}
