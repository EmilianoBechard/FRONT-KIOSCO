import { InstagramIcon } from "../../assets/iconos";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-[#111827]">
            Mi Empresa
          </h3>
          <p className="text-[#6B7280] text-sm">
            © 2025 Mi Empresa. Todos los derechos reservados.
          </p>
        </div>

        <div className="md:flex md:flex-col md:items-center">
          <h4 className="text-lg font-semibold mb-3 text-[#111827]">
            Enlaces útiles
          </h4>
          <ul className="md:flex md:flex-col md:items-center space-y-2">
            <li>
              <a
                href="#"
                className="text-[#2563EB] hover:text-[#1D4ED8] text-pretty"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[#2563EB] hover:text-[#1D4ED8] text-pretty"
              >
                Productos
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[#2563EB] hover:text-[#1D4ED8] text-pretty"
              >
                Contacto
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[#2563EB] hover:text-[#1D4ED8] text-pretty"
              >
                Política de privacidad
              </a>
            </li>
          </ul>
        </div>

        <div className="md:flex md:flex-col md:items-center">
          <h4 className="text-lg font-semibold mb-3 text-[#111827]">
            Síguenos
          </h4>
          <div className="flex space-x-4 text-2xl">
            <a
              href="#"
              className="text-[#8B5CF6] hover:text-[#2563EB] transition-colors"
            >
              🐦
            </a>
            <a
              href="#"
              className="text-[#8B5CF6] hover:text-[#2563EB] transition-colors"
            >
              📘
            </a>
            <a
              href="#"
              className="text-[#8B5CF6] hover:text-[#2563EB] transition-colors"
            >
              📸
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center border-t border-[#E5E7EB] text-center py-4 text-sm text-[#6B7280]">
        <a
          className="flex items-center hover:text-[#3B82F6] transition-colors duration-300 max-sm:focus:text-[#3B82F6]"
          href="https://www.instagram.com/emiliano.bechard/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Diseñado por Emiliano Bechard <InstagramIcon />
        </a>
      </div>
    </footer>
  );
}
