export function LoadingScreen({ text = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1E293B] text-[#F9FAFB]">
      <div className="w-16 h-16 border-4 border-t-[#3B82F6] border-[#94A3B8] rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium animate-pulse">{text}</p>
    </div>
  );
}
