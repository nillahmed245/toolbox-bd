import React from 'react';
import {
  Minimize2,
  Maximize2,
  Crop,
  QrCode,
  WholeWord,
  Type,
  Calendar,
  Hash,
  FileImage,
  FileCheck,
  Image as ImageIcon,
  FileText,
  Calculator as CalculatorIcon,
  FileStack,
  Wrench,
  Ruler,
  Scale,
  LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Minimize2,
  Maximize2,
  Crop,
  QrCode,
  WholeWord,
  Type,
  Calendar,
  Hash,
  FileImage,
  FileCheck,
  Image: ImageIcon,
  FileText,
  Calculator: CalculatorIcon,
  FileStack,
  Ruler,
  Scale,
};

export const ToolIcon: React.FC<ToolIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent {...props} />;
};
