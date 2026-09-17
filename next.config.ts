import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/escola/financeiro',
        destination: '/escola/dashboard',
        permanent: false,
      },
      {
        source: '/aluno/financeiro',
        destination: '/aluno/dashboard',
        permanent: false,
      },
      {
        source: '/escola/conteudos',
        destination: '/escola/cursos',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
