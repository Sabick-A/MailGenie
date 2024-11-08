import React, {useState } from 'react';

const SidebarLinkGroup = ({ children, activeCondition }) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <React.Fragment>{children(handleClick, open)}</React.Fragment>;
};

export default SidebarLinkGroup;