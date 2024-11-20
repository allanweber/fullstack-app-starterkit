export const Color = {
  green: {
    badge:
      'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10',
    dot: 'bg-[#10b981]',
  },
  blue: {
    badge:
      'text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10',
    dot: 'bg-[#0ea5e9]',
  },
  pink: {
    badge:
      'text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10',
    dot: 'bg-[#ec4899]',
  },
  orange: {
    badge:
      'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10',
    dot: 'bg-[#f97316]',
  },
  gray: {
    badge:
      'text-[#6b7280] bg-[#6b7280]/10 border-[#6b7280]/20 hover:bg-[#6b7280]/10',
    dot: 'bg-[#6b7280]',
  },
} as Record<string, Record<'badge' | 'dot', string>>;
