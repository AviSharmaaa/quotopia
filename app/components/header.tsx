import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
  actionButtons: React.ReactNode[];
}

const Header: React.FC<HeaderProps> = ({ actionButtons }) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 bg-white shadow-md p-4 z-50 flex justify-between items-center">
      <h1 className="flex text-2xl font-bold text-center">
        <Image
          src="/logo_light.svg"
          alt="Quotopia"
          width={35}
          height={35}
        />
        Quotopia
      </h1>
      <div className="flex space-x-2">
        {actionButtons.map((button, index) => (
          <div key={index}>{button}</div>
        ))}
      </div>
    </header>
  );
};

export default Header;
