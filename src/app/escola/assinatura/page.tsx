import { redirect } from 'next/navigation';

export default function AssinaturaPage() {
  // Redireciona diretamente para o painel durante o período de testes
  redirect('/escola/dashboard');
}
