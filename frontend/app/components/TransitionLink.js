
"use client";

import { useTransition } from '../context/TransitionContext';
import { usePathname } from 'next/navigation';

const TransitionLink = ({ href, children, ...props }) => {
  const { startTransition } = useTransition();
  const pathname = usePathname();

  const isCurrentPage = pathname === href;

  const handleClick = (e) => {
    e.preventDefault();
    if (isCurrentPage) {
      return; // Do nothing if already on the page
    }
    startTransition(href);
  };

  // Combine existing classNames with the 'active' class if it's the current page
  const combinedClassName = `${props.className || ''} ${isCurrentPage ? 'active' : ''}`.trim();

  return (
    <a href={href} onClick={handleClick} {...props} className={combinedClassName}>
      {children}
    </a>
  );
};

export default TransitionLink;
