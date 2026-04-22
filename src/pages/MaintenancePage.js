import Layout from '../components/Layout';
import { AlertTriangle } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-[#1E1E1E] border border-[#333] p-8 max-w-md w-full">
          
          <div className="flex justify-center mb-4">
            <AlertTriangle size={40} className="text-[#FFAA00]" />
          </div>

          <h1 className="font-pixel text-xl text-[#FFAA00] mb-2">
            Em manutenção
          </h1>

          <p className="text-[#AAAAAA] text-sm">
            Esta seção está temporariamente desativada para melhorias.
          </p>

          <p className="text-[#555] text-xs mt-4">
            Volte mais tarde.
          </p>
        </div>
      </div>
    </Layout>
  );
}